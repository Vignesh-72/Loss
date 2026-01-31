import pandas as pd
import numpy as np
import feedparser
import urllib.parse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.linear_model import LinearRegression

app = FastAPI()
analyzer = SentimentIntensityAnalyzer()

# --- SETUP ---
financial_lexicon = {
    'jumped': 4.0, 'jumps': 4.0, 'surges': 4.0, 'soars': 4.0,
    'doubled': 4.0, 'record': 3.5, 'high': 3.0, 'gains': 3.0,
    'green': 2.5, 'profit': 3.0, 'bull': 4.0, 'bullish': 4.0,
    'breakout': 3.5, 'rally': 3.5, 'recovers': 2.0,
    'tumbles': -4.0, 'plunges': -4.0, 'crashes': -4.0,
    'drops': -3.0, 'low': -3.0, 'loss': -3.0, 'bear': -4.0,
    'bearish': -4.0, 'selloff': -3.5, 'dip': -1.5,
    'spat': 0.0, 'war': -0.5, 'crisis': -0.5, 'fear': -0.5,
    'tension': -0.5, 'uncertainty': -0.5
}
analyzer.lexicon.update(financial_lexicon)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW DATA MODELS ---
# This matches the data coming from Vercel
class RawHistoryItem(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class RawDataPayload(BaseModel):
    ticker: str
    history: List[RawHistoryItem]
    current_price: float
    company_name: str
    currency: str
    sector: Optional[str] = "Other"
    industry: Optional[str] = "N/A"
    website: Optional[str] = "#"
    market_cap: Optional[Any] = "N/A"
    pe_ratio: Optional[Any] = "N/A"
    description: Optional[str] = "No profile available."

# --- LOGIC FUNCTIONS (Unchanged logic, just adapted) ---

def detect_signals(df):
    signals = []
    if len(df) < 20: return signals
    current = df.iloc[-1]
    prev = df.iloc[-2]
    
    std_dev = df['Close'].rolling(window=20).std().iloc[-1]
    vol_ma = df['Volume'].rolling(window=20).mean().iloc[-1]

    if prev['MA50'] < prev['MA200'] and current['MA50'] > current['MA200']:
        signals.append({"type": "Golden Cross", "sentiment": "Bullish", "desc": "Long-term trend just turned positive."})
    if prev['MA50'] > prev['MA200'] and current['MA50'] < current['MA200']:
        signals.append({"type": "Death Cross", "sentiment": "Bearish", "desc": "Long-term trend is slowing down."})

    if current['RSI'] < 30:
        signals.append({"type": "RSI Oversold", "sentiment": "Bullish", "desc": "Stock is currently 'on sale' (undervalued)."})
    elif current['RSI'] > 70:
        signals.append({"type": "RSI Overbought", "sentiment": "Bearish", "desc": "Stock is 'out of breath' (overextended)."})

    if vol_ma > 0 and current['Volume'] > (vol_ma * 1.5):
        signals.append({"type": "Volume Spike", "sentiment": "Neutral", "desc": "Huge crowd activity detected."})

    return signals

def calculate_technical_indicators(df):
    df['MA50'] = df['Close'].rolling(window=min(50, len(df))).mean()
    df['MA200'] = df['Close'].rolling(window=min(200, len(df))).mean()
    df['MA_20'] = df['Close'].rolling(window=20).mean()
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / (loss + 1e-9)
    df['RSI'] = 100 - (100 / (1 + rs))
    df['Momentum'] = df['Close'] - df['Close'].shift(10)
    df['Volatility'] = df['Close'].pct_change().rolling(window=21).std() * 100
    return df.bfill().ffill().fillna(0)

def predict_future_prices(df, days=7):
    try:
        if len(df) < 30: return []
        recent = df['Close'].tail(30).dropna()
        x = np.arange(len(recent)).reshape(-1, 1)
        model = LinearRegression().fit(x, recent)
        future_preds = []
        last_price = df['Close'].iloc[-1]
        recent_momentum = (df['Close'].iloc[-1] - df['Close'].iloc[-5]) / 5 if len(df) >= 5 else 0
        for i in range(days):
            pred_price = model.predict([[len(recent) + i]])[0]
            if recent_momentum > 0 and pred_price < last_price:
                pred_price = last_price + (recent_momentum * 0.5)
            future_preds.append({
                "date": (df.index[-1] + timedelta(days=i+1)).strftime('%Y-%m-%d'),
                "price": round(float(pred_price), 2)
            })
            last_price = pred_price
        return future_preds
    except:
        return []

def analyze_market_strength(ticker_symbol, price_history):
    # Google News might still work from Backend, if not, we handle error gracefully
    try:
        sixty_days_ago = (datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d')
        query = urllib.parse.quote(f"{ticker_symbol} stock news after:{sixty_days_ago}")
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss_url)
        compound_scores = []
        headlines = []
        
        entries = feed.entries[:20] if hasattr(feed, 'entries') else []
        
        for entry in entries:
            if not hasattr(entry, 'title'): continue
            title = entry.title.split(" - ")[0] if " - " in entry.title else entry.title
            vs = analyzer.polarity_scores(title)
            compound = vs['compound']
            compound_scores.append(compound)
            label = "Positive" if compound >= 0.05 else "Negative" if compound <= -0.05 else "Neutral"
            headlines.append({"title": title, "link": entry.link, "publisher": "News", "sentiment": label, "score": round(compound, 2)})
    except:
        compound_scores = []
        headlines = []

    avg_score = np.mean(compound_scores) if compound_scores else 0
    sentiment_score = int((avg_score + 1) * 50)
    
    perf_60 = 0
    if len(price_history) >= 60:
        perf_60 = ((price_history['Close'].iloc[-1] - price_history['Close'].iloc[-60]) / price_history['Close'].iloc[-60]) * 100
    
    reality_score = max(0, min(100, 50 + (perf_60 * 2.5)))
    
    insight, summary = "Neutral", "Market is moving normally."
    if perf_60 > 10 and sentiment_score > 60:
        insight, summary = "High Energy", "Prices are climbing fast and the news is cheering it on!"
    elif perf_60 > 10 and sentiment_score < 45:
        insight, summary = "Quiet Climber", "The stock is rising quietly despite neutral news."
    elif perf_60 < -10 and sentiment_score > 55:
        insight, summary = "The Trap", "WARNING: News is positive but the price is actually falling."
    elif perf_60 < -10:
        insight, summary = "Panic Mode", "People are scared and selling off quickly."
    elif perf_60 > 0:
        insight, summary = "Steady Growth", "Healthy upward movement matched by news."
    
    perf_7d = 0
    if len(price_history) >= 7:
        perf_7d = ((price_history['Close'].iloc[-1] - price_history['Close'].iloc[-7]) / price_history['Close'].iloc[-7]) * 100

    return {
        "score": sentiment_score, "reality_score": int(reality_score),
        "pos_ratio": int((len([x for x in compound_scores if x >= 0.05]) / (len(headlines) or 1)) * 100),
        "neg_ratio": int((len([x for x in compound_scores if x <= -0.05]) / (len(headlines) or 1)) * 100),
        "performance_60d": round(perf_60, 2),
        "performance_7d": round(perf_7d, 2),
        "insight": insight, "summary": summary, "feed": headlines,
        "reliability": "High" if abs(sentiment_score - reality_score) < 20 else "Low", 
        "rel_color": "emerald" if abs(sentiment_score - reality_score) < 20 else "orange"
    }

@app.post("/api/analyze-raw")
async def analyze_raw_data(payload: RawDataPayload):
    try:
        # 1. Convert Raw List to DataFrame
        # Vercel sends keys in lowercase (date, open, close), Pandas wants Title Case (Date, Open, Close)
        data_dicts = [item.dict() for item in payload.history]
        df = pd.DataFrame(data_dicts)
        
        # Rename columns to match what our math functions expect
        df = df.rename(columns={
            "date": "Date", "open": "Open", "high": "High", 
            "low": "Low", "close": "Close", "volume": "Volume"
        })
        
        # Convert Date string to DateTime object
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)

        if df.empty: raise HTTPException(status_code=404, detail="No data provided")
        
        # 2. Run Analysis
        df = calculate_technical_indicators(df)
        forecast = predict_future_prices(df)
        vibe_data = analyze_market_strength(payload.ticker, df)
        
        last_row = df.iloc[-1]
        is_overheated = last_row['RSI'] > 70
        is_on_sale = last_row['RSI'] < 30
        price_speed = vibe_data['performance_60d']
        news_mood = vibe_data['score']

        action, color, risk, reasoning = "HOLD", "blue", "Low", "The stock is currently stable with no strong signals."
        if price_speed > 5:
            if is_overheated: action, color, risk, reasoning = "BE CAREFUL", "yellow", "High", "It's rising fast but getting 'out of breath' (Overbought)."
            elif news_mood < 45: action, color, risk, reasoning = "STRONG BUY", "emerald", "Low", "A 'Silent Winner'—climbing despite quiet news."
            else: action, color, risk, reasoning = "GREAT BUY", "emerald", "Medium", "Strong momentum backed by positive news."
        elif is_on_sale:
            if news_mood > 55: action, color, risk, reasoning = "BUY THE DIP", "emerald", "Medium", "Price dropped but news is still good—likely a sale."
            else: action, color, risk, reasoning = "WAIT AND WATCH", "orange", "High", "Price is cheap, but the news is bad. Wait for the bottom."
        elif price_speed < -5 and news_mood > 60:
            action, color, risk, reasoning = "DANGER: SELL", "red", "Extreme", "A 'Bull Trap.' Headlines are happy, but the price is falling."

        recommendation = {
            "action": action, "color": color, "risk": risk, "why": reasoning,
            "bargain_meter": "On Sale" if is_on_sale else "Expensive" if is_overheated else "Fair Price",
            "target_price": forecast[0]['price'] if forecast else last_row['Close']
        }

        # 3. Return Final JSON
        return {
            "symbol": payload.ticker, "company_name": payload.company_name,
            "current_price": round(last_row['Close'], 2), "currency": payload.currency,
            "history": [{"date": r['Date'].strftime('%Y-%m-%d'), "price": round(r['Close'], 2), "ma50": round(r['MA50'], 2)} for _, r in df.tail(100).reset_index().iterrows()],
            "forecast": forecast, "vibe": vibe_data, "technicals": {"rsi": round(last_row['RSI'], 2), "volatility": round(last_row['Volatility'], 2)},
            "daily_stats": {"open": round(last_row['Open'], 2), "high": round(last_row['High'], 2), "low": round(last_row['Low'], 2), "volume": int(last_row['Volume'])},
            "recommendation": recommendation, 
            "fundamentals": {
                "sector": payload.sector, 
                "industry": payload.industry,
                "website": payload.website,
                "market_cap": payload.market_cap, 
                "pe_ratio": payload.pe_ratio,
                "description": payload.description
            },
            "peers": [], # Peer comparison is hard without raw API access on backend, skipping for now
            "signals": detect_signals(df),
            "seasonality": [], "relative_strength": None
        }
    except Exception as e:
        print(f"Server Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))