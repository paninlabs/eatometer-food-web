import { NextResponse } from "next/server";
import { appConfig } from "../../../lib/config";

export function GET() {
  const details = appConfig.appleAppId
    ? [
        {
          appIDs: [appConfig.appleAppId],
          paths: ["/confirm-email*", "/r/*", "/recipe/*", "/product/*", "/meal/*", "/meal-template/*", "/ration/*"],
        },
      ]
    : [];

  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
