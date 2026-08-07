import { connect, constants } from "node:http2";
import type { ClientHttp2Stream, IncomingHttpHeaders } from "node:http2";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const defaultSupportGrpcAddr = "localhost:46050";
const createSupportRequestPath = "/admin.AdminService/CreateSupportRequest";
const requestTimeoutMs = 10_000;

type SupportRequestPayload = {
  app_id: string;
  topic: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  language: string;
  source_url: string;
  user_agent: string;
};

type CreateSupportRequestResponse = {
  success: boolean;
  id: string;
};

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = stringValue(payload.email);
  const subject = stringValue(payload.subject);
  const message = stringValue(payload.message);
  if (!email || !subject || !message) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const forwardedPayload: SupportRequestPayload = {
    app_id: "eatometer-web",
    name: stringValue(payload.name),
    email,
    topic: stringValue(payload.topic) || "app",
    subject,
    message,
    language: stringValue(payload.language) || "ru",
    source_url: request.headers.get("referer") || "",
    user_agent: request.headers.get("user-agent") || "",
  };

  try {
    const response = await createSupportRequest(resolveSupportGrpcTarget(), forwardedPayload);
    if (!response.success) {
      return NextResponse.json({ error: "support_service_failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error("support request failed", error);
    return NextResponse.json({ error: "support_service_unavailable" }, { status: 503 });
  }
}

function createSupportRequest(target: string, payload: SupportRequestPayload): Promise<CreateSupportRequestResponse> {
  const message = encodeCreateSupportRequest(payload);
  const grpcFrame = Buffer.alloc(5 + message.length);
  grpcFrame[0] = 0;
  grpcFrame.writeUInt32BE(message.length, 1);
  message.copy(grpcFrame, 5);

  return new Promise((resolve, reject) => {
    const client = connect(target);
    const chunks: Buffer[] = [];
    let responseHeaders: IncomingHttpHeaders = {};
    let responseTrailers: IncomingHttpHeaders = {};
    let requestStream: ClientHttp2Stream | undefined;
    let settled = false;

    const settle = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      requestStream?.removeAllListeners();
      client.removeAllListeners();
      client.close();
      callback();
    };

    const fail = (error: unknown) => {
      settle(() => reject(error instanceof Error ? error : new Error(String(error))));
    };

    const timeout = setTimeout(() => {
      requestStream?.close(constants.NGHTTP2_CANCEL);
      fail(new Error("support_grpc_timeout"));
    }, requestTimeoutMs);

    client.on("error", fail);

    requestStream = client.request({
      ":method": "POST",
      ":path": createSupportRequestPath,
      "content-type": "application/grpc",
      te: "trailers",
      "grpc-timeout": "10S",
    });

    requestStream.on("response", (headers) => {
      responseHeaders = headers;
    });
    requestStream.on("trailers", (headers) => {
      responseTrailers = headers;
    });
    requestStream.on("data", (chunk: Buffer) => {
      chunks.push(Buffer.from(chunk));
    });
    requestStream.on("error", fail);
    requestStream.on("end", () => {
      const httpStatus = Number(headerValue(responseHeaders[":status"]) || 0);
      const grpcStatus =
        headerValue(responseTrailers["grpc-status"]) ||
        headerValue(responseHeaders["grpc-status"]) ||
        (httpStatus === 200 ? "0" : "");
      const grpcMessage = headerValue(responseTrailers["grpc-message"]) || headerValue(responseHeaders["grpc-message"]);

      if (httpStatus !== 200) {
        fail(new Error(`support_grpc_http_${httpStatus}`));
        return;
      }
      if (grpcStatus !== "0") {
        fail(new Error(`support_grpc_${grpcStatus}${grpcMessage ? `_${grpcMessage}` : ""}`));
        return;
      }

      try {
        const response = decodeCreateSupportRequestResponse(Buffer.concat(chunks));
        settle(() => resolve(response));
      } catch (error) {
        fail(error);
      }
    });

    requestStream.end(grpcFrame);
  });
}

function encodeCreateSupportRequest(payload: SupportRequestPayload): Buffer {
  return Buffer.concat([
    encodeStringField(1, payload.app_id),
    encodeStringField(2, payload.topic),
    encodeStringField(3, payload.name),
    encodeStringField(4, payload.email),
    encodeStringField(5, payload.subject),
    encodeStringField(6, payload.message),
    encodeStringField(7, payload.language),
    encodeStringField(8, payload.source_url),
    encodeStringField(9, payload.user_agent),
  ]);
}

function encodeStringField(fieldNumber: number, value: string): Buffer {
  if (!value) {
    return Buffer.alloc(0);
  }
  const valueBytes = Buffer.from(value, "utf8");
  return Buffer.concat([encodeVarint((fieldNumber << 3) | 2), encodeVarint(valueBytes.length), valueBytes]);
}

function encodeVarint(value: number): Buffer {
  const bytes: number[] = [];
  let remaining = value >>> 0;
  while (remaining > 0x7f) {
    bytes.push((remaining & 0x7f) | 0x80);
    remaining >>>= 7;
  }
  bytes.push(remaining);
  return Buffer.from(bytes);
}

function decodeCreateSupportRequestResponse(responseFrame: Buffer): CreateSupportRequestResponse {
  if (responseFrame.length < 5) {
    return { success: false, id: "" };
  }
  if (responseFrame[0] !== 0) {
    throw new Error("compressed_grpc_response_is_not_supported");
  }

  const messageLength = responseFrame.readUInt32BE(1);
  const messageEnd = 5 + messageLength;
  if (responseFrame.length < messageEnd) {
    throw new Error("truncated_grpc_response");
  }

  const message = responseFrame.subarray(5, messageEnd);
  let offset = 0;
  let success = false;
  let id = "";

  while (offset < message.length) {
    const tag = readVarint(message, offset);
    offset = tag.offset;
    const fieldNumber = tag.value >> 3;
    const wireType = tag.value & 0x7;

    if (fieldNumber === 1 && wireType === 0) {
      const value = readVarint(message, offset);
      success = value.value !== 0;
      offset = value.offset;
      continue;
    }

    if (fieldNumber === 2 && wireType === 2) {
      const length = readVarint(message, offset);
      const end = length.offset + length.value;
      id = message.subarray(length.offset, end).toString("utf8");
      offset = end;
      continue;
    }

    offset = skipField(message, offset, wireType);
  }

  return { success, id };
}

function readVarint(buffer: Buffer, startOffset: number): { value: number; offset: number } {
  let value = 0;
  let shift = 0;
  let offset = startOffset;

  while (offset < buffer.length) {
    const byte = buffer[offset];
    value |= (byte & 0x7f) << shift;
    offset += 1;
    if ((byte & 0x80) === 0) {
      return { value, offset };
    }
    shift += 7;
  }

  throw new Error("truncated_varint");
}

function skipField(buffer: Buffer, offset: number, wireType: number): number {
  if (wireType === 0) {
    return readVarint(buffer, offset).offset;
  }
  if (wireType === 2) {
    const length = readVarint(buffer, offset);
    return length.offset + length.value;
  }
  if (wireType === 5) {
    return offset + 4;
  }
  if (wireType === 1) {
    return offset + 8;
  }
  throw new Error(`unsupported_wire_type_${wireType}`);
}

function resolveSupportGrpcTarget(): string {
  const grpcAddr = process.env.ADMIN_SUPPORT_GRPC_ADDR?.trim();
  if (grpcAddr) {
    return normalizeGrpcTarget(grpcAddr);
  }

  const legacyApiUrl = process.env.ADMIN_SUPPORT_API_URL?.trim();
  if (legacyApiUrl) {
    const url = new URL(legacyApiUrl.includes("://") ? legacyApiUrl : `http://${legacyApiUrl}`);
    if (url.port === "46051") {
      url.port = "46050";
    }
    return normalizeGrpcTarget(url.host);
  }

  return normalizeGrpcTarget(defaultSupportGrpcAddr);
}

function normalizeGrpcTarget(value: string): string {
  const url = new URL(value.includes("://") ? value : `http://${value}`);
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return `${url.protocol}//${url.host}`;
}

function headerValue(value: number | string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }
  return value === undefined ? "" : String(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}