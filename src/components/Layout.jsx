import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, ChevronDown, Github, CloudSun, TrendingUp, Target, Newspaper, AirVent } from 'lucide-react'

export function Layout({ children }) {
    const location = useLocation()
    const [dropdownOpen, setDropdownOpen] = useState(false)
   
    const completedDashboards = [
        { id: '01', title: 'GitHub Activity', path: '/dashboard-01', icon: Github },
        { id: '02', title: 'Weather Tracker', path: '/dashboard-02', icon: CloudSun },
        { id: '03', title: 'Crypto Portfolio', path: '/dashboard-03', icon: TrendingUp },
        { id: '04', title: 'Stock Watchlist', path: '/dashboard-04', icon: Target },
        { id: '05', title: 'News Hub', path: '/dashboard-05', icon: Newspaper },
        { id: '06', title: 'Air Quality Tracker', path: '/dashboard-06', icon: AirVent },
        { id: '07', title: "COVID-19 Statistics", path: '/dashboard-07', icon: BarChart3}
    ]

    const currentDashboard = completedDashboards.find(d => d.path === location.pathname)
    
    return (
        <div className="min-h-screen bg-dashboard-dark">
            {/* Header */}
            <header className="bg-dashboard-card border-b border-dashboard-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2 text-white hover:text-dashboard-accent transition-colors">
                            <BarChart3 className="h-6 w-6" />
                            <span className="font-bold text-lg">30 Dashboards Challenge</span>
                        </Link>
                       
                        <nav className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    location.pathname === '/'
                                        ? 'bg-dashboard-accent text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                                }`}
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                           
                            {/* Dashboards Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        currentDashboard
                                            ? 'bg-dashboard-accent text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                                    }`}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span>{currentDashboard ? `Dashboard ${currentDashboard.id}` : 'Dashboards'}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-dashboard-card border border-dashboard-border rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-dashboard-border">
                                                Completed Dashboards
                                            </div>
                                            {completedDashboards.map((dashboard) => {
                                                const IconComponent = dashboard.icon
                                                return (
                                                    <Link
                                                        key={dashboard.id}
                                                        to={dashboard.path}
                                                        onClick={() => setDropdownOpen(false)}
                                                        className={`flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${
                                                            location.pathname === dashboard.path
                                                                ? 'bg-dashboard-accent text-white'
                                                                : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                                                        }`}
                                                    >
                                                        <IconComponent className="h-4 w-4" />
                                                        <span>Dashboard {dashboard.id}</span>
                                                        <span className="text-xs text-gray-400">• {dashboard.title}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
           
            {/* Click outside to close dropdown */}
            {dropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                />
            )}
           
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}