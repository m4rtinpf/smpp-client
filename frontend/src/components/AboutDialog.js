import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';;
import Typography from '@mui/material/Typography';


function SimpleDialog(props) {
    const { onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>About SMPP client</DialogTitle>
            <Typography align='center'>
                SMPP client
            </Typography>

            <Button
                variant="contained"
                sx={{ m: 1 }}
                size="small"
                onClick={onClose}
            >
                Close
            </Button>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function AboutDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                sx={{ m: 1 }}
                size="small"
                onClick={handleClickOpen}
            >
                About
            </Button>
            <SimpleDialog
                open={open}
                onClose={handleClose}
            />
        </React.Fragment>
    );
}
