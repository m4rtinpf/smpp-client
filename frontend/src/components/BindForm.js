import React from 'react';
import { Divider, Box, TextField, Grid, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { useForm } from "react-hook-form";

const MIN_PORT = 1;
const MAX_PORT = 65535;
const DEFAULT_PORT = 2775;
const MAX_SYSTEM_ID_LENGTH = 16;
const MAX_PASSWORD_LENGTH = 9;
const MAX_SYSTEM_TYPE_LENGTH = 13;

export default function BindForm(props) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const onSubmit = (bindData) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bindData),
        };
        fetch('/api/bind', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // props.handleBound(data);
            });
    };

    const isValidHostname = (string) => {
        let url;
        let regex = /^\w+:\/\//;

        try {
            console.log(!regex.test(string));

            if (!regex.test(string)) {
                string = `http://${string}`;
            }
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return true;
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    container
                    spacing={2}
                // wrap="wrap"
                >

                    <Grid item xs={12}>
                        <Typography variant="h6">Bind Settings</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="system-id"
                            label="SystemId *"
                            fullWidth={true}
                            size="small"
                            {...register("systemId", {
                                required: true,
                                maxLength: MAX_SYSTEM_ID_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_SYSTEM_ID_LENGTH + " octets",
                                }
                                [errors?.systemId?.type]
                            }
                            error={errors?.systemId?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="hostname"
                            label="Hostname *"
                            fullWidth={true}
                            size="small"
                            {...register("hostname", {
                                required: true,
                                validate: isValidHostname,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    validate: "Invalid hostname",
                                }
                                [errors?.hostname?.type]
                            }
                            error={errors?.hostname?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            label="Password *"
                            fullWidth={true}
                            size="small"
                            {...register("password", {
                                required: true,
                                maxLength: MAX_PASSWORD_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_PASSWORD_LENGTH + " octets",
                                }
                                [errors?.password?.type]
                            }
                            error={errors?.password?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="port"
                            label="Port *"
                            type="number"
                            fullWidth={true}
                            size="small"
                            defaultValue={DEFAULT_PORT}
                            {...register("port", {
                                required: true,
                                min: MIN_PORT,
                                max: MAX_PORT,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    min: "Port must be between " + MIN_PORT + " and " + MAX_PORT,
                                    max: "Port must be between " + MIN_PORT + " and " + MAX_PORT,
                                }
                                [errors?.port?.type]
                            }
                            error={errors?.port?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="system-type"
                            label="System Type *"
                            fullWidth={true}
                            size="small"
                            {...register("systemType", {
                                required: true,
                                maxLength: MAX_SYSTEM_TYPE_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_SYSTEM_TYPE_LENGTH + " octets",
                                }
                                [errors?.systemType?.type]
                            }
                            error={errors?.systemType?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6} display="flex" alignItems="center">
                        <FormControlLabel
                            control={<Switch size="small" />}
                            label="Use SSL"
                            {...register("useSSL")}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>

                </Grid>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid item xs={6}>
                        <Box>
                            <FormControlLabel
                                control={<Switch size="small" />}
                                label="Reconnect"
                                {...register("reconnect")}
                            // display="flex"
                            // alignItems="center"
                            />

                            <Button
                                variant="contained"
                                sx={{
                                    m: 1,
                                    // todo is there something wrong with `ch`? it should be `10ch`
                                    minWidth: '14ch',
                                }}
                                size="small"
                                type="submit"
                            >
                                {{ false: "Connect", true: 'Disconnect' }[props.isBound]}
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={6} align="right">
                        <Button variant="contained" sx={{ m: 1 }} size="small">
                            About
                        </Button>
                    </Grid>
                </Grid >
            </form >
        </React.Fragment>
    );
}

