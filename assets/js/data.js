/**
 * Site content — the single source of truth for everything rendered on the page.
 *
 * Every factual statement here must be traceable to the CV
 * (see docs/CONTENT_SOURCES.md). Do not add employers, deployments,
 * metrics or projects that are not documented there. Read AGENTS.md
 * before editing.
 *
 * The hero, contact links and SEO metadata are static in index.html so they
 * are crawlable without JavaScript; keep them consistent with this file.
 *
 * To add a project: append an object to `caseStudies`.
 * To add a section: add data here, a renderer in render.js and a
 * matching <section> placeholder in index.html.
 */

/**
 * Case study shape:
 *   id          stable kebab-case anchor
 *   title       short outcome-oriented title
 *   context     organization / setting (generalized where confidential)
 *   period      as written in the CV
 *   kind        "professional" | "academic" | "personal"
 *   problem, approach, outcome   one or two sentences each, CV-backed
 *   stack       technologies actually used
 *   repo        URL to public code, or null — never link private/client code
 *   note        optional disclosure (e.g. confidentiality)
 */
export const caseStudies = [
  {
    id: "soap-to-rest",
    title: "Rebuilding legacy SOAP services as REST APIs",
    context: "Enterprise banking · Key Yazılım Çözümleri",
    period: "2025 – 2026",
    kind: "professional",
    problem: "Critical banking queries were served by legacy SOAP services.",
    approach: "Rebuilt the services as RESTful APIs in Java and Spring Boot.",
    outcome: "Improved response-time efficiency for critical queries by approximately 70%.",
    stack: ["Java", "Spring Boot", "REST", "SOAP", "SQL"],
    repo: null,
    note: "Client work — code and internal details are confidential.",
  },
  {
    id: "java-21-migration",
    title: "Migrating core banking modules from Java 8 to Java 21",
    context: "Enterprise banking · Key Yazılım Çözümleri",
    period: "2025 – 2026",
    kind: "professional",
    problem: "Core modules of a banking platform ran on Java 8.",
    approach: "Migrated the modules to Java 21, modernizing the codebase along the way.",
    outcome: "Improved performance and long-term maintainability of the code base.",
    stack: ["Java 8", "Java 21", "Spring Boot"],
    repo: null,
    note: "Client work — code and internal details are confidential.",
  },
  {
    id: "file-processing-pipeline",
    title: "Turning manual file integration into an end-to-end pipeline",
    context: "STB · Candidate Engineer",
    period: "2023",
    kind: "professional",
    problem: "A form-based application required manual, file-by-file data integration.",
    approach:
      "Redesigned and rebuilt it in C# with SQL, centralizing parsing and transformation logic, " +
      "and packaged it in Docker containers distributed through container registries.",
    outcome:
      "Roughly doubled the number of records processed per day while keeping accuracy around 97%, " +
      "with no data corruption detected.",
    stack: ["C#", "SQL", "Docker", "Container registries"],
    repo: null,
    note: "Internal system — code is not public.",
  },
  {
    id: "mri-deep-learning",
    title: "Deep learning for brain MRI analysis",
    context: "Gazi University graduation thesis · Turkish Brain Project",
    period: "2024",
    kind: "academic",
    problem:
      "Developed within the Turkish Brain Project with the Presidency of the Republic of Türkiye Digital Transformation Office.",
    approach: "Designed a deep-learning MRI imaging system and trained a CNN model on the BraTS dataset.",
    outcome: "Completed with a reported accuracy of 92.3%.",
    stack: ["Deep learning", "CNN", "BraTS dataset"],
    repo: null,
    note: null,
  },
];

export const experience = [
  {
    role: "Software Developer",
    company: "Key Yazılım Çözümleri A.Ş.",
    period: "Jan 2025 – Jun 2026",
    points: [
      "Developed and maintained enterprise banking software for Garanti BBVA Invex, Türk Ticaret Bankası and İş Bankası using Java 8/17/21, Spring Boot, React, REST APIs and relational databases.",
      "Designed RESTful services for request, appraisal and valuation workflows, covering validation, SQL-based business rules, error handling and integrations.",
      "Joined a command/feature-pattern banking management platform early in development and delivered end-to-end modules: request/response models, mappers, service logic, REST endpoints and database changes.",
      "Worked with PostgreSQL, Oracle and MS SQL Server; wrote SQL queries, consistency checks and Liquibase migrations.",
      "Contributed to the AI team on integrating AI-assisted features and aligning backend services with them.",
      "Delivered through Docker and GitLab workflows, code review, API testing and CI/CD in an Agile team with analysts, senior developers and frontend engineers.",
    ],
  },
  {
    role: "Candidate Engineer",
    company: "STB",
    period: "Mar 2023 – Aug 2023",
    points: [
      "Rebuilt a form-based C#, Docker and SQL application into an end-to-end file-processing system.",
      "Packaged the application in Docker containers and used container registries for repeatable deployments.",
    ],
  },
  {
    role: "Cyber Security Intern",
    company: "GT-ARC, TU Berlin",
    period: "Jan 2023 – Feb 2023",
    points: [
      "Evaluated about six container registry options for the COSY project on security, scalability and integration fit.",
      "Tested the two leading candidates in depth, presented security findings to the team and supported adoption of the selected registry.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Alchemy Smart",
    period: "Aug 2022 – Sep 2022",
    points: [
      "Built a cross-browser real-time chat application with Java, JavaScript and Socket.io, later extended with private chat screens and encrypted message handling.",
      "Worked in an Agile Scrum team, taking part in daily stand-ups and sprint planning.",
    ],
  },
];

/** `level: "fundamentals"` marks skills the CV lists as fundamentals — keep that distinction visible. */
export const skills = [
  {
    group: "Backend",
    items: ["Java 8 / 17 / 21", "Spring Boot", "Spring MVC", "Spring Data JPA", "Hibernate", "RESTful APIs", "Web services", "JSP", "Apache Axis"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "Oracle", "MS SQL Server", "MySQL", "SQL", "PL/SQL", "Liquibase"],
  },
  {
    group: "Integration",
    items: ["Microservices", "Service integrations", "Asynchronous workflow concepts", { name: "Kafka", level: "fundamentals" }],
  },
  {
    group: "Cloud & DevOps",
    items: ["Docker", "Container registries", "CI/CD", "GitLab", "Maven", { name: "Kubernetes", level: "fundamentals" }, { name: "AWS · S3", level: "fundamentals" }],
  },
  {
    group: "Practices",
    items: ["Command / feature pattern", "Code review", "API testing", "SonarQube", "Agile / Scrum", { name: "TDD", level: "fundamentals" }],
  },
  {
    group: "Frontend",
    items: ["React", "JavaScript", "HTML", "CSS", "PrimeReact", "Axios", "Yup"],
  },
];

export const education = [
  {
    title: "BSc, Computer Engineering",
    place: "Gazi University",
    period: "2018 – 2024",
    detail: "Object-oriented programming, databases, distributed systems, algorithms and data structures, cyber security.",
  },
  {
    title: "Cloud Computing Security",
    place: "Siber Kulüpler Birliği",
    period: "2022",
    detail: "Course certificate.",
  },
  {
    title: "Communications Officer",
    place: "Erasmus Student Network, Gazi University",
    period: "Ongoing",
    detail: "Volunteer role.",
  },
];

export const languages = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "C1" },
  { name: "German", level: "B1" },
];
