import React from 'react';
import { Container, Box, TextField, Grid, Button, Typography, Switch, FormControlLabel, MenuItem, FormControl } from '@mui/material';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

const dataCodings = [
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

const submitModes = [
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

  return (
    <TextField
      {...props.childProps}
      error={props.validationFunction(text)}
      helperText={errorMessage}
      onChange={(e) => setText(e.target.value)}
      value={text}
    />
  )
}

Field.defaultProps = {
  defaultValue: "",
};

export default function App(props) {
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

  return (

    <Container
      maxWidth="md"
    >

      <Typography variant="h2" align='center'>SMPP client</Typography>

      <Typography variant="h6">Bind Settings</Typography>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >

        <Field
          childProps={{
            id: "system-id",
            label: "SystemId",
            required: true,
          }}
          errorMessageText={"Max " + MAX_SYSTEM_ID_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_SYSTEM_ID_LENGTH) }}
        />

        <TextField
          required
          id="hostname"
          label="Hostname"
        />

        <Field
          childProps={{
            required: true,
            id: "password",
            type: "password",
            autoComplete: "current-password",
            label: "Password",
          }}
          errorMessageText={"Max " + MAX_PASSWORD_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_PASSWORD_LENGTH) }}
        />

        <Field
          childProps={{
            id: "port",
            label: "Port",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_PORT}
          errorMessageText={"Port must be between " + MIN_PORT + " and " + MAX_PORT}
          validationFunction={(value) => { return (value > MAX_PORT || value < MIN_PORT) }}
        />

        <Field
          childProps={{
            required: true,
            id: "system-type",
            label: "System Type",
          }}
          errorMessageText={"Max " + MAX_SYSTEM_TYPE_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_SYSTEM_TYPE_LENGTH) }}
        />

        <FormControlLabel control={<Switch />} label="Use SSL" />

        <Field
          childProps={{
            id: "addr-ton",
            label: "Addr_TON",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_ADDR_TON}
          errorMessageText={"Max " + MAX_ADDR_TON_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_ADDR_TON_LENGTH) }}
        />

        <Field
          childProps={{
            id: "addr-npi",
            label: "Addr_NPI",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_ADDR_NPI}
          errorMessageText={"Max " + MAX_ADDR_NPI_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_ADDR_NPI_LENGTH) }}
        />

      </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          required
          id="text"
          label="Text"
        />

        <TextField
          required
          id="source-addr"
          label="Source_Addr"
        />

        <Field
          childProps={{
            id: "source-addr-ton",
            label: "Source_Addr_TON",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_SOURCE_ADDR_TON}
          errorMessageText={"Max " + MAX_SOURCE_ADDR_TON_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_SOURCE_ADDR_TON_LENGTH) }}
        />

        <Field
          childProps={{
            id: "source-addr-npi",
            label: "Source_Addr_NPI",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_SOURCE_ADDR_NPI}
          errorMessageText={"Max " + MAX_SOURCE_ADDR_NPI_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_SOURCE_ADDR_NPI_LENGTH) }}
        />

        <TextField
          required
          id="dest-addr"
          label="Dest_Addr"
        />

        <Field
          childProps={{
            id: "dest-addr-ton",
            label: "Dest_Addr_TON",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_DEST_ADDR_TON}
          errorMessageText={"Max " + MAX_DEST_ADDR_TON_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_DEST_ADDR_TON_LENGTH) }}
        />

        <Field
          childProps={{
            id: "dest-addr-npi",
            label: "Dest_Addr_NPI",
            type: "number",
            required: true,
          }}
          defaultValue={DEFAULT_DEST_ADDR_NPI}
          errorMessageText={"Max " + MAX_DEST_ADDR_NPI_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_DEST_ADDR_NPI_LENGTH) }}
        />

        <Field
          childProps={{
            id: "service-type",
            label: "Service Type",
            required: true,
          }}
          defaultValue={DEFAULT_SERVICE_TYPE}
          errorMessageText={"Max " + MAX_SERVICE_TYPE_LENGTH + " octets"}
          validationFunction={(value) => { return (value.length > MAX_SERVICE_TYPE_LENGTH) }}
        />

        <TextField
          required
          id="bulk-submit-times"
          label="Bulk async submit times"
          name="bulkSubmitTimes"
          type="number"
          defaultValue={DEFAULT_BULK_SUBMIT_TIMES}
        />

        <TextField
          id="data-coding"
          select
          label="Data Coding"
          name="dataCoding"
          value={state.dataCoding}
          onChange={handleChange}
        // fullWidth
        >
          {dataCodings.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="submit-mode"
          select
          label="Submit Mode"
          name="submitMode"
          value={state.submitMode}
          onChange={handleChange}
        // fullWidth
        >
          {submitModes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

      </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >

        <Button variant="contained" endIcon={<SendIcon />}>
          Submit
        </Button>

      </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          id="log"
          label="Log"
          multiline
          fullWidth
          maxRows={4}
          InputProps={{
            readOnly: true,
          }}
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies metus quis ultrices ullamcorper. Fusce massa ligula, egestas ac finibus et, tincidunt vel orci. Morbi id purus ac ante tincidunt efficitur. Suspendisse nec nisl vulputate, sollicitudin turpis sit amet, hendrerit lacus. Mauris pulvinar lacus at dolor dictum, id dapibus enim consectetur. Duis bibendum porta purus. Praesent at massa posuere, rhoncus neque eget, dapibus massa. Ut turpis nibh, accumsan non porttitor et, eleifend vitae nibh. Praesent malesuada felis eros, ut elementum nibh bibendum vitae. Fusce faucibus congue leo, ac fermentum urna iaculis non. Nam feugiat augue nulla, in dictum mauris rutrum in. Mauris sit amet diam feugiat, placerat lorem eget, suscipit dolor. In risus lorem, sagittis pretium laoreet pharetra, elementum sit amet ligula. Integer consectetur vitae turpis at malesuada. Phasellus in aliquam felis, eu posuere augue.

            Pellentesque vestibulum ligula consequat eros euismod malesuada. Fusce sagittis est et tellus porttitor, non posuere libero fringilla. Nam blandit eget velit id egestas. Pellentesque nibh enim, laoreet vitae scelerisque at, vulputate eu tortor. Integer feugiat convallis scelerisque. Aenean nec venenatis lacus. Suspendisse eu imperdiet metus, non tincidunt mauris. Nam at libero nec neque convallis varius. Etiam eget fermentum lorem, non accumsan urna. Nullam pellentesque tellus vitae enim suscipit, sed porta lacus egestas. Donec eu dolor rhoncus, volutpat felis quis, viverra mi. Duis nec nibh quis diam convallis placerat a eu orci. Nulla arcu leo, consequat eu neque nec, rhoncus pretium nulla.
            
            Ut tempor tincidunt ipsum et ornare. Sed eleifend et eros non tincidunt. Integer a condimentum nisi. In a luctus nibh. Sed in luctus mi. Cras non eros eros. Phasellus pellentesque lorem at mauris euismod faucibus. Aliquam dignissim semper mi a pharetra. Mauris consequat eget ex eu dictum. Nunc euismod a libero non malesuada. In fringilla nunc in nibh elementum, vel laoreet odio porttitor. Nunc imperdiet, magna at varius aliquet, mi tellus finibus lectus, non semper ligula magna vel turpis. Duis in erat vel lorem porttitor accumsan quis in risus.
            
            Donec consectetur hendrerit augue, vitae efficitur purus luctus at. Aenean libero nulla, porta non elementum consequat, varius eget enim. Ut tincidunt malesuada posuere. Curabitur eget felis sit amet purus scelerisque pretium vel non dui. Sed sagittis eros at sem eleifend, sed eleifend nisi lacinia. Proin elementum tempor ultricies. Mauris viverra, purus laoreet tempor vulputate, nulla ligula tincidunt tellus, ac laoreet tortor orci sit amet lacus. Sed vehicula dapibus orci eu pellentesque.
            
            Mauris vulputate elit id tincidunt iaculis. Duis ac dui dapibus, dignissim ipsum et, sagittis metus. Quisque scelerisque nulla nisl, vel ultrices eros condimentum ac. Cras egestas, libero laoreet commodo eleifend, arcu nunc hendrerit est, ut luctus libero turpis et odio. Nulla id porta elit. Praesent ligula nisl, imperdiet in odio nec, lacinia elementum orci. Morbi volutpat massa mauris, at tempus nisi tempus at. Nam volutpat et sem a accumsan."
        />

      </Box>
    </Container>
  );
}
