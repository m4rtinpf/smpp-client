import React from 'react';
import { TextField, Grid } from '@mui/material';
//import './App.css';
import { useSSE, SSEProvider } from 'react-hooks-sse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let logText = [];

function GetLog() {
    // todo hacky
    const state = useSSE('message');

    try {
        logText.push(state['text']);
    }
    catch {
    }
    return (
        <React.Fragment>
            {logText.map((row) => (
                <TableRow                >
                    <TableCell
                        component="th"
                        scope="row"
                        style={{
                            border: "none",
                            fontFamily: 'Monospace',
                            fontSize: '0.75rem',
                        }}
                    >
                        {row}
                    </TableCell>
                </TableRow>
            ))
            }
        </React.Fragment >
    );
}

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

                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: '200px',
                                boxShadow: "none",
                            }}
                        >
                            <Table
                                // size='small'
                                padding="none"
                                stickyHeader
                            >

                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            style={{
                                                fontSize: '1.5rem',
                                            }}
                                        >
                                            Log
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <SSEProvider endpoint="/events/">
                                        <GetLog />
                                    </SSEProvider>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* <TextField
                            id="log"
                            label="Log"
                            multiline
                            fullWidth={true}
                            maxRows={7}
                            InputProps={{
                                readOnly: true,
                            }}
                            
                            value={logText}
                        /> */}
                    </Grid>

                </Grid>
            </form>
        </React.Fragment >
    );
}

