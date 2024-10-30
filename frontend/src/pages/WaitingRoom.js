import React, { useEffect, useState } from "react";
import CreateSessionForm from "../components/CreateSessionForm";
import useQuestions from "../hooks/useQuestions";
import { useAuth } from "../context/AuthContext";
import {
    closeSocket,
    enterMatch,
    initializeSocket,
    cancelMatch,
    acceptMatch,
    rejectMatch,
} from "../api/matchingApi";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function WaitingRoom() {
    const [isTimeout, setTimeout] = useState("");
    const [isMatchFound, setMatchFound] = useState("");
    const [matchDetails, setMatchDetails] = useState();
    const { categories } = useQuestions();
    const { user } = useAuth();

    useEffect(() => {
        initializeSocket(user.id);
        return () => {
            closeSocket();
        };
    }, [user.id]);

    // TODO: write a hook to handle create session
    const handleCreateSession = (category, difficulty) => {
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

    const onAccept = () => {
        acceptMatch(matchDetails.acceptanceId);
        setMatchFound(false);
    };

    const onReject = () => {
        rejectMatch(matchDetails.acceptanceId);
        setMatchFound(false);
    };

    const buildMatchMessage = (matchDetails) => {
        if (!matchDetails) return "";

        const { category, difficulty } = matchDetails;

        return (
            <>
                You have been matched for a <strong>{difficulty}</strong> level{" "}
                <strong>{category}</strong> question. Do you accept the match?
            </>
        );
    };

    const matchMessage = buildMatchMessage(matchDetails); // Generate the match message

    return (
        <div>
            <h1>Start practicing now</h1>
            <CreateSessionForm
                categories={categories}
                handleCreateSession={handleCreateSession}
                handleCancelMatch={handleCancelMatch}
                isMatchFound={isMatchFound}
                isTimeout={isTimeout}
            />
            <ConfirmationDialog
                open={isMatchFound}
                onAccept={onAccept}
                onReject={onReject}
                message={matchMessage}
            />
        </div>
    );
}
