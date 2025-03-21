import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import questions from "../../data/questions";

const GameContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const GameProvider = ({ children }) => {
    const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
    const [hasExecuted, setHasExecuted] = useState(false);
    const user = useAuth().user;

    const [gameData, setGameData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const selectInitialQuestion = () => {
        const questionList = questions["easy"];
        return questionList[Math.floor(Math.random() * questionList.length)];
    }

    /**
    * This function creates a new gameData object for new users, and sends a request to the backend to save the data in the DB
    */
    const setDataNewUser = async (username) => {
        const selectedQuestion = selectInitialQuestion();

        let initialGameData = {
            currentDifficulty: "easy",
            currentQuestion: selectedQuestion,
            points: 0,
            startTime: Date.now(),
            badges: [],
            retryCount: 0,
            usedQuestions: {
                easy: [selectedQuestion.question],
                medium: [],
                hard: [],
            },
            playerPoints: {
                easy: [],
                medium: [],
                hard: [],
            },
            hintsUsedForQuestion: 0,
        };
        setGameData(initialGameData);
        try {
            const response = await axios.post(`${apiUrl}/game/starter-game-data`, {
                username: user.username,
                initialGameData
            }, { withCredentials: true });
            return;
        }
        catch (err) {
            console.error(err);
        }
    }

    /**
    * This function updates the game data, and sends a request to the backend to save the data in the DB
    * @key is an object field
    * @value is the new data to be saved
    */
    const updateGameData = async (key, value) => {
        setGameData((prev) => ({
            ...prev,
            [key]: value,
        }));
        try {
            const response = await axios.post(`${apiUrl}/game/update-game-data`, {
                username: user.username,
                key,
                value
            }, { withCredentials: true });
            return;
        }
        catch (err) {
            console.error(err);
        }
    };

    /**
    * This function updates the game data obejcts, and sends a request to the backend to save the data in the DB
    * @key is an object field
    * @value is the new data to be saved
    */
    const updateGameDataObjects = async (key, value) => {
        setGameData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [gameData.currentDifficulty]: [...prev[key][gameData.currentDifficulty], value]
            }
        }));
        try {
            const response = await axios.post(`${apiUrl}/game/update-game-data-object`, {
                username: user.username,
                key,
                value,
                level: gameData.currentDifficulty
            }, { withCredentials: true });
            return;
        }
        catch (err) {
            console.error(err);
        }
    };

    /**
    * This function resets the game data objects, and sends a request to the backend to save the data in the DB
    * gameData.currentDifficulty specifies which array of level will be reset 
    */
    const resetUsedQuestions = async () => {
        setGameData((prev) => ({
            ...prev,
            usedQuestions: {
                ...prev.usedQuestions,
                [gameData.currentDifficulty]: []
            }
        }));

        try {
            const response = await axios.post(`${apiUrl}/game/reset-game-data-object`, {
                username: user.username,
                key,
                level: gameData.currentDifficulty
            }, { withCredentials: true });
            return;
        }
        catch(err){
            console.error(err);
        }
    }

    /**
    * This function updates the player points and assigns a new level to the player if that's the case
    * @prevPoints is the current player points (before the update)
    * @earnedPoints is the points earned by completing a question
    */
    const updatePoints = (prevPoints, earnedPoints) => {
        const newPoints = prevPoints + earnedPoints;
        if (gameData.currentDifficulty == "easy"
            && newPoints >= 100
            // && gameData.playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 4
        ) {
            updateGameData("currentDifficulty", "medium");
            updateGameData("points", 0);
        }
        else if (gameData.currentDifficulty == "medium"
            && newPoints >= 120
            // this part doesn't seem to be correct
            // && gameData.playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 3
        ) {
            updateGameData("currentDifficulty", "hard");
            updateGameData("points", 0);
        }
        else {
            updateGameData("points", newPoints);
        }
    };

    /**
    * This function retrieves the game data when the user logs in or reloads the page
    */
    const fetchGameData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/game/load-data/${user.username}`, { withCredentials: true });
            if (response.data.gameData)
                setGameData(response.data.gameData.gameData);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    /**
    * This function updates the game data when the user gets new badges
    * NOT FULLY WORKING
    */
    const updateBadges = async (newBadges) => {
        setGameData((prev) => ({
            ...prev,
            "badges": [...newBadges],
        }));

        try {
            const response = await axios.post(`${apiUrl}/game/update-game-data-badges`, {
                username: user.username,
                newBadges
            }, { withCredentials: true });
            return;
        }
        catch(err){
            console.error(err);
        }
    }

    /**
    * This useEffect is used to set up the initial data
    */
    useEffect(() => {
        fetchGameData();
        /** 
        * If there's not gameData available after the call of fetchGameData, this will assume the player is a new user and assign a new game data
        * There might be some other considerations to take place here
        * For example what if fetchGameData fails? 
        */
        if (Object.keys(gameData).length === 0) {
            setDataNewUser();
        }
    }, []);

    return (
        <GameContext.Provider value={{ gameData, loading, error, updateGameData, updatePoints, updateGameDataObjects, resetUsedQuestions, updateBadges }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);