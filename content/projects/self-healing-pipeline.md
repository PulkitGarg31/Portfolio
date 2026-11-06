---
title: "Real-Time Self-Healing Data Pipeline"
summary: "Fault-tolerant Airflow pipeline that self-heals schema drift in CSV files using rules and a local LLM."
category: [data, genai]
tech: [Python, Apache Airflow, Ollama LLaMA 3.2, pytest, PostgreSQL, dbt, Docker, Streamlit]
github: https://github.com/PulkitGarg31/self-healing-pipeline
order: 3
highlights:
  - "Developed a 4-task event-driven Airflow pipeline to validate, load and transform CSVs, with 2 retries per task."
  - "Implemented LLaMA 3.2 self-healing that maps renamed columns, with 9 checks on every AI answer before use."
  - "Logged every repair attempt in PostgreSQL and containerized the stack so it starts with one Docker command."
---
