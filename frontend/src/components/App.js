import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// import './App.css';
import BindForm from "./BindForm";
import MessageForm from "./MessageForm";
import LogField from "./LogField";
import useWebSocket, { ReadyState } from 'react-use-websocket';


export default function App() {
  const [isBound, setIsBound] = useState(false);

  const socketUrl = 'ws://35.193.201.166:80/ws/api/';

  const [messageHistory, setMessageHistory] = useState([]);

  const GetIsBound = (props) => {
    const {
      sendMessage,
      lastMessage,
      readyState,
    } = useWebSocket(socketUrl, { shouldReconnect: (closeEvent) => true, reconnectInterval: 1000, });

    useEffect(() => {
      if (lastMessage !== null) {
        props.setMessageHistory(prev => prev.concat(lastMessage));
      }
    }, [lastMessage, props.setMessageHistory]);


    const myFunc = () => {
      if (JSON.parse(message.data)['isBound'] !== undefined) {

      }
    }

    return (
      <React.Fragment>
        {
          props.messageHistory.map((message, idx) => (
            <Typography
              key={idx}
              style={{
                fontFamily: 'Monospace',
                fontSize: '0.75rem',
              }}
            >
              {message ? props.setIsBound(JSON.parse(message.data)['isBound']) : console.error(message.data)}
            </Typography>
          ))
        }
      </React.Fragment>
    );
  };

  return (

    <Container
      maxWidth="md"
      style={{ overflowX: "hidden" }}
    >

      <Typography variant="h2" align='center' sx={{ fontWeight: 'bold' }}>SMPP client</Typography>

      <GetIsBound
        setIsBound={setIsBound}
        messageHistory={messageHistory}
        setMessageHistory={setMessageHistory}
      />

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
