// Core react imports
import { useState, useRef } from "react";

// React component imports
import FormInput from "../components/FormInput"

// External package imports
import {motion} from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom";

// Local module imports
import {validUsernameRegister, validPasswordRegister} from "../../modules/inputValidators"

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

    const usernameDebounce = useRef(null)
    const passwordDebounce = useRef(null)
    
    // Function Initialization
    async function submitForm(event) {
        // Preventing default behaviour
        event.preventDefault()

        // Determines if the request proceeds to server
        let clientError = false

        // Form inputs checked by frontend filters
        const usernameResponse = validUsernameRegister(usernameValue)
        if(usernameResponse.state == "error") {
            setUsernameState(usernameResponse.state)
            setUsernameErrorMsg(usernameResponse.message)
            clientError = true
        }

        const passwordResponse = validPasswordRegister(passwordValue)
        if(passwordResponse.state == "error") {
            setPasswordState(passwordResponse.state)
            setPasswordErrorMsg(passwordResponse.message)
            clientError = true
        }

        // Request proceeds to server
        if(!clientError) {
            // If the account creation is successful
            const submitRes = await axios.post("http://localhost:5000/registerUser", {username: usernameValue, password: passwordValue})
            if(submitRes.data.statusCodes.includes("S002") && submitRes.status === 201) {
                navigate("/")
                localStorage.setItem("jwt", submitRes.data.jwtToken)
            }

            // If the account creation is unsuccessful
            else if(submitRes.data.statusCodes.includes("E011")) {
                setUsernameState("error")
                setUsernameErrorMsg("Do not malform requests!")
                setPasswordState("error")
                setPasswordErrorMsg("Do not malform requests!")
            }
        }
    }

    function usernameFeedback(username) {
        // Updating state
        setUsernameValue(username)

        // Reseting everything
        clearTimeout(usernameDebounce.current)
        setUsernameState("neutral")
        setUsernameErrorMsg("")

        // Don"t check if the input is empty
        if(username.length == 0) return

        usernameDebounce.current = setTimeout(async () => {
            const response = await validUsernameRegister(username)
            if(response.state == "error") {
                setUsernameState(response.state)
                setUsernameErrorMsg(response.message)
            }
        }, 700);
    }

    async function passwordFeedback(password) {
        // Updating state
        setPasswordValue(password)

        // Reseting everything
        clearTimeout(passwordDebounce.current)
        setPasswordState("neutral")
        setPasswordErrorMsg("")

        // Don"t check if the input is empty
        if(password.length == 0) return

        passwordDebounce.current = setTimeout(() => {
            const response = validPasswordRegister(password)
            setPasswordState(response.state)
            setPasswordErrorMsg(response.message)
        }, 700);
    }

    return (
        <motion.div className="flex flex-col items-center relative font-medium bg-ivory" initial={{opacity: 0.6}} animate={{opacity: 1}} transition={{duration: 2}}>
            <div className="flex flex-col h-screen w-full px-[10%] sm:px-0 sm:w-96 text-center justify-center -translate-y-10">
                <form onSubmit={submitForm}>
                    <h1 className="text-3xl font-semibold mb-2">
                        REGISTER FOR FREE
                    </h1>
                    <div className="flex flex-col gap-2 mb-8">
                        <FormInput label="Username" inputState={usernameState} onChange={usernameFeedback} maxLength={20} errorMsg={usernameErrorMsg} type="text" />
                        <FormInput label="Password" inputState={passwordState} onChange={passwordFeedback} maxLength={64} errorMsg={passwordErrorMsg} type="password" />
                    </div>

                    <button type="submit" id="submitBtn"
                        className="flex justify-between items-center gap-4 bg-hazel text-ivory p-4 font-semibold text-xl mt-4 w-full cursor-pointer mb-6 hover:bg-ivory outline-2 outline-[#4d3b2c] hover:text-[#4d3b2c]">
                        <p id="submitBtnText">
                            CREATE ACCOUNT
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
                    <p id="continueGoogleBtnText">CONTINUE WITH GOOGLE</p>
                    <img src="/icons/google-logo.svg" alt="" className="w-8" />
                </button>

                <a href="#" className="inline-block w-fit mx-auto text-terracotta underline font-semibold text-md">Already have
                    an account? Log in</a>
            </div>
        </motion.div>
    )
}