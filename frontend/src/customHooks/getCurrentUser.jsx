import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice"
import { useDispatch, useSelector } from "react-redux"

const getCurrentUser = () => {
    let dispatch = useDispatch()
    let userData = useSelector(state => state.user.userData)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(result.data))

            } catch (error) {
                console.log(error);  
            }
        }
        fetchUser()
    }, [userData])
}

export default getCurrentUser