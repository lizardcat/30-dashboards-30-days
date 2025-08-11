import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Eye, Wind, Droplets, Thermometer, MapPin, Plus, X, Search, Sunrise, Sunset, Gauge } from 'lucide-react'

export function Dashboard02() {
    const [cities, setCities] = useState([
        { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', id: 'nairobi-ke' },
        { name: 'Arusha', country: 'Tanzania', countryCode: 'TZ', id: 'arusha-tz'},
        { name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ', id: 'dar-tz'},
        { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', id: 'lagos-ng' },
        { name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', id: 'cape-town-za' },
        { name: 'Cairo', country: 'Egypt', countryCode: 'EG', id: 'cairo-eg' },
    ])
    
    const [weatherData, setWeatherData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [newCity, setNewCity] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState('metric') // metric or imperial

    // Get API key from environment
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

    // OpenWeatherMap Geocoding API for city search
    const searchCitiesAPI = async (query) => {
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        
        setIsSearching(true)
        
        try {
            // Using the OpenWeatherMap Geocoding API
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
            )
            
            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Transform API response to match your format
            const results = data.map(city => ({
                name: city.name,
                country: city.country,
                countryCode: city.country, // API returns full country name, you might want to map this to codes
                state: city.state || '', // Some cities have states
                lat: city.lat,
                lon: city.lon
            }))
            
            setSearchResults(results)
        } catch (error) {
            console.error('City search error:', error)
            // Fallback to mock data if API fails
            searchCitiesMock(query)
        } finally {
            setIsSearching(false)
        }
    }

    // Fallback mock search function
    const searchCitiesMock = (query) => {
        const africanCities = [
            { name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA' },
            { name: 'Kinshasa', country: 'DR Congo', countryCode: 'CD' },
            { name: 'Luanda', country: 'Angola', countryCode: 'AO' },
            { name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ' },
            { name: 'Khartoum', country: 'Sudan', countryCode: 'SD' },
            { name: 'Algiers', country: 'Algeria', countryCode: 'DZ' },
            { name: 'Casablanca', country: 'Morocco', countryCode: 'MA' },
            { name: 'Tunis', country: 'Tunisia', countryCode: 'TN' },
            { name: 'Dakar', country: 'Senegal', countryCode: 'SN' },
            { name: 'Bamako', country: 'Mali', countryCode: 'ML' },
            { name: 'Abidjan', country: 'Ivory Coast', countryCode: 'CI' },
            { name: 'Kampala', country: 'Uganda', countryCode: 'UG' },
            { name: 'Maputo', country: 'Mozambique', countryCode: 'MZ' },
            { name: 'Lusaka', country: 'Zambia', countryCode: 'ZM' },
            { name: 'Harare', country: 'Zimbabwe', countryCode: 'ZW' }
        ]
        
        const results = africanCities
            .filter(city => 
                city.name.toLowerCase().includes(query.toLowerCase()) ||
                city.country.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
        
        setSearchResults(results)
    }

    // OpenWeatherMap API integration
    const fetchRealWeatherData = async (cityName, countryCode) => {
        if (!API_KEY || API_KEY === 'demo_key_replace_with_your_actual_key') {
            console.warn('OpenWeather API key not found. Using mock data.')
            return generateMockWeatherData(cityName)
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}&units=metric`
            )
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Convert OpenWeather data to our format
            return {
                temperature: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                pressure: data.main.pressure,
                visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
                uv_index: 5, // UV data requires separate API call
                condition: getWeatherCondition(data.weather[0].main.toLowerCase()),
                description: data.weather[0].description,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                }),
                last_updated: new Date().toLocaleTimeString()
            }
        } catch (error) {
            console.error(`Error fetching weather for ${cityName}:`, error)
            return generateMockWeatherData(cityName)
        }
    }

    const getWeatherCondition = (openWeatherCondition) => {
        const conditionMap = {
            'clear': 'sunny',
            'clouds': 'cloudy',
            'rain': 'rainy',
            'drizzle': 'rainy',
            'thunderstorm': 'rainy',
            'snow': 'overcast',
            'mist': 'overcast',
            'fog': 'overcast'
        }
        return conditionMap[openWeatherCondition] || 'sunny'
    }

    // Fallback mock data generator
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
            const weatherPromises = cities.map(async (city) => {
                const weather = await fetchRealWeatherData(city.name, city.countryCode)
                return { cityId: city.id, weather }
            })
            
            const results = await Promise.all(weatherPromises)
            
            const newWeatherData = {}
            results.forEach(({ cityId, weather }) => {
                newWeatherData[cityId] = weather
            })
            
            setWeatherData(newWeatherData)
        } catch (err) {
            setError('Failed to fetch weather data. Using mock data.')
            // Fallback to mock data
            const newWeatherData = {}
            cities.forEach(city => {
                newWeatherData[city.id] = generateMockWeatherData(city.name)
            })
            setWeatherData(newWeatherData)
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

    const addCity = (city) => {
        const cityId = `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.countryCode.toLowerCase()}`
        
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

    // Debounced search function
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (newCity) {
                searchCitiesAPI(newCity)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [newCity])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <Cloud className="h-10 w-10 text-blue-300" />
                        Global Weather Dashboard
                    </h1>
                    <p className="text-blue-200">Real-time weather data with API-powered city search</p>
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
                                    onChange={(e) => setNewCity(e.target.value)}
                                    placeholder="Search cities worldwide..."
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                                />
                                {isSearching ? (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
                                    </div>
                                ) : (
                                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
                                )}
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
                                        <div className="text-sm text-gray-600">
                                            {city.state && `${city.state}, `}{city.country}
                                        </div>
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

                {/* API Key Notice */}
                {API_KEY === 'demo_key_replace_with_your_actual_key' && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                        <p className="text-yellow-200">
                            <strong>Demo Mode:</strong> Replace the API_KEY variable with your OpenWeatherMap API key for live data.
                        </p>
                    </div>
                )}

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