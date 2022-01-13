import React from 'react';
import { TextField, Grid, Button, Typography, Switch, FormControlLabel,  MenuItem,  FormControl } from '@mui/material';
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
    <div className='center'>
      <Typography variant="h6">Bind Settings</Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={6}>
          <TextField
            required
            id="system-id"
            label="SystemId"
            // helperText="Max 16 octets"
            inputProps={{ maxLength: 16 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="hostname"
            label="Hostname"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="password"
            type="password"
            autoComplete="current-password"
            label="Password"
            // helperText="Max 9 octets"
            inputProps={{ maxLength: 9 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="port"
            type="number"
            label="Port"
            defaultValue={2775}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="system-type"
            label="System Type"
            // helperText="Max 13 octets"
            inputProps={{ maxLength: 13 }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel control={<Switch />} label="Use SSL" />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="addr-ton"
            type="number"
            label="Addr_TON"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="addr-npi"
            type="number"
            label="Addr_NPI"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid >
      </Grid >
      {/* <Grid container spacing={1}>
        <Grid item xs={2}>
          <FormControlLabel control={<Switch />} label="Reconnect" />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained">
            Connect
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained">
            Disconnect
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained">
            About
          </Button>
        </Grid>
      </Grid> */}
      <Grid container spacing={1} alignItems="center" marginTop="auto">
        <Grid item xs={12}>
          <TextField
            required
            id="text"
            label="Text"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="source-addr"
            label="Source_Addr"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="source-addr-ton"
            label="Source_Addr_TON"
            type="number"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="source-addr-npi"
            label="Source_Addr_NPI"
            type="number"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="dest-addr"
            label="Dest_Addr"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="dest-addr-ton"
            label="Dest_Addr_TON"
            type="number"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="dest-addr-npi"
            label="Dest_Addr_NPI"
            type="number"
            // helperText="1 octet"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="service-type"
            label="Service Type"
            // helperText="Max 6 octets"
            inputProps={{ maxLength: 6 }}
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <FormControlLabel control={<Switch />} label="Bulk async submit" />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '15ch' }}>
                <Input
                  id="bulk-submit-times"
                  value={state.bulkSubmitTimes}
                  name="bulkSubmitTimes"
                  onChange={handleChange}
                  endAdornment={<InputAdornment position="end">times</InputAdornment>}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="data-coding"
            select
            label="Data Coding"
            name="dataCoding"
            value={state.dataCoding}
            onChange={handleChange}
            fullWidth
          >
            {dataCodings.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="submit-mode"
            select
            label="Submit Mode"
            name="submitMode"
            value={state.submitMode}
            onChange={handleChange}
            fullWidth
          >
            {submitModes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" endIcon={<SendIcon />}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12} marginTop={2}>
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
        </Grid>
      </Grid>

    </div>
  );
}
