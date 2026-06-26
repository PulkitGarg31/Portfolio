export const site = {
  name: "Pulkit Garg",
  role: "ML Engineer",
  badges: ["ML Engineer", "GenAI & Agentic AI"],
  subHeadline: ["I build AI systems", "that ship different"],
  positioning:
    "GenAI, agentic systems & ML, built end-to-end and shipped, not just notebooked.",
  marquee: ["LLM Applications", "Agentic AI", "RAG Pipelines", "Data Engineering", "Machine Learning"],
  email: "pulkit3110@gmail.com",
  github: "https://github.com/PulkitGarg31",
  linkedin: "https://www.linkedin.com/in/pulkitgarg31",
  resumePath: "/Pulkit_Garg_Resume.pdf",
  // Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (local) and in Vercel (deploy).
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  availability: "Open to ML / GenAI roles.",
  footerTag: "Made with ♥ by Pulkit Garg",
  bio: [
    "I'm a computer science student at Thapar who builds AI that does real work instead of living in notebooks: agentic systems, RAG pipelines, and LLM apps wired into production workflows.",
    "My favorite projects are the ones where the AI acts, not just answers: a data pipeline that heals its own failures, a sales platform that runs its own outreach.",
    "I've completed Stanford and DeepLearning.AI machine learning coursework, and I'm looking for ML and GenAI engineering roles where shipping matters. If you're building something ambitious with LLMs, let's talk.",
  ],
  education: "B.E. Computer Science, Thapar Institute of Engineering and Technology, 2023-2027, CGPA 8.71",
  skills: [
    { group: "Languages", items: ["C", "C++","Python", "JavaScript"] },
    { group: "Machine Learning", items: ["Scikit-learn", "TensorFlow", " Regression & Classification", "Neural Networks", "NLP"] },
    { group: "AI & Automation", items: ["LangChain", "LangGraph","Agentic AI", "RAG Pipelines", "Prompt Engineering", "LLM Integration", "Gemini API", "Ollama"] },
    { group: "Data Engineering", items: ["Apache Airflow", "dbt", "Streamlit"] },
    { group: "Backend & APIs", items: ["FastAPI", "REST APIs", "NextAuth.js"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
    { group: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "ChromaDB"] },
    { group: "Tools & Version Control", items: ["Git", "GitHub", "Docker"] },
  ],
};

export type Site = typeof site;
