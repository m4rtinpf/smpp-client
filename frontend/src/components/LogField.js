import React from 'react';
import { TextField, Grid } from '@mui/material';
//import './App.css';

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
                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies metus quis ultrices ullamcorper. Fusce massa ligula, egestas ac finibus et, tincidunt vel orci. Morbi id purus ac ante tincidunt efficitur. Suspendisse nec nisl vulputate, sollicitudin turpis sit amet, hendrerit lacus. Mauris pulvinar lacus at dolor dictum, id dapibus enim consectetur. Duis bibendum porta purus. Praesent at massa posuere, rhoncus neque eget, dapibus massa. Ut turpis nibh, accumsan non porttitor et, eleifend vitae nibh. Praesent malesuada felis eros, ut elementum nibh bibendum vitae. Fusce faucibus congue leo, ac fermentum urna iaculis non. Nam feugiat augue nulla, in dictum mauris rutrum in. Mauris sit amet diam feugiat, placerat lorem eget, suscipit dolor. In risus lorem, sagittis pretium laoreet pharetra, elementum sit amet ligula. Integer consectetur vitae turpis at malesuada. Phasellus in aliquam felis, eu posuere augue.

        Pellentesque vestibulum ligula consequat eros euismod malesuada. Fusce sagittis est et tellus porttitor, non posuere libero fringilla. Nam blandit eget velit id egestas. Pellentesque nibh enim, laoreet vitae scelerisque at, vulputate eu tortor. Integer feugiat convallis scelerisque. Aenean nec venenatis lacus. Suspendisse eu imperdiet metus, non tincidunt mauris. Nam at libero nec neque convallis varius. Etiam eget fermentum lorem, non accumsan urna. Nullam pellentesque tellus vitae enim suscipit, sed porta lacus egestas. Donec eu dolor rhoncus, volutpat felis quis, viverra mi. Duis nec nibh quis diam convallis placerat a eu orci. Nulla arcu leo, consequat eu neque nec, rhoncus pretium nulla.
        
        Ut tempor tincidunt ipsum et ornare. Sed eleifend et eros non tincidunt. Integer a condimentum nisi. In a luctus nibh. Sed in luctus mi. Cras non eros eros. Phasellus pellentesque lorem at mauris euismod faucibus. Aliquam dignissim semper mi a pharetra. Mauris consequat eget ex eu dictum. Nunc euismod a libero non malesuada. In fringilla nunc in nibh elementum, vel laoreet odio porttitor. Nunc imperdiet, magna at varius aliquet, mi tellus finibus lectus, non semper ligula magna vel turpis. Duis in erat vel lorem porttitor accumsan quis in risus.
        
        Donec consectetur hendrerit augue, vitae efficitur purus luctus at. Aenean libero nulla, porta non elementum consequat, varius eget enim. Ut tincidunt malesuada posuere. Curabitur eget felis sit amet purus scelerisque pretium vel non dui. Sed sagittis eros at sem eleifend, sed eleifend nisi lacinia. Proin elementum tempor ultricies. Mauris viverra, purus laoreet tempor vulputate, nulla ligula tincidunt tellus, ac laoreet tortor orci sit amet lacus. Sed vehicula dapibus orci eu pellentesque.
        
        Mauris vulputate elit id tincidunt iaculis. Duis ac dui dapibus, dignissim ipsum et, sagittis metus. Quisque scelerisque nulla nisl, vel ultrices eros condimentum ac. Cras egestas, libero laoreet commodo eleifend, arcu nunc hendrerit est, ut luctus libero turpis et odio. Nulla id porta elit. Praesent ligula nisl, imperdiet in odio nec, lacinia elementum orci. Morbi volutpat massa mauris, at tempus nisi tempus at. Nam volutpat et sem a accumsan."
                        />
                    </Grid>
                </Grid>
            </form>
        </React.Fragment>
    );
}

