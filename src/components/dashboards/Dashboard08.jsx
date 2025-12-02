import { useState, useEffect } from 'react';
import { Calendar, Search, Image, Video, Star, Rocket, Download, ChevronLeft, ChevronRight, Sparkles, RefreshCw, X, ExternalLink, Info, LayoutGrid, List, Filter, Heart } from 'lucide-react';

export function Dashboard08() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video'
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('week'); // 'week', 'month', 'random'
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 12;

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('nasa-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Fetch NASA APOD data
    const fetchNASAData = async () => {
        setLoading(true);
        setError(null);

        try {
            let url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

            if (dateRange === 'random') {
                url += '&count=30';
            } else {
                const endDate = new Date();
                const startDate = new Date();
                
                if (dateRange === 'week') {
                    startDate.setDate(endDate.getDate() - 7);
                } else if (dateRange === 'month') {
                    startDate.setDate(endDate.getDate() - 30);
                }

                url += `&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch NASA APOD data');
            }

            const data = await response.json();
            const dataArray = Array.isArray(data) ? data : [data];
            
            // Sort by date descending (newest first)
            const sortedData = dataArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setImages(sortedData);
            setCurrentPage(1);

        } catch (err) {
            console.error('Error fetching NASA data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNASAData();
    }, [dateRange]);

    // Close modal with ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selectedImage]);

    // Toggle favorite
    const toggleFavorite = (image) => {
        const isFavorited = favorites.some(fav => fav.date === image.date);
        let newFavorites;

        if (isFavorited) {
            newFavorites = favorites.filter(fav => fav.date !== image.date);
        } else {
            newFavorites = [...favorites, image];
        }

        setFavorites(newFavorites);
        localStorage.setItem('nasa-favorites', JSON.stringify(newFavorites));
    };

    const isFavorited = (image) => {
        return favorites.some(fav => fav.date === image.date);
    };

    // Filter images
    const getFilteredImages = () => {
        let filtered = showFavorites ? favorites : images;

        // Filter by media type
        if (filterType !== 'all') {
            filtered = filtered.filter(img => img.media_type === filterType);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(img => 
                img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                img.explanation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredImages = getFilteredImages();

    // Pagination
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

    // Download image
    const downloadImage = async (imageUrl, title) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nasa-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    // Loading state
    if (loading && images.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-purple-400 mx-auto mb-4" size={48} />
                    <p className="text-white font-medium text-lg">Loading NASA Space Gallery...</p>
                    <p className="text-purple-300 text-sm mt-2">Fetching astronomy pictures from NASA APOD API</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && images.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Rocket className="text-red-400 mx-auto mb-4" size={48} />
                    <p className="text-white font-medium text-lg mb-2">Failed to load gallery</p>
                    <p className="text-purple-300 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl border-b border-purple-700/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Rocket className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">NASA Space Gallery</h1>
                                    <p className="text-purple-200">
                                        Astronomy Picture of the Day Archive
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                    <p className="text-white text-sm font-medium">{filteredImages.length} Images</p>
                                    <p className="text-purple-200 text-xs">
                                        {showFavorites ? 'Favorites' : 'In Gallery'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by title or description..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-sm"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                        showFavorites
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <Heart size={16} fill={showFavorites ? 'currentColor' : 'none'} />
                                    Favorites ({favorites.length})
                                </button>

                                <button
                                    onClick={() => setDateRange('week')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        dateRange === 'week'
                                            ? 'bg-white text-purple-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    Last Week
                                </button>
                                <button
                                    onClick={() => setDateRange('month')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        dateRange === 'month'
                                            ? 'bg-white text-purple-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    Last Month
                                </button>
                                <button
                                    onClick={() => setDateRange('random')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                        dateRange === 'random'
                                            ? 'bg-white text-purple-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <Sparkles size={16} />
                                    Random
                                </button>

                                <button
                                    onClick={() => setFilterType(filterType === 'all' ? 'image' : filterType === 'image' ? 'video' : 'all')}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30 flex items-center gap-2"
                                    title="Filter by type"
                                >
                                    <Filter size={16} />
                                    {filterType === 'all' ? 'All' : filterType === 'image' ? 'Images' : 'Videos'}
                                </button>

                                <button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30"
                                    title="Toggle view"
                                >
                                    {viewMode === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
                                </button>

                                <button
                                    onClick={fetchNASAData}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    title="Refresh gallery"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {filteredImages.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="text-purple-400 mx-auto mb-4" size={64} />
                        <p className="text-white text-xl font-semibold mb-2">
                            {showFavorites ? 'No favorites yet' : 'No images found'}
                        </p>
                        <p className="text-purple-300">
                            {showFavorites 
                                ? 'Start exploring and add some favorites!' 
                                : 'Try adjusting your search or filters'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Gallery Grid/List */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {currentImages.map((image) => (
                                    <div
                                        key={image.date}
                                        className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        {/* Image/Video Thumbnail */}
                                        <div className="relative aspect-square overflow-hidden bg-slate-900">
                                            {image.media_type === 'image' ? (
                                                <img
                                                    src={image.url}
                                                    alt={image.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                                                    <Video className="text-white" size={48} />
                                                </div>
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="text-white font-semibold text-sm line-clamp-2">
                                                        {image.title}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Media Type Badge */}
                                            <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                                {image.media_type === 'image' ? (
                                                    <Image size={12} className="text-purple-400" />
                                                ) : (
                                                    <Video size={12} className="text-blue-400" />
                                                )}
                                            </div>

                                            {/* Favorite Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(image);
                                                }}
                                                className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg hover:bg-slate-900 transition-colors"
                                            >
                                                <Heart
                                                    size={16}
                                                    className={isFavorited(image) ? 'text-pink-500' : 'text-white'}
                                                    fill={isFavorited(image) ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                                                {image.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-purple-300 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(image.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                {currentImages.map((image) => (
                                    <div
                                        key={image.date}
                                        className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4 p-4">
                                            {/* Thumbnail */}
                                            <div className="relative sm:w-48 sm:h-48 aspect-square overflow-hidden bg-slate-900 rounded-lg flex-shrink-0">
                                                {image.media_type === 'image' ? (
                                                    <img
                                                        src={image.url}
                                                        alt={image.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                                                        <Video className="text-white" size={32} />
                                                    </div>
                                                )}

                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(image);
                                                    }}
                                                    className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg hover:bg-slate-900 transition-colors"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={isFavorited(image) ? 'text-pink-500' : 'text-white'}
                                                        fill={isFavorited(image) ? 'currentColor' : 'none'}
                                                    />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h3 className="text-white font-bold text-lg">
                                                        {image.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {image.media_type === 'image' ? (
                                                            <Image size={16} className="text-purple-400" />
                                                        ) : (
                                                            <Video size={16} className="text-blue-400" />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <p className="text-purple-300 text-sm mb-3 line-clamp-2">
                                                    {image.explanation}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-purple-300 text-sm flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(image.date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-slate-800/50 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-slate-800/50 text-white hover:bg-slate-700'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-slate-800/50 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Info Section */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Info className="text-purple-400" size={24} />
                        About NASA APOD
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Star size={16} className="text-purple-400" />
                                Data Source
                            </h4>
                            <p className="text-purple-200 text-sm leading-relaxed">
                                This gallery showcases images from NASA's Astronomy Picture of the Day (APOD), 
                                one of the most popular websites at NASA. Each day, a different image or photograph 
                                of our fascinating universe is featured, along with a brief explanation written by 
                                a professional astronomer.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" />
                                Archive History
                            </h4>
                            <p className="text-purple-200 text-sm leading-relaxed">
                                The APOD archive contains over 9,000 images dating back to June 16, 1995. 
                                Each image provides a unique view of space, from distant galaxies and nebulae 
                                to planets in our solar system, captured by telescopes and spacecraft around the world.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Detail Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto py-8"
                    onClick={() => setSelectedImage(null)}
                >
                    <div 
                        className="max-w-6xl w-full bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-purple-500/30 gap-4">
                            <h2 className="text-2xl font-bold text-white flex-1 pt-2">
                                {selectedImage.title}
                            </h2>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg hover:shadow-xl flex-shrink-0"
                                title="Close (ESC or click outside)"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Image/Video */}
                                <div className="lg:col-span-2">
                                    {selectedImage.media_type === 'image' ? (
                                        <img
                                            src={selectedImage.hdurl || selectedImage.url}
                                            alt={selectedImage.title}
                                            className="w-full rounded-lg shadow-2xl"
                                        />
                                    ) : (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                            <iframe
                                                src={selectedImage.url}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title={selectedImage.title}
                                            />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-4">
                                        {selectedImage.media_type === 'image' && selectedImage.hdurl && (
                                            <button
                                                onClick={() => downloadImage(selectedImage.hdurl, selectedImage.title)}
                                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Download size={20} />
                                                Download HD
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleFavorite(selectedImage)}
                                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                                isFavorited(selectedImage)
                                                    ? 'bg-pink-600 hover:bg-pink-700 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                                            }`}
                                        >
                                            <Heart
                                                size={20}
                                                fill={isFavorited(selectedImage) ? 'currentColor' : 'none'}
                                            />
                                            {isFavorited(selectedImage) ? 'Favorited' : 'Add to Favorites'}
                                        </button>
                                        <a
                                            href={selectedImage.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={20} />
                                            Open Original
                                        </a>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                                        <p className="text-purple-300 text-sm mb-2 flex items-center gap-2">
                                            <Calendar size={14} />
                                            Date
                                        </p>
                                        <p className="text-white font-semibold">
                                            {new Date(selectedImage.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                                        <p className="text-purple-300 text-sm mb-2">Media Type</p>
                                        <p className="text-white font-semibold capitalize flex items-center gap-2">
                                            {selectedImage.media_type === 'image' ? (
                                                <Image size={16} className="text-purple-400" />
                                            ) : (
                                                <Video size={16} className="text-blue-400" />
                                            )}
                                            {selectedImage.media_type}
                                        </p>
                                    </div>

                                    {selectedImage.copyright && (
                                        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                                            <p className="text-purple-300 text-sm mb-2">Copyright</p>
                                            <p className="text-white text-sm">
                                                {selectedImage.copyright}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                                        <p className="text-purple-300 text-sm mb-3">Explanation</p>
                                        <p className="text-white text-sm leading-relaxed max-h-96 overflow-y-auto">
                                            {selectedImage.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="bg-slate-900 border-t border-purple-700/50 mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-white font-medium text-lg">
                        Dashboard #8 of 30 Days 30 Dashboards Challenge • NASA Space Gallery
                    </p>
                    <p className="text-purple-300 mt-2">
                        Powered by <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">NASA APOD API</a> • Explore the wonders of the universe through daily astronomy pictures
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-800 flex justify-center">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 backdrop-blur-sm">
                            <p className="text-purple-200 text-sm">
                                Made with ❤️ by{' '}
                                <a 
                                    href="https://github.com/lizardcat" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-medium underline decoration-purple-400/30 hover:decoration-purple-300 underline-offset-2 transition-colors duration-200"
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