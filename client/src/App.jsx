// Secondary package imports
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// App component export
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Client</h1>} />
            </Routes>
        </BrowserRouter>
    )
}