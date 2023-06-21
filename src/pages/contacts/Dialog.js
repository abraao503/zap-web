import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContentText from '@mui/material/DialogContentText';
import * as XLSX from 'xlsx';
import CircularProgress from '@mui/material/CircularProgress';
import InputMask from 'react-input-mask';
import { withSnackbar } from 'components/withSnackBar';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';

const CustomDialog = ({
    open,
    onClose,
    createContact,
    createContacts,
    createTag,
    type,
    tags,
    tagName,
    deleteContacts,
    handleOpen: handleOpenSnackbar
}) => {
    const [newTagName, setNewTagName] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [totalContacts, setTotalContacts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [confirmButtonText, setConfirmButtonText] = useState('Salvar');

    useEffect(() => {
        setNewTagName(tagName);

        if (type === 'DELETE_CONTACTS') {
            setConfirmButtonText('Excluir');
        }
    }, [open]);

    const handleSave = async () => {
        try {
            setLoading(true);
            if (type === 'TAG') {
                await createTag({
                    name: newTagName
                });
            } else if (type === 'CONTACT') {
                await createContact({
                    name,
                    phone_number: phoneNumber,
                    tags: selectedTags.map((tag) => tag.id || tag.name)
                });
            } else if (type === 'IMPORT') {
                await createContacts({
                    contacts
                });
            } else if (type === 'DELETE_CONTACTS') {
                await deleteContacts();
            }

            setNewTagName('');
            setName('');
            setPhoneNumber('');
            setSelectedTags([]);
            setContacts([]);
            setTotalContacts(0);
            setLoading(false);

            onClose();
        } catch (error) {
            console.log('error', error);
            if (error?.response?.data?.message === 'Phone number already taken') {
                handleOpenSnackbar('Número de telefone já cadastrado', 'error');
            }

            if (error?.response?.status === 400 && type === 'IMPORT') {
                handleOpenSnackbar('Verifique o arquivo XLS', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const contacts = XLSX.utils.sheet_to_json(worksheet);

            const formattedContacts = contacts.map((contact) => ({
                name: contact.NOME,
                phone_number: contact.TELEFONE.toString().replace(/\D/g, ''),
                tags: contact.TAGS.split(',').map((tag) => tag.toUpperCase().trim())
            }));

            setContacts(formattedContacts);
            setTotalContacts(contacts.length);
        };

        reader.readAsArrayBuffer(file);
    };

    const closeDialog = () => {
        setNewTagName('');
        setName('');
        setPhoneNumber('');
        setSelectedTags([]);
        setContacts([]);
        setTotalContacts(0);

        onClose();
    };

    const getTitle = () => {
        if (type === 'TAG') {
            return 'Nova tag';
        }
        if (type === 'CONTACT') {
            return 'Novo contato';
        }
        if (type === 'IMPORT') {
            return 'Importar contatos';
        }
        if (type === 'DELETE_CONTACTS') {
            return 'Excluir contatos';
        }
    };

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogContent>
                {type === 'TAG' && (
                    <TextField
                        label="Tag name"
                        fullWidth
                        autoFocus
                        value={newTagName}
                        onChange={(event) => setNewTagName(event.target.value)}
                    />
                )}
                {type === 'CONTACT' && (
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} sx={{ mt: 1 }}>
                            <TextField label="Nome" fullWidth value={name} onChange={(event) => setName(event.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container columnSpacing={1}>
                                <Grid item xs={12}>
                                    <InputMask
                                        mask="999999999999999"
                                        value={phoneNumber}
                                        onChange={(event) => setPhoneNumber(event.target.value)}
                                        maskChar={null}
                                    >
                                        {() => <TextField fullWidth label="Telefone" />}
                                    </InputMask>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                id="tags-standard"
                                options={tags}
                                getOptionLabel={(option) => option.name}
                                value={selectedTags}
                                freeSolo
                                onChange={(event, value) => {
                                    const lastValue = value[value.length - 1];

                                    if (typeof lastValue === 'string') {
                                        const newTag = {
                                            name: lastValue
                                        };
                                        setSelectedTags((selectedTags) => [...selectedTags, newTag]);
                                    } else {
                                        setSelectedTags(value);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Tags" placeholder="Tags" />}
                            />
                        </Grid>
                    </Grid>
                )}
                {type === 'IMPORT' && (
                    <>
                        <Button variant="contained" component="label">
                            Selecionar arquivo
                            <input type="file" accept=".xlsx" onChange={handleFileUpload} hidden />
                        </Button>
                        {totalContacts > 0 && <p>{totalContacts} contatos encontrados</p>}
                    </>
                )}
                {type === 'DELETE_CONTACTS' && (
                    <DialogContentText id="alert-dialog-description">
                        Tem certeza que deseja excluir os contatos selecionados?
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                {loading ? (
                    <CircularProgress size={30} />
                ) : (
                    <>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSave}>{confirmButtonText}</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default withSnackbar(CustomDialog);
