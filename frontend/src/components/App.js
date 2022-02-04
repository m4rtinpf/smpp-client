import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// import './App.css';
import BindForm from "./BindForm";
import MessageForm from "./MessageForm";
import LogField from "./LogField";
import useWebSocket, { ReadyState } from 'react-use-websocket';


export default function App() {
  const [isBound, setIsBound] = useState(false);

  const GetIsBound = (props) => {
    const [socketUrl, setSocketUrl] = useState('ws://0.0.0.0:8000/ws/api/');
    const [messageHistory, setMessageHistory] = useState([]);

    const {
      sendMessage,
      lastMessage,
      readyState,
    } = useWebSocket(socketUrl, { shouldReconnect: (closeEvent) => true, reconnectInterval: 1000, });

    useEffect(() => {
      if (lastMessage !== null) {
        setMessageHistory(prev => prev.concat(lastMessage));
      }
    }, [lastMessage, setMessageHistory]);


    const myFunc = () => {
      if (JSON.parse(message.data)['isBound'] !== undefined) {

      }
    }

    return (
      <React.Fragment>
        {
          messageHistory.map((message, idx) => (
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

      <GetIsBound setIsBound={setIsBound} />

      <BindForm
        isBound={isBound}
      />

      <MessageForm
        isBound={isBound}
      />

      <LogField />

    </Container >
  );
}
