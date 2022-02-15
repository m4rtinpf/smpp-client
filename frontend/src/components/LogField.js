import React, { useEffect, useRef } from 'react';
import { Grid, Box, Typography } from '@mui/material';
//import './App.css';

const Messages = (props) => {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [props.messageHistory]);

    return (
        <Box
            className="messagesWrapper"
            sx={{
                borderRadius: 1,
                padding: 1,
            }}
        >
            {
                props.messageHistory.map((message, idx) => (
                    <Typography
                        key={idx}
                        style={{
                            fontFamily: 'Monospace',
                            fontSize: '0.75rem',
                        }}
                    >
                        {message ? JSON.parse(message.data)['logMessage'] : console.error(message.data)}
                    </Typography>
                ))
            }
            < div
                ref={messagesEndRef}
            />
        </Box >
    );
};


export default function LogComponent(props) {

    return (
        <React.Fragment>
            <form>
                <Grid
                    container
                    spacing={2}
                    marginTop={0.5}
                >

                    <Grid item xs={12}>
                        <Typography variant="h6">Log</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Messages
                            messageHistory={props.messageHistory}
                        />
                    </Grid>

                </Grid>
            </form>
        </React.Fragment >
    );
}

