import React from 'react';
import { TextField, Grid, Button, Switch, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import { useForm } from "react-hook-form";
import {
    PhoneNumberUtil,
    PhoneNumberFormat as PNF
} from 'google-libphonenumber';

const DATA_CODINGS = [
    {
        value: 0,
        label: "GSM7 (0) (default)",
    },
    {
        value: 3,
        label: "ISO-8859-1 (3)",
    },
    {
        value: 8,
        label: "UTF-16 (8)",
    },
];
const DEFAULT_DATA_CODING = 0;

const SUBMIT_MODES = [
    {
        value: "shortMessage",
        label: "Short Message (default)",
    },
    {
        value: "placeholder1",
        label: "Placeholder 1",
    },
    {
        value: "placeholder2",
        label: "Placeholder 2",
    },
]
const DEFAULT_SUBMIT_MODE = "shortMessage";

const DEFAULT_SOURCE_ADDR_TON = 0;
const MAX_SOURCE_ADDR_TON_LENGTH = 1;
const DEFAULT_SOURCE_ADDR_NPI = 0;
const MAX_SOURCE_ADDR_NPI_LENGTH = 1;
const DEFAULT_DEST_ADDR_TON = 0;
const MAX_DEST_ADDR_TON_LENGTH = 1;
const DEFAULT_DEST_ADDR_NPI = 0;
const MAX_DEST_ADDR_NPI_LENGTH = 1;
const DEFAULT_SERVICE_TYPE = 0;
const MAX_SERVICE_TYPE_LENGTH = 6;
const MAX_MESSAGE_TEXT_LENGTH = 160;

const validatePhoneNumber = (str) => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    if (!str.startsWith('+')) {
        str = '+' + str;
    }
    try {
        const number = phoneUtil.parse(str);
        // console.log(number);
        // console.log(phoneUtil.isValidNumber(number));
        // console.log(phoneUtil.format(number, PNF.E164));

        return phoneUtil.isValidNumber(number);
    } catch (error) {
        // console.error(error);
        return false;
    }
}

const formatPhoneNumber = (str) => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    if (!str.startsWith('+')) {
        str = '+' + str;
    }
    const number = phoneUtil.parse(str);

    return phoneUtil.format(number, PNF.E164);
}

export default function MessageForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const watchBulkSubmitEnable = watch("bulkSubmitEnable");

    const onSubmit = (messageData) => {
        messageData["sourceAddr"] = formatPhoneNumber(messageData["sourceAddr"])
        messageData["destAddr"] = formatPhoneNumber(messageData["destAddr"])

        console.log(JSON.stringify(messageData));
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <Grid
                    container
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            id="message-text"
                            label="Text *"
                            fullWidth={true}
                            multiline={true}
                            maxRows={4}
                            size="small"
                            {...register("messageText", {
                                required: true,
                                maxLength: MAX_MESSAGE_TEXT_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_MESSAGE_TEXT_LENGTH + " octets",
                                }
                                [errors?.messageText?.type]
                            }
                            error={errors?.messageText?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="source-addr"
                            label="Source_Addr *"
                            fullWidth
                            // type="number"
                            size="small"
                            {...register("sourceAddr", {
                                required: true,
                                validate: validatePhoneNumber,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    validate: "Invalid phone number",
                                }
                                [errors?.sourceAddr?.type]
                            }
                            error={errors?.sourceAddr?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            id="source-addr-ton"
                            label="Source_Addr_TON *"
                            type="number"
                            size="small"
                            defaultValue={DEFAULT_SOURCE_ADDR_TON}
                            {...register("sourceAddrTON", {
                                required: true,
                                maxLength: MAX_SOURCE_ADDR_TON_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_SOURCE_ADDR_TON_LENGTH + " octets",
                                }
                                [errors?.sourceAddrTON?.type]
                            }
                            error={errors?.sourceAddrTON?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            id="source-addr-npi"
                            label="Source_Addr_NPI *"
                            type="number"
                            size="small"
                            defaultValue={DEFAULT_SOURCE_ADDR_NPI}
                            {...register("sourceAddrNPI", {
                                required: true,
                                maxLength: MAX_SOURCE_ADDR_NPI_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_SOURCE_ADDR_NPI_LENGTH + " octets",
                                }
                                [errors?.sourceAddrNPI?.type]
                            }
                            error={errors?.sourceAddrNPI?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="dest-addr"
                            label="Dest_Addr *"
                            fullWidth
                            size="small"
                            {...register("destAddr", {
                                required: true,
                                validate: validatePhoneNumber,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    validate: "Invalid phone number",
                                }
                                [errors?.destAddr?.type]
                            }
                            error={errors?.destAddr?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            id="dest-addr-ton"
                            label="Dest_Addr_TON *"
                            type="number"
                            size="small"
                            defaultValue={DEFAULT_DEST_ADDR_TON}
                            {...register("destAddrTON", {
                                required: true,
                                maxLength: MAX_DEST_ADDR_TON_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_DEST_ADDR_TON_LENGTH + " octets",
                                }
                                [errors?.destAddrTON?.type]
                            }
                            error={errors?.destAddrTON?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            id="dest-addr-npi"
                            label="Dest_Addr_NPI *"
                            type="number"
                            size="small"
                            defaultValue={DEFAULT_DEST_ADDR_NPI}
                            {...register("destAddrNPI", {
                                required: true,
                                maxLength: MAX_DEST_ADDR_NPI_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_DEST_ADDR_NPI_LENGTH + " octets",
                                }
                                [errors?.destAddrNPI?.type]
                            }
                            error={errors?.destAddrNPI?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="service-type"
                            label="Service Type *"
                            fullWidth={true}
                            size="small"
                            defaultValue={DEFAULT_SERVICE_TYPE}
                            {...register("serviceType", {
                                required: true,
                                maxLength: MAX_SERVICE_TYPE_LENGTH,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                    maxLength: "Max " + MAX_SERVICE_TYPE_LENGTH + " octets",
                                }
                                [errors?.serviceType?.type]
                            }
                            error={errors?.serviceType?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6} display="flex" alignItems="center">
                        <Switch
                            size="small"
                            {...register("bulkSubmitEnable")}
                        />
                        <TextField
                            id="bulk-submit-times"
                            label="Bulk async submit times"
                            name="bulkSubmitTimes"
                            type="number"
                            // defaultValue={DEFAULT_BULK_SUBMIT_TIMES}
                            variant="standard"
                            fullWidth
                            size="small"
                            disabled={!watchBulkSubmitEnable}
                            {...register("bulkSubmitTimes", {
                                required: watchBulkSubmitEnable,
                            })}
                            helperText={
                                {
                                    required: "Required",
                                }
                                [errors?.bulkSubmitTimes?.type]
                            }
                            error={errors?.bulkSubmitTimes?.type !== undefined}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="data-coding"
                            select
                            label="Data Coding"
                            name="dataCoding"
                            fullWidth
                            size="small"
                            defaultValue={DEFAULT_DATA_CODING}
                            {...register("dataCoding")}
                        >
                            {DATA_CODINGS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}></Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="submit-mode"
                            select
                            label="Submit Mode"
                            fullWidth
                            size="small"
                            defaultValue={DEFAULT_SUBMIT_MODE}
                            {...register("submitMode")}
                        >
                            {SUBMIT_MODES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6} align="right">
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            sx={{ m: 1 }}
                            size="small"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </React.Fragment>
    );
}
