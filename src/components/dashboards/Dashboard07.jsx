import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Users, Shield, Heart, MapPin, AlertCircle, Calendar, Globe, RefreshCw, Filter, Search, BarChart3, PieChart, Clock } from 'lucide-react';

export function Dashboard07() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [timeRange, setTimeRange] = useState('7days');
    const [viewMode, setViewMode] = useState('cases');
    const [searchTerm, setSearchTerm] = useState('');
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [africanCountries, setAfricanCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // African country mapping with ISO codes and regions
    const africanCountryMapping = {
        'DZ': { name: 'Algeria', region: 'North Africa' },
        'AO': { name: 'Angola', region: 'Central Africa' },
        'BJ': { name: 'Benin', region: 'West Africa' },
        'BW': { name: 'Botswana', region: 'Southern Africa' },
        'BF': { name: 'Burkina Faso', region: 'West Africa' },
        'BI': { name: 'Burundi', region: 'East Africa' },
        'CM': { name: 'Cameroon', region: 'Central Africa' },
        'CV': { name: 'Cabo Verde', region: 'West Africa' },
        'CF': { name: 'Central African Republic', region: 'Central Africa' },
        'TD': { name: 'Chad', region: 'Central Africa' },
        'KM': { name: 'Comoros', region: 'East Africa' },
        'CG': { name: 'Congo', region: 'Central Africa' },
        'CD': { name: 'DR Congo', region: 'Central Africa' },
        'CI': { name: "Côte d'Ivoire", region: 'West Africa' },
        'DJ': { name: 'Djibouti', region: 'East Africa' },
        'EG': { name: 'Egypt', region: 'North Africa' },
        'GQ': { name: 'Equatorial Guinea', region: 'Central Africa' },
        'ER': { name: 'Eritrea', region: 'East Africa' },
        'SZ': { name: 'Eswatini', region: 'Southern Africa' },
        'ET': { name: 'Ethiopia', region: 'East Africa' },
        'GA': { name: 'Gabon', region: 'Central Africa' },
        'GM': { name: 'Gambia', region: 'West Africa' },
        'GH': { name: 'Ghana', region: 'West Africa' },
        'GN': { name: 'Guinea', region: 'West Africa' },
        'GW': { name: 'Guinea-Bissau', region: 'West Africa' },
        'KE': { name: 'Kenya', region: 'East Africa' },
        'LS': { name: 'Lesotho', region: 'Southern Africa' },
        'LR': { name: 'Liberia', region: 'West Africa' },
        'LY': { name: 'Libya', region: 'North Africa' },
        'MG': { name: 'Madagascar', region: 'East Africa' },
        'MW': { name: 'Malawi', region: 'Southern Africa' },
        'ML': { name: 'Mali', region: 'West Africa' },
        'MR': { name: 'Mauritania', region: 'West Africa' },
        'MU': { name: 'Mauritius', region: 'East Africa' },
        'MA': { name: 'Morocco', region: 'North Africa' },
        'MZ': { name: 'Mozambique', region: 'Southern Africa' },
        'NA': { name: 'Namibia', region: 'Southern Africa' },
        'NE': { name: 'Niger', region: 'West Africa' },
        'NG': { name: 'Nigeria', region: 'West Africa' },
        'RW': { name: 'Rwanda', region: 'East Africa' },
        'ST': { name: 'São Tomé and Príncipe', region: 'Central Africa' },
        'SN': { name: 'Senegal', region: 'West Africa' },
        'SC': { name: 'Seychelles', region: 'East Africa' },
        'SL': { name: 'Sierra Leone', region: 'West Africa' },
        'SO': { name: 'Somalia', region: 'East Africa' },
        'ZA': { name: 'South Africa', region: 'Southern Africa' },
        'SS': { name: 'South Sudan', region: 'East Africa' },
        'SD': { name: 'Sudan', region: 'East Africa' },
        'TZ': { name: 'Tanzania', region: 'East Africa' },
        'TG': { name: 'Togo', region: 'West Africa' },
        'TN': { name: 'Tunisia', region: 'North Africa' },
        'UG': { name: 'Uganda', region: 'East Africa' },
        'ZM': { name: 'Zambia', region: 'Southern Africa' },
        'ZW': { name: 'Zimbabwe', region: 'Southern Africa' }
    };

    // Fetch COVID-19 data from disease.sh API
    const fetchCovidData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://disease.sh/v3/covid-19/countries');
            
            if (!response.ok) {
                throw new Error('Failed to fetch COVID-19 data');
            }

            const allCountries = await response.json();

            // Filter and map African countries
            const africanData = allCountries
                .filter(country => {
                    const countryCode = country.countryInfo.iso2;
                    return africanCountryMapping[countryCode];
                })
                .map(country => {
                    const countryCode = country.countryInfo.iso2;
                    const mapping = africanCountryMapping[countryCode];
                    
                    return {
                        id: countryCode,
                        name: mapping.name,
                        cases: country.cases,
                        deaths: country.deaths,
                        recovered: country.recovered,
                        active: country.active,
                        critical: country.critical,
                        todayCases: country.todayCases,
                        todayDeaths: country.todayDeaths,
                        population: Math.round(country.population / 1000000), // in millions
                        vaccinated: country.population > 0 
                            ? Math.round((country.tests / country.population) * 100) // Using tests as proxy
                            : 0,
                        region: mapping.region,
                        flag: country.countryInfo.flag,
                        updated: country.updated
                    };
                })
                .sort((a, b) => b.cases - a.cases);

            setAfricanCountries(africanData);
            setLastUpdate(new Date());

        } catch (err) {
            console.error('Error fetching COVID data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCovidData();

        // Refresh data every 10 minutes
        const interval = setInterval(fetchCovidData, 600000);
        return () => clearInterval(interval);
    }, []);

    // Calculate statistics
    const calculateStats = () => {
        const totalCases = africanCountries.reduce((sum, c) => sum + c.cases, 0);
        const totalDeaths = africanCountries.reduce((sum, c) => sum + c.deaths, 0);
        const totalRecovered = africanCountries.reduce((sum, c) => sum + c.recovered, 0);
        const avgVaccination = Math.round(africanCountries.reduce((sum, c) => sum + c.vaccinated, 0) / africanCountries.length);
        const activeCases = totalCases - totalDeaths - totalRecovered;
        const mortalityRate = ((totalDeaths / totalCases) * 100).toFixed(2);
        const recoveryRate = ((totalRecovered / totalCases) * 100).toFixed(1);

        return {
            totalCases,
            totalDeaths,
            totalRecovered,
            activeCases,
            avgVaccination,
            mortalityRate,
            recoveryRate,
            affectedCountries: africanCountries.length
        };
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-red-600 mx-auto mb-4" size={48} />
                    <p className="text-slate-700 font-medium text-lg">Loading COVID-19 data...</p>
                    <p className="text-slate-500 text-sm mt-2">Fetching real-time statistics from disease.sh API</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
                    <p className="text-slate-700 font-medium text-lg mb-2">Failed to load data</p>
                    <p className="text-slate-500 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const stats = calculateStats();

    // Get color based on metric and value
    const getColor = (country, metric) => {
        if (metric === 'cases') {
            const casesPerCapita = (country.cases / country.population) * 1000;
            if (casesPerCapita > 50) return '#DC2626'; // red-600
            if (casesPerCapita > 30) return '#EA580C'; // orange-600
            if (casesPerCapita > 15) return '#F59E0B'; // amber-500
            if (casesPerCapita > 5) return '#FCD34D'; // yellow-300
            return '#86EFAC'; // green-300
        } else if (metric === 'deaths') {
            const deathsPerCapita = (country.deaths / country.population) * 1000;
            if (deathsPerCapita > 2) return '#7C2D12'; // red-900
            if (deathsPerCapita > 1) return '#DC2626'; // red-600
            if (deathsPerCapita > 0.5) return '#F97316'; // orange-500
            if (deathsPerCapita > 0.2) return '#FBBF24'; // yellow-400
            return '#A7F3D0'; // green-200
        } else if (metric === 'vaccinated') {
            if (country.vaccinated >= 80) return '#059669'; // green-600
            if (country.vaccinated >= 60) return '#10B981'; // green-500
            if (country.vaccinated >= 40) return '#FBBF24'; // yellow-400
            if (country.vaccinated >= 20) return '#F97316'; // orange-500
            return '#DC2626'; // red-600
        }
        return '#9CA3AF'; // gray-400
    };

    // Simplified Africa SVG map with country paths
    const AfricaMap = () => {
        return (
            <svg viewBox="0 0 1000 1000" className="w-full h-full">
                {/* Countries as simplified paths */}
                {africanCountries.map((country) => {
                    const isSelected = selectedCountry?.id === country.id;
                    const fillColor = getColor(country, viewMode);
                    
                    return (
                        <g key={country.id}>
                            {/* Simplified rectangular representation for each country */}
                            <rect
                                x={getCountryPosition(country.id).x}
                                y={getCountryPosition(country.id).y}
                                width={getCountryPosition(country.id).width}
                                height={getCountryPosition(country.id).height}
                                fill={fillColor}
                                stroke={isSelected ? '#1E40AF' : '#1F2937'}
                                strokeWidth={isSelected ? 3 : 1}
                                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                                onClick={() => setSelectedCountry(country)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = 'brightness(1)';
                                }}
                            />
                            {/* Country label for larger countries */}
                            {getCountryPosition(country.id).showLabel && (
                                <text
                                    x={getCountryPosition(country.id).x + getCountryPosition(country.id).width / 2}
                                    y={getCountryPosition(country.id).y + getCountryPosition(country.id).height / 2}
                                    textAnchor="middle"
                                    className="text-xs font-semibold pointer-events-none"
                                    fill="#1F2937"
                                >
                                    {country.id}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    // Get position for each country (simplified grid layout representing approximate geographic position)
    const getCountryPosition = (countryId) => {
        const positions = {
            // North Africa
            'MA': { x: 150, y: 50, width: 120, height: 100, showLabel: true },
            'DZ': { x: 280, y: 50, width: 180, height: 120, showLabel: true },
            'TN': { x: 470, y: 40, width: 70, height: 80, showLabel: true },
            'LY': { x: 550, y: 60, width: 200, height: 140, showLabel: true },
            'EG': { x: 760, y: 80, width: 120, height: 140, showLabel: true },
            
            // West Africa
            'MR': { x: 120, y: 170, width: 130, height: 100, showLabel: false },
            'ML': { x: 250, y: 180, width: 140, height: 120, showLabel: true },
            'NE': { x: 400, y: 190, width: 150, height: 110, showLabel: true },
            'TD': { x: 560, y: 210, width: 120, height: 130, showLabel: true },
            'SN': { x: 80, y: 280, width: 70, height: 60, showLabel: false },
            'GM': { x: 85, y: 295, width: 30, height: 20, showLabel: false },
            'GW': { x: 70, y: 315, width: 40, height: 35, showLabel: false },
            'GN': { x: 110, y: 320, width: 80, height: 70, showLabel: false },
            'SL': { x: 100, y: 395, width: 50, height: 45, showLabel: false },
            'LR': { x: 130, y: 420, width: 60, height: 50, showLabel: false },
            'CI': { x: 190, y: 360, width: 90, height: 90, showLabel: true },
            'BF': { x: 280, y: 310, width: 90, height: 80, showLabel: true },
            'GH': { x: 280, y: 395, width: 80, height: 90, showLabel: true },
            'TG': { x: 365, y: 410, width: 35, height: 65, showLabel: false },
            'BJ': { x: 400, y: 400, width: 45, height: 80, showLabel: false },
            'NG': { x: 445, y: 380, width: 110, height: 130, showLabel: true },
            
            // Central Africa
            'CM': { x: 560, y: 420, width: 100, height: 120, showLabel: true },
            'CF': { x: 670, y: 420, width: 120, height: 100, showLabel: false },
            'SS': { x: 760, y: 380, width: 100, height: 100, showLabel: false },
            'GQ': { x: 545, y: 470, width: 35, height: 35, showLabel: false },
            'GA': { x: 545, y: 510, width: 80, height: 90, showLabel: false },
            'CG': { x: 630, y: 530, width: 90, height: 110, showLabel: false },
            'CD': { x: 680, y: 530, width: 160, height: 200, showLabel: true },
            'AO': { x: 560, y: 610, width: 120, height: 180, showLabel: true },
            
            // East Africa
            'SD': { x: 790, y: 230, width: 100, height: 160, showLabel: true },
            'ER': { x: 870, y: 270, width: 60, height: 80, showLabel: false },
            'ET': { x: 850, y: 360, width: 120, height: 140, showLabel: true },
            'DJ': { x: 920, y: 320, width: 30, height: 35, showLabel: false },
            'SO': { x: 910, y: 360, width: 80, height: 180, showLabel: true },
            'UG': { x: 800, y: 510, width: 70, height: 70, showLabel: false },
            'KE': { x: 850, y: 510, width: 80, height: 110, showLabel: true },
            'RW': { x: 785, y: 590, width: 35, height: 40, showLabel: false },
            'BI': { x: 785, y: 635, width: 30, height: 35, showLabel: false },
            'TZ': { x: 820, y: 625, width: 100, height: 140, showLabel: true },
            
            // Southern Africa
            'ZM': { x: 680, y: 740, width: 100, height: 90, showLabel: true },
            'MW': { x: 820, y: 760, width: 60, height: 100, showLabel: false },
            'MZ': { x: 790, y: 765, width: 90, height: 170, showLabel: true },
            'ZW': { x: 680, y: 835, width: 90, height: 80, showLabel: true },
            'BW': { x: 590, y: 825, width: 85, height: 100, showLabel: true },
            'NA': { x: 520, y: 800, width: 65, height: 140, showLabel: false },
            'ZA': { x: 580, y: 870, width: 150, height: 120, showLabel: true },
            'LS': { x: 670, y: 930, width: 35, height: 35, showLabel: false },
            'SZ': { x: 720, y: 915, width: 30, height: 35, showLabel: false },
            'MG': { x: 890, y: 800, width: 70, height: 180, showLabel: false },
        };

        return positions[countryId] || { x: 0, y: 0, width: 50, height: 50, showLabel: false };
    };

    // Filter countries based on search
    const filteredCountries = searchTerm
        ? africanCountries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : africanCountries;

    // Get top countries by metric
    const getTopCountries = (metric, limit = 5) => {
        return [...africanCountries]
            .sort((a, b) => b[metric] - a[metric])
            .slice(0, limit);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                                    <Activity className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">COVID-19 Africa Tracker</h1>
                                    <p className="text-orange-100">
                                        Live pandemic data from disease.sh API
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                    <p className="text-white text-sm font-medium">Last Updated</p>
                                    <p className="text-orange-100 text-xs">{lastUpdate.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-sm"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('cases')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === 'cases'
                                            ? 'bg-white text-red-700'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    Cases
                                </button>
                                <button
                                    onClick={() => setViewMode('deaths')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === 'deaths'
                                            ? 'bg-white text-red-700'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    Deaths
                                </button>
                                <button
                                    onClick={() => setViewMode('vaccinated')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === 'vaccinated'
                                            ? 'bg-white text-red-700'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    Vaccinated
                                </button>
                                <button
                                    onClick={fetchCovidData}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    title="Refresh data"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium text-sm">Total Cases</p>
                                <p className="text-3xl font-bold text-red-600">{(stats.totalCases / 1000000).toFixed(2)}M</p>
                                <p className="text-xs text-slate-500 mt-1">{stats.affectedCountries} countries</p>
                            </div>
                            <Activity className="text-red-500" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium text-sm">Total Deaths</p>
                                <p className="text-3xl font-bold text-gray-800">{(stats.totalDeaths / 1000).toFixed(1)}K</p>
                                <p className="text-xs text-slate-500 mt-1">{stats.mortalityRate}% mortality rate</p>
                            </div>
                            <AlertCircle className="text-gray-700" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium text-sm">Recovered</p>
                                <p className="text-3xl font-bold text-green-600">{(stats.totalRecovered / 1000000).toFixed(2)}M</p>
                                <p className="text-xs text-slate-500 mt-1">{stats.recoveryRate}% recovery rate</p>
                            </div>
                            <Heart className="text-green-500" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium text-sm">Avg Vaccination</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.avgVaccination}%</p>
                                <p className="text-xs text-slate-500 mt-1">Population coverage</p>
                            </div>
                            <Shield className="text-blue-500" size={40} />
                        </div>
                    </div>
                </div>

                {/* Map and Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Interactive Map */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Globe className="text-red-600" size={24} />
                                Africa COVID-19 Map
                            </h2>
                            <div className="text-xs text-slate-600">
                                Viewing: <span className="font-semibold capitalize">{viewMode}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="aspect-square">
                                <AfricaMap />
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Color Scale</p>
                            <div className="flex items-center gap-2 text-xs">
                                {viewMode === 'cases' && (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-green-300 rounded"></div>
                                            <span>Low</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                                            <span>Moderate</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                            <span>High</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                                            <span>Very High</span>
                                        </div>
                                    </>
                                )}
                                {viewMode === 'vaccinated' && (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                                            <span>&lt;20%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                                            <span>20-60%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                                            <span>60-80%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-green-600 rounded"></div>
                                            <span>&gt;80%</span>
                                        </div>
                                    </>
                                )}
                                {viewMode === 'deaths' && (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-green-200 rounded"></div>
                                            <span>Lowest</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                                            <span>Low</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                                            <span>High</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-red-900 rounded"></div>
                                            <span>Highest</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Country Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-red-600" size={24} />
                            {selectedCountry ? selectedCountry.name : 'Select a Country'}
                        </h2>

                        {selectedCountry ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm text-slate-600 mb-1">Total Cases</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {selectedCountry.cases.toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-slate-600 mb-1">Deaths</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {selectedCountry.deaths.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {((selectedCountry.deaths / selectedCountry.cases) * 100).toFixed(2)}% fatality rate
                                    </p>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-slate-600 mb-1">Recovered</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {selectedCountry.recovered.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {((selectedCountry.recovered / selectedCountry.cases) * 100).toFixed(1)}% recovery rate
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-slate-600 mb-1">Vaccination Rate</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {selectedCountry.vaccinated}%
                                    </p>
                                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${selectedCountry.vaccinated}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Region</span>
                                        <span className="font-semibold text-slate-900">{selectedCountry.region}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-slate-600">Population</span>
                                        <span className="font-semibold text-slate-900">{selectedCountry.population}M</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-slate-600">Active Cases</span>
                                        <span className="font-semibold text-orange-600">
                                            {(selectedCountry.cases - selectedCountry.deaths - selectedCountry.recovered).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <MapPin className="text-slate-300 mx-auto mb-4" size={64} />
                                <p className="text-slate-500">Click on a country on the map to view detailed statistics</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Countries Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Highest Cases */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="text-red-600" size={20} />
                            Highest Cases
                        </h3>
                        <div className="space-y-3">
                            {getTopCountries('cases').map((country, index) => (
                                <div
                                    key={country.id}
                                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                                    onClick={() => setSelectedCountry(country)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{country.name}</p>
                                            <p className="text-xs text-slate-600">{country.region}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-red-600">{(country.cases / 1000).toFixed(0)}K</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highest Vaccination */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Shield className="text-blue-600" size={20} />
                            Best Vaccination
                        </h3>
                        <div className="space-y-3">
                            {getTopCountries('vaccinated').map((country, index) => (
                                <div
                                    key={country.id}
                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                                    onClick={() => setSelectedCountry(country)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{country.name}</p>
                                            <p className="text-xs text-slate-600">{country.region}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-blue-600">{country.vaccinated}%</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highest Recovery */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Heart className="text-green-600" size={20} />
                            Most Recovered
                        </h3>
                        <div className="space-y-3">
                            {getTopCountries('recovered').map((country, index) => (
                                <div
                                    key={country.id}
                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                                    onClick={() => setSelectedCountry(country)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{country.name}</p>
                                            <p className="text-xs text-slate-600">{country.region}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-600">{(country.recovered / 1000).toFixed(0)}K</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regional Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="text-indigo-600" size={24} />
                        Regional Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {['North Africa', 'West Africa', 'East Africa', 'Southern Africa', 'Central Africa'].map((region) => {
                            const regionCountries = africanCountries.filter(c => c.region === region);
                            const regionCases = regionCountries.reduce((sum, c) => sum + c.cases, 0);
                            const regionDeaths = regionCountries.reduce((sum, c) => sum + c.deaths, 0);
                            const regionVacc = Math.round(regionCountries.reduce((sum, c) => sum + c.vaccinated, 0) / regionCountries.length);

                            return (
                                <div key={region} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                                    <h4 className="font-bold text-slate-900 mb-3">{region}</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Cases</span>
                                            <span className="font-semibold text-red-600">{(regionCases / 1000).toFixed(0)}K</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Deaths</span>
                                            <span className="font-semibold text-gray-700">{(regionDeaths / 1000).toFixed(1)}K</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Vaccinated</span>
                                            <span className="font-semibold text-blue-600">{regionVacc}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Countries</span>
                                            <span className="font-semibold text-slate-900">{regionCountries.length}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <AlertCircle className="text-amber-600" size={24} />
                        About This Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Activity size={16} className="text-amber-600" />
                                Data Sources
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                This dashboard uses real-time COVID-19 data from <a href="https://disease.sh" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 underline font-medium">disease.sh</a>, which aggregates information from official health ministries, WHO reports, and Johns Hopkins CSSE. 
                                All statistics are updated regularly to reflect the most current pandemic situation across African nations.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Shield size={16} className="text-amber-600" />
                                Stay Protected
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Get vaccinated, wear masks in crowded spaces, practice social distancing, and maintain good hygiene. 
                                Follow local health guidelines and stay informed about the pandemic situation in your region.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-800 border-t mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-white font-medium text-lg">
                        Dashboard #7 of 30 Days 30 Dashboards Challenge • COVID-19 Regional Tracker
                    </p>
                    <p className="text-slate-400 mt-2">
                        Real-time pandemic data via <a href="https://disease.sh" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">disease.sh API</a> • Comprehensive African coverage with interactive regional mapping
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 backdrop-blur-sm">
                            <p className="text-slate-300 text-sm">
                                Made with ❤️ by{' '}
                                <a 
                                    href="https://github.com/lizardcat" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-red-400 hover:text-red-300 font-medium underline decoration-red-400/30 hover:decoration-red-300 underline-offset-2 transition-colors duration-200"
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