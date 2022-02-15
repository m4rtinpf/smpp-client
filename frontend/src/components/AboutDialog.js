import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';


function SimpleDialog(props) {
    const { onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <Box padding={2} textAlign='center'>
                <DialogTitle>About SMPP client</DialogTitle>

                <Typography >This project exposes a RESTful API to send SMS messages using the SMPP (Short Message Peer-to-Peer) protocol.</Typography>
                <Typography >It also includes a web UI for easy usage.</Typography>
                <Typography >
                    <Link href="https://github.com/m4rtinpf/smpp-client">
                        You can check the code here.
                    </Link>
                </Typography>

                <Button
                    variant="contained"
                    sx={{ m: 1 }}
                    size="small"
                    onClick={onClose}
                >
                    Close
                </Button>
            </Box>
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
