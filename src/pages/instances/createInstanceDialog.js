import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import InputMask from 'react-input-mask';
import instancesService from 'services/instancesService';
import { withSnackbar } from 'components/withSnackBar';

const CreateInstanceDialog = ({ open, onClose, reload }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [DDI, setDDI] = useState('55');
    const [loading, setLoading] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleClose = () => {
        setName('');
        setPhoneNumber('');
        onClose();
    };

    const handleCreateInstance = async () => {
        try {
            setLoading(true);
            await instancesService.createInstance({
                name,
                phone_number: `${DDI} ${phoneNumber}`
            });
            await reload();

            setLoading(false);
            handleClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Criar Instância</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                    sx={{
                        marginBottom: 2
                    }}
                />
                <Grid container columnSpacing={1}>
                    <Grid item xs={2}>
                        <InputMask mask="999" value={DDI} onChange={(event) => setDDI(event.target.value)} maskChar=" ">
                            {() => <TextField label="DDI" />}
                        </InputMask>
                    </Grid>
                    <Grid item xs={10}>
                        <InputMask mask="99999999999" value={phoneNumber} onChange={handlePhoneNumberChange} maskChar={null}>
                            {() => <TextField fullWidth label="Telefone" />}
                        </InputMask>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleCreateInstance} variant="contained" color="primary">
                    {loading ? <CircularProgress size={24} /> : 'Criar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withSnackbar(CreateInstanceDialog);
