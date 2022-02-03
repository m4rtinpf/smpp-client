import React, { useState, useEffect, useRef } from 'react';
import { Grid, Box, Typography } from '@mui/material';
//import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const Messages = () => {
    const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/ws/api/');
    const [messageHistory, setMessageHistory] = useState([]);

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory(prev => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messageHistory]);

    return (
        <Box
            className="messagesWrapper"
            sx={{
                borderRadius: 1,
                padding: 1,
            }}
        >
            {
                messageHistory.map((message, idx) => (
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
                        <Messages />
                    </Grid>

                </Grid>
            </form>
        </React.Fragment >
    );
}

