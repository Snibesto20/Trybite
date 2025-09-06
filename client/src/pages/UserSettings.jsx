// Core react imports
import { useState, useEffect, useRef } from "react";

// React component imports
import FormInput from "../components/FormInput"

// External package imports
import {motion} from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom";

// Local module imports
import {validUsernameRegister} from "../../modules/inputValidators"

// Assets imports
import { FaChevronRight } from 'react-icons/fa';

// Global state import
import {useAccountStore} from "../store"

// UserSettings component
export default function UserSettings() {
    const { account } = useAccountStore();
    const navigate = useNavigate()

    const [usernameState, setUsernameState] = useState("neutral")
    const [usernameValue, setUsernameValue] = useState(account?.username || "")
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("")

    const usernameDebounce = useRef(null)
    
    useEffect(() => {
        if (account) {
            setUsernameValue(account.username)
        }
    }, [account])

    if (!account) return;

    function usernameFeedback(username) {
        // Updating state
        setUsernameValue(username)

        // Reseting everything
        clearTimeout(usernameDebounce.current)
        setUsernameState("neutral")
        setUsernameErrorMsg("")

        // Don"t check if the input is empty or equals the current username
        if(username.length == 0 || username === account.username) return

        // Perform frontend checks
        usernameDebounce.current = setTimeout(async () => {
            const clientRes = await validUsernameRegister(username.toLowerCase())
            if(clientRes.state == "error") {
                setUsernameState(clientRes.state)
                setUsernameErrorMsg(clientRes.message)
            }
        }, 700);
    }

    async function changeUsername() {
        // Reseting everything
        clearTimeout(usernameDebounce.current)
        setUsernameState("neutral")
        setUsernameErrorMsg("")


        // Perform frontend checks
        const clientRes = await validUsernameRegister(usernameValue.toLowerCase())
        if(clientRes.state == "error") {
            setUsernameState(clientRes.state)
            setUsernameErrorMsg(clientRes.message)
            return
        }

        // Perform backend checks
        const serverRes = await axios.patch("http://localhost:5000/changeUsername", {username: usernameValue}, {headers: {Authorization: `Bearer ${localStorage.getItem("jwt")}`}})

        // If the checks are correct
        if(serverRes.data.statusCodes.includes("S007")) {
            setUsernameState("success")
            setUsernameErrorMsg("Successfully changed the username!")

            setTimeout(() => {
                setUsernameState("neutral")
                setUsernameErrorMsg("")
            }, 2000);
        }
    }
    return (
        <motion.div className="bg-ivory h-screen px-12" initial={{opacity: 0.6}} animate={{opacity: 1}} transition={{duration: 2}}>
            <div className="flex justify-between items-end fixed top-0 left-0 right-0  bg-neutral-50 lg:mx-14 xl:mx-24 border-b z-50 py-4 select-none">
                <h2 className="font-bold text-2xl">Trybite.</h2>
                <button className="w-5 cursor-pointer" onClick={() => navigate(-1)}>
                    <FaChevronRight className="w-full h-full" />
                </button>
            </div>
            <div className="flex flex-col gap-2 pt-26 mx-12">
                <h1 className="text-2xl font-bold">My profile</h1>
                <form className="flex relative items-end w-100">
                    <FormInput label="Username" inputState={usernameState} onChange={usernameFeedback} maxLength={20} errorMsg={usernameErrorMsg} value={usernameValue} />
                    <button className="h-12.5 w-30 bg-hazel text-white font-semibold cursor-pointer" type="button" onClick={changeUsername}>SAVE</button>
                </form>
            </div>
        </motion.div>
    )
}