import React from 'react';
import { Container, Typography } from '@mui/material';
//import './App.css';
import BindForm from "./BindForm";
import MessageForm from "./MessageForm";
import LogField from "./LogField";

export default function App() {
  return (

    <Container
      maxWidth="md"
      style={{ overflowX: "hidden" }}
    >

      <Typography variant="h2" align='center' sx={{ fontWeight: 'bold' }}>SMPP client</Typography>

      <BindForm />

      <MessageForm />

      <LogField />

    </Container >
  );
}
