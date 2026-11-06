---
title: "SynthSales: Agentic AI Sales CRM"
summary: "Agentic B2B outreach backend that turns uploaded company CSVs into researched, scored, contactable prospects with verified emails, AI-drafted outreach, reply tracking, and meeting scheduling."
category: [agents, genai]
tech: [FastAPI, Gemini API, PostgreSQL, Redis, Docker, Google APIs, APScheduler]
github: https://github.com/PulkitGarg31/SynthSales-Agentic-AI-Sales-CRM
demo: https://synthsales.vercel.app
image: /projects/synthsales.png
featured: true
order: 1
highlights:
  - "Built a scalable FastAPI backend with 78 REST endpoints and 14 PostgreSQL models, owning it end-to-end from design to JWT auth and admin approvals."
  - "Designed an orchestrator that runs 8 AI agents in order, keeps a 24h undo snapshot before any run that clears data, and protects live conversations, booked meetings and verified emails from re-runs."
  - "Added an opt-in autonomous mode where AI reads inbound replies, answers product questions and books meetings, acting only above a confidence floor and sending the rest to human review."
---
