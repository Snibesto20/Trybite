// Core react imports
import { useState, useEffect, useRef } from "react"

// Secondary package imports
import {motion} from "framer-motion"
import { useNavigate } from "react-router-dom"

// Local module imports
import { logout } from "../modules/logout"

// Assets import
import { FaBars, FaCog, FaSearch, FaSignOutAlt } from "react-icons/fa";
import {useAccountStore} from "../store"

export default function RecipeNavbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchDFocused, setSearchDFocused] = useState(false)
    const [searchMFocused, setSearchMFocused] = useState(false)
    const [btn1Hover, setBtn1Hover] = useState(false)
    const [btn2Hover, setBtn2Hover] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()
    const { account } = useAccountStore()
    
    useEffect(() => { if (searchMFocused) searchRef.current?.focus() }, [searchMFocused])

    return (
        <div>
            {/* Desktop */}
            <div className="md:flex hidden gap-2 justify-between items-center fixed top-0 left-0 right-0 mx-12 lg:mx-14 xl:mx-24 border-b z-50 py-4 select-none bg-ivory">
                <h2 className="font-bold text-2xl static">Trybite.</h2>
                <motion.div className={`relative w-2/5 lg:w-100 hidden sm:flex`} onFocus={() => setSearchDFocused(true)} onBlur={() => setSearchDFocused(false)} initial={{scale: 1}} animate={{ scale: searchDFocused ? 1.05 : 1 }}>
                    <FaSearch className={`absolute bottom-1.5 left-2 h-5 w-5 ${searchDFocused && "hidden"}`} />
                    <input type="text" className={`border rounded-sm px-2 py-1 outline-0 w-full text-terracotta ${searchDFocused ? "border-terracotta" : "border-espresso"}`} />
                </motion.div>
                <div className="relative flex items-center gap-5">
                    <h4 className={`font-semibold hidden lg:flex`}>{account ? account.displayName : null}</h4>
                    <button className={`cursor-pointer h-6 ${account ? "block" : "hidden"}`} onClick={() => setMenuOpen(prev => !prev)}><FaBars className="h-full w-full" /></button>
                    <div className={`absolute w-43 right-0 -bottom-23 bg-ivory ${menuOpen ? "block" : "hidden"}`}>
                        <button className="flex w-full cursor-pointer items-center justify-between border-b px-3 py-2 pr-0" onClick={() => navigate("account/settings")} onMouseOver={() => setBtn2Hover(true)} onMouseOut={() => setBtn2Hover(false)}>
                            <span className={`${btn2Hover ? "text-terracotta underline" : null}`}>Settings</span>
                            <FaCog className={`${btn2Hover ? "text-terracotta terracotta" : null}`} />
                        </button>
                        <button className="flex w-full cursor-pointer items-center justify-between border-b px-3 py-2 pr-0" onClick={() => logout(navigate)} onMouseOver={() => setBtn1Hover(true)} onMouseOut={() => setBtn1Hover(false)}>
                            <span className={`${btn1Hover ? "text-terracotta underline" : null}`}>Logout</span>
                            <FaSignOutAlt className={`${btn1Hover ? "text-terracotta underline" : null}`} />
                        </button>
                    </div>
                </div>
                <div className={`${account ? "hidden" : "block"}`}><motion.button className="border px-2 py-1 font-semibold rounded-sm cursor-pointer" onClick={() => navigate("/register")}>Prisijungti</motion.button></div>
            </div>

            {/* Mobile */}
            <div className="flex gap-2 justify-between items-start fixed top-0 left-0 right-0 px-5 md:hidden border-b z-50 py-4 select-none bg-ivory">
                <h2 className={`font-bold text-2xl ${searchMFocused && "hidden"}`}>Trybite.</h2>
                <div className={`flex gap-5 ${searchMFocused && "hidden"}`}>
                    <motion.button className="flex rounded-4xl border p-2" onClick={() => setSearchMFocused(true)}><FaSearch className="h-5 w-5" /></motion.button>
                    <div className="flex items-center">
                        <button className={`cursor-pointer h-6 ${account ? "block" : "hidden"}`} onClick={() => setMenuOpen(prev => !prev)}><FaBars className="h-full w-full" /></button>
                        <div className={`absolute left-0 w-full px-5 -bottom-32 bg-ivory ${menuOpen ? "block" : "hidden"}`}>
                            <button className="flex w-full cursor-pointer items-center justify-between border-b p-1 py-5 pr-0" onClick={() => navigate("account/settings")} onMouseOver={() => setBtn2Hover(true)} onMouseOut={() => setBtn2Hover(false)}><span className={`${btn2Hover ? "text-terracotta underline" : null}`}>Settings</span><FaCog className={`${btn2Hover ? "text-terracotta terracotta" : null}`} /></button>
                            <button className="flex w-full cursor-pointer items-center justify-between border-b p-1 py-5 pr-0" onClick={() => logout(navigate)} onMouseOver={() => setBtn1Hover(true)} onMouseOut={() => setBtn1Hover(false)}><span className={`${btn1Hover ? "text-terracotta underline" : null}`}>Logout</span><FaSignOutAlt className={`${btn1Hover ? "text-terracotta underline" : null}`} /></button>
                        </div>
                    </div>
                    <div className={`${account ? "hidden" : "block"}`}><motion.button className="border px-2 py-1 font-semibold rounded-sm cursor-pointer" onClick={() => navigate("/register")}>Prisijungti</motion.button></div>
                </div>
                <div className={`${searchMFocused ? "flex" : "hidden"} w-full h-9.5`}>
                    <motion.input type="text" ref={searchRef} className="border rounded-sm px-2 py-1 outline-0 w-full text-terracotta border-terracotta" onBlur={() => {setSearchMFocused(false); setMenuOpen(false)}} initial={{scale: 1}} animate={{scale: searchMFocused ? 1.05 : 1}} />
                </div>
            </div>
        </div>
    )
}
