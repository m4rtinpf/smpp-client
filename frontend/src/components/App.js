import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
// import './App.css';
import BindForm from "./BindForm";
import MessageForm from "./MessageForm";
import LogField from "./LogField";
import { useSSE, SSEProvider } from 'react-hooks-sse';


export default function App() {
  const [isBound, setIsBound] = useState(false);

  function GetIsBound() {
    // todo hacky

    try {
      setIsBound(useSSE('message')['isBound']);
    }
    catch {
    }
    return null;
  }

  return (

    <Container
      maxWidth="md"
      style={{ overflowX: "hidden" }}
    >

      <Typography variant="h2" align='center' sx={{ fontWeight: 'bold' }}>SMPP client</Typography>

      <SSEProvider endpoint="/events/">
        <GetIsBound />
      </SSEProvider>

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
