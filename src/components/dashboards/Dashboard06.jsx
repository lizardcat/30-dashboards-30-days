import { useState, useEffect } from 'react';
import { Wind, MapPin, AlertTriangle, Zap, RefreshCw, Globe, Filter, Search, TrendingUp, Calendar, Eye, Heart, Leaf } from 'lucide-react';

export function Dashboard06() {
    const [africanCities, setAfricanCities] = useState([]);
    const [globalCities, setGlobalCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [error, setError] = useState(null);
    const [selectedContinent, setSelectedContinent] = useState('all');

    // AQICN API configuration - user should add their API key
    const API_KEY = import.meta.env.VITE_AQICN_API_KEY || 'demo';
    const BASE_URL = 'https://api.waqi.info';

    // Rate limiting helper
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let lastApiCall = 0;

    // African cities to prioritize (major cities with good monitoring)
    const priorityAfricanCities = [
        'nairobi', 'lagos', 'johannesburg', 'casablanca', 'alexandria', 'khartoum',
        'cairo', 'dar-es-salaam', 'addis-ababa', 'accra', 'kinshasa', 'luanda',
        'algiers', 'tunis', 'dakar', 'bamako', 'ouagadougou', 'abidjan',
        'kampala', 'kigali', 'lusaka', 'maputo', 'harare', 'gaborone',
        'windhoek', 'libreville', 'malabo', 'brazzaville', 'ndjamena', 'niamey'
    ];

    // Global cities for comparison
    const globalComparisonCities = [
        'beijing', 'delhi', 'tokyo', 'london', 'new-york', 'paris', 
        'los-angeles', 'mumbai', 'shanghai', 'mexico-city', 'seoul', 'bangkok',
        'jakarta', 'manila', 'singapore', 'sydney', 'moscow', 'berlin'
    ];

    // Mock data generator for fallback
    const generateMockAirQualityData = (cities, isAfrican = false) => {
        return cities.slice(0, 12).map((city, index) => ({
            city: city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' '),
            aqi: Math.floor(Math.random() * 300) + 20,
            station: {
                name: `${city.charAt(0).toUpperCase() + city.slice(1)} Monitoring Station`,
                time: new Date(Date.now() - Math.random() * 7200000).toISOString(),
            },
            iaqi: {
                pm25: { v: Math.floor(Math.random() * 150) + 10 },
                pm10: { v: Math.floor(Math.random() * 200) + 15 },
                o3: { v: Math.floor(Math.random() * 100) + 5 },
                no2: { v: Math.floor(Math.random() * 80) + 5 },
                co: { v: Math.floor(Math.random() * 50) + 2 },
            },
            isAfrican,
            id: `${city}-${index}`
        }));
    };

    // Get AQI level information
    const getAQIInfo = (aqi) => {
        if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
        if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
        if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
        if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
        if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
        return { level: 'Hazardous', color: 'bg-red-800', textColor: 'text-red-900', bgColor: 'bg-red-100', borderColor: 'border-red-300' };
    };

    // Fetch air quality data from AQICN API
    const fetchAirQualityData = async (cityName) => {
        if (API_KEY === 'demo') {
            // Return mock data if no API key
            await delay(100); // Simulate API delay
            return null;
        }

        try {
            // Rate limiting
            const now = Date.now();
            const timeSinceLastCall = now - lastApiCall;
            if (timeSinceLastCall < 200) {
                await delay(200 - timeSinceLastCall);
            }
            lastApiCall = Date.now();

            const response = await fetch(`${BASE_URL}/feed/${cityName}/?token=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'ok') {
                return {
                    ...data.data,
                    city: data.data.city?.name || cityName.charAt(0).toUpperCase() + cityName.slice(1).replace('-', ' '),
                    id: `${cityName}-${Date.now()}`
                };
            } else {
                console.warn(`No data for ${cityName}:`, data.msg);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data for ${cityName}:`, error);
            return null;
        }
    };

    // Search for city air quality
    const searchCity = async (cityName) => {
        if (!cityName.trim()) return null;
        
        try {
            setSearchLoading(true);
            const data = await fetchAirQualityData(cityName.toLowerCase().replace(' ', '-'));
            setSearchLoading(false);
            return data;
        } catch (error) {
            setSearchLoading(false);
            console.error('Search error:', error);
            return null;
        }
    };

    // Load all air quality data
    const loadAirQualityData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load African cities
            const africanPromises = priorityAfricanCities.slice(0, 15).map(city => 
                fetchAirQualityData(city).then(data => data ? { ...data, isAfrican: true } : null)
            );
            
            // Load global cities for comparison
            const globalPromises = globalComparisonCities.slice(0, 10).map(city => 
                fetchAirQualityData(city).then(data => data ? { ...data, isAfrican: false } : null)
            );

            const [africanResults, globalResults] = await Promise.all([
                Promise.all(africanPromises),
                Promise.all(globalPromises)
            ]);

            const africanData = africanResults.filter(Boolean);
            const globalData = globalResults.filter(Boolean);

            if (africanData.length === 0 && globalData.length === 0) {
                throw new Error('No data available from API');
            }

            setAfricanCities(africanData);
            setGlobalCities(globalData);
            setLastRefresh(new Date());

        } catch (error) {
            console.error('Error loading air quality data:', error);
            setError(error.message);
            
            // Use mock data as fallback
            setAfricanCities(generateMockAirQualityData(priorityAfricanCities, true));
            setGlobalCities(generateMockAirQualityData(globalComparisonCities, false));
            setLastRefresh(new Date());
        }

        setLoading(false);
    };

    // Handle search with debouncing
    const handleSearch = async (term) => {
        setSearchTerm(term);
        
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        if (term.trim()) {
            window.searchTimeout = setTimeout(async () => {
                const result = await searchCity(term);
                if (result) {
                    // Add to appropriate list based on whether it's African
                    const isAfricanCity = priorityAfricanCities.some(city => 
                        city.toLowerCase().includes(term.toLowerCase()) || 
                        term.toLowerCase().includes(city)
                    );
                    
                    if (isAfricanCity) {
                        setAfricanCities(prev => [{ ...result, isAfrican: true }, ...prev.slice(0, 14)]);
                    } else {
                        setGlobalCities(prev => [{ ...result, isAfrican: false }, ...prev.slice(0, 9)]);
                    }
                }
            }, 800);
        }
    };

    // Load initial data
    useEffect(() => {
        loadAirQualityData();
    }, []);

    // Auto-refresh every 10 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (!searchTerm) {
                loadAirQualityData();
            }
        }, 600000); // 10 minutes

        return () => clearInterval(interval);
    }, [searchTerm]);

    // Format relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    // Air Quality Card Component
    const AirQualityCard = ({ data }) => {
        const aqiInfo = getAQIInfo(data.aqi);
        
        return (
            <div className={`${aqiInfo.bgColor} rounded-xl shadow-lg border-2 ${aqiInfo.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300 group ${data.isAfrican ? 'ring-2 ring-blue-200' : ''}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${aqiInfo.color} rounded-lg`}>
                                <Wind className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{data.city}</h3>
                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <MapPin size={12} />
                                    {data.isAfrican ? 'Africa' : 'Global'}
                                </div>
                            </div>
                        </div>
                        
                        {data.station?.time && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={12} />
                                {formatRelativeTime(data.station.time)}
                            </div>
                        )}
                    </div>

                    {/* AQI Value */}
                    <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-20 h-20 ${aqiInfo.color} rounded-full shadow-lg`}>
                            <span className="text-2xl font-bold text-white">{data.aqi}</span>
                        </div>
                        <p className={`${aqiInfo.textColor} font-semibold text-sm mt-2`}>
                            {aqiInfo.level}
                        </p>
                    </div>

                    {/* Pollutant Details */}
                    <div className="space-y-2">
                        {data.iaqi?.pm25 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">PM2.5</span>
                                <span className="font-medium text-slate-900">{data.iaqi.pm25.v} μg/m³</span>
                            </div>
                        )}
                        {data.iaqi?.pm10 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">PM10</span>
                                <span className="font-medium text-slate-900">{data.iaqi.pm10.v} μg/m³</span>
                            </div>
                        )}
                        {data.iaqi?.o3 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Ozone</span>
                                <span className="font-medium text-slate-900">{data.iaqi.o3.v} μg/m³</span>
                            </div>
                        )}
                        {data.iaqi?.no2 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">NO₂</span>
                                <span className="font-medium text-slate-900">{data.iaqi.no2.v} μg/m³</span>
                            </div>
                        )}
                    </div>

                    {/* Station Info */}
                    {data.station?.name && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Eye size={12} />
                                {data.station.name}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Get continental stats
    const getStats = () => {
        const allCities = [...africanCities, ...globalCities];
        const goodAir = allCities.filter(city => city.aqi <= 50).length;
        const unhealthyAir = allCities.filter(city => city.aqi > 150).length;
        const avgAfrican = africanCities.length > 0 
            ? Math.round(africanCities.reduce((sum, city) => sum + city.aqi, 0) / africanCities.length)
            : 0;
        const avgGlobal = globalCities.length > 0
            ? Math.round(globalCities.reduce((sum, city) => sum + city.aqi, 0) / globalCities.length)
            : 0;

        return { goodAir, unhealthyAir, avgAfrican, avgGlobal, total: allCities.length };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
                    <p className="text-slate-700 font-medium">Loading air quality data...</p>
                    {API_KEY === 'demo' && (
                        <p className="text-slate-500 text-sm mt-2">Running in demo mode - add API key for live data</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-cyan-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl shadow-lg">
                                    <Wind className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Global Air Quality Monitor</h1>
                                    <p className="text-emerald-100">
                                        {API_KEY !== 'demo' ? 'Real-time air quality data worldwide' : 'Demo mode • Global coverage'}
                                    </p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative max-w-md w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search city air quality..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                                    />
                                    {searchLoading && (
                                        <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-white/60" size={16} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Leaf className="text-white/70" size={16} />
                                <span className="text-white/70 text-sm font-medium">Real-time monitoring • Global coverage</span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={loadAirQualityData}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Total Cities</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                            <Globe className="text-emerald-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Good Air Quality</p>
                                <p className="text-2xl font-bold text-green-600">{stats.goodAir}</p>
                            </div>
                            <Leaf className="text-green-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Unhealthy</p>
                                <p className="text-2xl font-bold text-red-600">{stats.unhealthyAir}</p>
                            </div>
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Primary Avg AQI</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.avgAfrican}</p>
                            </div>
                            <Heart className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Extended Avg AQI</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.avgGlobal}</p>
                            </div>
                            <TrendingUp className="text-purple-500" size={32} />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 font-medium">⚠️ {error}</p>
                        <p className="text-yellow-600 text-sm mt-1">Showing demo data instead</p>
                    </div>
                )}

                {/* Major Cities Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                <MapPin size={20} className="text-white" />
                            </div>
                            Major Cities Air Quality ({africanCities.length})
                        </h2>
                        <div className="text-sm text-slate-600">
                            Live monitoring • Updated continuously
                        </div>
                    </div>
                    
                    {africanCities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {africanCities.map((data) => (
                                <AirQualityCard key={data.id} data={data} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <Wind className="text-slate-400 mx-auto mb-4" size={64} />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No city data available</h3>
                            <p className="text-slate-600">Try refreshing or check your API key</p>
                        </div>
                    )}
                </div>

                {/* Additional Cities Section */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg">
                                <Globe size={20} className="text-white" />
                            </div>
                            Additional Cities ({globalCities.length})
                        </h2>
                        <div className="text-sm text-slate-600">
                            Extended coverage worldwide
                        </div>
                    </div>
                    
                    {globalCities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {globalCities.map((data) => (
                                <AirQualityCard key={data.id} data={data} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <Globe className="text-slate-400 mx-auto mb-4" size={64} />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No additional city data</h3>
                            <p className="text-slate-600">Loading extended air quality data...</p>
                        </div>
                    )}
                </div>

                {/* AQI Legend */}
                <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                            <Zap size={20} className="text-white" />
                        </div>
                        Air Quality Index (AQI) Guide
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {[
                            { range: '0-50', level: 'Good', color: 'bg-green-500', desc: 'Air quality is satisfactory' },
                            { range: '51-100', level: 'Moderate', color: 'bg-yellow-500', desc: 'Acceptable for most people' },
                            { range: '101-150', level: 'Unhealthy for Sensitive', color: 'bg-orange-500', desc: 'Sensitive groups may be affected' },
                            { range: '151-200', level: 'Unhealthy', color: 'bg-red-500', desc: 'Everyone may be affected' },
                            { range: '201-300', level: 'Very Unhealthy', color: 'bg-purple-500', desc: 'Health warnings issued' },
                            { range: '300+', level: 'Hazardous', color: 'bg-red-800', desc: 'Emergency conditions' },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`}></div>
                                <p className="font-semibold text-slate-900 text-sm">{item.level}</p>
                                <p className="text-xs text-slate-600 mt-1">{item.range}</p>
                                <p className="text-xs text-slate-500 mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg">
                            <AlertTriangle size={20} className="text-white" />
                        </div>
                        Frequently Asked Questions
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Wind size={16} className="text-emerald-600" />
                                What does AQI measure?
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                The Air Quality Index (AQI) measures how polluted the air is and what associated health effects might be of concern. 
                                It tracks pollutants like PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide.
                            </p>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Eye size={16} className="text-emerald-600" />
                                How often is data updated?
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Air quality data is updated hourly from monitoring stations worldwide. 
                                This dashboard refreshes automatically every 10 minutes to provide you with the most current information available.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Heart size={16} className="text-emerald-600" />
                                When should I be concerned?
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                AQI values above 100 are unhealthy for sensitive groups (children, elderly, people with respiratory conditions). 
                                Values above 150 are unhealthy for everyone. Consider limiting outdoor activities during these times.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Leaf size={16} className="text-emerald-600" />
                                What affects air quality?
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Air quality is influenced by vehicle emissions, industrial activities, wildfires, weather patterns, and geographic features. 
                                Urban areas typically have higher pollution levels than rural regions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-800 border-t mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-white font-medium text-lg">
                        Dashboard #6 of 30 Days 30 Dashboards Challenge • {API_KEY !== 'demo' ? 'Live Air Quality via AQICN API' : 'Demo Mode'}
                    </p>
                    <p className="text-slate-400 mt-2">
                        {API_KEY !== 'demo' 
                            ? 'Real-time air quality monitoring from stations worldwide with comprehensive coverage'
                            : 'Add your AQICN API key as VITE_AQICN_API_KEY in environment variables for live data'}
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 backdrop-blur-sm">
                            <p className="text-slate-300 text-sm">
                                Made with ❤️ by{' '}
                                <a 
                                    href="https://github.com/lizardcat" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 font-medium underline decoration-emerald-400/30 hover:decoration-emerald-300 underline-offset-2 transition-colors duration-200"
                                >
                                    Alex Raza
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}