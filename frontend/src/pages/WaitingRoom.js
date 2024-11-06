import './page-styles/WaitingRoom.css';
import React, { useEffect, useState } from "react";
import CreateSessionForm from "../components/CreateSessionForm";
import useQuestions from "../hooks/useQuestions";
import { useAuth } from "../context/AuthContext";
import {
    closeSocket,
    enterMatch,
    initializeSocket,
    cancelMatch,
} from "../api/matchingApi";
import ConfirmationDialog from "../components/ConfirmationDialog";
import NavigationButton from '../components/NavigationButton';

export default function WaitingRoom() {
    const [isTimeout, setTimeout] = useState("");
    const [isMatchFound, setMatchFound] = useState(false);
    const [matchDetails, setMatchDetails] = useState();
    const { categories } = useQuestions();
    const { user } = useAuth();

    useEffect(() => {
        initializeSocket(user.id)
        return () => {
            closeSocket();
        };
    }, [user.id]);

    const handleCreateSession = async (category, difficulty) => {
        enterMatch(category, difficulty, setMatchFound, setTimeout)
            .then((match) => {
                console.log("Match details:", match);
                setMatchDetails(match); // Store match details in state
            })
            .catch((error) => {
                console.error("Error entering match:", error.message);
            });
        console.log("Session created!");
    };

    const handleCancelMatch = () => {
        cancelMatch();
        console.log("Match cancelled!");
    };

    return (
        <div className="waiting-room-container">
            <NavigationButton path='Home' link='/home'/>
            <h1 className='waiting-room-title'>Start practicing now</h1>
            <CreateSessionForm
                categories={categories}
                handleCreateSession={handleCreateSession}
                handleCancelMatch={handleCancelMatch}
                isMatchFound={isMatchFound}
                isTimeout={isTimeout}
            />
            <ConfirmationDialog
                isMatchFound={isMatchFound}
                setMatchFound={setMatchFound}
                matchDetails={matchDetails}
            />
        </div>
    );
}
