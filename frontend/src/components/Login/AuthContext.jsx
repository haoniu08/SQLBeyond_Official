import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import questions from "../../data/questions";
import { useGame } from "../Context/GameContext";

export const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    /**
    * This function handles the registration process , and sends a request to the backend to save the data in the DB
    */
    const register = async (formData) => {
        try {
            const response = await axios.post(`${apiUrl}/account/register`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                password: formData.password
            }, { withCredentials: true });

            const data = response.data;

            if (data.user) {
                setUser(data.user);
                setLoading(false);
                if (!localStorage.getItem("introSeen")) {
                    return navigate("/welcome");
                }
                return navigate("/quiz");
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    /**
    * This function handles the login process
    */
    const login = async (formData) => {
        try {
            const response = await axios.post(`${apiUrl}/account/login`, {
                username: formData.username,
                password: formData.password
            }, { withCredentials: true });

            const data = response.data;

            if (data.user) {
                setUser(data.user);
                setLoading(false);
                if (!localStorage.getItem("introSeen")) {
                    return navigate("/welcome");
                }
                if (response.data.missingQuiz)
                    return navigate("/quiz")

                return navigate("/SQLEditor");
            }
            else {
                alert(data.msg);
                navigate('/');
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    /**
    * This function handles the logout process
    */
    const logout = async () => {
        try {
            await axios.post(`${apiUrl}/account/logout`, {}, { withCredentials: true });
            setUser(null);
            setLoading(true);
            navigate("/");
        }
        catch (err) {
            console.error(err);
        }
    }

    /**
    * This useEffect loads the data for logged in users
    */
    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/account/login`, { withCredentials: true });
                if (response.data) setUser(response.data.user);
                else setUser(null); 
            }
            catch (err) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);