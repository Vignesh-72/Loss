import { useState, useEffect } from 'react';
import { 
  Search, Activity, Zap, X, Trash2,
  LayoutGrid, BrainCircuit, Library, 
  BarChart3, ShoppingBag, Star, ArrowUpRight, ArrowDownRight,
  History, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Info, ExternalLink,
  Calendar, TrendingUp, BarChart2, DollarSign, User, Github, Mail,
  FileText, CheckSquare, Bell, Newspaper, Code, Terminal, Server
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line 
} from 'recharts';

// --- CONFIG & HELPERS ---
const formatNumber = (num) => {
  if (num === "N/A" || !num) return "N/A";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toLocaleString();
};

const runBacktest = (history) => {
  if (!history || history.length < 10) return null;

  const attempts = [
    { label: 'Last 2 Months', days: 60 },
    { label: 'Last 6 Months', days: 180 },
    { label: 'Last 1 Year', days: 365 }
  ];

  for (let attempt of attempts) {
    const startIndex = Math.max(0, history.length - attempt.days);
    let signals = 0, wins = 0, totalReturn = 0;
    const trades = [];

    for (let i = startIndex; i < history.length - 5; i++) {
      if (i === 0) continue;
      const today = history[i];
      const prev = history[i-1];
      const nextWeek = history[i + 5];

      if (!today.ma50 || !prev.ma50 || !nextWeek) continue;

      if (prev.price < prev.ma50 && today.price > today.ma50) {
         signals++;
         const profit = ((nextWeek.price - today.price) / today.price) * 100;
         totalReturn += profit;
         if (profit > 0) wins++;
         trades.push({ date: today.date, entry: today.price, exit: nextWeek.price, profit: profit });
      }
    }

    if (signals > 0) {
      return { 
        winRate: Math.round((wins / signals) * 100), 
        avgReturn: (totalReturn / signals).toFixed(2), 
        totalTrades: signals, 
        trades: trades.slice(-5).reverse(),
        periodLabel: attempt.label 
      };
    }
  }
  return { winRate: 0, avgReturn: 0, totalTrades: 0, trades: [], periodLabel: 'Last 1 Year' };
};

// --- UI COMPONENTS ---
const SketchyCard = ({ children, className = "", height = "h-auto", noPattern = false, bgColor = "bg-paper" }) => (
  <div 
    className={`
      relative ${bgColor} rounded-2xl border-[3px] border-graphite 
      shadow-soft
      overflow-hidden p-4 md:p-5 ${height} ${className}
      transition-transform hover:-translate-y-1 hover:shadow-soft-hover
    `}
    style={!noPattern ? {
      backgroundImage: 'radial-gradient(#E5E5E5 1.5px, transparent 1.5px)',
      backgroundSize: '20px 20px'
    } : {}}
  >
    {children}
  </div>
);

const ChunkyButton = ({ onClick, active, label, icon: Icon, disabled, className, variant="default" }) => {
  const bgColors = {
    default: active ? 'bg-graphite text-white' : 'bg-paper hover:bg-gray-100 text-graphite',
    action: 'bg-graphite text-white hover:bg-neutral-700',
    danger: 'bg-paper text-graphite hover:bg-neutral-100',
  };

  return (
    <button 
      onClick={onClick} disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl 
        font-black text-xs tracking-tight transition-all
        border-[3px] border-graphite
        shadow-soft-sm
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${bgColors[variant]}
        ${className}
      `}
    >
      {Icon && <Icon size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={3} />}
      {label}
    </button>
  );
};

const navItems = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dash' }, 
  { id: 'intel', icon: Newspaper, label: 'Vibe' },
  { id: 'pro', icon: Bell, label: 'Signals' }, 
  { id: 'backtest', icon: CheckSquare, label: 'Test' }, 
  { id: 'vault', icon: FileText, label: 'Data' }, 
  { id: 'about', icon: User, label: 'About' } 
];const FloatingDock = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* DESKTOP: CARTOON TOOL PALETTE (Unchanged) */}
      <nav className="hidden md:flex fixed z-50 left-6 top-1/2 -translate-y-1/2 flex-col gap-5 p-4 bg-paper border-[3px] border-graphite rounded-full shadow-[8px_8px_0px_0px_rgba(38,38,38,1)]">
        {navItems.map((item) => {
           const isActive = activeTab === item.id;
           return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl border-[3px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isActive 
                  ? 'bg-graphite border-graphite text-white shadow-none rotate-3 scale-110' 
                  : 'bg-white border-transparent text-gray-400 hover:bg-neutral-200 hover:border-graphite hover:text-graphite hover:scale-125 hover:-rotate-12 hover:shadow-[4px_4px_0px_0px_rgba(38,38,38,1)]'}
              `}>
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2.5} />
              
              <div className="absolute left-full ml-6 px-4 py-2 bg-graphite text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 -translate-x-8 rotate-45 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-0 transition-all duration-500 cubic-bezier(0.68, -0.55, 0.265, 1.55) pointer-events-none whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] z-50">
                {item.label}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-graphite"></div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* MOBILE: HIGH VOLTAGE ANIMATION (Monochrome Update) */}
      <nav className="md:hidden fixed z-50 bottom-5 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-paper border-[3px] border-graphite rounded-full shadow-soft-hover flex items-center px-1 h-[56px] pointer-events-auto mx-4 w-full max-w-[340px]">
          <div className="grid grid-cols-6 w-full h-full items-center justify-items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className="relative flex flex-col items-center justify-center w-full h-full group"
                >
                  <div className={`
                    transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) flex items-center justify-center rounded-full border-[3px] border-graphite
                    ${isActive 
                      ? 'w-12 h-12 -translate-y-9 bg-graphite text-white shadow-[4px_4px_0px_0px_#000000] rotate-12 scale-110' // CHANGED: Yellow removed, now Graphite/White
                      : 'w-8 h-8 -translate-y-0 bg-transparent border-transparent text-graphite/40 group-active:scale-90 shadow-none'}
                  `}>
                    <item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 3 : 2.5} />
                  </div>
                  
                  {isActive && (
                    <span className="absolute bottom-2.5 text-[9px] font-black uppercase tracking-tight text-graphite animate-in slide-in-from-bottom-2 fade-in duration-300">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
function App() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false); 
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backtestResults, setBacktestResults] = useState(null);
  const [bucketOpen, setBucketOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('industrialWatchlist') || '[]'));
  const [weeklyPerf, setWeeklyPerf] = useState(0);

  useEffect(() => { localStorage.setItem('industrialWatchlist', JSON.stringify(watchlist)); }, [watchlist]);

  useEffect(() => {
    const wakeUpServer = async () => {
       try {
         const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
         await fetch(API_URL, { method: 'GET' }); 
       } catch (e) { }
    };
    wakeUpServer();
  }, []);

  const handleAnalyze = async (symbolOverride) => {
    const searchTicker = symbolOverride || ticker;
    if (!searchTicker) return;
    setTicker(searchTicker);
    setLoading(true);
    setIsWakingUp(false);
    setBucketOpen(false); 

    const wakeUpTimer = setTimeout(() => { setIsWakingUp(true); }, 10000);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      // STEP 1: Get Raw Data from Vercel Relay (Bypassing IP Block)
      // This runs on Vercel's servers, which are not blocked by Yahoo.
      const rawRes = await fetch(`/api/fetch-data?ticker=${searchTicker}`);
      
      if (!rawRes.ok) throw new Error('Vercel Fetch Failed');
      const rawData = await rawRes.json();

      // STEP 2: Send Raw Data to Render for Analysis
      const res = await fetch(`${API_URL}/api/analyze-raw`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ticker: searchTicker,
            history: rawData.history,
            current_price: rawData.quote.regularMarketPrice,
            company_name: rawData.quote.shortName || searchTicker,
            currency: rawData.quote.currency || "USD",
            sector: rawData.profile.sector || "Other",
            industry: rawData.profile.industry || "N/A",
            website: rawData.profile.website || "#",
            market_cap: rawData.stats.marketCap || "N/A",
            pe_ratio: rawData.stats.trailingPE || "N/A",
            description: rawData.profile.longBusinessSummary || "No description."
        }),
      });
      
      clearTimeout(wakeUpTimer);
      if (!res.ok) throw new Error('Analysis Failed');
      
      const result = await res.json();
      
      const historyPoints = result.history.map(d => ({ date: d.date, history: d.price, forecast: null }));
      if (historyPoints.length > 0) { historyPoints[historyPoints.length - 1].forecast = historyPoints[historyPoints.length - 1].history; }
      const forecastPoints = result.forecast.map(d => ({ date: d.date, history: null, forecast: d.price }));
      
      let wPerf = 0;
      if (result.history && result.history.length >= 7) {
        const todayPrice = result.history[result.history.length - 1].price;
        const lastWeekPrice = result.history[result.history.length - 7].price;
        wPerf = ((todayPrice - lastWeekPrice) / lastWeekPrice) * 100;
      }
      setWeeklyPerf(parseFloat(wPerf.toFixed(2)));

      setData({ ...result, chartData: [...historyPoints, ...forecastPoints] });
      setBacktestResults(runBacktest(result.history));
      setActiveTab('dashboard'); 
    } catch (err) { 
      clearTimeout(wakeUpTimer);
      console.error(err);
      alert("System Error: Asset not found or backend is offline."); 
    } finally { 
      setLoading(false); 
      setIsWakingUp(false);
    }
  };

  const getVerdictStyle = (color) => {
      if (color === 'emerald') return 'bg-[#333333] text-white';
      if (color === 'red') return 'bg-paper text-graphite';
      if (color === 'orange') return 'bg-neutral-300 text-graphite';
      return 'bg-neutral-200 text-graphite';
  };

  const getForecastRange = (forecast) => {
      if(!forecast || forecast.length === 0) return "N/A";
      const prices = forecast.map(f => f.price);
      return `$${Math.min(...prices).toFixed(0)} - $${Math.max(...prices).toFixed(0)}`;
  }

  return (
    <div className="min-h-screen text-graphite font-mono pb-24 md:pb-10 transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor: '#262626', 
        backgroundImage: 'url("/wallpaper.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* === ROUNDED FLOATING NAVBAR === */}
      <div className="fixed top-2 md:top-4 left-0 right-0 z-50 flex justify-center px-2 md:px-4">
        <nav className="bg-paper border-[3px] border-graphite shadow-soft rounded-full px-2 md:px-4 py-1.5 flex items-center gap-2 w-full max-w-2xl transition-all duration-300">
          
          <div className="flex items-center gap-2 shrink-0 group cursor-pointer" onClick={() => window.location.reload()}>
             {/* Logo: Spins on hover */}
             <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border-[2px] border-graphite overflow-hidden bg-white group-hover:animate-[spin_1s_ease-in-out_infinite]">
                <img src="/logotrans.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
             </div>
             {/* Text: Squashes on hover */}
             <span className="hidden xs:block font-brand font-black text-lg md:text-xl text-graphite tracking-tight group-hover:scale-x-110 group-hover:scale-y-90 transition-transform duration-200">LOSS</span>
          </div>

          <div className="flex-grow relative min-w-0 mx-1">
             <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="SEARCH..." 
                className="w-full bg-transparent border-none outline-none font-bold text-xs md:text-sm uppercase text-graphite placeholder:text-gray-400 pl-1" 
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} 
             />
          </div>

          <div className="flex items-center gap-1 shrink-0">
             <button onClick={() => handleAnalyze()} disabled={loading} className="p-1.5 md:p-2 bg-neutral-200 rounded-full text-graphite hover:bg-graphite hover:text-white transition-colors">
                {loading ? <Activity size={14} className="animate-spin"/> : <Search size={16} strokeWidth={3} />}
             </button>

             <div className="h-4 md:h-5 w-[2px] bg-neutral-300 mx-0.5"></div>
             
             <button onClick={() => setBucketOpen(!bucketOpen)} className={`relative p-1.5 md:p-2 rounded-full transition-all ${bucketOpen ? 'bg-graphite text-white' : 'hover:bg-neutral-200 text-graphite'}`}>
               <ShoppingBag size={16} strokeWidth={2.5} />
               {watchlist.length > 0 && (<span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-graphite text-white text-[8px] md:text-[9px] font-black flex items-center justify-center rounded-full border-[2px] border-white animate-bounce">{watchlist.length}</span>)}
             </button>
          </div>

        </nav>
      </div>
      
      {/* SERVER WAKING BANNER */}
      {isWakingUp && (
         <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-yellow-400 text-graphite border-[3px] border-graphite px-4 py-2 rounded-xl shadow-soft flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Server size={18} className="animate-pulse" />
            <div className="text-left leading-none">
              <p className="font-black text-[10px] uppercase">Waking Server...</p>
              <p className="text-[9px] font-bold opacity-80">Free tier takes ~60s</p>
            </div>
         </div>
      )}

      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {bucketOpen && (
        <>
          <div className="fixed inset-0 bg-[#000000]/40 z-50 backdrop-blur-sm" onClick={() => setBucketOpen(false)} />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-paper border-[3px] border-graphite rounded-2xl shadow-soft z-[60] overflow-hidden">
             <div className="bg-graphite text-white p-3 flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest">Watchlist</h3>
                <button onClick={() => setBucketOpen(false)}><X size={18} /></button>
             </div>
             <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                {watchlist.length === 0 ? (<p className="text-center py-8 uppercase font-bold opacity-30 text-xs">Empty</p>) : (watchlist.map(symbol => (<div key={symbol} onClick={() => handleAnalyze(symbol)} className="flex justify-between items-center p-3 bg-neutral-50 border-[2px] border-graphite rounded-xl hover:bg-neutral-200 cursor-pointer"><span className="font-black text-lg text-graphite">{symbol}</span><button onClick={(e) => {e.stopPropagation(); setWatchlist(watchlist.filter(t => t !== symbol))}} className="hover:text-red-600"><Trash2 size={16}/></button></div>)))}
             </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="pt-24 px-3 md:px-4 max-w-6xl mx-auto md:pl-28 min-h-screen flex flex-col justify-center">
        {activeTab === 'about' ? (
          // === ABOUT PAGE ===
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-xl mx-auto">
             <SketchyCard className="p-0 overflow-hidden" noPattern={true}>
                {/* Header Strip */}
                <div className="bg-graphite p-4 flex justify-between items-center border-b-[3px] border-graphite">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-[3px] border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
                       <img src="/logotrans.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <div>
                      <h1 className="font-brand font-black text-4xl text-white tracking-widest uppercase">LOSS</h1>
                      <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">System Spec v1.0</p>
                    </div>
                  </div>
                  <Terminal size={32} className="text-white opacity-30" />
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 bg-paper relative">
                  <div className="absolute top-4 right-4 text-graphite/10 rotate-12 pointer-events-none">
                     <Code size={120} />
                  </div>

                  <div className="mb-6 relative z-10">
                    <h2 className="font-black text-sm text-graphite uppercase border-b-2 border-graphite inline-block mb-3">Mission Protocol</h2>
                    <p className="font-bold text-gray-600 text-sm leading-relaxed">
                      LOSS is an academic instrument designed to dissect market noise. By fusing historical data, real-time sentiment analysis, and algorithmic projection, it provides a brutalist view of financial reality.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                     <div className="space-y-4">
                        <h2 className="font-black text-sm text-graphite uppercase border-b-2 border-graphite inline-block">Operator</h2>
                        <div className="bg-neutral-100 border-2 border-graphite p-3 rounded-lg flex items-center gap-3">
                           <div className="w-10 h-10 bg-graphite text-white flex items-center justify-center rounded font-bold">VS</div>
                           <div>
                              <p className="font-black text-graphite text-sm">Vignesh S</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Lead Developer</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h2 className="font-black text-sm text-graphite uppercase border-b-2 border-graphite inline-block">Uplink</h2>
                        <div className="flex flex-col gap-2">
                           <a href="https://github.com/Vignesh-72" target="_blank" className="flex items-center gap-2 p-2 bg-white border-2 border-graphite rounded hover:bg-graphite hover:text-white transition-all group cursor-pointer">
                              <Github size={16} />
                              <span className="text-xs font-black uppercase">Github Repo</span>
                              <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-100" />
                           </a>
                           <a href="mailto:vicky31pro@gmail.com" className="flex items-center gap-2 p-2 bg-white border-2 border-graphite rounded hover:bg-graphite hover:text-white transition-all group cursor-pointer">
                              <Mail size={16} />
                              <span className="text-xs font-black uppercase">Secure Mail</span>
                              <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-100" />
                           </a>
                        </div>
                     </div>
                  </div>
                </div>
                
                {/* Footer Strip */}
                <div className="bg-neutral-200 p-2 text-center border-t-[3px] border-graphite">
                  <p className="text-[10px] font-black text-graphite/50 uppercase">Academic Use Only // Not Financial Advice</p>
                </div>
             </SketchyCard>
          </div>
        ) : data ? (
          <div className="animate-in fade-in duration-300">
            {/* Header Card */}
            <SketchyCard className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-graphite">{data.symbol}</h1>
                     <span className="px-3 py-1 rounded-lg bg-neutral-200 border-2 border-graphite text-xs font-black shadow-soft-sm text-graphite">{data.fundamentals.sector}</span>
                   </div>
                   <p className="font-bold text-gray-500 text-sm md:text-lg">{data.company_name}</p>
                </div>
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                   <div className="text-left md:text-right">
                     <div className="text-[10px] font-black bg-graphite text-white px-2 py-1 inline-block transform rotate-2">CURRENT PRICE</div>
                     <div className="text-3xl md:text-5xl font-black text-graphite mt-1">${data.current_price.toFixed(2)}</div>
                   </div>
                   <ChunkyButton onClick={() => !watchlist.includes(data.symbol) && setWatchlist([...watchlist, data.symbol])} variant="action" icon={Star} label={watchlist.includes(data.symbol) ? "SAVED!" : "SAVE"} />
                </div>
            </SketchyCard>

            {/* === DASHBOARD === */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`
                      rounded-3xl p-6 relative overflow-hidden border-[3px] border-graphite shadow-soft flex flex-col justify-between min-h-[280px]
                      ${getVerdictStyle(data.recommendation.color)}
                    `}>
                       <div className="absolute -top-4 -right-4 p-4 opacity-10 transform rotate-12"><Zap size={120} strokeWidth={3} /></div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <p className="font-black text-xs uppercase tracking-widest border-b-2 border-current inline-block">AI VERDICT</p>
                             <span className="bg-current/10 px-2 py-0.5 rounded-full text-[10px] font-black border border-current/20">RISK: {data.recommendation.risk}</span>
                          </div>
                          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">{data.recommendation.action}</h2>
                          <p className="font-bold text-sm leading-tight opacity-80 p-2 rounded-lg border border-current/20">{data.recommendation.why}</p>
                       </div>
                       <div className="mt-4 pt-4 border-t-[3px] border-current">
                          <div className="flex justify-between items-end">
                             <div><p className="font-bold text-[10px] uppercase mb-1">BARGAIN CHECK</p><p className="text-xl font-black uppercase italic">{data.recommendation.bargain_meter}</p></div>
                             <div className="text-right">
                                <p className="font-bold text-[10px] uppercase mb-1">TARGET</p>
                                <p className="text-2xl font-black border-2 border-current px-2 rounded-lg">${data.recommendation.target_price.toFixed(2)}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <SketchyCard className="md:col-span-2 flex flex-col justify-center transform rotate-1" noPattern={true}>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border-[2px] border-graphite shadow-[2px_2px_0_#262626]">
                             <DollarSign size={16} className="text-gray-400 mb-1"/>
                             <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Last Close</p>
                             <p className="text-xl font-black text-graphite">${data.current_price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border-[2px] border-graphite shadow-[2px_2px_0_#262626]">
                             <BarChart2 size={16} className="text-gray-400 mb-1"/>
                             <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Volume</p>
                             <p className="text-lg font-bold text-graphite">{formatNumber(data.daily_stats.volume)}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-100 border-[2px] border-dashed border-graphite">
                             <TrendingUp size={16} className="text-graphite mb-1"/>
                             <p className="text-[10px] font-black text-graphite uppercase mb-0.5">Tomorrow's Forecast</p>
                             <p className="text-xl font-black text-graphite">
                                {data.forecast[0] ? `$${data.forecast[0].price}` : 'N/A'}
                             </p>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-100 border-[2px] border-dashed border-graphite">
                             <Calendar size={16} className="text-graphite mb-1"/>
                             <p className="text-[10px] font-black text-graphite uppercase mb-0.5">Next 7 Days Range</p>
                             <p className="text-sm font-black text-graphite text-center leading-tight">{getForecastRange(data.forecast)}</p>
                          </div>
                       </div>
                    </SketchyCard>
                 </div>

                 <SketchyCard>
                    <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
                       <h3 className="font-black text-2xl uppercase italic text-graphite">Price Action</h3>
                       <div className="flex items-center gap-3 text-[10px] font-bold">
                          <span className="px-3 py-1 rounded-lg bg-graphite text-white">HISTORY</span>
                          <span className="px-3 py-1 rounded-lg bg-paper border-2 border-graphite text-graphite">AI PREDICTION</span>
                       </div>
                    </div>
                    <div className="h-[300px] w-full border-[3px] border-graphite rounded-xl p-2 bg-neutral-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }} data={data.chartData}>
                           <defs>
                            <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#262626" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#262626" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeWidth={2} vertical={false} />
                          <XAxis dataKey="date" hide={true} />
                          <YAxis domain={['auto', 'auto']} orientation="right" tick={{fill: '#262626', fontSize: 10, fontWeight: 900}} axisLine={false} tickLine={false} tickFormatter={(n) => `$${n}`} width={40} />
                          <Tooltip contentStyle={{backgroundColor: '#262626', borderRadius: '8px', border: 'none'}} itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}} />
                          <Area type="monotone" dataKey="history" stroke="#262626" strokeWidth={3} fill="url(#colorHistory)" connectNulls={true} />
                          <Line type="monotone" dataKey="forecast" stroke="#262626" strokeDasharray="10 5" strokeWidth={3} dot={{r: 5, fill: "#FAFAFA", stroke: "#262626", strokeWidth: 3}} activeDot={{r: 7}} connectNulls={true} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </SketchyCard>
              </div>
            )}

            {/* === SENTIMENT === */}
            {activeTab === 'intel' && (
               <SketchyCard className="p-4 md:p-8" bgColor="bg-paper" noPattern={true}>
                  <div className="mb-6 p-4 bg-neutral-100 border-[2px] border-graphite rounded-xl flex items-start gap-3">
                     <Info className="flex-shrink-0 text-graphite" />
                     <div>
                        <h4 className="font-black text-sm uppercase text-graphite">Sentiment Intel</h4>
                        <p className="text-xs text-gray-600 mt-1">
                           This system scans thousands of global news headlines to quantify the market's psychological "Vibe" towards this asset. It detects fear, excitement, and uncertainty before they fully impact the price.
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6 mb-8">
                     <div className="flex-grow">
                        <div className="inline-block bg-graphite text-white px-4 py-1.5 rounded-lg border-2 border-graphite text-xs font-black mb-4 transform -rotate-1">MOOD ANALYZER</div>
                        <h2 className="text-3xl md:text-5xl font-black text-graphite mb-2 leading-none tracking-tight">"{data.vibe.insight}"</h2>
                        <div className="bg-neutral-100 border-[3px] border-graphite p-5 rounded-2xl shadow-soft transform rotate-1">
                           <p className="font-bold text-lg md:text-xl text-graphite leading-snug">{data.vibe.summary}</p>
                        </div>
                     </div>
                     <div className="lg:w-64 space-y-4">
                        <div className="bg-graphite text-white border-[3px] border-graphite rounded-2xl p-4 shadow-soft">
                           <p className="text-[10px] font-black uppercase opacity-60">People Loving it</p>
                           <p className="text-4xl font-black">{data.vibe.pos_ratio}%</p>
                        </div>
                        <div className="bg-paper text-graphite border-[3px] border-graphite rounded-2xl p-4 shadow-soft">
                           <p className="text-[10px] font-black uppercase opacity-60">People Hating it</p>
                           <p className="text-4xl font-black">{data.vibe.neg_ratio}%</p>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.vibe.feed.slice(0, 6).map((news, i) => (
                      <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <div className="h-full bg-paper border-[3px] border-graphite rounded-xl p-4 hover:bg-neutral-200 shadow-soft transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-black bg-graphite text-white px-2 py-1 rounded uppercase truncate max-w-[70%]">{news.publisher}</span>
                                <div className="p-1 rounded border-2 border-graphite bg-white">
                                   {news.score > 0 ? <ThumbsUp size={14} className="text-graphite"/> : 
                                    news.score < 0 ? <ThumbsDown size={14} className="text-graphite"/> : <Activity size={14}/>}
                                </div>
                            </div>
                            <h4 className="font-bold text-xs md:text-sm text-graphite line-clamp-3 leading-snug">{news.title}</h4>
                        </div>
                      </a>
                    ))}
                  </div>
               </SketchyCard>
            )}

            {/* === SIGNALS === */}
            {activeTab === 'pro' && (
              <div className="space-y-6 md:space-y-8">
                 <div className="p-4 bg-neutral-100 border-[2px] border-graphite rounded-xl flex items-start gap-3">
                     <BrainCircuit className="flex-shrink-0 text-graphite" />
                     <div>
                        <h4 className="font-black text-sm uppercase text-graphite">Technical Signals</h4>
                        <p className="text-xs text-gray-600 mt-1">
                           We track patterns in price and volume. 
                           The <span className="font-bold">Leaderboard</span> shows how much this asset moved in the last 7 days compared to its sector peers. 
                           <span className="font-bold"> Market Oddities</span> highlight unusual events like a "Golden Cross" or extreme buying volume.
                        </p>
                     </div>
                  </div>
                <SketchyCard>
                  <h3 className="font-black text-xl md:text-2xl uppercase mb-6 flex items-center gap-3 text-graphite">
                    <Zap size={24} className="md:w-[32px] md:h-[32px] fill-graphite" strokeWidth={3} /> 
                    Weekly Leaderboard
                  </h3>
                  {weeklyPerf !== null ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-5">
                        <div className="flex justify-between font-black text-sm text-graphite">
                          <span>{data.symbol} (7 Days)</span>
                          <span>{weeklyPerf > 0 ? '+' : ''}{weeklyPerf}%</span>
                        </div>
                        <div className="h-6 md:h-8 bg-neutral-300 rounded-xl border-[3px] border-graphite overflow-hidden relative">
                          <div 
                            className={`h-full bg-graphite transition-all duration-500`} 
                            style={{width: `${Math.min(Math.abs(weeklyPerf) * 10, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center flex flex-col items-center justify-center py-6 md:py-8 bg-paper border-[3px] border-graphite rounded-2xl shadow-soft">
                        <p className="text-xs font-black text-gray-400 uppercase mb-2">WEEKLY VIBE</p>
                        <div className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-graphite">
                          {weeklyPerf > 3 ? 'Explosive' : weeklyPerf < -3 ? 'Falling' : 'Chilling'}
                        </div>
                      </div>
                    </div>
                  ) : <p className="text-center opacity-30">Loading leaderboard...</p>}
                </SketchyCard>
                <SketchyCard>
                  <h3 className="font-black text-xl md:text-2xl uppercase mb-6 flex items-center gap-3 text-graphite">
                    <BrainCircuit size={24} className="md:w-[32px] md:h-[32px]" strokeWidth={3} /> 
                    Market Oddities
                  </h3>
                  <div className="space-y-4">
                    {data.signals && data.signals.length > 0 ? (
                      data.signals.map((sig, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-4 md:p-5 bg-paper border-[3px] border-graphite rounded-xl shadow-soft">
                          <div className="flex-shrink-0 mt-1">
                            {sig.sentiment === 'Bullish' ? <ArrowUpRight className="text-graphite" /> : 
                            sig.sentiment === 'Bearish' ? <ArrowDownRight className="text-graphite" /> : <Activity className="text-gray-400" />}
                          </div>
                          <div>
                            <span className="font-black text-sm md:text-base uppercase text-graphite bg-neutral-200 px-2 py-0.5 rounded">{sig.type}</span>
                            <p className="text-xs md:text-sm font-bold text-gray-600 leading-tight mt-2">
                              {sig.desc}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border-[3px] border-dashed border-graphite rounded-xl bg-neutral-50 flex flex-col items-center">
                        <CheckCircle2 size={40} className="text-gray-300 mb-3" strokeWidth={2} />
                        <h3 className="font-black text-lg text-gray-400 uppercase">Nothing Weird Detected</h3>
                      </div>
                    )}
                  </div>
                </SketchyCard>
              </div>
            )}

            {/* === BACKTEST === */}
            {activeTab === 'backtest' && (
               <SketchyCard className="p-4 md:p-8">
                  <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h2 className="text-3xl md:text-4xl font-black text-graphite">THE TRUTH TESTER</h2>
                      {backtestResults && backtestResults.totalTrades > 0 && (
                          <span className="text-xs font-black uppercase bg-graphite text-white px-3 py-1 rounded">
                              Based on: {backtestResults.periodLabel}
                          </span>
                      )}
                  </div>
                  {backtestResults ? (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                           <div className="text-center py-10 bg-graphite text-white border-[3px] border-graphite rounded-2xl shadow-soft">
                             <p className="text-xs font-black opacity-60 uppercase">Win Rate</p>
                             <p className="text-5xl md:text-7xl font-black">{backtestResults.winRate}%</p>
                           </div>
                           <div className="text-center py-10 bg-paper border-[3px] border-graphite rounded-2xl shadow-soft">
                             <p className="text-xs font-black opacity-30 uppercase">Avg. Return</p>
                             <p className="text-4xl md:text-6xl font-black text-graphite">{backtestResults.avgReturn}%</p>
                           </div>
                        </div>
                        <div className="lg:col-span-2">
                           <h3 className="font-black uppercase mb-6 border-b-[3px] border-graphite inline-block">Last 5 Trades</h3>
                           <div className="space-y-4">
                              {backtestResults.trades.length > 0 ? backtestResults.trades.map((trade, i) => (
                                 <div key={i} className="flex justify-between items-center p-4 bg-paper border-[3px] border-graphite rounded-xl shadow-soft-sm">
                                    <div className="flex items-center gap-4">
                                       {trade.profit > 0 ? <CheckCircle2 size={32} className="text-graphite"/> : <XCircle size={32} className="text-gray-300"/>}
                                       <div><div className="font-black text-sm">{trade.date}</div><div className="text-xs font-bold opacity-50">Entry: ${trade.entry.toFixed(2)}</div></div>
                                    </div>
                                    <div className="text-right"><div className="font-black text-xl text-graphite">{trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(1)}%</div></div>
                                 </div>
                              )) : (
                                <div className="text-center py-12 bg-neutral-100 border-[2px] border-dashed border-graphite rounded-xl">
                                    <p className="font-bold text-gray-500">No signals found in the last year.</p>
                                    <p className="text-xs text-gray-400 mt-1">Our strict "Golden Cross" strategy didn't trigger recently.</p>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ) : <div className="text-center py-20 opacity-30 font-black">NO TRADES RECORDED.</div>}
               </SketchyCard>
            )}

            {/* === FUNDAMENTALS === */}
            {activeTab === 'vault' && (
              <SketchyCard className="p-4 md:p-8">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {Object.entries({
                        'Market Cap': formatNumber(data.fundamentals.market_cap), 
                        'P/E Ratio': data.fundamentals.pe_ratio, 
                        'Industry': data.fundamentals.industry,
                        'Website': data.fundamentals.website
                    }).map(([label, val]) => (
                      <div key={label} className="text-center p-5 bg-paper border-[3px] border-graphite rounded-2xl shadow-soft overflow-hidden">
                        <p className="text-[10px] font-black opacity-30 uppercase mb-1">{label}</p>
                        {label === 'Website' && val !== '#' ? (
                            <a href={val} target="_blank" className="text-sm md:text-lg font-black text-blue-600 hover:underline truncate block">{val}</a>
                        ) : (
                            <p className="text-sm md:text-xl font-black text-graphite truncate">{val}</p>
                        )}
                      </div>
                    ))}
                 </div>
                 <div>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-black text-2xl uppercase bg-graphite text-white inline-block px-2 transform -rotate-1">Asset Profile</h3>
                        <a 
                            href={`https://en.wikipedia.org/wiki/Special:Search?search=${data.symbol}+${data.company_name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-black uppercase border-2 border-graphite px-3 py-1 rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                            <ExternalLink size={14}/> Read More on Wiki
                        </a>
                    </div>
                    <div className="font-bold text-gray-600 leading-relaxed border-[3px] border-graphite p-6 rounded-2xl bg-paper shadow-soft">
                        {data.fundamentals.description}
                    </div>
                 </div>
              </SketchyCard>
            )}
          </div>
        ) : (
          // === CHANGED: PERFECTLY CENTERED LANDING PAGE ===
          // Removed padding top/neg margins. Used min-h-[80vh] to perfectly center in the available view.
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
             <div className="mb-8 relative flex flex-row items-center gap-4">
               
               {/* CARTOON LOGO: Floating Animation + Hover Wiggle */}
               <div className="animate-[bounce_3s_infinite]">
                 <img 
                   src="/logotrans.png" 
                   alt="Logo" 
                   className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain drop-shadow-[4px_4px_0px_rgba(38,38,38,0.4)] hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-grab active:cursor-grabbing" 
                 />
               </div>

               <div className="relative group cursor-default">
                 {/* TITLE: Slam Entry + Hover Squash */}
                 <h1 className="font-brand font-black text-6xl xs:text-7xl sm:text-9xl md:text-[10rem] text-graphite tracking-tighter leading-none animate-in zoom-in-50 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-x-105 group-hover:scale-y-90 transition-transform">
                   LOSS
                 </h1>
                 
                 {/* BADGE: Swings like a sign */}
                 <div className="absolute -bottom-2 -right-4 bg-graphite text-white px-3 py-1 text-[10px] xs:text-xs md:text-sm font-bold uppercase -rotate-6 origin-top-left animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] group-hover:rotate-0 transition-all">
                   Analyze Anything
                 </div>
               </div>
             </div>
             
             {/* Search Prompt - ADDED AS REQUESTED BELOW LOGO AND TITLE */}
             <div className="mt-10 animate-[bounce_2.5s_infinite]">
               <p className="font-black text-[10px] xs:text-xs sm:text-sm uppercase bg-white text-graphite px-6 py-3 border-[3px] border-graphite rounded-full shadow-[5px_5px_0px_0px_rgba(38,38,38,1)] -rotate-2 hover:rotate-0 hover:scale-110 hover:bg-neutral-200 hover:shadow-none transition-all duration-300 cursor-help mx-auto max-w-fit">
                 Enter a symbol like: <span className="text-blue-600">AAPL</span>, <span className="text-purple-600">NVDA</span>, or <span className="text-orange-600">BTC</span>
               </p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;