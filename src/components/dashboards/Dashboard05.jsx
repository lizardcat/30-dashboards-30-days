import { useState, useEffect } from 'react';
import { Search, Clock, ExternalLink, Bookmark, Filter, Globe, TrendingUp, Calendar, Eye, RefreshCw, Check } from 'lucide-react';

export function Dashboard05() {
    const [articles, setArticles] = useState([]);
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [selectedCountry, setSelectedCountry] = useState('us');
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [error, setError] = useState(null);
    const [bookmarks, setBookmarks] = useState(new Set());

    // NewsAPI configuration
    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const BASE_URL = 'https://newsapi.org/v2';

    // Rate limiting helper
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let lastApiCall = 0;

    const categories = [
        { id: 'general', name: 'General', icon: Globe },
        { id: 'business', name: 'Business', icon: TrendingUp },
        { id: 'technology', name: 'Technology', icon: Globe },
        { id: 'sports', name: 'Sports', icon: Globe },
        { id: 'health', name: 'Health', icon: Globe },
        { id: 'science', name: 'Science', icon: Globe },
        { id: 'entertainment', name: 'Entertainment', icon: Globe }
    ];

    const countries = [
        // Major News Markets (Best API Coverage)
        { code: 'us', name: '🇺🇸 United States' },
        { code: 'gb', name: '🇬🇧 United Kingdom' },
        { code: 'ca', name: '🇨🇦 Canada' },
        { code: 'au', name: '🇦🇺 Australia' },
        { code: 'de', name: '🇩🇪 Germany' },
        { code: 'fr', name: '🇫🇷 France' },
        // East African Countries
        { code: 'ke', name: '🇰🇪 Kenya' },
        { code: 'tz', name: '🇹🇿 Tanzania' },
        { code: 'ug', name: '🇺🇬 Uganda' },
        { code: 'et', name: '🇪🇹 Ethiopia' },
        { code: 'rw', name: '🇷🇼 Rwanda' },
        // Other African Countries
        { code: 'za', name: '🇿🇦 South Africa' },
        { code: 'ng', name: '🇳🇬 Nigeria' },
        { code: 'eg', name: '🇪🇬 Egypt' },
        { code: 'ma', name: '🇲🇦 Morocco' }
    ];

    // Mock news data generator (fallback when API is unavailable)
    const generateMockArticles = (count = 20) => {
        const mockTitles = [
            "Technology Giants Report Strong Q3 Earnings Despite Market Volatility",
            "Climate Change Summit Reaches Historic Agreement on Carbon Reduction",
            "New Medical Breakthrough Shows Promise for Cancer Treatment",
            "Global Markets React to Federal Reserve Interest Rate Decision",
            "Revolutionary AI Model Demonstrates Human-Level Reasoning Capabilities",
            "Space Exploration Mission Discovers Potential Signs of Ancient Life",
            "Renewable Energy Adoption Reaches All-Time High Globally",
            "Cybersecurity Experts Warn of Emerging Threats in Digital Banking",
            "Olympic Games Preparations Enter Final Phase with New Safety Protocols",
            "Scientific Study Reveals Surprising Benefits of Remote Work",
            "Major Automotive Manufacturer Announces Full Electric Vehicle Lineup",
            "International Trade Relations Show Signs of Improvement",
            "Healthcare Innovation Conference Showcases Latest Medical Technologies",
            "Educational Technology Transforms Learning in Post-Pandemic Era",
            "Environmental Conservation Efforts Show Measurable Impact on Wildlife"
        ];

        const mockSources = [
            "TechCrunch", "Reuters", "BBC News", "CNN", "The Guardian", 
            "Associated Press", "Wall Street Journal", "Financial Times", 
            "National Geographic", "Scientific American", "ESPN", "NBC News"
        ];

        const mockDescriptions = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
        ];

        return Array.from({ length: count }, (_, index) => ({
            title: mockTitles[index % mockTitles.length],
            description: mockDescriptions[index % mockDescriptions.length],
            url: `https://example.com/article-${index + 1}`,
            urlToImage: `https://picsum.photos/400/250?random=${index + 1}`,
            publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            source: { name: mockSources[index % mockSources.length] },
            author: `Reporter ${index + 1}`,
            id: `mock-${index + 1}`
        }));
    };

    // Fetch news from NewsAPI
    const fetchNews = async (endpoint, params = {}) => {
        if (!API_KEY) {
            console.warn('NewsAPI key not found, using mock data');
            return generateMockArticles();
        }

        try {
            // Rate limiting: ensure at least 1 second between API calls
            const now = Date.now();
            const timeSinceLastCall = now - lastApiCall;
            if (timeSinceLastCall < 1000) {
                await delay(1000 - timeSinceLastCall);
            }
            lastApiCall = Date.now();

            const queryParams = new URLSearchParams({
                apiKey: API_KEY,
                pageSize: 50,
                ...params
            });

            const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'ok') {
                const filteredArticles = data.articles.map((article, index) => ({
                    ...article,
                    id: article.url || `article-${index}-${Date.now()}`
                })).filter(article => 
                    article.title && 
                    article.title !== '[Removed]' && 
                    article.description && 
                    article.description !== '[Removed]' &&
                    article.source &&
                    article.source.name !== '[Removed]'
                );
                
                console.log(`API returned ${data.articles.length} articles, filtered to ${filteredArticles.length}`);
                return filteredArticles;
            } else {
                console.error('API Error:', data);
                throw new Error(data.message || 'Unknown API error');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError(error.message);
            return generateMockArticles();
        }
    };

    // Load top headlines
    const loadTopHeadlines = async () => {
        setLoading(true);
        setError(null);
        try {
            const articles = await fetchNews('top-headlines', {
                category: selectedCategory,
                country: selectedCountry
            });
            setArticles(articles);
            setLastRefresh(new Date());
        } catch (error) {
            setError('Failed to load headlines');
            setArticles(generateMockArticles());
        }
        setLoading(false);
    };

    // Search news
    const searchNews = async (query) => {
        if (!query.trim()) {
            loadTopHeadlines();
            return;
        }

        setSearchLoading(true);
        setError(null);
        try {
            // Try the everything endpoint first
            let articles = await fetchNews('everything', {
                q: encodeURIComponent(query.trim()),
                sortBy: 'publishedAt',
                language: 'en',
                pageSize: 50
            });
            
            // If everything endpoint fails or returns no results, try top-headlines with search
            if (!articles || articles.length === 0) {
                console.log('Everything endpoint failed, trying top-headlines with search...');
                articles = await fetchNews('top-headlines', {
                    q: encodeURIComponent(query.trim()),
                    country: selectedCountry,
                    pageSize: 50
                });
            }
            
            setArticles(articles);
        } catch (error) {
            console.error('Search failed:', error);
            setError(`Search failed: ${error.message}`);
            // Generate mock search results based on query
            const mockResults = generateMockArticles(15).map(article => ({
                ...article,
                title: `${query}: ${article.title}`,
                description: `Search result for "${query}": ${article.description}`
            }));
            setArticles(mockResults);
        }
        setSearchLoading(false);
    };

    // Load bookmarks from memory state (persistent during session)
    useEffect(() => {
        // In a real app, you'd load from a backend or localStorage
        // For this demo, bookmarks persist during the session
        setBookmarks(new Set());
    }, []);

    // Toggle bookmark
    const toggleBookmark = (article) => {
        setBookmarks(prev => {
            const newBookmarks = new Set(prev);
            if (newBookmarks.has(article.id)) {
                newBookmarks.delete(article.id);
            } else {
                newBookmarks.add(article.id);
            }
            return newBookmarks;
        });

        setBookmarkedArticles(prev => {
            const isBookmarked = prev.some(b => b.id === article.id);
            if (isBookmarked) {
                return prev.filter(b => b.id !== article.id);
            } else {
                return [...prev, article];
            }
        });
    };

    // Load initial articles
    useEffect(() => {
        loadTopHeadlines();
    }, [selectedCategory, selectedCountry]);

    // Auto-refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (!searchTerm) {
                loadTopHeadlines();
            }
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [selectedCategory, selectedCountry, searchTerm]);

    // Handle search with debouncing
    const handleSearch = (term) => {
        setSearchTerm(term);
        
        // Clear any existing search timeout
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        // Debounce search to avoid too many API calls
        window.searchTimeout = setTimeout(() => {
            if (term.trim()) {
                console.log(`Searching for: "${term}"`);
                searchNews(term);
            } else {
                console.log('Clearing search, loading top headlines');
                loadTopHeadlines();
            }
        }, 500); // Wait 500ms after user stops typing
    };

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

    const NewsCard = ({ article }) => {
        const isBookmarked = bookmarks.has(article.id);
        
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {article.urlToImage && (
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={article.urlToImage} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toggleBookmark(article);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200"
                        >
                            {isBookmarked ? (
                                <div className="relative">
                                    <Bookmark size={16} className="text-emerald-600 fill-emerald-600" />
                                    <Check size={10} className="absolute -top-1 -right-1 text-white bg-emerald-600 rounded-full p-0.5" />
                                </div>
                            ) : (
                                <Bookmark size={16} className="text-slate-600" />
                            )}
                        </button>
                    </div>
                )}
                
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {article.source.name}
                        </span>
                        <div className="flex items-center text-xs text-slate-500 gap-1">
                            <Clock size={12} />
                            {formatRelativeTime(article.publishedAt)}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {article.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            {article.author && (
                                <span>By {article.author}</span>
                            )}
                        </div>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Read more
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                    <p className="text-slate-700 font-medium">Loading latest news...</p>
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
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Globe className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Global News Hub</h1>
                                    <p className="text-slate-200">
                                        {API_KEY ? 'Real-time news from around the world' : 'Demo mode'}
                                    </p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative max-w-md w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search news..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                    />
                                    {searchLoading && (
                                        <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-white/60" size={16} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="text-white/70" size={16} />
                                <span className="text-white/70 text-sm font-medium">Category:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id} className="text-slate-900">
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Globe className="text-white/70" size={16} />
                                <span className="text-white/70 text-sm font-medium">Country:</span>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    {countries.map(country => (
                                        <option key={country.code} value={country.code} className="text-slate-900">
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={loadTopHeadlines}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Articles</p>
                                <p className="text-2xl font-bold text-slate-900">{articles.length}</p>
                            </div>
                            <Globe className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Bookmarks</p>
                                <p className="text-2xl font-bold text-slate-900">{bookmarkedArticles.length}</p>
                            </div>
                            <Bookmark className="text-emerald-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Category</p>
                                <p className="text-2xl font-bold text-slate-900 capitalize">{selectedCategory}</p>
                            </div>
                            <TrendingUp className="text-purple-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-medium">Last Refresh</p>
                                <p className="text-sm font-bold text-slate-900">{formatRelativeTime(lastRefresh.toISOString())}</p>
                            </div>
                            <Calendar className="text-orange-500" size={32} />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 font-medium">⚠️ {error}</p>
                        <p className="text-red-600 text-sm mt-1">Showing demo data instead</p>
                    </div>
                )}

                {/* Search Results Header */}
                {searchTerm && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">
                            Search results for "{searchTerm}"
                        </h2>
                        <p className="text-slate-600">{articles.length} articles found</p>
                    </div>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {articles.map((article) => (
                        <NewsCard 
                            key={article.id} 
                            article={article}
                        />
                    ))}
                </div>

                {articles.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <Globe className="text-slate-400 mx-auto mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
                        <p className="text-slate-600">Try adjusting your search terms or filters</p>
                    </div>
                )}

                {/* Bookmarked Articles Section */}
                {bookmarkedArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Bookmark size={24} className="text-blue-600" />
                            Bookmarked Articles ({bookmarkedArticles.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarkedArticles.map((article) => (
                                <NewsCard 
                                    key={`bookmark-${article.id}`} 
                                    article={article}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800 border-t mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-white font-medium text-lg">
                        Dashboard #5 of 30 Days 30 Dashboards Challenge • {API_KEY ? 'Live Global News via NewsAPI' : 'Demo Mode'}
                    </p>
                    <p className="text-slate-400 mt-2">
                        {API_KEY 
                            ? 'Real-time news from multiple sources with smart caching and rate limiting'
                            : 'Add your NewsAPI key to environment variables for live news data'}
                    </p>
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
        </div>
    );
}