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
                const userData = result.data.user || result.data;
                dispatch(setUserData(userData));

            } catch (error) {
                console.log(error);  
            }
        }
        fetchUser()
    }, [dispatch])
}

export default getCurrentUser