import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import api from '../service/api';

function useGetCurrentUser() {
    const dispatch = useDispatch();

    const getCurrentUser = async () => {
        try {
            const result = await api.get("/user/me");
            console.log("Current User:", result.data.data);
            dispatch(setUserData(result.data.data));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    
}

export default useGetCurrentUser
