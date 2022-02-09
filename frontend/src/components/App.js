import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// import './App.css';
import BindForm from "./BindForm";
import MessageForm from "./MessageForm";
import LogField from "./LogField";
import useWebSocket, { ReadyState } from 'react-use-websocket';


export default function App() {
  const [isBound, setIsBound] = useState(false);

  const socketUrl = `ws://${document.location.host}/ws/api/`;

  const [messageHistory, setMessageHistory] = useState([]);

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, { shouldReconnect: (closeEvent) => true, reconnectInterval: 1000, });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
      setIsBound(JSON.parse(lastMessage.data)['isBound']);
    }
  }, [lastMessage, setMessageHistory]);

  return (

    <Container
      maxWidth="md"
      style={{ overflowX: "hidden" }}
    >

      <Typography variant="h2" align='center' sx={{ fontWeight: 'bold' }}>SMPP client</Typography>

      <BindForm
        isBound={isBound}
      />

      <MessageForm
        isBound={isBound}
      />

      <LogField
        messageHistory={messageHistory}
      />

    </Container >
  );
}
