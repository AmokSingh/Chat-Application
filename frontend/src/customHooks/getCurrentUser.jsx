import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice"
import { useDispatch} from "react-redux"

const getCurrentUser = () => {
    let dispatch = useDispatch()
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(result.data.user))

            } catch (error) {
                console.log(error);  
            }
        }
        fetchUser()
    }, [dispatch])
}

export default getCurrentUser