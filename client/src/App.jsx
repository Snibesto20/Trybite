// Core react imports
import { useEffect } from "react";

// React component imports
import UserRegister from './pages/UserRegister'

// External package imports
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// App component export
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<UserRegister />} />
            </Routes>
        </BrowserRouter>
    )
}