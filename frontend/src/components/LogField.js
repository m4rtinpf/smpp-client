import React from 'react';
import { TextField, Grid } from '@mui/material';
//import './App.css';
import { useSSE, SSEProvider } from 'react-hooks-sse';

let logText = "";

const Comments = () => {
    // todo hacky
    const state = useSSE('message');

    try {
        logText += state['text'] + '\n';
        // console.log(myVar)
        // return (
        //     toString(myVar)
        // );
    }
    catch {
        // return null;
    }
    return null;
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

                        <SSEProvider endpoint="/events/">
                            <Comments />
                        </SSEProvider>

                        <TextField
                            id="log"
                            label="Log"
                            multiline
                            fullWidth={true}
                            maxRows={7}
                            InputProps={{
                                readOnly: true,
                            }}
                            size="small"
                            value=

                            {logText}
                        />
                    </Grid>

                </Grid>
            </form>
        </React.Fragment>
    );
}

