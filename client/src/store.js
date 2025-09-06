import axios from "axios"
import {create} from "zustand"

export const useAccountStore = create((set) => ({
    account: null,

    fetchAccount: async () => {
        const jwt = localStorage.getItem("jwt")
        if(!jwt) {return}

        try {
            const fetchedAccount = await axios.get('http://localhost:5000/fetchAccount', {headers: {Authorization: `Bearer ${jwt}`}})
            const responseStatusCodes = fetchedAccount.data.statusCodes

            if(responseStatusCodes.includes("S004")) {set({account: fetchedAccount.data.fetchedAccount})}
        } catch (err) {
            console.error(err);
        }
    }
}))