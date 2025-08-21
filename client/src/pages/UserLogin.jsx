// Core react imports
import { useState, useRef } from "react";

// React component imports
import FormInput from "../components/FormInput"

// External package imports
import {motion} from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom";

// Assets imports
import { FaChevronRight } from "react-icons/fa";

// UserLogin component export
export default function Form() {
    // Essential variables declaration
    const navigate = useNavigate()
    const [usernameState, setUsernameState] = useState("neutral")
    const [usernameValue, setUsernameValue] = useState("")
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("")

    const [passwordState, setPasswordState] = useState("neutral")
    const [passwordValue, setPasswordValue] = useState("")
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")

    // Function Initialization
    async function loginUser(event) {
        // Preventing default behaviour
        event.preventDefault()

        // If the login is successful
        try {
            const submitRes = await axios.post("http://localhost:5000/loginUser", {username: usernameValue, password: passwordValue})
            navigate("/")
            localStorage.setItem("jwt", submitRes.data.jwtToken)
        } catch (err) {
            setUsernameState("error")
            setPasswordState("error")
            if(err.response.data.statusCodes.includes("E012")) {
                setUsernameErrorMsg("Username or password is incorrect!")
                setPasswordErrorMsg("Username or password is incorrect!")
            }
            else if(err.response.data.statusCodes.includes("E009")) {
                setUsernameErrorMsg("An unexpected error occurred, trys again later!")
                setPasswordErrorMsg("An unexpected error occurred, try again later!")
            }
        }
    }

    function neutralizeInputs() {
        setUsernameState("neutral")
        setPasswordState("neutral")
        setUsernameErrorMsg("")
        setPasswordErrorMsg("")
    }
    return (
        <motion.div className="flex flex-col items-center relative font-medium bg-ivory" initial={{opacity: 0.6}} animate={{opacity: 1}} transition={{duration: 2}}>
            <div className="flex flex-col h-screen w-full px-[10%] sm:px-0 sm:w-96 text-center justify-center -translate-y-10">
                <form onSubmit={loginUser}>
                    <h1 className="text-3xl font-semibold mb-2">
                        WELCOME BACK, READY TO COOK?
                    </h1>
                    <div className="flex flex-col gap-2 mb-8">
                        <FormInput label="Username" inputState={usernameState} onChange={setUsernameValue} onFocus={neutralizeInputs} maxLength={20} errorMsg={usernameErrorMsg} type="text" />
                        <FormInput label="Password" inputState={passwordState} onChange={setPasswordValue} onFocus={neutralizeInputs} maxLength={64} errorMsg={passwordErrorMsg} type="password" />
                    </div>

                    <button type="submit" id="submitBtn"
                        className="flex justify-between items-center gap-4 bg-hazel text-ivory p-4 font-semibold text-xl mt-4 w-full cursor-pointer mb-6 hover:bg-ivory outline-2 outline-[#4d3b2c] hover:text-[#4d3b2c]">
                        <p id="submitBtnText">
                            LOGIN
                        </p>
                        <FaChevronRight />
                    </button>
                </form>

                <div className="relative my-3">
                    <hr className="border-t border-espresso" />
                    <span
                        className="absolute left-1/2 transform -translate-x-1/2 top-[-0.7em] bg-ivory px-2 text-espresso">OR</span>
                </div>
                <button id="continueGoogleBtn"
                    className="flex justify-between gap-4 outline-2 text-hazel outline-hazel p-4 font-semibold mt-6 w-full cursor-pointer mb-6 text-xl hover:outline-none hover:text-ivory hover:bg-hazel">
                    <p id="continueGoogleBtnText">LOG IN WITH GOOGLE</p>
                    <img src="/icons/google-logo.svg" alt="" className="w-8" />
                </button>

                <a href="#" className="inline-block w-fit mx-auto text-terracotta underline font-semibold text-md" onClick={() => navigate("/register")}>Don't have an account? Register</a>
            </div>
        </motion.div>
    )
}