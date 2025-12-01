import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import { Dashboard01 } from './components/dashboards/Dashboard01'
import { Dashboard02 } from './components/dashboards/Dashboard02'
import { Dashboard03 } from './components/dashboards/Dashboard03'
import { Dashboard04 } from './components/dashboards/Dashboard04'
import { Dashboard05 } from './components/dashboards/Dashboard05'
import { Dashboard06 } from './components/dashboards/Dashboard06'
import { Dashboard07 } from './components/dashboards/Dashboard07'
import { Dashboard08 } from './components/dashboards/Dashboard08'
import './index.css'

function App() {
    return (
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard-01" element={<Dashboard01 />} />
            <Route path="/dashboard-02" element={<Dashboard02 />} />
            <Route path="/dashboard-03" element={<Dashboard03 />} />
            <Route path="/dashboard-04" element={<Dashboard04 />} />
            <Route path="/dashboard-05" element={<Dashboard05 />} />
            <Route path="/dashboard-06" element={<Dashboard06 />} />
            <Route path="/dashboard-07" element={<Dashboard07 />} />
            <Route path="/dashboard-08" element={<Dashboard08 />} />
            {/* Add more dashboard routes as you build them */}
            </Routes>
        </Layout>
        </Router>
    )
}

export default App