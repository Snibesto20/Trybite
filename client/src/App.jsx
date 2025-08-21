// Core react imports
import { useEffect } from "react";

// React component imports
import UserRegister from "./pages/UserRegister"
import UserLogin from "./pages/UserLogin"
import RecipeBrowser from "./pages/RecipeBrowser";

// External package imports
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// Global state import
import {useAccountStore} from "./store"

// App component export
export default function App() {
    // Global state fetch
    const { fetchAccount } = useAccountStore()
    useEffect(() => { fetchAccount() }, [])
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RecipeBrowser />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/login" element={<UserLogin />} />
            </Routes>
        </BrowserRouter>
    )
}