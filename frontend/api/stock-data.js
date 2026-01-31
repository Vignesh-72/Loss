import YahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) return res.status(400).json({ error: 'Ticker symbol is required' });

  try {
    // CORRECT v3 USAGE: Configuration goes INSIDE the constructor
    const yahooFinance = new YahooFinance({
        suppressNotices: ['yahooSurvey', 'urlDeprecation']
    });

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const period1 = oneYearAgo.toISOString().split('T')[0];

    console.log(`Fetching ${ticker} data from ${period1}...`);

    const history = await yahooFinance.historical(ticker, { period1, interval: '1d' });
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