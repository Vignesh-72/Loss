<div align="center">
  <img 
    width="478" 
    height="233" 
    alt="Gemini_Generated_Image_lr25rblr25rblr25-removebg-preview(1)" 
    src="https://github.com/user-attachments/assets/34574a2b-0e85-4c00-9188-bb8ca1eda1be"
  />
</div>

# The Brutalist Market Analyzer
<div align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white" />
</div>

<br>

**LOSS** is a high-speed, "split-stack" financial dashboard designed to strip away market noise. By combining mathematically rigorous technical indicators with VADER-powered AI sentiment analysis, LOSS delivers objective, real-time **Buy, Sell, or Hold** verdicts in under two seconds. 

Wrapped in a distraction-free, "Brutalist" user interface, this tool is built for traders who rely on data, not hype.

---

## 📑 Table of Contents
1. [About the Project](#-about-the-project)
2. [System Architecture](#-system-architecture)
3. [Core Features](#-core-features)
4. [Tech Stack](#️-tech-stack)
---

## 💡 About the Project

Modern financial websites are bloated with ads, conflicting opinions, and unnecessary jargon. **LOSS** solves this by automating the math and reading the news for you. 

Instead of a monolithic architecture, LOSS uses a **Split-Stack approach**:
* A **Vercel Relay** handles raw data fetching, bypassing CORS and rate limits.
* A **Render Python Backend** acts as the "Brain," executing heavy machine learning and NLP tasks.
* A **React Frontend** pieces it all together instantly.

---

## 🏗️ System Architecture

LOSS operates on a 3-tier "Split-Stack" workflow:

1. **The UI (React):** Takes user input (Ticker) and displays the final Brutalist dashboard.
2. **The Relay (Vercel/Node.js):** Proxies requests to the **Yahoo Finance API** to fetch OHLCV (Open, High, Low, Close, Volume) data securely.
3. **The Brain (Render/Python):** Receives the raw data, calculates technical signals (RSI, MACD), scrapes news for VADER sentiment, runs a Scikit-Learn Linear Regression forecast, and returns the final verdict.

---

## ✨ Core Features

* **🤖 AI Trading Verdicts:** Instant **Buy/Sell/Hold** signals based on a weighted algorithm of math and sentiment.
* **📰 "Vibe" Check (Sentiment Analysis):** Uses VADER NLP to read recent news headlines and score the market mood (Positive/Negative/Neutral).
* **📈 Automated Technicals:** Instantly calculates RSI, MACD, and Moving Averages without human error.
* **🔮 Price Forecasting:** Uses Linear Regression to predict the next day's price trend.
* **📊 Interactive "Brutalist" Charts:** High-contrast, no-nonsense data visualization using Recharts.
* **🪣 The "Bucket":** A local-storage-based watchlist to monitor your favorite assets instantly.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* **Framework:** React.js (Vite)
* **Styling:** Brutalist UI / CSS
* **Charting:** Recharts

**The Relay (Data Fetching)**
* **Environment:** Node.js (Vercel Serverless Functions)
* **Data Source:** Yahoo Finance API

**The Brain (Backend & ML)**
* **Framework:** Python / FastAPI (Hosted on Render)
* **Data Manipulation:** Pandas
* **Machine Learning:** Scikit-Learn (Linear Regression)
* **NLP Sentiment:** VADER (NLTK)
