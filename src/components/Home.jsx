import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Target, TrendingUp, Github, CloudSun, Newspaper, Fan, ChevronDown, ChevronUp, BarChart3, Activity, Rocket, Train, Zap, Globe, Users, ShoppingCart, FolderKanban, Star, ChefHat, BookOpen, Music, CheckSquare, DollarSign, GraduationCap, Heart, MapPin, Utensils, Gamepad2, Leaf, Clock, Trophy } from 'lucide-react'

export function Home() {
    const [showFullList, setShowFullList] = useState(false)

    const dashboards = [
        {
            id: '01',
            title: 'GitHub Activity Tracker',
            description: 'Personal GitHub contribution and repository analytics',
            status: 'completed',
            path: '/dashboard-01',
            icon: Github,
        },
        {
            id: '02',
            title: 'Global Cities Weather Tracker',
            description: 'Real-time weather data for multiple locations in Africa and the rest of the world',
            status: 'completed',
            path: '/dashboard-02',
            icon: CloudSun,
        },
        {
            id: '03',
            title: 'Cryptocurrency Tracker and Portfolio Analyzer',
            description: 'A simple real-time cryptocurrency tracker',
            status: 'completed',
            path: '/dashboard-03',
            icon: TrendingUp,
        },
        {
            id: '04',
            title: 'Stock Market Watchlist',
            description: 'A simple real-time stock market watchlist',
            status: 'completed',
            path: '/dashboard-04',
            icon: Target,
        },
        {
            id: '05',
            title: 'News Aggregator',
            description: 'Real-time global news hub with search and bookmarking',
            status: 'completed',
            path: '/dashboard-05',
            icon: Newspaper,
        },
        {
            id: '06',
            title: 'Air Quality Monitor',
            description: 'Global air quality index tracker',
            status: 'completed',
            path: '/dashboard-06',
            icon: Fan,
        },
        {
            id: '07',
            title: 'COVID-19 Statistics',
            description: 'Regional pandemic data visualization',
            status: 'completed',
            path: '/dashboard-07',
            icon: BarChart3,
        },
        {
            id: '08',
            title: 'NASA Space Gallery',
            description: 'Astronomy picture of the day archive',
            status: 'in-progress',
            path: '/dashboard-08',
            icon: Rocket,
        },
        {
            id: '09',
            title: 'Transit Tracker',
            description: 'Public transportation status and delays',
            status: 'planned',
            path: '/dashboard-09',
            icon: Train,
        },
        {
            id: '10',
            title: 'Energy Consumption',
            description: 'Global energy usage by country',
            status: 'planned',
            path: '/dashboard-10',
            icon: Zap,
        },
        {
            id: '11',
            title: 'Website Analytics',
            description: 'Mock analytics dashboard with insights',
            status: 'planned',
            path: '/dashboard-11',
            icon: BarChart3,
        },
        {
            id: '12',
            title: 'Social Media Metrics',
            description: 'Engagement tracking dashboard',
            status: 'planned',
            path: '/dashboard-12',
            icon: Users,
        },
        {
            id: '13',
            title: 'E-commerce Sales',
            description: 'Sales performance visualization',
            status: 'planned',
            path: '/dashboard-13',
            icon: ShoppingCart,
        },
        {
            id: '14',
            title: 'Project Management',
            description: 'Team productivity and task tracking',
            status: 'planned',
            path: '/dashboard-14',
            icon: FolderKanban,
        },
        {
            id: '15',
            title: 'Movie Ratings Hub',
            description: 'Film ratings from multiple sources',
            status: 'planned',
            path: '/dashboard-15',
            icon: Star,
        },
        {
            id: '16',
            title: 'Recipe Nutrition',
            description: 'Nutritional analysis of recipes',
            status: 'planned',
            path: '/dashboard-16',
            icon: ChefHat,
        },
        {
            id: '17',
            title: 'Fitness Activity',
            description: 'Personal workout and activity tracker',
            status: 'planned',
            path: '/dashboard-17',
            icon: Activity,
        },
        {
            id: '18',
            title: 'Reading Progress',
            description: 'Book tracking and reading analytics',
            status: 'planned',
            path: '/dashboard-18',
            icon: BookOpen,
        },
        {
            id: '19',
            title: 'Music Statistics',
            description: 'Listening habits and music discovery',
            status: 'planned',
            path: '/dashboard-19',
            icon: Music,
        },
        {
            id: '20',
            title: 'Habit Tracker',
            description: 'Daily habit formation and streaks',
            status: 'planned',
            path: '/dashboard-20',
            icon: CheckSquare,
        },
        {
            id: '21',
            title: 'Budget Monitor',
            description: 'Personal finance tracking dashboard',
            status: 'planned',
            path: '/dashboard-21',
            icon: DollarSign,
        },
        {
            id: '22',
            title: 'Learning Progress',
            description: 'Course completion and skill tracking',
            status: 'planned',
            path: '/dashboard-22',
            icon: GraduationCap,
        },
        {
            id: '23',
            title: 'Health Metrics',
            description: 'Wellness and health data visualization',
            status: 'planned',
            path: '/dashboard-23',
            icon: Heart,
        },
        {
            id: '24',
            title: 'Travel Planner',
            description: 'Trip planning and expense tracking',
            status: 'planned',
            path: '/dashboard-24',
            icon: MapPin,
        },
        {
            id: '25',
            title: 'Recipe Collection',
            description: 'Meal planning and grocery lists',
            status: 'planned',
            path: '/dashboard-25',
            icon: Utensils,
        },
        {
            id: '26',
            title: 'Game Statistics',
            description: 'Gaming performance and achievements',
            status: 'planned',
            path: '/dashboard-26',
            icon: Gamepad2,
        },
        {
            id: '27',
            title: 'Plant Care Tracker',
            description: 'Garden and houseplant management',
            status: 'planned',
            path: '/dashboard-27',
            icon: Leaf,
        },
        {
            id: '28',
            title: 'Time Tracker',
            description: 'Productivity and time management',
            status: 'planned',
            path: '/dashboard-28',
            icon: Clock,
        },
        {
            id: '29',
            title: 'Goal Tracker',
            description: 'Personal and professional goal tracking',
            status: 'planned',
            path: '/dashboard-29',
            icon: Trophy,
        },
        {
            id: '30',
            title: 'Challenge Reflection',
            description: 'Analytics of the entire 30-day journey',
            status: 'planned',
            path: '/dashboard-30',
            icon: BarChart3,
        },
    ]
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'in-progress':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'planned':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    const completedCount = dashboards.filter(d => d.status === 'completed').length
    const remainingCount = 30 - completedCount
    
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    30 Dashboards in 30 Days Challenge
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    I'm building functional, data-driven dashboards with free APIs and React. 
                    One dashboard per day or so for 30 days!
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="dashboard-card text-center">
                        <div className="dashboard-stat">{completedCount}</div>
                        <div className="dashboard-label mt-1">Completed</div>
                    </div>
                    <div className="dashboard-card text-center">
                        <div className="dashboard-stat">{remainingCount}</div>
                        <div className="dashboard-label mt-1">Remaining</div>
                    </div>
                    <div className="dashboard-card text-center">
                        <div className="dashboard-stat">{completedCount}</div>
                        <div className="dashboard-label mt-1">Day Streak</div>
                    </div>
                </div>

                {/* Show Full Challenge Button */}
                <div className="mt-8 flex flex-col items-center">
                    <button
                        onClick={() => setShowFullList(!showFullList)}
                        className="bg-dashboard-accent/10 hover:bg-dashboard-accent/20 border border-dashboard-accent/30 hover:border-dashboard-accent/50 text-dashboard-accent font-semibold px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 text-lg"
                    >
                        <span>CLICK HERE TO SEE FULL CHALLENGE LIST</span>
                        {showFullList ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                        }
                    </button>
                </div>
            </div>
            
            {/* Dashboard Grid - Show first 9 or all based on state */}
            <div>
                <h2 className="dashboard-subheader">
                    {showFullList ? 'All 30 Dashboards' : 'Latest Dashboards'}
                </h2>
                
                {showFullList && (
                    <div className="mb-6 flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            ● Completed ({dashboards.filter(d => d.status === 'completed').length})
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            ● In Progress ({dashboards.filter(d => d.status === 'in-progress').length})
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            ● Planned ({dashboards.filter(d => d.status === 'planned').length})
                        </span>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showFullList ? dashboards : dashboards.slice(0, 9)).map((dashboard) => {
                        const IconComponent = dashboard.icon
                        
                        return (
                            <div key={dashboard.id} className="dashboard-card hover:border-dashboard-accent/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {IconComponent && <IconComponent className="h-6 w-6 text-dashboard-accent" />}
                                        <span className="text-sm font-medium text-gray-400">
                                            Dashboard {dashboard.id}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(dashboard.status)}`}>
                                        {dashboard.status}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {dashboard.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {dashboard.description}
                                </p>
                                
                                {dashboard.status === 'completed' ? (
                                    <Link
                                        to={dashboard.path}
                                        className="inline-flex items-center text-dashboard-accent hover:text-blue-300 transition-colors group-hover:underline"
                                    >
                                        View Dashboard →
                                    </Link>
                                ) : dashboard.status === 'in-progress' ? (
                                    <span className="text-yellow-400 text-sm">In Progress...</span>
                                ) : (
                                    <span className="text-gray-500 text-sm">Coming Soon</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {showFullList && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowFullList(false)}
                            className="text-dashboard-accent hover:text-blue-300 transition-colors underline"
                        >
                            Show Less ↑
                        </button>
                    </div>
                )}
            </div>
            
            {/* Challenge Info */}
            <div className="dashboard-card">
                <h2 className="dashboard-subheader">About the Challenge</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                        <Target className="h-6 w-6 text-dashboard-accent mt-1" />
                        <div>
                            <h3 className="font-semibold text-white mb-1">Goal</h3>
                            <p className="text-gray-400 text-sm">
                                The goal is to build 30 functional dashboards using real data sources and Vite + React.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                        <Calendar className="h-6 w-6 text-dashboard-accent mt-1" />
                        <div>
                            <h3 className="font-semibold text-white mb-1">Timeline</h3>
                            <p className="text-gray-400 text-sm">
                                I'm aiming for one dashboard per day for 30 consecutive days and will be documenting the entire process.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                        <TrendingUp className="h-6 w-6 text-dashboard-accent mt-1" />
                        <div>
                            <h3 className="font-semibold text-white mb-1">Learning</h3>
                            <p className="text-gray-400 text-sm">
                                This is purely so I can learn React, API integration, and deployment practices. You can find the repo for this <a href="https://github.com/lizardcat/30-dashboards-30-days">on my GitHub.</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="dashboard-card mt-12">
                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        30 Days 30 Dashboards Challenge • Built with React + Vite
                    </p>
                    
                    {/* Personal Attribution */}
                    <div className="flex justify-center">
                        <div className="bg-dashboard-card border border-dashboard-border rounded-lg px-4 py-3">
                            <p className="text-gray-300 text-sm">
                                Made with ❤️ by{' '}
                                <a 
                                    href="https://github.com/lizardcat" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-dashboard-accent hover:text-blue-300 font-medium underline decoration-dashboard-accent/30 hover:decoration-blue-300 underline-offset-2 transition-colors duration-200"
                                >
                                    Alex Raza
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}