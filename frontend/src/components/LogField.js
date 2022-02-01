import React, { useEffect, useRef } from 'react';
import { Grid, Box, Typography } from '@mui/material';
//import './App.css';
import { useSSE, SSEProvider } from 'react-hooks-sse';

let messages = [];

const Messages = (props) => {
    const state = useSSE('message');

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [state]);

    try {
        messages.push(state['text']);

    }
    catch {
    }

    return (
        <Box
            className="messagesWrapper"
            sx={{
                borderRadius: 1,
                padding: 1,
            }}
        >
            {
                messages.map(message => (
                    <Typography
                        key={message}
                        style={{
                            fontFamily: 'Monospace',
                            fontSize: '0.75rem',
                        }}
                    >{message}</Typography>
                ))
            }
            < div
                ref={messagesEndRef}
            />
        </Box >
    );
};

export default function LogComponent() {

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
                        <SSEProvider endpoint="/events/">
                            <Messages />
                        </SSEProvider>
                    </Grid>

                </Grid>
            </form>
        </React.Fragment >
    );
}

