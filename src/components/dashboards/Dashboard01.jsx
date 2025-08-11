import { useState, useEffect } from 'react'
import { Github, Star, GitFork, Eye, Calendar, TrendingUp, Code, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export function Dashboard01() {
  const [username, setUsername] = useState('lizardcat') // Default GitHub user
  const [userData, setUserData] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGitHubData = async (user) => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${user}`)
      if (!userResponse.ok) throw new Error('User not found')
      const userInfo = await userResponse.json()
      
      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=10`)
      const reposData = await reposResponse.json()
      
      // Fetch recent events
      const eventsResponse = await fetch(`https://api.github.com/users/${user}/events?per_page=30`)
      const eventsData = await eventsResponse.json()
      
      setUserData(userInfo)
      setRepos(reposData)
      setEvents(eventsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubData(username)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      fetchGitHubData(username.trim())
    }
  }

  // Process language data
  const getLanguageData = () => {
    const languages = {}
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })
    return Object.entries(languages).map(([name, value]) => ({ name, value }))
  }

  // Process activity data (commits by date)
  const getActivityData = () => {
    const activityMap = {}
    events
      .filter(event => event.type === 'PushEvent')
      .forEach(event => {
        const date = new Date(event.created_at).toLocaleDateString()
        activityMap[date] = (activityMap[date] || 0) + (event.payload.commits?.length || 1)
      })
    
    return Object.entries(activityMap)
      .slice(-7) // Last 7 days
      .map(([date, commits]) => ({ date, commits }))
  }

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Github className="h-12 w-12 text-dashboard-accent animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading GitHub data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="dashboard-header flex items-center gap-3">
            <Github className="h-8 w-8 text-dashboard-accent" />
            GitHub Activity Tracker
          </h1>
          <p className="text-gray-400">Track GitHub user activity, repositories, and contributions</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dashboard-accent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-dashboard-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="dashboard-card bg-red-500/10 border-red-500/20">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {userData && (
        <>
          {/* User Profile */}
          <div className="dashboard-card">
            <div className="flex items-start gap-6">
              <img
                src={userData.avatar_url}
                alt={`${userData.login}'s avatar`}
                className="w-20 h-20 rounded-full border-2 border-dashboard-border"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{userData.name || userData.login}</h2>
                    <p className="text-dashboard-accent">@{userData.login}</p>
                    {userData.bio && <p className="text-gray-400 mt-2">{userData.bio}</p>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {userData.followers} followers
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="dashboard-card text-center">
              <div className="dashboard-stat">{userData.public_repos}</div>
              <div className="dashboard-label mt-1">Public Repos</div>
            </div>
            <div className="dashboard-card text-center">
              <div className="dashboard-stat">{userData.followers}</div>
              <div className="dashboard-label mt-1">Followers</div>
            </div>
            <div className="dashboard-card text-center">
              <div className="dashboard-stat">{userData.following}</div>
              <div className="dashboard-label mt-1">Following</div>
            </div>
            <div className="dashboard-card text-center">
              <div className="dashboard-stat">{repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}</div>
              <div className="dashboard-label mt-1">Total Stars</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <div className="dashboard-card">
              <h3 className="dashboard-subheader">Language Distribution</h3>
              {getLanguageData().length > 0 ? (
                <div className="space-y-4">
                  {/* Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getLanguageData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {getLanguageData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={languageColors[entry.name] || '#8884d8'} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {getLanguageData().map((lang, index) => (
                      <div key={lang.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: languageColors[lang.name] || '#8884d8' }}
                        />
                        <span className="text-sm text-gray-300">{lang.name}</span>
                        <span className="text-sm text-gray-500">({lang.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400">No language data available</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card">
              <h3 className="dashboard-subheader">Recent Commits</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getActivityData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Repositories */}
          <div className="dashboard-card">
            <h3 className="dashboard-subheader">Top Repositories</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {repos.slice(0, 6).map((repo) => (
                <div key={repo.id} className="border border-dashboard-border rounded-lg p-4 hover:border-dashboard-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white truncate">{repo.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400 ml-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks_count}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {repo.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {repo.language && (
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: languageColors[repo.language] || '#8884d8' }}
                        />
                      )}
                      <span className="text-sm text-gray-400">{repo.language}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}