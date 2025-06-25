import React, { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';


interface ConfirmBoxProps {
    selectedItemDelete: number | null,
    isOpen: boolean,
    onCancel: () => void,
    onConfirm: (itemId: number) => void
}



export default function ConfirmDeleteExample({ selectedItemDelete, isOpen, onCancel, onConfirm }: ConfirmBoxProps) {


    return (
        <div>

            <Dialog
                open={isOpen}
                onClose={onCancel}
            >
                <DialogTitle>{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. Do you really want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => selectedItemDelete !== null ? onConfirm(selectedItemDelete) : null} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

