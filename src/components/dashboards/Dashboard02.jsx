import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Eye, Wind, Droplets, Thermometer, MapPin, Plus, X, Search, Sunrise, Sunset, Gauge } from 'lucide-react'

export function Dashboard02() {
    const [cities, setCities] = useState([
        { name: 'Nairobi', country: 'Kenya', id: 'nairobi-ke' },
        { name: 'Lagos', country: 'Nigeria', id: 'lagos-ng' },
        { name: 'Cape Town', country: 'South Africa', id: 'cape-town-za' },
        { name: 'Cairo', country: 'Egypt', id: 'cairo-eg' },
        { name: 'Accra', country: 'Ghana', id: 'accra-gh' },
        { name: 'Addis Ababa', country: 'Ethiopia', id: 'addis-ababa-et' }
    ])
  
    const [weatherData, setWeatherData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [newCity, setNewCity] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState('metric') // metric or imperial

    // Mock weather data generator (since we can't use real API keys in artifacts)
    const generateMockWeatherData = (cityName) => {
        const weatherConditions = [
        { condition: 'sunny', icon: 'sun', description: 'Clear Sky' },
        { condition: 'cloudy', icon: 'cloud', description: 'Partly Cloudy' },
        { condition: 'rainy', icon: 'rain', description: 'Light Rain' },
        { condition: 'overcast', icon: 'cloud', description: 'Overcast' }
        ]
        
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    const baseTemp = cityName.includes('Cape Town') ? 18 : cityName.includes('Cairo') ? 28 : 24
    const tempVariation = Math.floor(Math.random() * 10) - 5
    
    return {
        temperature: baseTemp + tempVariation,
        feels_like: baseTemp + tempVariation + Math.floor(Math.random() * 3) - 1,
        humidity: Math.floor(Math.random() * 40) + 40,
        wind_speed: Math.floor(Math.random() * 15) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 5) + 8,
        uv_index: Math.floor(Math.random() * 8) + 1,
        condition: randomCondition.condition,
        description: randomCondition.description,
        sunrise: '06:30',
        sunset: '18:45',
        last_updated: new Date().toLocaleTimeString()
        }
    }

    const fetchWeatherData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newWeatherData = {}
        cities.forEach(city => {
            newWeatherData[city.id] = generateMockWeatherData(city.name)
        })
        
        setWeatherData(newWeatherData)
        } catch (err) {
        setError('Failed to fetch weather data')
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        fetchWeatherData()
    }, [cities])

    const getWeatherIcon = (condition) => {
        switch (condition) {
        case 'sunny':
            return <Sun className="h-8 w-8 text-yellow-400" />
        case 'cloudy':
            return <Cloud className="h-8 w-8 text-gray-400" />
        case 'rainy':
            return <CloudRain className="h-8 w-8 text-blue-400" />
        case 'overcast':
            return <Cloud className="h-8 w-8 text-gray-500" />
        default:
            return <Sun className="h-8 w-8 text-yellow-400" />
        }
    }

    const convertTemp = (temp) => {
        if (selectedUnit === 'imperial') {
        return Math.round((temp * 9/5) + 32)
        }
        return Math.round(temp)
    }

    const getUnitSymbol = () => selectedUnit === 'metric' ? '°C' : '°F'

    const searchCities = async (query) => {
        if (query.length < 2) {
        setSearchResults([])
        return
        }
        
    setIsSearching(true)
    
    // Mock city search results - African cities
    const africanCities = [
        { name: 'Johannesburg', country: 'South Africa' },
        { name: 'Kinshasa', country: 'DR Congo' },
        { name: 'Luanda', country: 'Angola' },
        { name: 'Dar es Salaam', country: 'Tanzania' },
        { name: 'Khartoum', country: 'Sudan' },
        { name: 'Algiers', country: 'Algeria' },
        { name: 'Casablanca', country: 'Morocco' },
        { name: 'Tunis', country: 'Tunisia' },
        { name: 'Dakar', country: 'Senegal' },
        { name: 'Bamako', country: 'Mali' },
        { name: 'Abidjan', country: 'Ivory Coast' },
        { name: 'Kampala', country: 'Uganda' },
        { name: 'Maputo', country: 'Mozambique' },
        { name: 'Lusaka', country: 'Zambia' },
        { name: 'Harare', country: 'Zimbabwe' }
    ]
    
    const results = africanCities
        .filter(city => 
            city.name.toLowerCase().includes(query.toLowerCase()) ||
            city.country.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        
        setTimeout(() => {
        setSearchResults(results)
        setIsSearching(false)
        }, 300)
    }

    const addCity = (city) => {
        const cityId = `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.country.toLowerCase().replace(/\s+/g, '-')}`
        
        if (!cities.find(c => c.id === cityId)) {
        setCities([...cities, { ...city, id: cityId }])
        }
        
        setNewCity('')
        setSearchResults([])
    }

    const removeCity = (cityId) => {
        if (cities.length > 1) {
        setCities(cities.filter(city => city.id !== cityId))
        }
    }

    const getAverageTemp = () => {
        const temps = Object.values(weatherData).map(data => data.temperature)
        if (temps.length === 0) return 0
        return Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length)
    }

    const getHighestTemp = () => {
        const temps = Object.values(weatherData).map(data => data.temperature)
        return temps.length > 0 ? Math.max(...temps) : 0
    }

    const getLowestTemp = () => {
        const temps = Object.values(weatherData).map(data => data.temperature)
        return temps.length > 0 ? Math.min(...temps) : 0
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Cloud className="h-10 w-10 text-blue-300" />
                African Cities Weather
            </h1>
            <p className="text-blue-200">Real-time weather data for major African cities</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
            {/* Add City */}
            <div className="relative flex-1 max-w-md">
                <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                    type="text"
                    value={newCity}
                    onChange={(e) => {
                        setNewCity(e.target.value)
                        searchCities(e.target.value)
                    }}
                    placeholder="Search African cities..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
                </div>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm rounded-lg mt-1 z-10 shadow-lg">
                    {searchResults.map((city, index) => (
                    <button
                        key={index}
                        onClick={() => addCity(city)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-100 first:rounded-t-lg last:rounded-b-lg transition-colors text-gray-800"
                    >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-600">{city.country}</div>
                    </button>
                    ))}
                </div>
                )}
            </div>

            {/* Unit Toggle & Refresh */}
            <div className="flex gap-2">
                <button
                onClick={() => setSelectedUnit(selectedUnit === 'metric' ? 'imperial' : 'metric')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                >
                {selectedUnit === 'metric' ? '°C' : '°F'}
                </button>
                <button
                onClick={fetchWeatherData}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                {loading ? 'Updating...' : 'Refresh'}
                </button>
            </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-5 w-5 text-blue-300" />
                <span className="text-blue-200">Average Temperature</span>
                </div>
                <div className="text-2xl font-bold text-white">
                {convertTemp(getAverageTemp())}{getUnitSymbol()}
                </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-orange-400" />
                <span className="text-blue-200">Highest Today</span>
                </div>
                <div className="text-2xl font-bold text-white">
                {convertTemp(getHighestTemp())}{getUnitSymbol()}
                </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                <Cloud className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">Lowest Today</span>
                </div>
                <div className="text-2xl font-bold text-white">
                {convertTemp(getLowestTemp())}{getUnitSymbol()}
                </div>
            </div>
            </div>

            {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-200">{error}</p>
            </div>
            )}

            {/* Weather Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => {
                const weather = weatherData[city.id]
                
                return (
                <div key={city.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-300" />
                        <div>
                        <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                        <p className="text-sm text-blue-200">{city.country}</p>
                        </div>
                    </div>
                    {cities.length > 1 && (
                        <button
                        onClick={() => removeCity(city.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        >
                        <X className="h-5 w-5" />
                        </button>
                    )}
                    </div>

                    {loading || !weather ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                    ) : (
                    <>
                        {/* Main Weather */}
                        <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">
                            {convertTemp(weather.temperature)}{getUnitSymbol()}
                            </div>
                            <p className="text-blue-200 capitalize">{weather.description}</p>
                            <p className="text-sm text-blue-300">
                            Feels like {convertTemp(weather.feels_like)}{getUnitSymbol()}
                            </p>
                        </div>
                        <div className="text-right">
                            {getWeatherIcon(weather.condition)}
                        </div>
                        </div>

                        {/* Weather Details */}
                        <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">Humidity</span>
                            </div>
                            <span className="text-white font-medium">{weather.humidity}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">Wind</span>
                            </div>
                            <span className="text-white font-medium">{weather.wind_speed} km/h</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">Pressure</span>
                            </div>
                            <span className="text-white font-medium">{weather.pressure} mb</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">Visibility</span>
                            </div>
                            <span className="text-white font-medium">{weather.visibility} km</span>
                        </div>
                        </div>

                        {/* Sun Times */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <Sunrise className="h-4 w-4 text-orange-400" />
                            <span className="text-blue-200">{weather.sunrise}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sunset className="h-4 w-4 text-orange-600" />
                            <span className="text-blue-200">{weather.sunset}</span>
                        </div>
                        </div>

                        {/* Last Updated */}
                        <div className="text-xs text-blue-300 text-center mt-3">
                        Last updated: {weather.last_updated}
                        </div>
                    </>
                    )}
                </div>
                )
            })}
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-blue-200">
            <p>Weather data updates every 10 minutes</p>
            </div>
        </div>
        </div>
    )
}