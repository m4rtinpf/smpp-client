import React from 'react';
import { Divider, Container, Box, TextField, Grid, Button, Typography, Switch, FormControlLabel, MenuItem, FormControl } from '@mui/material';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import { useForm } from "react-hook-form";


const DATA_CODINGS = [
  {
    value: "0",
    label: "GSM7 (0) (default)",
  },
  {
    value: "3",
    label: "ISO-8859-1 (3)",
  },
  {
    value: "8",
    label: "UTF-16 (8)",
  },
];

const SUBMIT_MODES = [
  {
    value: "default",
    label: "Short Message (default)",
  },
  {
    value: "default2",
    label: "Placeholder 1",
  },
  {
    value: "default3",
    label: "Placeholder 2",
  },
]

const MIN_PORT = 1;
const MAX_PORT = 65535;
const DEFAULT_PORT = 2775;
const MAX_SYSTEM_ID_LENGTH = 16;
const MAX_PASSWORD_LENGTH = 9;
const MAX_SYSTEM_TYPE_LENGTH = 13;
const DEFAULT_ADDR_TON = 0;
const MAX_ADDR_TON_LENGTH = 1;
const DEFAULT_ADDR_NPI = 0;
const MAX_ADDR_NPI_LENGTH = 1;
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
const DEFAULT_BULK_SUBMIT_TIMES = 0;
const MAX_MESSAGE_TEXT_LENGTH = 160;


function Field(props) {
  const [text, setText] = React.useState(props.defaultValue);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    // Set errorMessage only if validationFunction(text) == true
    if (props.validationFunction(text)) {
      setErrorMessage(
        props.errorMessageText
      );
    }
  }, [text]);

  React.useEffect(() => {
    // Set empty erroMessage only if validationFunction(text) == false
    // and errorMessage is not empty.
    // avoids setting empty errorMessage if the errorMessage is already empty
    if (!(props.validationFunction(text)) && errorMessage) {
      setErrorMessage("");
    }
  }, [text, errorMessage]);

  const updateParentState = (e) => {
    setText(e.target.value);
    props.callback({ text });
  }

  return (
    <TextField
      {...props.childProps}
      error={props.validationFunction(text)}
      helperText={errorMessage}
      onChange={(e) => updateParentState(e)}
      value={text}
    />
  )
}

Field.defaultProps = {
  defaultValue: "",
};

function BindForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

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
              label="SystemId"
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
              label="Hostname"
              fullWidth={true}
              size="small"
              {...register("hostname", {
                required: true,
              })}
              helperText={
                {
                  required: "Required",
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
              label="Password"
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
              label="Port"
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
              label="System Type"
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
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="addr-ton"
              label="Addr_TON"
              type="number"
              fullWidth={true}
              size="small"
              defaultValue={DEFAULT_ADDR_TON}
              {...register("addrTON", {
                required: true,
                maxLength: MAX_ADDR_TON_LENGTH,
              })}
              helperText={
                {
                  required: "Required",
                  maxLength: "Max " + MAX_ADDR_TON_LENGTH + " octets",
                }
                [errors?.addrTON?.type]
              }
              error={errors?.addrTON?.type !== undefined}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="addr-npi"
              label="Addr_NPI"
              type="number"
              fullWidth={true}
              size="small"
              defaultValue={DEFAULT_ADDR_NPI}
              {...register("addrNPI", {
                required: true,
                maxLength: MAX_ADDR_NPI_LENGTH,
              })}
              helperText={
                {
                  required: "Required",
                  maxLength: "Max " + MAX_ADDR_NPI_LENGTH + " octets",
                }
                [errors?.addrNPI?.type]
              }
              error={errors?.addrNPI?.type !== undefined}
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
                display="flex"
              // alignItems="center"
              />

              <Button
                variant="contained"
                sx={{ m: 1 }}
                size="small"
                type="submit"
              >
                Connect
              </Button>
              <Button variant="contained" sx={{ m: 1 }} size="small">
                Disconnect
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

function MessageForm() {
  const [state, setState] = React.useState({
    dataCoding: "0",
    submitMode: "default",
    bulkSubmitTimes: "",
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
              label="Text"
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
              label="Source_Addr"
              fullWidth
              size="small"
              {...register("sourceAddr", {
                required: true,
              })}
              helperText={
                {
                  required: "Required",
                }
                [errors?.sourceAddr?.type]
              }
              error={errors?.sourceAddr?.type !== undefined}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              id="source-addr-ton"
              label="Source_Addr_TON"
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
              label="Source_Addr_NPI"
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
              label="Dest_Addr"
              fullWidth
              size="small"
              {...register("destAddr", {
                required: true,
              })}
              helperText={
                {
                  required: "Required",
                }
                [errors?.destAddr?.type]
              }
              error={errors?.destAddr?.type !== undefined}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              id="dest-addr-ton"
              label="Dest_Addr_TON"
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
              label="Dest_Addr_NPI"
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
              label="Service Type"
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
            <Switch size="small" />
            <TextField
              id="bulk-submit-times"
              label="Bulk async submit times"
              name="bulkSubmitTimes"
              type="number"
              defaultValue={DEFAULT_BULK_SUBMIT_TIMES}
              variant="standard"
              fullWidth
              size="small"
              {...register("bulkSubmitTimes", {
                required: true,
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
              value={state.dataCoding}
              onChange={handleChange}
              fullWidth
              size="small"
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
              name="submitMode"
              value={state.submitMode}
              onChange={handleChange}
              fullWidth
              size="small"
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

function LogComponent() {
  return (
    <React.Fragment>
      <Grid
        container
        spacing={2}
        marginTop={0.5}
      >

        <Grid item xs={12}>
          <TextField
            id="log"
            label="Log"
            multiline
            fullWidth
            maxRows={4}
            InputProps={{
              readOnly: true,
            }}
            size="small"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies metus quis ultrices ullamcorper. Fusce massa ligula, egestas ac finibus et, tincidunt vel orci. Morbi id purus ac ante tincidunt efficitur. Suspendisse nec nisl vulputate, sollicitudin turpis sit amet, hendrerit lacus. Mauris pulvinar lacus at dolor dictum, id dapibus enim consectetur. Duis bibendum porta purus. Praesent at massa posuere, rhoncus neque eget, dapibus massa. Ut turpis nibh, accumsan non porttitor et, eleifend vitae nibh. Praesent malesuada felis eros, ut elementum nibh bibendum vitae. Fusce faucibus congue leo, ac fermentum urna iaculis non. Nam feugiat augue nulla, in dictum mauris rutrum in. Mauris sit amet diam feugiat, placerat lorem eget, suscipit dolor. In risus lorem, sagittis pretium laoreet pharetra, elementum sit amet ligula. Integer consectetur vitae turpis at malesuada. Phasellus in aliquam felis, eu posuere augue.

        Pellentesque vestibulum ligula consequat eros euismod malesuada. Fusce sagittis est et tellus porttitor, non posuere libero fringilla. Nam blandit eget velit id egestas. Pellentesque nibh enim, laoreet vitae scelerisque at, vulputate eu tortor. Integer feugiat convallis scelerisque. Aenean nec venenatis lacus. Suspendisse eu imperdiet metus, non tincidunt mauris. Nam at libero nec neque convallis varius. Etiam eget fermentum lorem, non accumsan urna. Nullam pellentesque tellus vitae enim suscipit, sed porta lacus egestas. Donec eu dolor rhoncus, volutpat felis quis, viverra mi. Duis nec nibh quis diam convallis placerat a eu orci. Nulla arcu leo, consequat eu neque nec, rhoncus pretium nulla.
        
        Ut tempor tincidunt ipsum et ornare. Sed eleifend et eros non tincidunt. Integer a condimentum nisi. In a luctus nibh. Sed in luctus mi. Cras non eros eros. Phasellus pellentesque lorem at mauris euismod faucibus. Aliquam dignissim semper mi a pharetra. Mauris consequat eget ex eu dictum. Nunc euismod a libero non malesuada. In fringilla nunc in nibh elementum, vel laoreet odio porttitor. Nunc imperdiet, magna at varius aliquet, mi tellus finibus lectus, non semper ligula magna vel turpis. Duis in erat vel lorem porttitor accumsan quis in risus.
        
        Donec consectetur hendrerit augue, vitae efficitur purus luctus at. Aenean libero nulla, porta non elementum consequat, varius eget enim. Ut tincidunt malesuada posuere. Curabitur eget felis sit amet purus scelerisque pretium vel non dui. Sed sagittis eros at sem eleifend, sed eleifend nisi lacinia. Proin elementum tempor ultricies. Mauris viverra, purus laoreet tempor vulputate, nulla ligula tincidunt tellus, ac laoreet tortor orci sit amet lacus. Sed vehicula dapibus orci eu pellentesque.
        
        Mauris vulputate elit id tincidunt iaculis. Duis ac dui dapibus, dignissim ipsum et, sagittis metus. Quisque scelerisque nulla nisl, vel ultrices eros condimentum ac. Cras egestas, libero laoreet commodo eleifend, arcu nunc hendrerit est, ut luctus libero turpis et odio. Nulla id porta elit. Praesent ligula nisl, imperdiet in odio nec, lacinia elementum orci. Morbi volutpat massa mauris, at tempus nisi tempus at. Nam volutpat et sem a accumsan."
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default function App(props) {
  return (

    <Container
      maxWidth="md"
      style={{ overflowX: "hidden" }}
    >

      <Typography variant="h2" align='center' sx={{ fontWeight: 'bold' }}>SMPP client</Typography>

      <BindForm />

      <MessageForm />

      <LogComponent />

    </Container >
  );
}
