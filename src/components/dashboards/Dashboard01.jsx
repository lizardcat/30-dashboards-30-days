import { useState, useEffect } from 'react'
import {
  Github, Star, GitFork, Eye, Calendar, TrendingUp, Code,
  ExternalLink, Clock, GitCommit, BookOpen, Activity, Search,
  Zap, Globe, MapPin, Mail, Building
} from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

export function Dashboard01() {
  const [username, setUsername] = useState('lizardcat')
  const [userData, setUserData] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [gists, setGists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [repoFilter, setRepoFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchGitHubData = async (user) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${user}`)
      if (!userResponse.ok) throw new Error('User not found')
      const userInfo = await userResponse.json()

      // Fetch repositories with more data
      const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?sort=${sortBy}&per_page=100`)
      const reposData = await reposResponse.json()

      // Fetch recent events (limited to ~30 days by GitHub API)
      const eventsResponse = await fetch(`https://api.github.com/users/${user}/events?per_page=100`)
      const eventsData = await eventsResponse.json()

      // Fetch organizations
      const orgsResponse = await fetch(`https://api.github.com/users/${user}/orgs`)
      const orgsData = await orgsResponse.json()

      // Fetch gists
      const gistsResponse = await fetch(`https://api.github.com/users/${user}/gists?per_page=20`)
      const gistsData = await gistsResponse.json()

      setUserData(userInfo)
      setRepos(reposData)
      setEvents(eventsData)
      setOrganizations(orgsData)
      setGists(gistsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubData(username)
  }, [sortBy])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      fetchGitHubData(username.trim())
    }
  }

  // data processing
  const getLanguageData = () => {
    const languages = {}
    const filteredRepos = getFilteredRepos()

    filteredRepos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = {
          count: (languages[repo.language]?.count || 0) + 1,
          stars: (languages[repo.language]?.stars || 0) + repo.stargazers_count,
          size: (languages[repo.language]?.size || 0) + repo.size
        }
      }
    })

    return Object.entries(languages)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }

  const getActivityData = () => {
    const activityMap = {}
    events
      .filter(event => ['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent'].includes(event.type))
      .forEach(event => {
        const date = new Date(event.created_at).toLocaleDateString()
        activityMap[date] = (activityMap[date] || 0) + 1
      })

    return Object.entries(activityMap)
      .slice(-14)
      .map(([date, activity]) => ({ date, activity }))
  }

  const getRepoStats = () => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)
    const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0)
    const totalSize = repos.reduce((sum, repo) => sum + repo.size, 0)

    return { totalStars, totalForks, totalWatchers, totalSize }
  }

  const getTopRepos = (metric = 'stars') => {
    return [...repos]
      .filter(repo => !repo.fork || repoFilter === 'all')
      .sort((a, b) => {
        switch(metric) {
          case 'stars': return b.stargazers_count - a.stargazers_count
          case 'forks': return b.forks_count - a.forks_count
          case 'updated': return new Date(b.updated_at) - new Date(a.updated_at)
          case 'size': return b.size - a.size
          default: return 0
        }
      })
      .slice(0, 6)
  }

  const getFilteredRepos = () => {
    let filtered = repos

    if (repoFilter === 'original') {
      filtered = filtered.filter(repo => !repo.fork)
    } else if (repoFilter === 'forks') {
      filtered = filtered.filter(repo => repo.fork)
    }

    if (searchTerm) {
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered
  }

  const getEventTypeStats = () => {
    const eventTypes = {}
    events.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1
    })

    return Object.entries(eventTypes)
      .map(([type, count]) => ({ type: type.replace('Event', ''), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
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
    PHP: '#4F5D95',
    Shell: '#89e051',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Github className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading GitHub data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Github className="h-8 w-8 text-blue-400" />
              GitHub Analytics Dashboard
            </h1>
            <p className="text-gray-400">GitHub user activity, repository insights, and contribution tracking</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {userData && (
          <>
            {/* User Profile */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <img
                  src={userData.avatar_url}
                  alt={`${userData.login}'s avatar`}
                  className="w-24 h-24 rounded-full border-2 border-blue-400"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{userData.name || userData.login}</h2>
                      <p className="text-blue-400 text-lg">@{userData.login}</p>
                      {userData.bio && <p className="text-gray-300 mt-2 max-w-2xl">{userData.bio}</p>}
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                        {userData.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {userData.location}
                          </div>
                        )}
                        {userData.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {userData.email}
                          </div>
                        )}
                        {userData.company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {userData.company}
                          </div>
                        )}
                        {userData.blog && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <a href={userData.blog} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{userData.followers}</div>
                        <div className="text-gray-400">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{userData.following}</div>
                        <div className="text-gray-400">Following</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{organizations.length}</div>
                        <div className="text-gray-400">Organizations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(userData.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last updated {new Date(userData.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-700">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'repositories', label: 'Repositories', icon: Code },
                { id: 'activity', label: 'Activity', icon: GitCommit }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Stats Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Public Repos', value: userData.public_repos, icon: Code, color: 'blue' },
                    { label: 'Total Stars', value: getRepoStats().totalStars, icon: Star, color: 'yellow' },
                    { label: 'Total Forks', value: getRepoStats().totalForks, icon: GitFork, color: 'green' },
                    { label: 'Watchers', value: getRepoStats().totalWatchers, icon: Eye, color: 'purple' },
                    { label: 'Gists', value: userData.public_gists, icon: BookOpen, color: 'pink' },
                    { label: 'Total Size', value: `${(getRepoStats().totalSize / 1024).toFixed(1)}MB`, icon: TrendingUp, color: 'orange' }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                        <Icon className={`h-6 w-6 mx-auto mb-2 text-${stat.color}-400`} />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Language Distribution */}
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-400" />
                      Language Distribution
                    </h3>
                    {getLanguageData().length > 0 ? (
                      <div className="space-y-4">
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
                                dataKey="count"
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
                                formatter={(value, name, props) => [
                                  `${value} repos`,
                                  `${props.payload.name}`
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {getLanguageData().map((lang, index) => (
                            <div key={lang.name} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: languageColors[lang.name] || '#8884d8' }}
                              />
                              <span className="text-sm text-gray-300 truncate">{lang.name}</span>
                              <span className="text-sm text-gray-500">({lang.count})</span>
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

                  {/* Activity Timeline */}
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-400" />
                      Recent Activity
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getActivityData()}>
                          <defs>
                            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#94a3b8"
                            fontSize={12}
                            tick={{ fill: '#94a3b8' }}
                          />
                          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #334155',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="activity" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#activityGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Event Types */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Activity Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {getEventTypeStats().map((event, index) => (
                      <div key={event.type} className="text-center p-4 bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{event.count}</div>
                        <div className="text-sm text-gray-400">{event.type}s</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Repositories Tab */}
            {activeTab === 'repositories' && (
              <div className="space-y-6">
                {/* Repository Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Repos' },
                      { id: 'original', label: 'Original' },
                      { id: 'forks', label: 'Forks' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setRepoFilter(filter.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          repoFilter === filter.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="updated">Recently Updated</option>
                      <option value="pushed">Recently Pushed</option>
                      <option value="created">Recently Created</option>
                      <option value="full_name">Name</option>
                    </select>
                  </div>
                </div>

                {/* Repository Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {getFilteredRepos().slice(0, 12).map((repo) => (
                    <div key={repo.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-400/50 transition-all hover:shadow-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white truncate mb-1 flex items-center gap-2">
                            {repo.name}
                            {repo.fork && <span className="text-xs bg-slate-600 text-gray-300 px-2 py-0.5 rounded">Fork</span>}
                            {repo.private && <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded">Private</span>}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {repo.description || 'No description available'}
                          </p>
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors ml-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <span 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: languageColors[repo.language] || '#8884d8' }}
                              />
                              <span className="text-gray-400">{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {repo.watchers_count}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4">Recent Events</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {events.slice(0, 20).map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {event.type === 'PushEvent' && <GitCommit className="h-4 w-4 text-green-400" />}
                          {event.type === 'CreateEvent' && <Code className="h-4 w-4 text-blue-400" />}
                          {event.type === 'IssuesEvent' && <BookOpen className="h-4 w-4 text-yellow-400" />}
                          {event.type === 'PullRequestEvent' && <GitFork className="h-4 w-4 text-purple-400" />}
                          {event.type === 'WatchEvent' && <Eye className="h-4 w-4 text-pink-400" />}
                          {!['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent', 'WatchEvent'].includes(event.type) && 
                            <Activity className="h-4 w-4 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{event.type.replace('Event', '')}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(event.created_at).toLocaleDateString()} at {new Date(event.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            <span className="text-blue-400">{event.repo.name}</span>
                            {event.type === 'PushEvent' && event.payload.commits && 
                              ` - ${event.payload.commits.length} commit${event.payload.commits.length !== 1 ? 's' : ''}`
                            }
                            {event.type === 'CreateEvent' && ` - Created ${event.payload.ref_type}`}
                            {event.type === 'IssuesEvent' && ` - ${event.payload.action} issue`}
                            {event.type === 'PullRequestEvent' && ` - ${event.payload.action} pull request`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Organizations */}
            {organizations.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-400" />
                  Organizations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="text-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                      <img
                        src={org.avatar_url}
                        alt={org.login}
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                      />
                      <p className="text-sm text-white font-medium">{org.login}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gists */}
            {gists.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-pink-400" />
                  Recent Gists
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gists.slice(0, 6).map((gist) => (
                    <div key={gist.id} className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white truncate">
                          {Object.keys(gist.files)[0] || 'Untitled'}
                        </h4>
                        <a
                          href={gist.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-400 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {gist.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{gist.public ? 'Public' : 'Secret'}</span>
                        <span>{new Date(gist.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
