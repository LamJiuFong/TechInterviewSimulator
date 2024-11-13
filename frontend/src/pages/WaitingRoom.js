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
    const [isTimeout, setTimeout] = useState(false);
    const [isMatchFound, setMatchFound] = useState(false);
    const [matchDetails, setMatchDetails] = useState();
    const [isRejected, setRejected] = useState(false);
    const [isReject, setReject] = useState(false);
    const [isCollabTimeout, setCollabTimeout] = useState(false);
    const { categories } = useQuestions();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            initializeSocket(user.id)
                .then(() => console.log("Socket initialized!"))
                .catch((error) => {
                    console.error("Error initializing socket:", error.message);
                });
        }
        return () => {
            closeSocket();
        };
    }
    , [user, loading]);

    const handleCreateSession = async (category, difficulty) => {
        enterMatch(category, difficulty, setMatchFound, setTimeout, setRejected, setReject, setCollabTimeout)
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
        setReject(false);
        setRejected(false);
        setMatchFound(false);
        setTimeout(false);
        setCollabTimeout(false);
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
                isTimeout={isTimeout}
                isMatchFound={isMatchFound}
                isReject={isReject}
                isRejected={isRejected}
                isCollabTimeout={isCollabTimeout}
            />
            <ConfirmationDialog
                isMatchFound={isMatchFound}
                setMatchFound={setMatchFound}
                matchDetails={matchDetails}
                isReject={isReject}
                isRejected={isRejected}
                isCollabTimeout={isCollabTimeout}
            />
        </div>
    );
}
