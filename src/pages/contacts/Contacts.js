import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseSquareOutlined, SearchOutlined } from '@ant-design/icons';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
// import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import contactsService from 'services/contactsService';
import tagsService from 'services/tagsService';
import Dialog from './Dialog';
import { withSnackbar } from 'components/withSnackBar';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    padding: theme.spacing(1)
}));

const Contacts = ({ handleOpen: handleOpenSnackbar }) => {
    const [editId, setEditId] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [tags, setTags] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [editTags, setEditTags] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState({
        name: '',
        phone_number: '',
        tags: []
    });
    const [lineLoading, setLineLoading] = useState(null);
    const [dialogType, setDialogType] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);

    useEffect(() => {
        getContacts({
            page: page + 1,
            limit: rowsPerPage
        });
        getTags();
    }, []);

    const getTags = async () => {
        const tags = await tagsService.getTags();
        setTags(tags);
    };

    const handleSetSearch = (key, value) => {
        setSearch((search) => {
            return {
                ...search,
                [key]: value
            };
        });
    };

    const handleSearch = async () => {
        const newSearch = Object.keys(search).reduce((obj, key) => {
            if (search[key] !== '') {
                obj[key] = search[key];
            }

            if (key === 'tags') {
                obj[key] = search[key].map((tag) => tag.id);
            }

            return obj;
        }, {});

        await getContacts({
            page: 1,
            limit: rowsPerPage,
            ...newSearch
        });
    };

    const handleSelectContact = (e, id) => {
        if (e.target.checked) {
            setSelectedContacts((selectedContacts) => {
                return [...selectedContacts, id];
            });
        } else {
            setSelectedContacts((selectedContacts) => {
                return selectedContacts.filter((contactId) => contactId !== id);
            });
        }
    };

    const getContacts = async (query) => {
        const contacts = await contactsService.getContacts(query);
        setContacts(contacts.results);
        setTotal(contacts.totalResults);
    };

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);

        await getContacts({
            page: newPage + 1,
            limit: rowsPerPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

        getContacts({
            page: 0,
            limit: parseInt(event.target.value, 10)
        });
    };

    const handleEdit = (id) => {
        if (editId !== null) {
            return;
        }

        const contato = contacts.find((c) => c.id === id);
        setEditId(id);
        setEditNome(contato.name);
        setEditTelefone(contato.phone_number);
        setEditTags(contato.tags || []);
    };

    const updateContact = (id, data) => {
        setContacts((contacts) => {
            return contacts.map((contato) => {
                if (contato.id === id) {
                    return { ...contato, ...data };
                }
                return contato;
            });
        });
    };

    const handleSave = async (id) => {
        try {
            setLineLoading(id);

            const data = {
                name: editNome,
                phone_number: editTelefone,
                tags: editTags.map((tag) => tag.id)
            };

            await contactsService.patchContact(id, data);
            updateContact(id, {
                ...data,
                tags: editTags
            });

            setEditId(null);
            setEditNome('');
            setEditTelefone('');
            setEditTags([]);
        } catch (error) {
            console.log(error);

            if (error?.response?.data?.message === '"phone_number" must be in the format "country_code phone_number"') {
                handleOpenSnackbar('Formato de número inválido', 'error');
            }
        } finally {
            setLineLoading(null);
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setEditNome('');
        setEditTelefone('');
    };

    const handleDelete = async (id) => {
        await contactsService.deleteContact(id);
        setContacts((contacts) => {
            return contacts.filter((contato) => contato.id !== id);
        });
    };

    const handleDeleteSelectedContacts = async () => {
        await contactsService.deleteContacts(selectedContacts);
        await getContacts({
            page: page + 1,
            limit: rowsPerPage
        });
        setSelectedContacts([]);
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const createTag = async (data) => {
        const newTag = await tagsService.postTag(data);

        setEditTags((editTags) => [...editTags, newTag]);
        setTags((tags) => [...tags, newTag]);
        setNewTagName('');
    };

    const createContact = async (data) => {
        await contactsService.postContact(data);
        await getContacts({
            page: page + 1,
            limit: rowsPerPage
        });
    };

    const createContacts = async (data) => {
        await contactsService.postContacts(data);
        await getContacts({
            page: page + 1,
            limit: rowsPerPage
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Grid item xs={12}>
                    <Item
                        sx={{
                            mb: 2
                        }}
                    >
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <OutlinedInput
                                        value={search.name}
                                        onChange={(e) => handleSetSearch('name', e.target.value)}
                                        size="small"
                                        id="header-search"
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                                <SearchOutlined />
                                            </InputAdornment>
                                        }
                                        aria-describedby="header-search-text"
                                        inputProps={{
                                            'aria-label': 'weight'
                                        }}
                                        sx={{
                                            height: 37
                                        }}
                                        placeholder="Pesquisar por nome"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <OutlinedInput
                                        value={search.phone_number}
                                        onChange={(e) => handleSetSearch('phone_number', e.target.value)}
                                        size="small"
                                        id="header-search"
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                                <SearchOutlined />
                                            </InputAdornment>
                                        }
                                        aria-describedby="header-search-text"
                                        inputProps={{
                                            'aria-label': 'weight'
                                        }}
                                        sx={{
                                            height: 37
                                        }}
                                        placeholder="Pesquisar por telefone"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    value={search.tags}
                                    onChange={(e, value) => handleSetSearch('tags', value)}
                                    multiple
                                    size="small"
                                    disablePortal
                                    id="tags-standard"
                                    options={tags}
                                    filterSelectedOptions
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} placeholder="Pesquisar por tag" />}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Button variant="contained" color="primary" onClick={handleSearch}>
                                    Pesquisar
                                </Button>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            mb: 2
                        }}
                    >
                        <Button variant="contained" component="label" onClick={() => handleOpenDialog('IMPORT')}>
                            Importar contatos
                        </Button>
                        <Button variant="contained" component="label" onClick={() => handleOpenDialog('CONTACT')}>
                            Novo contato
                        </Button>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDialog('DELETE_CONTACTS')}
                            disabled={selectedContacts.length === 0}
                        >
                            Exclusão em massa
                        </Button>
                    </Item>
                </Grid>
            </Grid>
            <Grid item xs={12} md={8}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left">Nome</TableCell>
                                <TableCell align="left">Telefone</TableCell>
                                <TableCell align="left">Tags</TableCell>
                                <TableCell align="left">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((contato) => (
                                <TableRow key={contato.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="left">
                                        <Checkbox
                                            checked={selectedContacts.includes(contato.id)}
                                            onChange={(e) => handleSelectContact(e, contato.id)}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        {editId === contato.id ? (
                                            <TextField value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                                        ) : (
                                            contato.name
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editId === contato.id ? (
                                            <TextField value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} />
                                        ) : (
                                            contato.phone_number
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editId === contato.id ? (
                                            <Autocomplete
                                                value={editTags}
                                                sx={{ width: 300 }}
                                                multiple
                                                id="tags-filled"
                                                options={tags}
                                                defaultValue={contato.tags}
                                                freeSolo
                                                getOptionLabel={(option) => option.name}
                                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                                renderTags={(value, getTagProps) => {
                                                    return value.map((option, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={typeof option === 'string' ? option : option.name}
                                                            {...getTagProps({ index })}
                                                        />
                                                    ));
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Tags" placeholder="Selecione" />}
                                                onChange={(e, value) => {
                                                    const lastValue = value[value.length - 1];

                                                    if (typeof lastValue === 'string') {
                                                        setNewTagName(lastValue);
                                                        handleOpenDialog('TAG');
                                                    } else {
                                                        setEditTags(value);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            contato?.tags?.map((tag) => tag.name).join(', ')
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editId === contato.id ? (
                                            <>
                                                {lineLoading === contato.id ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <>
                                                        <Button variant="contained" color="success" onClick={() => handleSave(contato.id)}>
                                                            <SaveOutlined />
                                                        </Button>
                                                        <Button variant="contained" color="error" onClick={() => handleCancel()}>
                                                            <CloseSquareOutlined />
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <IconButton
                                                    disabled={editId !== null}
                                                    color="primary"
                                                    aria-label="edit"
                                                    onClick={() => handleEdit(contato.id)}
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                                <IconButton color="error" aria-label="delete" onClick={() => handleDelete(contato.id)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    type={dialogType}
                    tags={tags}
                    createContact={createContact}
                    createTag={createTag}
                    createContacts={createContacts}
                    tagName={newTagName}
                    deleteContacts={handleDeleteSelectedContacts}
                />
            </Grid>
        </Grid>
    );
};

export default withSnackbar(Contacts);
