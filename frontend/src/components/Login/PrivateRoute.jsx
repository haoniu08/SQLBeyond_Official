import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../Login/AuthContext";
import { useGame } from "../Context/GameContext";
import GameProvider from "../Context/GameContext";

const PrivateRoute = () => {
    const { user, loading: userLoading } = useAuth();

    // Wait until user is loaded
    if (userLoading) {
        return (
            <div className="loading-page">
                <p>We are loading your data :)</p>
                <p>If you are not logged in yet, please login <Link to="/">here</Link></p>
            </div>
        );
    }

    // If no user, redirect to login
    if (!user) return <Navigate to="/" />;

    // Wrap everything inside GameProvider
    return (
        <GameProvider>
            <GameLoader />
        </GameProvider>
    );
};

const GameLoader = () => {
    const { loading: gameLoading } = useGame();
    // Wait until game data is loaded
    if (gameLoading) {
        return (
            <div className="loading-page">
                <p>Loading game data...</p>
            </div>
        );
    }
    // Once everything is loaded, render the protected routes
    return <Outlet />;
};

export default PrivateRoute;
