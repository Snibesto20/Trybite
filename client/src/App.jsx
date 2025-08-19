// Core react imports
import { useEffect } from "react";

// React component imports
import UserRegister from './pages/UserRegister'

// External package imports
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import RecipeBrowser from "./pages/RecipeBrowser";

// App component export
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RecipeBrowser />} />
                <Route path="/register" element={<UserRegister />} />
            </Routes>
        </BrowserRouter>
    )
}