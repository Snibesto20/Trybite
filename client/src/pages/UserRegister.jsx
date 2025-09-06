// Core react imports
import { useState, useRef } from "react";

// React component imports
import FormInput from "../components/FormInput"

// External package imports
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom";

// Local module imports
import { validUsernameRegister, validPasswordRegister } from "../../modules/inputValidators"
import { StatusMsg } from "../constants/errorMsg"

// Assets imports
import { FaChevronRight } from "react-icons/fa";

// UserRegister component export
export default function Form() {
    const navigate = useNavigate()
    const [usernameState, setUsernameState] = useState("neutral")
    const [usernameValue, setUsernameValue] = useState("")
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("")

    const [passwordState, setPasswordState] = useState("neutral")
    const [passwordValue, setPasswordValue] = useState("")
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")

    const usernameDebounce = useRef(null)
    const passwordDebounce = useRef(null)
    
    async function registerUser(event) {
        event.preventDefault()
        let clientValid = true

        const usernameResponse = await validUsernameRegister(usernameValue)
        if(usernameResponse.state === "error") {
            setUsernameState(usernameResponse.state)
            setUsernameErrorMsg(usernameResponse.message)
            clientValid = false
        }

        const passwordResponse = await validPasswordRegister(passwordValue)
        if(passwordResponse.state === "error") {
            setPasswordState(passwordResponse.state)
            setPasswordErrorMsg(passwordResponse.message)
            clientValid = false
        }

        if(clientValid) {
            try {
                const submitRes = await axios.post("http://localhost:5000/registerUser", {
                    username: usernameValue.toLowerCase(),
                    password: passwordValue
                })
                localStorage.setItem("jwt", submitRes.data.jwtToken)
                navigate("/")
            } catch (err) {
                const statusCodes = err.response?.data?.statusCodes || []

                if(statusCodes.includes("E009")) { setUsernameState("error"); setUsernameErrorMsg(StatusMsg.E009); return }

                if(statusCodes.includes("E004")) { setUsernameState("error"); setUsernameErrorMsg(StatusMsg.E004)}
                else if(statusCodes.includes("E001")) { setUsernameState("error"); setUsernameErrorMsg(StatusMsg.E001)}
                else if(statusCodes.includes("E002")) { setUsernameState("error"); setUsernameErrorMsg(StatusMsg.E002)}

                if(statusCodes.includes("E010")) { setPasswordState("error"); setPasswordErrorMsg(StatusMsg.E010)}
            }
        }
    }

    async function usernameFeedback(username) {
        setUsernameValue(username)
        if(usernameDebounce.current) clearTimeout(usernameDebounce.current)
        setUsernameState("neutral")
        setUsernameErrorMsg("")

        if(username.length === 0) return

        usernameDebounce.current = setTimeout(async () => {
            const response = await validUsernameRegister(username.toLowerCase())
            if(response.state === "error") {
                setUsernameState(response.state)
                setUsernameErrorMsg(response.message)
            }
        }, 700);
    }

    async function passwordFeedback(password) {
        setPasswordValue(password)
        if(passwordDebounce.current) clearTimeout(passwordDebounce.current)
        setPasswordState("neutral")
        setPasswordErrorMsg("")

        if(password.length === 0) return

        passwordDebounce.current = setTimeout(async () => {
            const response = await validPasswordRegister(password)
            setPasswordState(response.state)
            setPasswordErrorMsg(response.message)
        }, 700);
    }
    return (
        <motion.div className="flex flex-col items-center relative font-medium bg-ivory" initial={{opacity: 0.6}} animate={{opacity: 1}} transition={{duration: 2}}>
            <div className="flex flex-col h-screen w-full px-[10%] sm:px-0 sm:w-96 text-center justify-center -translate-y-10">
                <form onSubmit={registerUser}>
                    <h1 className="text-3xl font-semibold mb-2">REGISTER FOR FREE</h1>
                    <div className="flex flex-col gap-2 mb-8">
                        <FormInput label="Username" inputState={usernameState} onChange={usernameFeedback} maxLength={20} errorMsg={usernameErrorMsg} type="text" />
                        <FormInput label="Password" inputState={passwordState} onChange={passwordFeedback} maxLength={64} errorMsg={passwordErrorMsg} type="password" />
                    </div>

                    <button type="submit" id="submitBtn"
                        className="flex justify-between items-center gap-4 bg-hazel text-ivory p-4 font-semibold text-xl mt-4 w-full cursor-pointer mb-6 hover:bg-ivory outline-2 outline-[#4d3b2c] hover:text-[#4d3b2c]">
                        <p id="submitBtnText">CREATE ACCOUNT</p>
                        <FaChevronRight />
                    </button>
                </form>

                <div className="relative my-3">
                    <hr className="border-t border-espresso" />
                    <span className="absolute left-1/2 transform -translate-x-1/2 top-[-0.7em] bg-ivory px-2 text-espresso">OR</span>
                </div>
                <button id="continueGoogleBtn"
                    className="flex justify-between gap-4 outline-2 text-hazel outline-hazel p-4 font-semibold mt-6 w-full cursor-pointer mb-6 text-xl hover:outline-none hover:text-ivory hover:bg-hazel">
                    <p id="continueGoogleBtnText">CONTINUE WITH GOOGLE</p>
                    <img src="/icons/google-logo.svg" alt="" className="w-8" />
                </button>

                <a href="#" className="inline-block w-fit mx-auto text-terracotta underline font-semibold text-md" onClick={() => navigate("/login")}>Already have an account? Log in</a>
            </div>
        </motion.div>
    )
}
