import { Link } from 'react-router-dom'
import { Calendar, Target, TrendingUp, Github, CloudSun } from 'lucide-react'

export function Home() {
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
        description: 'Real-time weather data for multiple locations in Africa',
        status: 'completed',
        path: '/dashboard-02',
        icon: CloudSun,
        },
        {
        id: '03',
        title: 'Cryptocurrency Tracker and Portfolio Analyzer',
        description: 'A simple real-time cryptocurrency tracker',
        status: 'in-progress',
        path: '/dashboard-03',
        icon: TrendingUp,
        },
        // add more dashboards here
    ]
    
    const getStatusBadge = (status) => {
        switch (status) {
        case 'completed':
            return 'bg-green-500/20 text-green-400 border-green-500/30'
        case 'in-progress':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }
    
    return (
        <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
            30 Dashboards in 30 Days Challenge
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Building functional, data-driven dashboards with real APIs and React. 
            One dashboard per day for 30 days.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="dashboard-card text-center">
                <div className="dashboard-stat">2</div>
                <div className="dashboard-label mt-1">Completed</div>
            </div>
            <div className="dashboard-card text-center">
                <div className="dashboard-stat">28</div>
                <div className="dashboard-label mt-1">Remaining</div>
            </div>
            <div className="dashboard-card text-center">
                <div className="dashboard-stat">2</div>
                <div className="dashboard-label mt-1">Day Streak</div>
            </div>
            </div>
        </div>
        
        {/* Dashboard Grid */}
        <div>
            <h2 className="dashboard-subheader">All Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => {
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
                    ) : (
                    <span className="text-gray-500 text-sm">Coming Soon</span>
                    )}
                </div>
                )
            })}
            </div>
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
                    The goal is to build 30 functional dashboards using real data sources and modern web technologies.
                </p>
                </div>
            </div>
            
            <div className="flex items-start space-x-3">
                <Calendar className="h-6 w-6 text-dashboard-accent mt-1" />
                <div>
                <h3 className="font-semibold text-white mb-1">Timeline</h3>
                <p className="text-gray-400 text-sm">
                    I'm aiming for one dashboard per day for 30 consecutive days, documenting the entire process.
                </p>
                </div>
            </div>
            
            <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-dashboard-accent mt-1" />
                <div>
                <h3 className="font-semibold text-white mb-1">Learning</h3>
                <p className="text-gray-400 text-sm">
                    This is purely so I can master React, API integration, and deployment practices. You can find the repo for this <a href="https://github.com/lizardcat/30-dashboards-30-days">on my GitHub.</a>
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}