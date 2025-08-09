import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import { Dashboard01 } from './components/dashboards/Dashboard01'
import './index.css'

function App() {
    return (
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard-01" element={<Dashboard01 />} />
            {/* Add more dashboard routes as you build them */}
            {/* <Route path="/dashboard-02" element={<Dashboard02 />} /> */}
            </Routes>
        </Layout>
        </Router>
    )
}

export default App