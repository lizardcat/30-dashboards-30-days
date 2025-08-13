import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Zap, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

export function Dashboard03() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [portfolio, setPortfolio] = useState([
        { coinId: 'bitcoin', amount: 0.5 },
        { coinId: 'ethereum', amount: 2.0 },
        { coinId: 'cardano', amount: 1000 },
        { coinId: 'solana', amount: 10 },
        { coinId: 'chainlink', amount: 50 }
    ]);
    const [showAddHolding, setShowAddHolding] = useState(false);
    const [newHolding, setNewHolding] = useState({ coinId: '', amount: '' });
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [portfolioChange, setPortfolioChange] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h"
                );
                const data = await res.json();
                setCoins(data);
                
                // Calculate realistic portfolio metrics
                calculatePortfolioValue(data);
                
                // Set default selected coin and create chart data
                if (data.length > 0) {
                    setSelectedCoin(data[0]);
                    generateChartData(data[0]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const addHolding = () => {
        if (newHolding.coinId && newHolding.amount && parseFloat(newHolding.amount) > 0) {
            const existingIndex = portfolio.findIndex(h => h.coinId === newHolding.coinId);
            
            if (existingIndex >= 0) {
                // Update existing holding
                const updatedPortfolio = [...portfolio];
                updatedPortfolio[existingIndex].amount = parseFloat(newHolding.amount);
                setPortfolio(updatedPortfolio);
            } else {
                // Add new holding
                setPortfolio([...portfolio, { 
                    coinId: newHolding.coinId, 
                    amount: parseFloat(newHolding.amount) 
                }]);
            }
            
            setNewHolding({ coinId: '', amount: '' });
            setShowAddHolding(false);
            
            // Recalculate portfolio with updated holdings
            if (coins.length > 0) {
                calculatePortfolioValue(coins);
            }
        }
    };

    const removeHolding = (coinId) => {
        const updatedPortfolio = portfolio.filter(h => h.coinId !== coinId);
        setPortfolio(updatedPortfolio);
        
        // Recalculate portfolio
        if (coins.length > 0) {
            calculatePortfolioValue(coins);
        }
    };

    const updateHoldingAmount = (coinId, newAmount) => {
        if (newAmount === '' || parseFloat(newAmount) >= 0) {
            const updatedPortfolio = portfolio.map(h => 
                h.coinId === coinId ? { ...h, amount: parseFloat(newAmount) || 0 } : h
            );
            setPortfolio(updatedPortfolio);
            
            // Recalculate portfolio
            if (coins.length > 0) {
                calculatePortfolioValue(coins);
            }
        }
    };

    const calculatePortfolioValue = (coins) => {
        let totalValue = 0;
        let totalChange = 0;
        let totalPreviousValue = 0;

        portfolio.forEach(holding => {
            const coin = coins.find(c => c.id === holding.coinId);
            if (coin) {
                const currentValue = coin.current_price * holding.amount;
                const previousPrice = coin.current_price / (1 + coin.price_change_percentage_24h / 100);
                const previousValue = previousPrice * holding.amount;
                
                totalValue += currentValue;
                totalPreviousValue += previousValue;
            }
        });

        const portfolioChangePercent = totalPreviousValue > 0 
            ? ((totalValue - totalPreviousValue) / totalPreviousValue) * 100 
            : 0;

        setTotalPortfolioValue(totalValue);
        setPortfolioChange(portfolioChangePercent);
    };

    const generateChartData = (coin) => {
        if (coin && coin.sparkline_in_7d && coin.sparkline_in_7d.price) {
            const prices = coin.sparkline_in_7d.price;
            const now = new Date();
            
            const data = prices.map((price, index) => {
                // Each data point represents roughly 1 hour (168 hours in 7 days / 168 data points)
                const hoursBack = prices.length - 1 - index;
                const timeStamp = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));
                
                return {
                    time: timeStamp.getTime(),
                    price: price,
                    timeLabel: timeStamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: index % 24 === 0 ? '2-digit' : undefined
                    })
                };
            });
            setChartData(data);
        }
    };

    const handleCoinSelect = (coin) => {
        setSelectedCoin(coin);
        generateChartData(coin);
    };

    const formatNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Cryptocurrency Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Real-time crypto market data and portfolio tracking using the CoinGecko API</p>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Portfolio Value</p>
                                <p className="text-3xl font-bold text-blue-400">
                                    ${formatNumber(totalPortfolioValue)}
                                </p>
                            </div>
                            <DollarSign className="text-blue-400" size={32} />
                        </div>
                    </div>
                    
                    <div className={`bg-gradient-to-r ${portfolioChange >= 0 ? 'from-green-600/20 to-emerald-600/20 border-green-500/30' : 'from-red-600/20 to-rose-600/20 border-red-500/30'} backdrop-blur-sm border rounded-2xl p-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">24h Portfolio Change</p>
                                <p className={`text-3xl font-bold ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                                </p>
                            </div>
                            {portfolioChange >= 0 ? 
                                <TrendingUp className="text-green-400" size={32} /> : 
                                <TrendingDown className="text-red-400" size={32} />
                            }
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Active Assets</p>
                                <p className="text-3xl font-bold text-purple-400">{portfolio.length}</p>
                            </div>
                            <Activity className="text-purple-400" size={32} />
                        </div>
                    </div>
                </div>

                {/* Portfolio Holdings */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <DollarSign className="text-green-400" />
                            Portfolio Holdings
                        </h2>
                        <button
                            onClick={() => setShowAddHolding(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} />
                            Add Holding
                        </button>
                    </div>

                    {/* Add/Edit Holding Form */}
                    {showAddHolding && (
                        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Add New Holding</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Cryptocurrency</label>
                                    <select
                                        value={newHolding.coinId}
                                        onChange={(e) => setNewHolding({ ...newHolding, coinId: e.target.value })}
                                        className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-400 focus:outline-none"
                                    >
                                        <option value="">Select a coin...</option>
                                        {coins.map(coin => (
                                            <option key={coin.id} value={coin.id}>
                                                {coin.name} ({coin.symbol.toUpperCase()})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0.0"
                                        value={newHolding.amount}
                                        onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
                                        className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={addHolding}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Save size={16} />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddHolding(false);
                                            setNewHolding({ coinId: '', amount: '' });
                                        }}
                                        className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Holdings Grid */}
                    {portfolio.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">No holdings yet</p>
                            <p className="text-sm">Add your cryptocurrency holdings to track your portfolio</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {portfolio.map(holding => {
                                const coin = coins.find(c => c.id === holding.coinId);
                                if (!coin) return null;
                                
                                const holdingValue = coin.current_price * holding.amount;
                                const holdingChange = coin.price_change_percentage_24h;
                                
                                return (
                                    <div key={holding.coinId} className="bg-slate-700/30 rounded-lg p-4 group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                                                <div>
                                                    <div className="font-semibold">{coin.name}</div>
                                                    <div className="text-xs text-slate-400">{coin.symbol.toUpperCase()}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeHolding(holding.coinId)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 rounded"
                                                title="Remove holding"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <div className="text-xs text-slate-400 mb-1">Amount:</div>
                                            <input
                                                type="number"
                                                step="any"
                                                min="0"
                                                value={holding.amount}
                                                onChange={(e) => updateHoldingAmount(holding.coinId, e.target.value)}
                                                className="w-full bg-slate-600/50 text-white rounded px-2 py-1 text-sm border border-transparent focus:border-blue-400 focus:outline-none"
                                            />
                                        </div>
                                        
                                        <div className="text-lg font-bold">${holdingValue.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400 mb-1">
                                            @ ${coin.current_price.toLocaleString()} per {coin.symbol.toUpperCase()}
                                        </div>
                                        <div className={`text-sm ${holdingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {holdingChange >= 0 ? '+' : ''}{holdingChange.toFixed(2)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Chart Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart3 className="text-blue-400" />
                            Price History
                        </h2>
                        {selectedCoin && (
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">{selectedCoin.name}</p>
                                <p className="text-xl font-bold">${selectedCoin.current_price.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ height: 400 }}>
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis 
                                        dataKey="time"
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af' }}
                                        type="number"
                                        scale="time"
                                        domain={['dataMin', 'dataMax']}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            });
                                        }}
                                    />
                                    <YAxis 
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af' }}
                                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#1f2937', 
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                                        labelFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorPrice)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Market Data Table */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="text-yellow-400" />
                            Market Data
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="text-left p-4 text-slate-300 font-semibold">Coin</th>
                                    <th className="text-right p-4 text-slate-300 font-semibold">Price</th>
                                    <th className="text-right p-4 text-slate-300 font-semibold">24h Change</th>
                                    <th className="text-right p-4 text-slate-300 font-semibold">Market Cap</th>
                                    <th className="text-center p-4 text-slate-300 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
                                                <span className="text-slate-400">Loading market data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    coins.map((coin, index) => (
                                        <tr 
                                            key={coin.id} 
                                            className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${selectedCoin?.id === coin.id ? 'bg-blue-500/10' : ''}`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={coin.image} 
                                                        alt={coin.name} 
                                                        className="w-8 h-8 rounded-full" 
                                                    />
                                                    <div>
                                                        <div className="font-semibold">{coin.name}</div>
                                                        <div className="text-slate-400 text-sm uppercase">{coin.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                ${coin.current_price.toLocaleString()}
                                            </td>
                                            <td className={`p-4 text-right font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                <div className="flex items-center justify-end gap-1">
                                                    {coin.price_change_percentage_24h >= 0 ? 
                                                        <TrendingUp size={16} /> : 
                                                        <TrendingDown size={16} />
                                                    }
                                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                                    {coin.price_change_percentage_24h.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-mono text-slate-300">
                                                ${formatNumber(coin.market_cap)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleCoinSelect(coin)}
                                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                                        selectedCoin?.id === coin.id 
                                                            ? 'bg-blue-500 text-white' 
                                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    }`}
                                                >
                                                    {selectedCoin?.id === coin.id ? 'Selected' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}