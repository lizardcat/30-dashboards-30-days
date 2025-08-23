import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3 } from 'lucide-react'

export function Layout({ children }) {
    const location = useLocation()
    
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
                
                <Link 
                    to="/dashboard-01" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard-01' 
                        ? 'bg-dashboard-accent text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                    }`}
                >
                    Dashboard 01
                </Link>
                <Link 
                    to="/dashboard-02" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard-02' 
                        ? 'bg-dashboard-accent text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                    }`}
                >
                    Dashboard 02
                </Link>

                <Link 
                    to="/dashboard-03" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard-03' 
                        ? 'bg-dashboard-accent text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                    }`}
                >
                    Dashboard 03
                </Link>

                <Link 
                    to="/dashboard-04" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard-04' 
                        ? 'bg-dashboard-accent text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                    }`}
                >
                    Dashboard 04
                </Link>
                <Link 
                    to="/dashboard-05" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard-04' 
                        ? 'bg-dashboard-accent text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dashboard-border'
                    }`}
                >
                    Dashboard 05
                </Link>
                </nav>
            </div>
            </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
        </main>
        </div>
    )
}