import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import {
  acceptMatch,
  rejectMatch
} from "../api/matchingApi";
import { useNavigate } from "react-router-dom";

export default function ConfirmationDialog({isMatchFound, setMatchFound, matchDetails, isReject, isRejected, isCollabTimeout}) { 
  const [hasToWait, setHasToWait] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (createdRoom) {
      navigate(`/collaboration`, {state: {roomInfo: createdRoom}});
    }
  }, [createdRoom])

  useEffect(() => {
    console.log("reset dialog");
    setHasToWait(false);
    setIsCreatingRoom(false);
    setCreatedRoom(null);
  }, [isRejected, isReject, isCollabTimeout]);

  const onAccept = () => {
    acceptMatch(matchDetails.acceptanceId, setHasToWait, setIsCreatingRoom, setCreatedRoom);
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

  const dialogTitle = isCreatingRoom
  ? 'Creating Room...'
  : hasToWait
  ? 'Waiting for another player to accept'
  : 'Found a match';

  const dialogContentText = isCreatingRoom
  ? 'Give us a moment'
  : hasToWait
  ? 'Please wait for awhile'
  : matchMessage;

  return (
    <Dialog
      open={isMatchFound}
      onClose={onReject}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      {!hasToWait && !isCreatingRoom &&
      <DialogActions>
        <Button onClick={onReject} color="secondary" variant="outlined">
          Reject
        </Button>
        <Button onClick={onAccept} color="primary" variant="contained">
          Accept
        </Button>
      </DialogActions>
      }
    </Dialog>
  );
}
