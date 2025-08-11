import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import { Dashboard01 } from './components/dashboards/Dashboard01'
import { Dashboard02 } from './components/dashboards/Dashboard02'
import { Dashboard03 } from './components/dashboards/Dashboard03'
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
            {/* Add more dashboard routes as you build them */}
            {/* <Route path="/dashboard-02" element={<Dashboard02 />} /> */}
            </Routes>
        </Layout>
        </Router>
    )
}

export default App