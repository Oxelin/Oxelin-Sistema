// src/components/DialogCustom.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const DialogCustom = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default DialogCustom;
