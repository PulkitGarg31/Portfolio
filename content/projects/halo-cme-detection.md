---
title: "Halo CME Detection"
summary: "Two-member ML project, published as a research paper at ICACSDF 2026, that flags Halo Coronal Mass Ejections in Aditya-L1 solar wind data without coronagraph images."
category: ml
tech: [Python, scikit-learn, XGBoost, Pandas, NumPy, FastAPI, Render]
github: https://github.com/Arnav020/Halo-CME-Detection
demo: https://halo-cme-detection.onrender.com
image: /projects/halo-cme.png
featured: true
order: 4
demoNote: "Free hosting: the first load can take about 30 seconds."
highlights:
  - "Engineered 4 physics-informed features and built 43 labelled solar wind windows (13 CME) from the CACTUS catalogue."
  - "Trained a soft-voting Random Forest, XGBoost and Logistic Regression ensemble with a recall-first 0.45 threshold, reaching 100% CME recall and 0.91 ROC AUC on a held-out split."
  - "Served the model through FastAPI on Render, with CSV checks for BOM, unsorted rows and sparse windows."
---
