import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function ConfirmationDialog({ open, onAccept, onReject, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onReject}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title || 'Confirm Action'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReject} color="secondary" variant="outlined">
          Reject
        </Button>
        <Button onClick={onAccept} color="primary" variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
