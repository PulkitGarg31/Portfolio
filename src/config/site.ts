type Paper = {
  title: string;
  authors: string[];
  venue: string;
  date: string;
  url?: string; // PDF in public/papers/, or a DOI / proceedings link
  projectSlug?: string; // links to the project card with this id
};

type Achievement = { title: string; detail: string; date: string; url?: string };

export const site = {
  name: "Pulkit Garg",
  url: "https://pulkitgarg31.tech",
  role: "Backend & AI Engineer",
  badges: ["Backend Development", "Agentic AI"],
  subHeadline: ["I build backends", "that run AI agents"],
  positioning:
    "Backends, agentic AI and ML, built end to end and shipped, not just notebooked.",
  marquee: [
    "Backend Development",
    "Agentic AI",
    "REST APIs",
    "System Design",
    "Scalable Systems",
    "Data Structures & Algorithms",
    "Machine Learning",
  ],
  email: "pulkit3110@gmail.com",
  github: "https://github.com/PulkitGarg31",
  linkedin: "https://www.linkedin.com/in/pulkitgarg31",
  resumePath: "/Pulkit_Garg_Resume.pdf",
  // Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (local) and in Vercel (deploy).
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  availability: "Open to backend, AI and ML roles.",
  footerTag: "Made with ♥ by Pulkit Garg",
  bio: [
    "I'm a Computer Science student at Thapar who builds backends that do real work: APIs, data pipelines and AI agents wired into real workflows.",
    "My favourite projects are the ones where the AI acts, not just answers: a sales platform that researches companies and drafts its own outreach, and a data pipeline that repairs schema drift in incoming files by itself.",
    "I co-authored a research paper on detecting Halo Coronal Mass Ejections from Aditya-L1 solar wind data, published at ICACSDF 2026, and I was selected for Amazon ML Summer School 2026. I'm looking for backend and AI engineering roles where shipping matters. If you're building something ambitious, let's talk.",
  ],
  education:
    "B.E. Computer Science and Engineering · Thapar Institute of Engineering and Technology · Aug 2023 to May 2027 · CGPA 8.71",
  skills: [
    { group: "Languages & CS", items: ["C++", "Python", "Data Structures & Algorithms"] },
    { group: "Backend & APIs", items: ["FastAPI", "REST APIs", "Microservices", "API Testing", "pytest", "Redis"] },
    { group: "Databases", items: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "ChromaDB"] },
    { group: "AI & Automation", items: ["GenAI", "LangChain", "LLM Integration", "Ollama", "Streamlit"] },
    { group: "Machine Learning", items: ["Pandas", "NumPy", "Scikit-learn", "Regression & Classification", "Neural Networks", "NLP"] },
    { group: "Cloud & DevOps", items: ["Git", "GitHub", "Docker"] },
  ],
  research: [
    {
      title: "Real-Time Detection of Halo Coronal Mass Ejections from Solar Wind Data",
      authors: ["Arnav Joshi", "Pulkit Garg", "Vijay Kumari", "Stuti Chug"],
      venue:
        "2026 International Conference on Advancement of Cyber Security and Digital Forensics (ICACSDF), UPES Dehradun",
      date: "Sep 2026",
      url: "/papers/halo-cme-detection-icacsdf-2026.pdf",
      projectSlug: "halo-cme-detection",
    },
  ] as Paper[],
  achievements: [
    {
      title: "Amazon ML Summer School 2026",
      detail: "Selected nationwide for Amazon's competitive ML training program",
      date: "2026",
    },
    {
      title: "Advanced Learning Algorithms",
      detail: "DeepLearning.AI & Stanford University (Coursera)",
      date: "Dec 2025",
      url: "https://coursera.org/verify/946HWVIOR5BS",
    },
    {
      title: "Supervised Machine Learning: Regression and Classification",
      detail: "DeepLearning.AI & Stanford University (Coursera)",
      date: "Jan 2025",
      url: "https://coursera.org/verify/M1N8S47R2IYD",
    },
  ] as Achievement[],
};

export type Site = typeof site;
