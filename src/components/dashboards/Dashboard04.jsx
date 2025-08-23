import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Activity, Plus, X, BarChart3, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export function Dashboard04() {
    const [watchlist, setWatchlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [marketData, setMarketData] = useState([]);

    // Alpha Vantage API configuration - uses .env file
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const BASE_URL = 'https://www.alphavantage.co/query';

    // Rate limiting helper
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let lastApiCall = 0;

    // Generate chart data
    const generateChartData = () => {
        const data = [];
        const basePrice = 150;
        let currentPrice = basePrice;
        
        for (let i = 0; i < 30; i++) {
        const change = (Math.random() - 0.5) * 10;
        currentPrice = Math.max(currentPrice + change, 50);
        data.push({
            day: `Day ${i + 1}`,
            price: parseFloat(currentPrice.toFixed(2)),
            volume: Math.floor(Math.random() * 5000000) + 1000000
        });
        }
        return data;
    };

    const generateMarketOverview = () => {
        return [
        { name: 'Tech', value: 32, color: '#3B82F6' },
        { name: 'Healthcare', value: 18, color: '#10B981' },
        { name: 'Finance', value: 24, color: '#8B5CF6' },
        { name: 'Energy', value: 15, color: '#F59E0B' },
        { name: 'Consumer', value: 11, color: '#EF4444' }
        ];
    };

    // Top 12 popular stocks for initial load
    const defaultStocks = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA',
        'META', 'NFLX', 'AMD', 'ORCL', 'CRM', 'ADBE'
    ];

    // Company name mapping
    const getCompanyName = (symbol) => {
        const names = {
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corporation',
        'GOOGL': 'Alphabet Inc.',
        'AMZN': 'Amazon.com Inc.',
        'TSLA': 'Tesla Inc.',
        'NVDA': 'NVIDIA Corporation',
        'META': 'Meta Platforms Inc.',
        'NFLX': 'Netflix Inc.',
        'AMD': 'Advanced Micro Devices',
        'ORCL': 'Oracle Corporation',
        'CRM': 'Salesforce Inc.',
        'ADBE': 'Adobe Inc.',
        'JPM': 'JPMorgan Chase & Co.',
        'JNJ': 'Johnson & Johnson',
        'WMT': 'Walmart Inc.',
        'PG': 'Procter & Gamble',
        'UNH': 'UnitedHealth Group',
        'HD': 'Home Depot Inc.',
        'MA': 'Mastercard Inc.',
        'BAC': 'Bank of America',
        'DIS': 'Walt Disney Company'
        };
        return names[symbol] || `${symbol} Corporation`;
    };

    // Mock stock data generator (fallback when API is unavailable)
    const generateStockData = (symbol) => {
        const basePrice = Math.random() * 500 + 50;
        const changePercent = (Math.random() - 0.5) * 10;
        const changeAmount = (basePrice * changePercent) / 100;
        
        return {
        symbol,
        name: getCompanyName(symbol),
        price: basePrice.toFixed(2),
        change: changeAmount.toFixed(2),
        changePercent: changePercent.toFixed(2),
        volume: Math.floor(Math.random() * 10000000),
        marketCap: `${(Math.random() * 2000 + 100).toFixed(0)}B`,
        high52: (basePrice * 1.3).toFixed(2),
        low52: (basePrice * 0.7).toFixed(2),
        lastUpdate: new Date().toLocaleTimeString(),
        chartData: generateChartData()
        };
    };

    // Real API integration using Alpha Vantage
    const fetchStockData = async (symbol) => {
        // Check if API key is available
        if (!API_KEY) {
        console.warn('Alpha Vantage API key not found, using mock data');
        return generateStockData(symbol);
        }

        try {
        // Rate limiting: ensure at least 12 seconds between API calls (5 calls per minute limit)
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall;
        if (timeSinceLastCall < 12000) {
            await delay(12000 - timeSinceLastCall);
        }
        lastApiCall = Date.now();

        const response = await fetch(
            `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
            const quote = data['Global Quote'];
            return {
            symbol: quote['01. symbol'],
            name: getCompanyName(symbol),
            price: parseFloat(quote['05. price']).toFixed(2),
            change: parseFloat(quote['09. change']).toFixed(2),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
            volume: parseInt(quote['06. volume']),
            marketCap: 'N/A', // Not provided by this endpoint
            high52: parseFloat(quote['03. high']).toFixed(2),
            low52: parseFloat(quote['04. low']).toFixed(2),
            lastUpdate: new Date().toLocaleTimeString(),
            chartData: generateChartData() // Using mock chart data to avoid additional API calls
            };
        } else if (data['Error Message']) {
            console.error('Alpha Vantage Error:', data['Error Message']);
            throw new Error(data['Error Message']);
        } else if (data['Note']) {
            console.warn('API Rate Limit:', data['Note']);
            throw new Error('API rate limit exceeded');
        } else {
            throw new Error('Invalid response from Alpha Vantage');
        }
        } catch (error) {
        console.error('Error fetching stock data:', error);
        // Fallback to mock data if API fails
        return generateStockData(symbol);
        }
    };

    const searchStocks = async (query) => {
        // Check if API key is available
        if (!API_KEY) {
        console.warn('Alpha Vantage API key not found, using mock search');
        return mockSearch(query);
        }

        try {
        // Rate limiting for search
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall;
        if (timeSinceLastCall < 12000) {
            await delay(12000 - timeSinceLastCall);
        }
        lastApiCall = Date.now();

        const response = await fetch(
            `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.bestMatches) {
            return data.bestMatches.slice(0, 5).map(match => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            price: '0.00', // Search doesn't include current price
            change: '0.00',
            changePercent: '0.00',
            volume: 0,
            marketCap: 'N/A',
            high52: '0.00',
            low52: '0.00',
            lastUpdate: new Date().toLocaleTimeString(),
            chartData: generateChartData()
            }));
        } else if (data['Error Message']) {
            throw new Error(data['Error Message']);
        } else if (data['Note']) {
            throw new Error('Search rate limit exceeded');
        }
        return [];
        } catch (error) {
        console.error('Error searching stocks:', error);
        return mockSearch(query);
        }
    };

    const mockSearch = (query) => {
        const mockResults = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX',
        'JPM', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'MA', 'BAC', 'DIS', 'ADBE'
        ].filter(symbol => 
        symbol.toLowerCase().includes(query.toLowerCase()) ||
        getCompanyName(symbol).toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        return mockResults.map(generateStockData);
    };

    // Initialize with default stocks (load them sequentially to respect rate limits)
    useEffect(() => {
        const loadInitialStocks = async () => {
        setLoading(true);
        const initialStocks = [];
        
        // Load first 3 stocks with real data, rest with mock data to stay within API limits
        for (let i = 0; i < defaultStocks.length; i++) {
            if (i < 3 && API_KEY) {
            console.log(`Loading real data for ${defaultStocks[i]}...`);
            const stockData = await fetchStockData(defaultStocks[i]);
            initialStocks.push(stockData);
            } else {
            // Use mock data for remaining stocks to avoid hitting API limits
            initialStocks.push(generateStockData(defaultStocks[i]));
            }
        }
        
        setWatchlist(initialStocks);
        setMarketData(generateMarketOverview());
        setLoading(false);
        };

        loadInitialStocks();
    }, [API_KEY]);

    // Auto-refresh stock prices every 5 minutes (respects API limits)
    useEffect(() => {
        if (!API_KEY) return; // Skip refresh if no API key

        const interval = setInterval(async () => {
        console.log('Refreshing stock data...');
        try {
            // Only refresh the first 3 stocks to stay within API limits
            const updatedStocks = [...watchlist];
            for (let i = 0; i < Math.min(3, watchlist.length); i++) {
            const stock = watchlist[i];
            const updatedStock = await fetchStockData(stock.symbol);
            updatedStocks[i] = updatedStock;
            }
            
            // Update remaining stocks with mock data
            for (let i = 3; i < watchlist.length; i++) {
            updatedStocks[i] = {
                ...watchlist[i],
                ...generateStockData(watchlist[i].symbol)
            };
            }
            
            setWatchlist(updatedStocks);
        } catch (error) {
            console.error('Error refreshing stock data:', error);
            // Fallback to mock updates if API fails
            setWatchlist(prev => prev.map(stock => ({
            ...stock,
            ...generateStockData(stock.symbol)
            })));
        }
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [watchlist, API_KEY]);

    // Search functionality with real API
    const handleSearch = async (term) => {
        if (!term.trim()) {
        setSearchResults([]);
        return;
        }

        setSearchLoading(true);
        try {
        const results = await searchStocks(term);
        setSearchResults(results);
        } catch (error) {
        console.error('Search error:', error);
        setSearchResults(mockSearch(term));
        }
        setSearchLoading(false);
    };

    const addToWatchlist = async (stock) => {
        if (!watchlist.find(w => w.symbol === stock.symbol)) {
        // Try to get real data for the new stock if we haven't hit API limits
        let newStock = stock;
        if (API_KEY && watchlist.filter(s => parseFloat(s.price) > 0).length < 3) {
            try {
            newStock = await fetchStockData(stock.symbol);
            } catch (error) {
            console.log('Using mock data for new stock due to API limits');
            }
        }
        setWatchlist(prev => [...prev, newStock]);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeFromWatchlist = (symbol) => {
        setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    };

    const StockCard = ({ stock, showRemove = false }) => {
        const isPositive = parseFloat(stock.change) >= 0;
        
        return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900">{stock.symbol}</h3>
                <button
                    onClick={() => setSelectedStock(selectedStock?.symbol === stock.symbol ? null : stock)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                >
                    <BarChart3 size={16} />
                </button>
                {showRemove && (
                    <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                    <X size={16} />
                    </button>
                )}
                </div>
                <p className="text-sm text-slate-600 truncate max-w-[200px]">{stock.name}</p>
            </div>
            <div className={`p-3 rounded-xl shadow-md ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}>
                {isPositive ? (
                <TrendingUp className="text-white" size={20} />
                ) : (
                <TrendingDown className="text-white" size={20} />
                )}
            </div>
            </div>

            <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-slate-900">${stock.price}</span>
                <div className="text-right">
                <div className={`text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{stock.change}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    ({isPositive ? '+' : ''}{stock.changePercent}%)
                </div>
                </div>
            </div>

            {selectedStock?.symbol === stock.symbol && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <LineChart size={16} />
                    30-Day Price Chart
                </h4>
                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={stock.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis hide />
                        <YAxis hide />
                        <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']}
                        labelStyle={{ color: '#475569' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        />
                        <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={isPositive ? '#10b981' : '#ef4444'} 
                        strokeWidth={2}
                        dot={false}
                        />
                    </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                <span className="block text-slate-600 font-medium">Volume</span>
                <span className="font-bold text-slate-800">{stock.volume.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                <span className="block text-slate-600 font-medium">Market Cap</span>
                <span className="font-bold text-slate-800">{stock.marketCap}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                <span className="block text-slate-600 font-medium">52W High</span>
                <span className="font-bold text-slate-800">${stock.high52}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                <span className="block text-slate-600 font-medium">52W Low</span>
                <span className="font-bold text-slate-800">${stock.low52}</span>
                </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Last updated: {stock.lastUpdate}</span>
            </div>
            </div>
        </div>
        );
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
            <Activity className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-slate-700 font-medium">Loading market data...</p>
            {!API_KEY && (
                <p className="text-slate-500 text-sm mt-2">Running in demo mode - add API key for live data</p>
            )}
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <DollarSign className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Stock Market Watchlist</h1>
                    <p className="text-slate-200">
                    {API_KEY ? 'Real-time market data and trends' : 'Demo mode'}
                    </p>
                </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                    type="text"
                    placeholder="Search stocks (e.g., AAPL, Apple)"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((stock) => (
                        <div
                        key={stock.symbol}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => addToWatchlist(stock)}
                        >
                        <div className="flex justify-between items-center">
                            <div>
                            <div className="font-medium text-gray-900">{stock.symbol}</div>
                            <div className="text-sm text-gray-600 truncate max-w-[200px]">{stock.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                            <span className="font-medium">${stock.price}</span>
                            <Plus size={16} className="text-blue-600" />
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {searchLoading && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center">
                    <Activity className="animate-spin text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-sm text-slate-600 font-medium">Searching...</p>
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Market Summary */}
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 font-medium">S&P 500</p>
                    <p className="text-2xl font-bold text-slate-900">4,157.24</p>
                    <p className="text-sm font-medium text-emerald-600">+0.65%</p>
                </div>
                <TrendingUp className="text-emerald-500" size={32} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 font-medium">NASDAQ</p>
                    <p className="text-2xl font-bold text-slate-900">12,789.56</p>
                    <p className="text-sm font-medium text-red-500">-0.23%</p>
                </div>
                <TrendingDown className="text-red-500" size={32} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 font-medium">DOW</p>
                    <p className="text-2xl font-bold text-slate-900">33,945.58</p>
                    <p className="text-sm font-medium text-blue-600">+0.89%</p>
                </div>
                <TrendingUp className="text-blue-500" size={32} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 font-medium">VIX</p>
                    <p className="text-2xl font-bold text-slate-900">18.74</p>
                    <p className="text-sm font-medium text-orange-600">-2.1%</p>
                </div>
                <Activity className="text-orange-500" size={32} />
                </div>
            </div>
            </div>

            {/* Market Overview Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Market Sector Distribution
                </h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                        formatter={(value) => [`${value}%`, 'Market Share']}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-emerald-600" />
                Market Performance Trend
                </h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={watchlist.slice(0, 8).map((stock, index) => ({
                    name: stock.symbol,
                    performance: parseFloat(stock.changePercent),
                    price: parseFloat(stock.price)
                    }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                        formatter={(value, name) => [
                        name === 'performance' ? `${value}%` : `$${value}`, 
                        name === 'performance' ? 'Change %' : 'Price'
                        ]}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                    />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>

            {/* Watchlist */}
            <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign size={24} className="text-blue-600" />
                Your Watchlist ({watchlist.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlist.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} showRemove={true} />
                ))}
            </div>
            </div>

            {watchlist.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <DollarSign className="text-slate-400 mx-auto mb-4" size={64} />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No stocks in watchlist</h3>
                <p className="text-slate-600">Search for stocks above to add them to your watchlist</p>
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t mt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p className="text-white font-medium text-lg">
                Dashboard #4 of 30 Days 30 Dashboards Challenge • {API_KEY ? 'Live Data via Alpha Vantage API' : 'Demo Mode'}
            </p>
            <p className="text-slate-400 mt-2">
                {API_KEY 
                ? '* First 3 stocks show live data, others use demo data to respect API limits (5 calls/min)'
                : '* The API key is not working for some reason, so the dashboard is using dummy data! Sorry!'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
                {API_KEY && 'Refreshes every 5 minutes to respect API limits'}
            </p>
            </div>
                <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 backdrop-blur-sm">
                <p className="text-slate-300 text-sm">
                    Made with ❤️ by{' '}
                    <a 
                    href="https://github.com/lizardcat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium underline decoration-blue-400/30 hover:decoration-blue-300 underline-offset-2 transition-colors duration-200"
                    >
                    Alex Raza
                    </a>
                </p>
                </div>
                </div>
            </div>
        </div>
    );
}