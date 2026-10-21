/**
 * Site content — the single source of truth for everything rendered from data.
 *
 * Every factual statement must be traceable to the CV
 * (see docs/CONTENT_SOURCES.md). Do not add employers, deployments,
 * metrics or projects that are not documented there. Read AGENTS.md
 * before editing.
 *
 * Localized text is written as { en, tr }. A plain string is language-neutral
 * (technology names, company names, numbers). Both languages are required for
 * every localized field — scripts/check.mjs enforces this.
 *
 * Interface labels live in i18n.js. The hero heading and SEO metadata are static
 * in index.html so they are crawlable without JavaScript.
 *
 * To add a project: append an object to `caseStudies`.
 * To add a section: add data here, a renderer in render.js and a
 * matching data-render slot in index.html.
 */

/** Quick facts shown beside the hero. */
export const glance = [
  {
    label: { en: "Focus", tr: "Odak" },
    value: { en: "Enterprise banking systems", tr: "Kurumsal bankacılık sistemleri" },
  },
  { label: { en: "Core stack", tr: "Temel teknolojiler" }, value: "Java 8 / 17 / 21 · Spring Boot · REST" },
  { label: { en: "Databases", tr: "Veritabanları" }, value: "PostgreSQL · Oracle · MS SQL Server" },
  { label: { en: "Delivery", tr: "Teslimat" }, value: "Docker · GitLab · CI/CD · Agile" },
  {
    label: { en: "Education", tr: "Eğitim" },
    value: { en: "BSc Computer Engineering, Gazi University", tr: "Bilgisayar Mühendisliği Lisans, Gazi Üniversitesi" },
  },
  { label: { en: "Based in", tr: "Konum" }, value: "Ankara, Türkiye" },
];

/** Headline results — each one is stated in the CV with the same qualifier. */
export const metrics = [
  {
    value: { en: "~70%", tr: "~%70" },
    label: {
      en: "response-time efficiency gain on critical banking queries (SOAP → REST)",
      tr: "kritik bankacılık sorgularında yanıt süresi verimliliği artışı (SOAP → REST)",
    },
    ref: "soap-to-rest",
  },
  {
    value: "8 → 21",
    label: {
      en: "Java version migration of core banking modules",
      tr: "çekirdek bankacılık modüllerinde Java sürüm geçişi",
    },
    ref: "java-21-migration",
  },
  {
    value: "~2×",
    label: {
      en: "daily records processed after a pipeline redesign, at ~97% accuracy",
      tr: "veri hattının yeniden tasarımıyla günlük işlenen kayıt, ~%97 doğrulukla",
    },
    ref: "file-processing-pipeline",
  },
  {
    value: { en: "92.3%", tr: "%92.3" },
    label: {
      en: "accuracy of the CNN model in the brain MRI graduation thesis",
      tr: "beyin MR bitirme tezindeki CNN modelinin doğruluk oranı",
    },
    ref: "mri-deep-learning",
  },
];

/**
 * Case study shape:
 *   id          stable kebab-case anchor
 *   title       short outcome-oriented title            { en, tr }
 *   context     organization / setting                  { en, tr } or string
 *   period      as written in the CV
 *   kind        "professional" | "academic" | "personal"
 *   problem, approach, outcome   one or two sentences   { en, tr }
 *   flow        before → after steps shown as a small diagram (strings or { en, tr })
 *   stack       technologies actually used (strings or { en, tr })
 *   repo        URL to public code, or null — never link private/client code
 *   note        optional disclosure                      { en, tr } | null
 */
export const caseStudies = [
  {
    id: "soap-to-rest",
    title: {
      en: "Rebuilding legacy SOAP services as REST APIs",
      tr: "Eski SOAP servislerini REST API olarak yeniden inşa etmek",
    },
    context: { en: "Enterprise banking · Key Yazılım Çözümleri", tr: "Kurumsal bankacılık · Key Yazılım Çözümleri" },
    period: "2025 – 2026",
    kind: "professional",
    problem: {
      en: "Critical banking queries were served by legacy SOAP services.",
      tr: "Kritik bankacılık sorguları eski SOAP servisleri üzerinden sunuluyordu.",
    },
    approach: {
      en: "Rebuilt the services as RESTful APIs in Java and Spring Boot.",
      tr: "Servisleri Java ve Spring Boot ile RESTful API olarak yeniden geliştirdim.",
    },
    outcome: {
      en: "Improved response-time efficiency for critical queries by approximately 70%.",
      tr: "Kritik sorgularda yanıt süresi verimliliğini yaklaşık %70 artırdım.",
    },
    flow: [{ en: "SOAP services", tr: "SOAP servisleri" }, { en: "RESTful APIs", tr: "RESTful API'ler" }],
    stack: ["Java", "Spring Boot", "REST", "SOAP", "SQL"],
    repo: null,
    note: {
      en: "Client work — code and internal details are confidential.",
      tr: "Müşteri projesi — kod ve iç detaylar gizlidir.",
    },
  },
  {
    id: "java-21-migration",
    title: {
      en: "Migrating core banking modules from Java 8 to Java 21",
      tr: "Çekirdek bankacılık modüllerini Java 8'den Java 21'e taşımak",
    },
    context: { en: "Enterprise banking · Key Yazılım Çözümleri", tr: "Kurumsal bankacılık · Key Yazılım Çözümleri" },
    period: "2025 – 2026",
    kind: "professional",
    problem: {
      en: "Core modules of a banking platform ran on Java 8.",
      tr: "Bir bankacılık platformunun çekirdek modülleri Java 8 üzerinde çalışıyordu.",
    },
    approach: {
      en: "Migrated the modules to Java 21, modernizing the codebase along the way.",
      tr: "Modülleri Java 21'e taşıyarak kod tabanını modernleştirdim.",
    },
    outcome: {
      en: "Improved performance and long-term maintainability of the codebase.",
      tr: "Kod tabanının performansını ve sürdürülebilirliğini iyileştirdim.",
    },
    flow: ["Java 8", "Java 21"],
    stack: ["Java 8", "Java 21", "Spring Boot"],
    repo: null,
    note: {
      en: "Client work — code and internal details are confidential.",
      tr: "Müşteri projesi — kod ve iç detaylar gizlidir.",
    },
  },
  {
    id: "file-processing-pipeline",
    title: {
      en: "Turning manual file integration into an end-to-end pipeline",
      tr: "Manuel dosya entegrasyonunu uçtan uca bir veri hattına dönüştürmek",
    },
    context: "STB · Candidate Engineer",
    period: "2023",
    kind: "professional",
    problem: {
      en: "A form-based application required manual, file-by-file data integration.",
      tr: "Form tabanlı bir uygulama, verilerin dosya dosya manuel olarak entegre edilmesini gerektiriyordu.",
    },
    approach: {
      en:
        "Redesigned and rebuilt it in C# with SQL, centralizing parsing and transformation logic, " +
        "and packaged it in Docker containers distributed through container registries.",
      tr:
        "Uygulamayı C# ve SQL ile yeniden tasarlayıp geliştirdim; ayrıştırma ve dönüştürme mantığını merkezileştirdim, " +
        "Docker container'larıyla paketleyip container registry'ler üzerinden dağıttım.",
    },
    outcome: {
      en:
        "Roughly doubled the number of records processed per day while keeping accuracy around 97%, " +
        "with no data corruption detected.",
      tr:
        "Günlük işlenen kayıt sayısını yaklaşık iki katına çıkardım; doğruluk yaklaşık %97 seviyesinde kaldı " +
        "ve veri bozulması tespit edilmedi.",
    },
    flow: [
      { en: "Manual, file-by-file integration", tr: "Dosya dosya manuel entegrasyon" },
      { en: "End-to-end file processing", tr: "Uçtan uca dosya işleme" },
    ],
    stack: ["C#", "SQL", "Docker", "Container registries"],
    repo: null,
    note: { en: "Internal system — code is not public.", tr: "Kurum içi sistem — kod herkese açık değildir." },
  },
  {
    id: "mri-deep-learning",
    title: { en: "Deep learning for brain MRI analysis", tr: "MR görüntülemede derin öğrenme" },
    context: {
      en: "Gazi University graduation thesis · Turkish Brain Project",
      tr: "Gazi Üniversitesi bitirme tezi · Turkish Brain Project",
    },
    period: "2024",
    kind: "academic",
    problem: {
      en: "Developed within the Turkish Brain Project with the Presidency of the Republic of Türkiye Digital Transformation Office.",
      tr: "Cumhurbaşkanlığı Dijital Dönüşüm Ofisi ile Turkish Brain Project kapsamında yürütüldü.",
    },
    approach: {
      en: "Designed a deep-learning MRI imaging system and trained a CNN model on the BraTS dataset.",
      tr: "BraTS veri seti kullanılarak derin öğrenme tabanlı bir MR görüntüleme sistemi tasarlandı; bir CNN modeli geliştirilip eğitildi.",
    },
    outcome: {
      en: "Completed with a reported accuracy of 92.3%.",
      tr: "Proje %92.3 doğruluk oranıyla tamamlandı.",
    },
    flow: [{ en: "BraTS MRI data", tr: "BraTS MR verisi" }, "CNN", { en: "92.3% accuracy", tr: "%92.3 doğruluk" }],
    stack: [{ en: "Deep learning", tr: "Derin öğrenme" }, "CNN", "BraTS"],
    repo: null,
    note: null,
  },
];

/** Working principles — each one restates practices listed in the CV. `icon` is a sprite id in index.html. */
export const principles = [
  {
    icon: "contract",
    title: { en: "Clear API contracts", tr: "Net API sözleşmeleri" },
    body: {
      en: "Clarifying requirements and aligning API contracts with analysts, senior developers and frontend teams.",
      tr: "Gereksinimleri netleştirip API sözleşmelerini analist, kıdemli geliştirici ve frontend ekipleriyle hizalamak.",
    },
  },
  {
    icon: "shield",
    title: { en: "Maintainable code", tr: "Sürdürülebilir kod" },
    body: {
      en: "Code review, SonarQube, API testing and debugging with long-term maintainability in mind.",
      tr: "Code review, SonarQube, API testi ve uzun vadeli sürdürülebilirliği gözeten debugging.",
    },
  },
  {
    icon: "database",
    title: { en: "Reliable data changes", tr: "Güvenilir veri değişiklikleri" },
    body: {
      en: "SQL consistency checks and Liquibase migrations for reliable persistence.",
      tr: "Güvenilir kalıcılık için SQL tutarlılık kontrolleri ve Liquibase migration'ları.",
    },
  },
  {
    icon: "layers",
    title: { en: "Legacy modernization", tr: "Legacy modernizasyonu" },
    body: {
      en: "Moving legacy systems forward: Java 8 to Java 21, SOAP services to RESTful APIs.",
      tr: "Legacy sistemleri ileri taşımak: Java 8'den Java 21'e, SOAP servislerinden RESTful API'lere.",
    },
  },
];

export const experience = [
  {
    role: "Software Developer",
    company: "Key Yazılım Çözümleri A.Ş.",
    period: { en: "Jan 2025 – Jun 2026", tr: "Oca 2025 – Haz 2026" },
    points: [
      {
        en: "Developed and maintained enterprise banking software for Garanti BBVA Invex, Türk Ticaret Bankası and İş Bankası using Java 8/17/21, Spring Boot, React, REST APIs and relational databases.",
        tr: "Garanti BBVA Invex, Türk Ticaret Bankası ve İş Bankası için Java 8/17/21, Spring Boot, React, REST API'ler ve ilişkisel veritabanlarıyla kurumsal bankacılık yazılımları geliştirdim ve bakımını yaptım.",
      },
      {
        en: "Designed RESTful services for request, appraisal and valuation workflows, covering validation, SQL-based business rules, error handling and integrations.",
        tr: "Talep, ekspertiz ve değerleme süreçleri için doğrulama, SQL tabanlı iş kuralları, hata yönetimi ve entegrasyonları kapsayan RESTful servisler tasarladım ve geliştirdim.",
      },
      {
        en: "Joined a command/feature-pattern banking management platform early in development and delivered end-to-end modules: request/response models, mappers, service logic, REST endpoints and database changes.",
        tr: "Command/feature pattern tabanlı bir bankacılık yönetim platformuna erken aşamada katılarak istek/yanıt modelleri, mapper'lar, servis mantığı, REST endpoint'leri ve veritabanı değişiklikleri dâhil uçtan uca modüller geliştirdim.",
      },
      {
        en: "Worked with PostgreSQL, Oracle and MS SQL Server; wrote SQL queries, consistency checks and Liquibase migrations.",
        tr: "PostgreSQL, Oracle ve MS SQL Server ile çalıştım; SQL sorguları, tutarlılık kontrolleri ve Liquibase migration'ları oluşturdum.",
      },
      {
        en: "Contributed to the AI team on integrating AI-assisted features and aligning backend services with them.",
        tr: "Yapay zekâ destekli çözümlerin projelere entegrasyonu ve backend servislerinin bu özelliklerle hizalanması için AI ekibine katkı sağladım.",
      },
      {
        en: "Delivered through Docker and GitLab workflows, code review, API testing and CI/CD in an Agile team with analysts, senior developers and frontend engineers.",
        tr: "Docker ve GitLab iş akışları, code review, API testi ve CI/CD pratikleriyle; analist, kıdemli geliştirici ve frontend ekipleriyle birlikte Agile bir ortamda teslimat yaptım.",
      },
    ],
  },
  {
    role: "Candidate Engineer",
    company: "STB",
    period: { en: "Mar 2023 – Aug 2023", tr: "Mar 2023 – Ağu 2023" },
    points: [
      {
        en: "Rebuilt a form-based C#, Docker and SQL application into an end-to-end file-processing system.",
        tr: "Form tabanlı bir C#, Docker ve SQL uygulamasını uçtan uca dosya işleyebilen bir sisteme dönüştürdüm.",
      },
      {
        en: "Packaged the application in Docker containers and used container registries for repeatable deployments.",
        tr: "Uygulamayı Docker container'larıyla paketleyip tekrarlanabilir dağıtımlar için container registry'ler kullandım.",
      },
    ],
  },
  {
    role: "Cyber Security Intern",
    company: "GT-ARC, TU Berlin",
    period: { en: "Jan 2023 – Feb 2023", tr: "Oca 2023 – Şub 2023" },
    points: [
      {
        en: "Evaluated about six container registry options for the COSY project on security, scalability and integration fit.",
        tr: "COSY projesi için yaklaşık 6 container registry alternatifini güvenlik, ölçeklenebilirlik ve entegrasyon uygunluğu açısından değerlendirdim.",
      },
      {
        en: "Tested the two leading candidates in depth, presented security findings to the team and supported adoption of the selected registry.",
        tr: "Öne çıkan 2 adayı derinlemesine test ettim, güvenlik bulgularını ekibe sundum ve seçilen registry'nin devreye alınmasına destek verdim.",
      },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Alchemy Smart",
    period: { en: "Aug 2022 – Sep 2022", tr: "Ağu 2022 – Eyl 2022" },
    points: [
      {
        en: "Built a cross-browser real-time chat application with Java, JavaScript and Socket.io, later extended with private chat screens and encrypted message handling.",
        tr: "Java, JavaScript ve Socket.io ile tarayıcılar arası gerçek zamanlı bir sohbet uygulaması geliştirdim; özel sohbet ekranları ve şifreli mesaj işleme özellikleriyle genişlettim.",
      },
      {
        en: "Worked in an Agile Scrum team, taking part in daily stand-ups and sprint planning.",
        tr: "Agile Scrum ekibinde çalışarak günlük toplantılara ve sprint planlamalarına katıldım.",
      },
    ],
  },
];

/** `level: "fundamentals"` marks skills the CV lists as fundamentals — keep that distinction visible. */
export const skills = [
  {
    group: "Backend",
    items: [
      "Java 8 / 17 / 21",
      "Spring Boot",
      "Spring MVC",
      "Spring Data JPA",
      "Hibernate",
      "RESTful APIs",
      { name: { en: "Web services", tr: "Web servisleri" } },
      "JSP",
      "Apache Axis",
    ],
  },
  {
    group: { en: "Databases", tr: "Veritabanları" },
    items: ["PostgreSQL", "Oracle", "MS SQL Server", "MySQL", "SQL", "PL/SQL", "Liquibase"],
  },
  {
    group: { en: "Integration", tr: "Entegrasyon" },
    items: [
      "Microservices",
      { name: { en: "Service integrations", tr: "Servis entegrasyonları" } },
      { name: { en: "Asynchronous workflow concepts", tr: "Asenkron iş akışı kavramları" } },
      { name: "Kafka", level: "fundamentals" },
    ],
  },
  {
    group: { en: "Cloud & DevOps", tr: "Bulut & DevOps" },
    items: [
      "Docker",
      "Container registries",
      "CI/CD",
      "GitLab",
      "Maven",
      { name: "Kubernetes", level: "fundamentals" },
      { name: "AWS · S3", level: "fundamentals" },
    ],
  },
  {
    group: { en: "Practices", tr: "Pratikler" },
    items: [
      "Command / feature pattern",
      "Code review",
      { name: { en: "API testing", tr: "API testi" } },
      "SonarQube",
      "Agile / Scrum",
      { name: "TDD", level: "fundamentals" },
    ],
  },
  {
    group: "Frontend",
    items: ["React", "JavaScript", "HTML", "CSS", "PrimeReact", "Axios", "Yup"],
  },
];

export const education = [
  {
    title: { en: "BSc, Computer Engineering", tr: "Bilgisayar Mühendisliği Lisans" },
    place: { en: "Gazi University", tr: "Gazi Üniversitesi" },
    period: "2018 – 2024",
    detail: {
      en: "Object-oriented programming, databases, distributed systems, algorithms and data structures, cyber security.",
      tr: "Nesne yönelimli programlama, veritabanları, dağıtık sistemler, algoritmalar ve veri yapıları, siber güvenlik.",
    },
  },
  {
    title: { en: "Cloud Computing Security", tr: "Bulut Bilişim Güvenliği" },
    place: "Siber Kulüpler Birliği",
    period: "2022",
    detail: { en: "Course certificate.", tr: "Kurs sertifikası." },
  },
  {
    title: { en: "Communications Officer", tr: "İletişim Sorumlusu" },
    place: { en: "Erasmus Student Network, Gazi University", tr: "Erasmus Student Network, Gazi Üniversitesi" },
    period: { en: "Ongoing", tr: "Devam ediyor" },
    detail: { en: "Volunteer role.", tr: "Gönüllü rol." },
  },
];

export const languages = [
  { name: { en: "Turkish", tr: "Türkçe" }, level: { en: "Native", tr: "Ana dil" } },
  { name: { en: "English", tr: "İngilizce" }, level: "C1" },
  { name: { en: "German", tr: "Almanca" }, level: "B1" },
];
