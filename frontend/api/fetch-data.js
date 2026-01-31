import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required' });
  }

  try {
    // 1. Calculate Date Range (1 Year back)
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const queryOptions = { 
      period1: oneYearAgo.toISOString().split('T')[0], // Format: YYYY-MM-DD
      interval: '1d' 
    };

    // 2. Fetch History and Quote using Vercel's clean IP
    const history = await yahooFinance.historical(ticker, queryOptions);
    const quote = await yahooFinance.quote(ticker);
    
    // 3. Get Company Profile (for Sector/Industry)
    const profile = await yahooFinance.quoteSummary(ticker, { modules: [ "assetProfile", "summaryDetail" ] });

    res.status(200).json({ 
      history, 
      quote,
      profile: profile.assetProfile || {},
      stats: profile.summaryDetail || {}
    });

  } catch (error) {
    console.error("Vercel Relay Error:", error);
    res.status(500).json({ error: `Failed to fetch data for ${ticker}` });
  }
}