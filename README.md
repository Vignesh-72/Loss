<div align="center">
  <img 
    width="478" 
    height="233" 
    alt="Gemini_Generated_Image_lr25rblr25rblr25-removebg-preview(1)" 
    src="https://github.com/user-attachments/assets/34574a2b-0e85-4c00-9188-bb8ca1eda1be"
  />
</div>

# 📉 LOSS: The Brutalist Market Analyzer


![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

**LOSS** is a high-speed, "split-stack" financial dashboard designed to strip away market noise. By combining mathematically rigorous technical indicators with VADER-powered AI sentiment analysis, LOSS delivers objective, real-time **Buy, Sell, or Hold** verdicts in under two seconds. 

Wrapped in a distraction-free, "Brutalist" user interface, this tool is built for traders who rely on data, not hype.

---

## 📑 Table of Contents
1. [About the Project](#about-the-project)
2. [System Architecture](#system-architecture)
3. [Core Features](#core-features)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Usage Scenario](#usage-scenario)
7. [Disclaimer](#disclaimer)

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

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v16+)
* Python (3.9+)
* Git

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/loss-market-analyzer.git](https://github.com/your-username/loss-market-analyzer.git)
cd loss-market-analyzer
```
### 2. Setup the Python Backend ("The Brain")
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on http://localhost:8000

### 3. Setup the React Frontend & Relay
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables
Create a .env file in the frontend directory to link to your backend:
```bash
VITE_API_URL=http://localhost:8000
```
## 🎯 Usage Scenario

1. Open the LOSS dashboard.
2. Search for a highly volatile stock (e.g., `TSLA` or `BTC-USD`).
3. Within 2 seconds, view the **Verdict Panel**.
4. Check the **Sentiment Score** to see if news headlines are crashing the stock, or if it's purely a technical dip.
5. Click **"Add to Bucket"** to save it to your daily watchlist.

---

## ⚠️ Disclaimer

*LOSS is an educational tool developed for academic/portfolio purposes. The "Verdicts" generated by the AI are based on historical data and algorithmic sentiment, which do not guarantee future performance. Do not use this application as sole financial advice for real money trading.*
