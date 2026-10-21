/**
 * Interface strings (labels, headings, buttons) in every supported language.
 * Content (case studies, experience…) lives in data.js.
 *
 * index.html elements carry data-i18n="<key>" (text) or
 * data-i18n-attr="<attr>:<key>" (attributes); their English text in the HTML
 * is the no-JavaScript fallback and must match `en` below.
 * Every key must exist in every language — scripts/check.mjs enforces it.
 */

export const LANGUAGES = ["en", "tr"];
export const DEFAULT_LANGUAGE = "en";

export const strings = {
  en: {
    "meta.title": "Elif Berfin Gülbaş — Software Engineer, Backend & Enterprise Systems",
    "meta.description":
      "Elif Berfin Gülbaş is a backend-focused software engineer building enterprise banking systems with Java, Spring Boot, REST APIs and relational databases.",
    skip: "Skip to content",
    "nav.label": "Primary",
    "nav.work": "Work",
    "nav.experience": "Experience",
    "nav.expertise": "Expertise",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.home": "Elif Berfin Gülbaş, back to top",
    "lang.label": "Language",
    "theme.toDark": "Switch to dark theme",
    "theme.toLight": "Switch to light theme",
    "hero.eyebrow": "Software Engineer — Backend & Enterprise Systems",
    "hero.lede":
      "Backend-focused computer engineer building enterprise banking systems, primarily with Java and Spring Boot. I work on REST APIs, business logic, and database and enterprise-system integrations — across greenfield development and legacy modernization.",
    "hero.ctaWork": "View selected work",
    "hero.ctaEmail": "Email me",
    "glance.title": "At a glance",
    "metrics.label": "Selected results",
    "work.title": "Selected work",
    "work.intro":
      "Engineering case studies from professional and academic work. Client systems are described at a general level; no proprietary code or data is shown.",
    "case.context": "Context",
    "case.approach": "Approach",
    "case.outcome": "Outcome",
    "case.stack": "Technologies",
    "case.source": "View source",
    "kind.professional": "Professional",
    "kind.academic": "Academic",
    "kind.personal": "Personal project",
    "experience.title": "Experience",
    "expertise.title": "Technical expertise",
    "expertise.introBefore": "Items marked",
    "expertise.introAfter": "are working knowledge rather than production depth.",
    fundamentals: "fundamentals",
    "education.title": "Education, certification & volunteering",
    "languages.title": "Languages",
    "contact.title": "Get in touch",
    "contact.lede": "The quickest way to reach me is email. I'm also on GitHub and LinkedIn.",
    "contact.copy": "Copy",
    "contact.copied": "Copied",
    "contact.copyLabel": "Copy email address",
    "contact.copiedAnnounce": "Email address copied to clipboard",
    "contact.email": "Email",
    "principles.title": "How I work",
    "contact.print": "Save as PDF",
    "contact.printMeta": "Print-ready résumé of this page",
    "experience.more": "Show more",
    "experience.less": "Show less",
    "case.flow": "Change",
    "metrics.see": "See case study",
    "footer.top": "Back to top",
    "footer.built": "Built with plain HTML, CSS and JavaScript.",
    noscript: "Case studies, experience and skills need JavaScript. The full CV is available on LinkedIn.",
  },
  tr: {
    "meta.title": "Elif Berfin Gülbaş — Yazılım Mühendisi, Backend & Kurumsal Sistemler",
    "meta.description":
      "Elif Berfin Gülbaş; Java, Spring Boot, REST API'ler ve ilişkisel veritabanlarıyla kurumsal bankacılık sistemleri geliştiren backend odaklı bir yazılım mühendisidir.",
    skip: "İçeriğe geç",
    "nav.label": "Ana menü",
    "nav.work": "Projeler",
    "nav.experience": "Deneyim",
    "nav.expertise": "Yetkinlikler",
    "nav.contact": "İletişim",
    "nav.menu": "Menü",
    "nav.home": "Elif Berfin Gülbaş, başa dön",
    "lang.label": "Dil",
    "theme.toDark": "Karanlık temaya geç",
    "theme.toLight": "Aydınlık temaya geç",
    "hero.eyebrow": "Yazılım Mühendisi — Backend & Kurumsal Sistemler",
    "hero.lede":
      "Ağırlıklı olarak Java ve Spring Boot ile kurumsal bankacılık sistemleri geliştiren, backend odaklı bir bilgisayar mühendisiyim. REST API'ler, iş mantığı, veritabanı ve kurumsal sistem entegrasyonları üzerinde; hem sıfırdan geliştirme hem de legacy modernizasyon projelerinde çalışıyorum.",
    "hero.ctaWork": "Projeleri incele",
    "hero.ctaEmail": "E-posta gönder",
    "glance.title": "Kısaca",
    "metrics.label": "Öne çıkan sonuçlar",
    "work.title": "Seçili projeler",
    "work.intro":
      "Profesyonel ve akademik çalışmalardan mühendislik vaka çalışmaları. Müşteri sistemleri genel düzeyde anlatılır; özel kod veya veri paylaşılmaz.",
    "case.context": "Bağlam",
    "case.approach": "Yaklaşım",
    "case.outcome": "Sonuç",
    "case.stack": "Teknolojiler",
    "case.source": "Kaynak kodu",
    "kind.professional": "Profesyonel",
    "kind.academic": "Akademik",
    "kind.personal": "Kişisel proje",
    "experience.title": "Deneyim",
    "expertise.title": "Teknik yetkinlikler",
    "expertise.introBefore": "",
    "expertise.introAfter": "ile işaretli öğeler, production derinliği yerine temel düzeyde bilgiyi ifade eder.",
    fundamentals: "temel düzey",
    "education.title": "Eğitim, sertifika ve gönüllülük",
    "languages.title": "Diller",
    "contact.title": "İletişim",
    "contact.lede": "Bana ulaşmanın en hızlı yolu e-posta. GitHub ve LinkedIn'de de bulabilirsiniz.",
    "contact.copy": "Kopyala",
    "contact.copied": "Kopyalandı",
    "contact.copyLabel": "E-posta adresini kopyala",
    "contact.copiedAnnounce": "E-posta adresi panoya kopyalandı",
    "contact.email": "E-posta",
    "principles.title": "Nasıl çalışırım",
    "contact.print": "PDF olarak kaydet",
    "contact.printMeta": "Bu sayfanın yazdırılabilir özgeçmişi",
    "experience.more": "Daha fazla göster",
    "experience.less": "Daha az göster",
    "case.flow": "Değişim",
    "metrics.see": "Projeye git",
    "footer.top": "Başa dön",
    "footer.built": "Sade HTML, CSS ve JavaScript ile geliştirildi.",
    noscript: "Projeler, deneyim ve yetkinlikler için JavaScript gerekir. Özgeçmişin tamamı LinkedIn'de.",
  },
};

/** Resolves a localized value: plain strings are language-neutral, objects are { en, tr }. */
export function t(value, lang) {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value;
  return value[lang] ?? value[DEFAULT_LANGUAGE];
}
