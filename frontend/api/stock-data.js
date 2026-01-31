import YahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) return res.status(400).json({ error: 'Ticker symbol is required' });

  try {
    const yahooFinance = new YahooFinance({
        // 'ripHistorical' suppresses the warning about the old API removal
        suppressNotices: ['yahooSurvey', 'ripHistorical'] 
    });

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Explicitly define Start AND End dates to satisfy strict validation
    const period1 = oneYearAgo.toISOString().split('T')[0];
    const period2 = today.toISOString().split('T')[0];

    console.log(`Fetching ${ticker} chart from ${period1} to ${period2}...`);

    // === CHANGE: Use .chart() instead of .historical() ===
    // This is the modern API endpoint recommended by the error logs.
    const chartResult = await yahooFinance.chart(ticker, { 
      period1: period1, 
      period2: period2, 
      interval: '1d' 
    });

    // .chart() returns an object: { meta: {...}, quotes: [...] }
    // We extract 'quotes' because that is the list of prices our frontend expects.
    const history = chartResult.quotes;

    const quote = await yahooFinance.quote(ticker);
    
    let profile = {}, stats = {};
    try {
        const profileData = await yahooFinance.quoteSummary(ticker, { modules: [ "assetProfile", "summaryDetail" ] });
        profile = profileData.assetProfile || {};
        stats = profileData.summaryDetail || {};
    } catch (e) {
        console.warn("Profile fetch skipped");
    }

    res.status(200).json({ history, quote, profile, stats });

  } catch (error) {
    console.error("VERCEL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}