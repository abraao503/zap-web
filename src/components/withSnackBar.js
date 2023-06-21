import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import { CloseOutlined } from '@ant-design/icons';

export function withSnackbar(Component) {
    return function WithSnackbar(props) {
        const [open, setOpen] = useState(false);
        const [message, setMessage] = useState('');
        const [snackbarColor, setSnackbarColor] = useState('');

        const handleClose = () => {
            setOpen(false);
        };

        const handleOpen = (message, severity) => {
            if (severity === 'error') {
                setSnackbarColor('#f44336');
            }

            if (severity === 'success') {
                setSnackbarColor('#4caf50');
            }

            setOpen(true);
            setMessage(message);
        };

        return (
            <>
                <Component {...props} handleOpen={handleOpen} />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <SnackbarContent
                        message={message}
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                    <CloseOutlined fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                        style={{
                            backgroundColor: snackbarColor
                        }}
                    />
                </Snackbar>
            </>
        );
    };
}
