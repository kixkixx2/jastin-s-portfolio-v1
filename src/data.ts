import { asset } from './utils/asset';

export const PORTFOLIO_DATA = {
  name: "Jastin Lamug",
  role: "Software Developer & Data Specialist",
  email: "jastinlamug26@gmail.com",
  phone: "0917 457 2531",
  portfolio: "kixkixx2.github.io/jastin-s-portfolio-v1",
  about: "I am a computer science graduate specializing in data mining, AI-assisted development, and software engineering. I build robust management systems, implement machine learning pipelines, and optimize real-world workflows.",
  skills: {
    stack: ["Python", "JavaScript", "C++", "HTML/CSS", "SQL"],
    ai: ["AI-Assisted Development", "AI Debugging", "Prompt Engineering", "Claude", "Gemini", "Codex"],
    office: ["MS Office Suite (Excel, Word, PowerPoint)", "Data Entry", "Documentation"]
  },
  experience: [
    {
      id: "dmw",
      role: "Internship",
      company: "Department of Migrant Workers - DMW",
      date: "Feb 2026 - May 2026",
      images: [
        asset("/assets/intern/1.jpg"),
        asset("/assets/intern/2.jpg"),
        asset("/assets/intern/3.jpg"),
        asset("/assets/intern/4.jpg")
      ],
      points: [
        "Architected and deployed a standalone, local-network Paperless Queuing System using SQLite to streamline and optimize real-time client routing between DMW and OWWA offices.",
        "Processed and consolidated large-scale demographic datasets into structured, highly organized spreadsheets, improving record accuracy and access efficiency."
      ]
    }
  ],
  projects: [
    {
      id: "qms",
      title: "Queue Management System",
      date: "Feb 2026",
      images: [
        asset("/assets/q-system/1.png"),
        asset("/assets/q-system/2.png"),
        asset("/assets/q-system/3.png"),
        asset("/assets/q-system/4.png"),
        asset("/assets/q-system/5.png"),
        asset("/assets/q-system/6.png"),
        asset("/assets/q-system/7.png"),
        asset("/assets/q-system/8.png"),
        asset("/assets/q-system/9.png"),
        asset("/assets/q-system/10.png"),
        asset("/assets/q-system/11.jpg")
      ],
      stack: ["HTML", "CSS", "JavaScript", "Node.js", "SQLite", "Local Network"],
      points: [
        "Developed a localhost queuing application using SQLite to manage and route clients for a joint DMW and OWWA facility.",
        "Eliminated physical wait times with an offline, paperless system operating entirely on the local network to protect user data."
      ]
    },
    {
      id: "kumap",
      title: "K-UMAP Health Analytics",
      displayTitle: "Machine Learning",
      date: "Dec 2025",
      images: [
        asset("/assets/k-umap/k1.png"),
        asset("/assets/k-umap/k2.png"),
        asset("/assets/k-umap/k3.png")
      ],
      stack: ["Python", "Flask", "Flask-CORS", "Gunicorn", "NumPy", "Pandas", "Scikit-Learn", "Joblib", "UMAP-learn", "SciPy", "Optuna"],
      link: "https://k-umap.onrender.com/",
      points: [
        "An enhanced K-UMAP pipeline for analyzing health records at Isabela State University Echague Infirmary. This project combines two powerful algorithms:",
        "UMAP: Uniform Manifold Approximation and Projection — a dimensionality reduction technique that visualizes high-dimensional data in 2D/3D while preserving the global and local structure of the data.",
        "K-Means: A clustering algorithm that partitions data into K distinct groups based on similarity, identifying patterns and groupings in student health records for better healthcare insights."
      ]
    },
    {
      id: "jplamug",
      title: "J.P. Lamug-Daquioag Clinic Website",
      displayTitle: "Web",
      date: "Sept 2026",
      image: asset("/assets/web.png"),
      stack: ["TypeScript", "HTML", "API", "Chatbot"],
      link: "https://j-p-lamug-daquioag.vercel.app/",
      points: [
        "Designed, developed, and deployed the official clinic website for J.P. Lamug-Daquioag OB-GYNE Clinic, establishing an online presence for their healthcare services in San Agustin, Isabela."
      ]
    },
    {
      id: "automation",
      title: "Stock Market News Intelligence Analyzer",
      displayTitle: "Automation",
      date: "Aug 2026",
      images: [
        asset("/assets/automation/a1.png"),
        asset("/assets/automation/a2.png"),
        asset("/assets/automation/a3.png"),
        asset("/assets/automation/a4.png"),
        asset("/assets/automation/a5.png")
      ],
      stack: ["n8n", "RSS Feeds", "HTTP/REST APIs", "AI/LLM", "Google Gemini", "Discord Webhooks", "JavaScript", "JSON", "Cron/Scheduled Triggers"],
      points: [
        "Stock Market News Intelligence Analyzer is an automated financial-news monitoring system built with n8n. It collects and consolidates stock-market news from multiple financial sources, processes and analyzes the collected stories using AI to identify potentially significant market developments, and filters the results to highlight important market signals. The selected insights are then formatted and delivered automatically to Discord through a webhook, providing users with timely and organized stock-market news without manually monitoring multiple sources."
      ]
    }
  ],
  education: {
    degree: "Bachelor of Science in Computer Science (Major in Data Mining)",
    school: "Isabela State University - Echague Main Campus",
    date: "Aug 2022 - Jul 2026",
    honors: "Cum Laude",
    gwa: "1.518",
    images: [
      asset("/assets/cert/isu.png"),
      asset("/assets/cert/certification graduate.jpg"),
      asset("/assets/cert/honor graduate .jpg"),
      asset("/assets/cert/certificate of recognition.jpg"),
      asset("/assets/cert/accenture.png"),
      asset("/assets/cert/certificate of elegibility.jpg")
    ],
    cumLaudeImage: asset("/assets/cert/certificate of recognition.jpg"),
    certifications: [
      {
        title: "Honor Graduate Eligibility - Cum Laude (PD - 907)",
        date: "Jul 2026",
        image: asset("/assets/cert/honor graduate .jpg")
      },
      {
        title: "Accenture Technology Academy - Salesforce",
        date: "Feb 2026 - Apr 2026",
        image: asset("/assets/cert/accenture.png")
      },
      {
        title: "Civil Service Eligible - Professional",
        date: "Mar 2024",
        image: asset("/assets/cert/certificate of elegibility.jpg")
      }
    ]
  }
};
