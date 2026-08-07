import type { Metadata } from "next";
import { appConfig } from "@/lib/config";
import { formatLocaleCopy } from "@/lib/russian-typography";

export type LegalDocumentSlug = "agreement" | "privacy";
export type LegalLocale = "en" | "ru";

export type LegalSection = {
  title: string;
  content: string | string[];
};

export type LegalLocaleDocument = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export type LegalDocument = {
  slug: LegalDocumentSlug;
  permalink: string;
  locales: Record<LegalLocale, LegalLocaleDocument>;
};

export const legalDocumentOrder: LegalDocumentSlug[] = ["agreement", "privacy"];

export const legalDocumentLabels: Record<LegalDocumentSlug, Record<LegalLocale, string>> = {
  agreement: {
    en: "User Agreement",
    ru: "Пользовательское соглашение",
  },
  privacy: {
    en: "Privacy Policy",
    ru: "Политика конфиденциальности",
  },
};

export function buildLegalDocumentPath(slug: LegalDocumentSlug): string {
  return `/legal/${slug}`;
}

export function buildLegalDocumentUrl(slug: LegalDocumentSlug): string {
  return `${appConfig.marketingUrl}${buildLegalDocumentPath(slug)}`;
}

export function isLegalDocumentSlug(value: string): value is LegalDocumentSlug {
  return legalDocumentOrder.includes(value as LegalDocumentSlug);
}

function withLocaleTypography(locales: Record<LegalLocale, LegalLocaleDocument>): Record<LegalLocale, LegalLocaleDocument> {
  return {
    en: formatLocaleCopy(locales.en, "en"),
    ru: formatLocaleCopy(locales.ru, "ru"),
  };
}

export function getLegalDocument(slug: LegalDocumentSlug): LegalDocument {
  const permalink = buildLegalDocumentUrl(slug);

  return {
    slug,
    permalink,
    locales: buildDocumentLocales(slug, permalink),
  };
}

export function buildLegalMetadata(slug: LegalDocumentSlug): Metadata {
  const document = getLegalDocument(slug);
  const russian = document.locales.ru;

  return {
    title: russian.title,
    description: russian.description,
    alternates: {
      canonical: document.permalink,
    },
    openGraph: {
      type: "article",
      url: document.permalink,
      title: `${russian.title} | ${appConfig.localizedAppName}`,
      description: russian.description,
      siteName: appConfig.localizedAppName,
    },
    twitter: {
      card: "summary",
      title: `${russian.title} | ${appConfig.localizedAppName}`,
      description: russian.description,
    },
  };
}

function buildDocumentLocales(slug: LegalDocumentSlug, permalink: string): Record<LegalLocale, LegalLocaleDocument> {
  switch (slug) {
    case "agreement":
      return withLocaleTypography({
        en: {
          title: "User Agreement",
          description: `Rules for using ${appConfig.appName}, account access, and user responsibilities.`,
          effectiveDate: "Effective date: April 14, 2026",
          sections: [
            {
              title: "1. General provisions",
              content:
                `This User Agreement governs access to and use of the ${appConfig.appName} mobile application, related web pages, and supporting technical services. By installing, opening, registering in, or otherwise using the service, you confirm that you have read and accepted this agreement.`,
            },
            {
              title: "2. Service functionality",
              content:
                `${appConfig.appName} provides tools for keeping a food diary, recording meals, water, nutrition goals, custom foods, recipes, saved meals, and related data. Individual features may change, be updated, or be discontinued without prior notice if required by technical, legal, or product considerations.`,
            },
            {
              title: "3. Account and access",
              content:
                "You are responsible for the accuracy of data provided during registration and for maintaining the confidentiality of credentials linked to your account. All actions taken under your account are considered your responsibility until you report unauthorized access.",
            },
            {
              title: "4. User content",
              content:
                "You retain rights to content you create in the service, including diary entries, recipes, notes, and custom products. At the same time, you grant the operator the limited right to process and store that content to operate the service, synchronization, import, export, and backup functions.",
            },
            {
              title: "5. Prohibited use",
              content:
                "You may not use the service in violation of law, to interfere with infrastructure, to bypass security restrictions, to abuse APIs, or to publish content that infringes third-party rights. Reverse engineering or attempts to obtain source code are prohibited except where directly allowed by mandatory law.",
            },
            {
              title: "6. Disclaimer",
              content:
                `${appConfig.appName} is not a medical service and does not provide medical advice, diagnosis, treatment, or emergency support. All nutrition and wellness decisions based on the service remain your sole responsibility.`,
            },
            {
              title: "7. Changes and publication",
              content:
                `The operator may update this agreement at any time. The current public version is permanently available at ${permalink}. Continued use of the service after publication of an updated version means acceptance of the updated terms.`,
            },
            {
              title: "8. Contact",
              content: `For support and legal notices, contact ${appConfig.supportEmail}.`,
            },
          ],
        },
        ru: {
          title: "Пользовательское соглашение",
          description: `Правила использования ${appConfig.localizedAppName}, доступа к аккаунту и ответственности пользователя.`,
          effectiveDate: "Дата вступления в силу: 14 апреля 2026",
          sections: [
            {
              title: "1. Общие положения",
              content:
                `Настоящее Пользовательское соглашение регулирует доступ к мобильному приложению ${appConfig.localizedAppName}, связанным веб-страницам и технической инфраструктуре сервиса. Устанавливая приложение, создавая аккаунт, входя в него или используя сервис иным способом, пользователь подтверждает, что ознакомился с условиями настоящего соглашения и принимает их в полном объеме.`,
            },
            {
              title: "2. Функциональность сервиса",
              content:
                `${appConfig.localizedAppName} предоставляет инструменты для ведения дневника питания, учета приемов пищи, воды, целей по калориям и макронутриентам, пользовательских продуктов, рецептов, сохраненных приемов пищи и связанных с ними данных. Отдельные функции могут изменяться, дополняться или прекращаться без предварительного уведомления, если это необходимо по техническим, юридическим или продуктовым причинам.`,
            },
            {
              title: "3. Аккаунт и доступ",
              content:
                "Пользователь обязан предоставлять достоверные данные при регистрации и самостоятельно обеспечивать сохранность своих учетных данных. Все действия, совершенные с использованием аккаунта пользователя, считаются совершенными самим пользователем до момента уведомления о несанкционированном доступе.",
            },
            {
              title: "4. Пользовательский контент",
              content:
                "Права на контент, создаваемый пользователем в сервисе, включая записи дневника, рецепты, заметки и пользовательские продукты, сохраняются за пользователем. При этом пользователь предоставляет оператору ограниченное право на обработку, хранение, синхронизацию, импорт, экспорт и резервное копирование такого контента в объеме, необходимом для работы сервиса.",
            },
            {
              title: "5. Ограничения использования",
              content:
                "Запрещается использовать сервис с нарушением закона, вмешиваться в работу инфраструктуры, обходить меры безопасности, злоупотреблять API, публиковать контент, нарушающий права третьих лиц, а также пытаться получить исходный код приложения или его частей, кроме случаев, прямо разрешенных обязательными нормами права.",
            },
            {
              title: "6. Ограничение ответственности",
              content:
                `${appConfig.localizedAppName} не является медицинским сервисом и не предоставляет медицинские рекомендации, диагностику, лечение либо экстренную помощь. Все решения, связанные с питанием, здоровьем и образом жизни, принимаются пользователем самостоятельно и на его риск.`,
            },
            {
              title: "7. Изменение условий и публикация",
              content:
                `Оператор вправе в любое время обновлять настоящее соглашение. Актуальная публичная версия документа постоянно доступна по адресу ${permalink}. Продолжение использования сервиса после публикации новой редакции означает согласие пользователя с обновленными условиями.`,
            },
            {
              title: "8. Контакты",
              content: `По вопросам поддержки и юридическим уведомлениям обращайтесь: ${appConfig.supportEmail}.`,
            },
          ],
        },
      });
    case "privacy":
      return withLocaleTypography({
        en: {
          title: "Privacy Policy",
          description: "Privacy, usage, storage, and data protection rules for Eatometer.",
          effectiveDate: "Effective date: May 11, 2026",
          sections: [
            {
              title: "1. General provisions",
              content: "This Privacy Policy and Terms of Use explain what data is processed when using Eatometer. The operator of the service is Panin Mikhail Sergeevich. In this document, “we”, “us”, “our”, and “Company” refer to Panin Mikhail Sergeevich. This document applies to the Eatometer app, goeatometer.com, public recipe, product, and saved-meal pages, support forms, notifications, Apple Health integrations, backend infrastructure, and other technical services required to operate the product. By using the service, the user confirms that they have read this Policy and accept its terms.",
            },
            {
              title: "2. Definitions",
              content: "Personal data means any information relating to an identified or identifiable user. Account means a unique account created to access the service or its parts. Service means the Eatometer app, goeatometer.com, public recipe, product, and saved-meal pages, support forms, notifications, Apple Health integrations, backend infrastructure, and other technical services required to operate the product. Usage data means technical and diagnostic data automatically generated by the application, website, or server infrastructure. User means an individual who installs the app, opens the website, creates an account, or otherwise uses the service.",
            },
            {
              title: "3. Disclaimer and limitation of liability",
              content: "Eatometer is not a medical service, does not diagnose, prescribe treatment, or replace consultation with a physician or other professional. Nutrition, water, calorie, macro, and goal information is provided for informational purposes. The user independently makes health, nutrition, and lifestyle decisions and consults a professional when needed. The service is provided on an as is and as available basis. The operator takes reasonable measures to keep the service stable but does not guarantee uninterrupted or error-free availability. To the extent permitted by applicable law, the operator’s liability is limited to direct proven damage.",
            },
            {
              title: "4. Types of data collected",
              content: "The service may process data provided directly by the user, data generated when using app and web features, and technical data automatically transmitted by the device, browser, app, or server infrastructure. The service does not collect personal data beyond what is necessary for stated features, security, support, and legal obligations.",
            },
            {
              title: "5. Data provided by the user",
              content: "Depending on how Eatometer is used, we may process: email address, username or display name, authentication identifiers, profile data, birth date, height, weight, calorie and macro goals, food diary entries, water records, meals, recipes, custom products, favorites, search queries, Apple Health data where permission is granted, and support request data. The user provides all such data independently and is responsible for its accuracy, relevance, and lawful submission.",
            },
            {
              title: "6. Data collected automatically",
              content: "When using the service, we may automatically process IP address, device type, device or installation identifiers, operating system version, app version, browser type and version, date and time of access, opened pages, public-link parameters, visit duration, diagnostic events, error information, and other technical data required for security, reliability analytics, and correct operation of the service.",
            },
            {
              title: "7. Device permissions and specific features",
              content: "Eatometer may work with Apple Health only after the user grants permission. Where permission is granted, the app may access selected HealthKit data or export selected nutrition and water records to Apple Health. These permissions can be revoked in device system settings; food and water history in the service will continue to work within available functionality.",
            },
            {
              title: "8. Website, cookies, and local storage",
              content: "The Eatometer web version may use cookies, localStorage, and similar technologies to remember language, technical preferences, correct link opening, and page stability analysis. The user may restrict these technologies in browser settings, but some web features may become less convenient. Public recipe, product, and saved-meal pages may include a title, description, composition, nutrition values, route parameters, and a link for opening the app. These pages are intended for sharing and may be accessible to anyone who receives the link.",
            },
            {
              title: "9. Analytics and diagnostic data",
              content: "We may use anonymized or aggregated technical data to evaluate stability, find errors, protect against abuse, improve the interface, and improve service quality. Such data is not intended to identify the user on its own and is used only to the extent necessary to operate the product.",
            },
            {
              title: "10. Use of personal data",
              content: "Personal data is used to create and protect accounts, authenticate users, synchronize data between devices, display and store user content, open public links, send permitted notifications, process support requests, prevent abuse, diagnose errors, perform the User Agreement, and comply with applicable legal requirements.",
            },
            {
              title: "11. Sharing of personal data",
              content: "We do not sell personal data. The service may use hosting infrastructure, authentication, notification delivery, email support, reliability analytics, Apple Health on the user device, and other technical services. Data sharing with such providers is limited to what is necessary to operate Eatometer. Data may also be disclosed with the user’s consent, where required by law, to protect the rights and safety of users, investigate abuse, or comply with binding requests from public authorities.",
            },
            {
              title: "12. Storage and deletion",
              content: "Data is retained for as long as necessary to operate the service, perform contractual and legal obligations, process requests, protect against abuse, and resolve disputes. The user may delete the account through available app functions or send a support request. After account deletion or a justified deletion request, some data is deleted or anonymized unless continued storage is required for legal, accounting, technical, or security purposes.",
            },
            {
              title: "13. Security of personal data",
              content: "Data security is important to us. We apply organizational and technical safeguards, including access limitation, secure transmission channels, separation of access rights, technical event monitoring, and backups where necessary. However, no method of internet transmission or electronic storage is absolutely secure, so we cannot guarantee one hundred percent protection of data.",
            },
            {
              title: "14. Children’s privacy",
              content: "The service is not intended for independent use by children below the age at which they may consent to data processing under applicable law. We do not knowingly seek to collect such data. If we learn that a child’s data was obtained without the required consent of a parent or legal representative, we will take reasonable steps to delete that information.",
            },
            {
              title: "15. Updates, correction, and user rights",
              content: "The user may request access to data, correction of inaccurate information, deletion, restriction of processing, data export, or withdrawal of consent within the limits provided by applicable law. To protect the account, we may request additional identity confirmation before fulfilling a request.",
            },
            {
              title: "16. Links to third-party websites and third-party data",
              content: "The service may contain links to websites, app stores, catalogs, rights-holder pages, and other external resources that we do not control. We are not responsible for the content, availability, privacy policies, or practices of such third-party resources. We recommend reviewing the documents of each third-party website or service separately.",
            },
            {
              title: "17. Changes to this Policy and applicable law",
              content: "We may update this Policy when service features, legal requirements, or data processing practices change. The current version is published on the legal page of https://goeatometer.com. Disputes and matters related to this Policy are resolved under the applicable laws of the Russian Federation unless mandatory law provides otherwise.",
            },
            {
              title: "18. Contact us",
              content: "For data processing questions, account deletion, user rights requests, and privacy-related notices, contact support@goeatometer.com.",
            }
          ],
        },
        ru: {
          title: "Политика конфиденциальности",
          description: "Правила конфиденциальности, использования, хранения и защиты данных в Едометре.",
          effectiveDate: "Дата вступления в силу: 11 мая 2026",
          sections: [
            {
              title: "1. Общие положения",
              content: "Настоящая Политика конфиденциальности и условия использования описывают, какие данные обрабатываются при использовании сервиса Едометр. Оператором сервиса является Панин Михаил Сергеевич. В тексте слова «мы», «нас», «наш» и «Компания» означают Панин Михаил Сергеевич. Документ применяется к сервису, включая приложение Едометр, сайт goeatometer.com, публичные страницы рецептов, продуктов и сохраненных приемов пищи, формы поддержки, уведомления, интеграции Apple Health, backend-инфраструктуру и иные технические сервисы, необходимые для работы продукта. Используя сервис, пользователь подтверждает, что ознакомился с настоящей Политикой и принимает ее условия.",
            },
            {
              title: "2. Определения",
              content: "Персональные данные — любая информация, относящаяся к идентифицированному или определяемому пользователю. Аккаунт — учетная запись, созданная для доступа к сервису или его отдельным функциям. Сервис — приложение Едометр, сайт goeatometer.com, публичные страницы рецептов, продуктов и сохраненных приемов пищи, формы поддержки, уведомления, интеграции Apple Health, backend-инфраструктуру и иные технические сервисы, необходимые для работы продукта. Данные об использовании — технические и диагностические данные, автоматически формируемые при работе приложения, сайта или серверной инфраструктуры. Пользователь — физическое лицо, которое устанавливает приложение, открывает сайт, создает аккаунт или иным образом использует сервис.",
            },
            {
              title: "3. Отказ от ответственности и ограничение ответственности",
              content: "Едометр не является медицинским сервисом, не ставит диагнозы, не назначает лечение и не заменяет консультацию врача или другого специалиста. Информация о питании, воде, калориях, макронутриентах и целях носит информационный характер. Пользователь самостоятельно принимает решения о здоровье, питании и образе жизни и при необходимости обращается к специалисту. Сервис предоставляется по модели «как есть» и «по мере доступности». Оператор принимает разумные меры для стабильной работы сервиса, но не гарантирует бесперебойную и безошибочную доступность. При любых обстоятельствах ответственность оператора ограничивается прямым доказанным ущербом в пределах, допускаемых применимым законодательством.",
            },
            {
              title: "4. Типы собираемых данных",
              content: "Сервис может обрабатывать данные, которые пользователь предоставляет напрямую, данные, возникающие при использовании функций приложения и веб-версии, а также технические данные, которые автоматически передаются устройством, браузером, приложением или серверной инфраструктурой. Сервис не собирает персональные данные сверх того, что необходимо для заявленных функций, безопасности, поддержки и исполнения юридических обязанностей.",
            },
            {
              title: "5. Данные, которые пользователь предоставляет",
              content: "В зависимости от сценария использования Едометр может обрабатывать: email, имя пользователя или отображаемое имя, идентификаторы авторизации, данные профиля, дата рождения, рост, вес, цели по калориям и макронутриентам, дневник питания, воду, приемы пищи, рецепты, пользовательские продукты, избранное, поисковые запросы, данные Apple Health при наличии разрешения и данные обращений в поддержку. Все данные пользователь предоставляет самостоятельно и отвечает за их достоверность, актуальность и законность передачи.",
            },
            {
              title: "6. Данные, собираемые автоматически",
              content: "При использовании сервиса могут автоматически обрабатываться IP-адрес, тип устройства, идентификаторы устройства или установки, версия операционной системы, версия приложения, тип и версия браузера, дата и время обращения, открытые страницы, параметры публичной ссылки, длительность посещения, диагностические события, сведения об ошибках и иные технические данные, необходимые для безопасности, аналитики надежности и корректной работы сервиса.",
            },
            {
              title: "7. Разрешения устройства и отдельные функции",
              content: "Едометр может работать с Apple Health только после разрешения пользователя. При наличии разрешения приложение может получать выбранные данные HealthKit или экспортировать выбранные записи о питании и воде в Apple Health. Эти разрешения можно отозвать в системных настройках устройства; история питания и воды в самом сервисе продолжит работать в пределах доступной функциональности.",
            },
            {
              title: "8. Сайт, файлы cookie и локальное хранилище",
              content: "Веб-версия Едометра может использовать cookie, localStorage и аналогичные технологии для запоминания языка, технических предпочтений, корректного открытия ссылок и анализа стабильности страниц. Пользователь может ограничить такие технологии в настройках браузера, но часть веб-функций может работать менее удобно. Публичные страницы рецептов, продуктов и сохраненных приемов пищи могут содержать название, описание, состав, пищевую ценность, параметры маршрута и ссылку для открытия приложения. Такие страницы предназначены для шаринга и могут быть доступны любому лицу, получившему ссылку.",
            },
            {
              title: "9. Аналитические и диагностические данные",
              content: "Мы можем использовать обезличенные или агрегированные технические данные для оценки стабильности, поиска ошибок, защиты от злоупотреблений, улучшения интерфейса и качества сервиса. Такие данные не предназначены для самостоятельной идентификации пользователя и используются в объеме, необходимом для работы продукта.",
            },
            {
              title: "10. Использование персональных данных",
              content: "Персональные данные используются для создания и защиты аккаунта, аутентификации, синхронизации данных между устройствами, отображения и сохранения пользовательского контента, открытия публичных ссылок, отправки разрешенных уведомлений, обработки запросов поддержки, предотвращения злоупотреблений, диагностики ошибок, исполнения пользовательского соглашения, а также выполнения требований применимого законодательства.",
            },
            {
              title: "11. Передача персональных данных",
              content: "Мы не продаем персональные данные. Сервис может использовать инфраструктуру хостинга, авторизации, доставки уведомлений, почтовой поддержки, аналитики надежности, Apple Health на устройстве пользователя и другие технические сервисы. Передача данных таким поставщикам ограничивается объемом, необходимым для работы Едометра. Передача также возможна при наличии согласия пользователя, по требованию закона, для защиты прав и безопасности пользователей, расследования злоупотреблений или исполнения обязательных требований государственных органов.",
            },
            {
              title: "12. Хранение и удаление данных",
              content: "Данные хранятся столько, сколько необходимо для работы сервиса, исполнения договорных и юридических обязанностей, обработки обращений, защиты от злоупотреблений и разрешения споров. Пользователь может удалить аккаунт через доступные функции приложения или направить запрос в поддержку. После удаления аккаунта или получения обоснованного запроса часть данных удаляется или обезличивается, если дальнейшее хранение не требуется законом, бухгалтерскими, техническими или защитными целями.",
            },
            {
              title: "13. Безопасность персональных данных",
              content: "Безопасность данных важна для нас. Мы применяем организационные и технические меры защиты, включая ограничение доступа, защищенные каналы передачи, разделение прав доступа, мониторинг технических событий и резервное копирование там, где это необходимо. При этом ни один способ передачи через интернет или электронного хранения не является абсолютно безопасным, поэтому мы не можем гарантировать стопроцентную защиту данных.",
            },
            {
              title: "14. Конфиденциальность детей",
              content: [
                "Наш Сервис не предназначен для лиц в возрасте до 16 лет. Мы не собираем преднамеренно Персональные данные от лиц в возрасте до 16 лет. Если вы являетесь родителем или опекуном и знаете, что ваш ребенок предоставил нам Персональные данные, пожалуйста, свяжитесь с нами.",
                "Если нам станет известно, что мы собрали Персональные данные от любого лица в возрасте до 16 лет без проверки согласия родителей, мы предпримем шаги для удаления этой информации с наших серверов.",
                "Если нам необходимо полагаться на согласие как на юридическое основание для обработки вашей информации, а в вашей стране требуется согласие родителя, мы можем потребовать согласия вашего родителя, прежде чем собирать и использовать эту информацию.",
              ],
            },
            {
              title: "15. Обновление, исправление и реализация прав",
              content: "Пользователь может запросить доступ к своим данным, исправление неточных сведений, удаление, ограничение обработки, экспорт данных или отзыв согласия в пределах, предусмотренных применимым законодательством. Для защиты аккаунта мы можем запросить дополнительное подтверждение личности перед выполнением запроса.",
            },
            {
              title: "16. Ссылки на сторонние сайты и данные третьих лиц",
              content: "Сервис может содержать ссылки на сайты, магазины приложений, каталоги, страницы правообладателей и иные внешние ресурсы, которыми мы не управляем. Мы не отвечаем за содержание, доступность, политику конфиденциальности и практики таких сторонних ресурсов. Рекомендуем изучать документы каждого стороннего сайта или сервиса отдельно.",
            },
            {
              title: "17. Изменения политики и применимое право",
              content: "Мы можем обновлять настоящую Политику при изменении функций сервиса, требований закона или практик обработки данных. Актуальная версия публикуется на юридической странице сервиса https://goeatometer.com. Споры и вопросы, связанные с настоящей Политикой, разрешаются по нормам применимого законодательства Российской Федерации, если иное не предусмотрено обязательными нормами права.",
            },
            {
              title: "18. Связаться с нами",
              content: "По вопросам обработки данных, удаления аккаунта, реализации прав пользователя и обращений, связанных с конфиденциальностью, пишите на support@goeatometer.com.",
            }
          ],
        },
      });
  }
}