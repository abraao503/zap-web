import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState, updateEdge } from 'reactflow';
import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from '@mui/material/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';
import './overview.css';
import { FormHelperText } from '../../../node_modules/@mui/material/index';
import tagsService from 'services/tagsService';
import instancesService from 'services/instancesService';
import campaignsService from 'services/campaignsService';

const nodeTypes = {
    custom: CustomNode
};

const minimapStyle = {
    height: 120
};

const validationSchema = Yup.object().shape({
    instance: Yup.string().required('Selecione uma instância.'),
    tags: Yup.array().of(Yup.string()).min(1, 'Selecione pelo menos uma tag.'),
    scheduled_at: Yup.string().when('to_schedule', {
        is: true,
        then: Yup.string().required('Selecione uma data e hora.'),
        otherwise: Yup.string()
    }),
    to_schedule: Yup.boolean()
});

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const ComponentColor = () => {
    const edgeUpdateSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [step, setStep] = useState(0);
    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedInstance, setSelectedInstance] = useState('');
    const [messages, setMessages] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');
    const [toSchedule, setAgendarData] = React.useState(false);
    const [scheduleAt, setScheduleAt] = React.useState(null);
    const [instances, setInstances] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const instancesReponse = await instancesService.getInstances();
            const tagsResponse = await tagsService.getTags();

            const instances = instancesReponse.map((instance) => ({
                label: instance.name,
                value: instance.id
            }));

            const tags = tagsResponse.map((tag) => ({
                label: tag.name,
                value: tag.id
            }));

            setInstances(instances);
            setTags(tags);
        };

        console.log('fetching data');

        fetchData();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorSnackbarMessage('');
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const formik = useFormik({
        initialValues: {
            instance: '',
            tags: [],
            scheduled_at: '',
            to_schedule: false
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setStep((step) => step + 1);
        }
    });

    const handleInstanceSelect = (event) => {
        setSelectedInstance(event.target.value);
        formik.setFieldValue('instance', event.target.value);
    };

    const onConnect = useCallback((params) => {
        return setEdges((eds) => {
            const connectionWithHandles = eds.filter(
                (edge) => edge.sourceHandle === params.sourceHandle || edge.targetHandle === params.targetHandle
            );

            if (connectionWithHandles.length > 0) {
                const newEdges = eds.filter((edge) => !connectionWithHandles.includes(edge));

                return addEdge(params, newEdges);
            }

            return addEdge(params, eds);
        });
    }, []);

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    const removeNode = (nodeId) => {
        setNodes((ns) => ns.filter((n) => n.id !== nodeId));
        setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId));
    };

    const removeInputsEdges = (nodeId, inputs) => {
        setEdges((es) => es.filter((e) => !inputs.includes(e.sourceHandle)));
    };

    const removeSourceEdges = (nodeId) => {
        setEdges((es) => es.filter((e) => e.source !== nodeId));
    };

    const addCustomNode = useCallback(() => {
        setNodes((ns) => [
            ...ns,
            {
                id: `custom-${ns.length}`,
                type: 'custom',
                position: { x: 250, y: 250 },
                data: {
                    type: 'TEXT',
                    label: `Custom Node ${ns.length}`,
                    inputs: {
                        'input-handle-0': 'input'
                    },
                    removeNode,
                    removeInputsEdges,
                    removeSourceEdges
                }
            }
        ]);
    }, []);

    const logEdges = async () => {
        console.log(nodes);
        console.log(edges);

        const firstNodeEdge = edges.find((edge) => edge.source === '5');

        if (!firstNodeEdge) {
            setOpenSnackbar(true);
            setErrorSnackbarMessage('Indique o início da mensagens');
            return;
        }

        const firstNode = nodes.find((node) => node.id === firstNodeEdge.targetHandle);

        function getNextMessage(nodeId) {
            const nextNodeEdge = edges.find((edge) => edge.sourceHandle === nodeId);

            if (!nextNodeEdge) {
                return null;
            }

            const nextNode = nodes.find((node) => node.id === nextNodeEdge.targetHandle);

            if (nextNode.data.type === 'TEXT') {
                return {
                    type: 'TEXT',
                    text: nextNode.data.label,
                    next_message: getNextMessage(nextNodeEdge.targetHandle),
                    position: nextNode.position
                };
            }

            if (nextNode.data.type === 'OPTIONS') {
                const options = Object.keys(nextNode.data.inputs).map((key) => {
                    return {
                        content: nextNode.data.inputs[key],
                        next_message: getNextMessage(key)
                    };
                });

                return {
                    type: 'OPTIONS',
                    text: nextNode.data.label,
                    options,
                    position: nextNode.position
                };
            }
        }

        const firstMessageType = firstNode.data.type;

        const firstMessage = {
            type: firstMessageType,
            text: firstNode.data.label,
            position: firstNode.position
        };

        if (firstMessageType === 'TEXT') {
            firstMessage.next_message = getNextMessage(firstNodeEdge.targetHandle);
        } else if (firstMessageType === 'OPTIONS') {
            const options = Object.keys(firstNode.data.inputs).map((key) => {
                return {
                    content: firstNode.data.inputs[key],
                    next_message: getNextMessage(key)
                };
            });

            firstMessage.options = options;
        }

        setMessages(firstMessage);
        // setStep((step) => step + 1);

        const campaignData = {
            name: title,
            tags: selectedTags.map((tag) => tag.value),
            to_schedule: false,
            message: firstMessage
        };

        console.log(campaignData);

        await campaignsService.postCampaign(campaignData);
    };

    const handleChangeToSchedule = (event) => {
        setAgendarData(event.target.checked);
        setScheduleAt(null);
        formik.setFieldValue('to_schedule', event.target.checked);
    };

    const handleChangeScheduleAt = (newDate) => {
        setScheduleAt(newDate);

        if (!newDate) {
            formik.setFieldValue('scheduled_at', '');
            return;
        }

        formik.setFieldValue('scheduled_at', newDate.toISOString());
    };

    const handleTagChange = (event, value) => {
        formik.setFieldValue(
            'tags',
            value.map((tag) => tag.value)
        );
        setSelectedTags(value);
    };

    return (
        <div className="container-campaigns">
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    message={errorSnackbarMessage}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                                <CloseOutlined fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                    style={{ backgroundColor: '#f44336' }}
                />
            </Snackbar>
            <Box
                sx={{
                    mb: 4
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button onClick={() => setStep(step - 1)} disabled={step === 0}>
                                Voltar
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Box>
            {step === 0 && (
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                id="title"
                                label="Titulo da campanha"
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                options={tags}
                                getOptionLabel={(option) => option.label}
                                filterSelectedOptions
                                value={selectedTags}
                                onChange={handleTagChange}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Tags" placeholder="Tags de contatos" />
                                )}
                            />
                            {formik.errors.tags && formik.touched.tags && <FormHelperText error>{formik.errors.tags}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="instance-label">Instance</InputLabel>
                                <Select
                                    labelId="instance-label"
                                    id="instance-select"
                                    value={selectedInstance}
                                    onChange={handleInstanceSelect}
                                    inputProps={{
                                        name: 'instance',
                                        id: 'instance'
                                    }}
                                >
                                    {instances.map((instance) => (
                                        <MenuItem key={instance.value} value={instance.value}>
                                            {instance.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.instance && formik.touched.instance && (
                                    <FormHelperText error>{formik.errors.instance}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={toSchedule} onChange={handleChangeToSchedule} name="toSchedule" color="primary" />
                                }
                                label="Agendar data de disparo"
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => (toSchedule ? <TextField {...props} /> : <TextField {...props} disabled />)}
                                    label="Data de Disparo"
                                    value={scheduleAt}
                                    onChange={handleChangeScheduleAt}
                                    disabled={!toSchedule}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                />
                            </LocalizationProvider>
                            {formik.errors.scheduled_at && formik.touched.scheduled_at && (
                                <FormHelperText error>{formik.errors.scheduled_at}</FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained">
                                Próximo
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}
            {step === 1 && (
                <>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onEdgeUpdate={onEdgeUpdate}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        onConnect={onConnect}
                        onInit={onInit}
                        fitView
                        attributionPosition="top-right"
                        nodeTypes={nodeTypes}
                    >
                        <MiniMap style={minimapStyle} zoomable pannable />
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                    <div className="fixed-menu">
                        <button onClick={addCustomNode}>
                            <span>Nova mensagem</span>
                        </button>
                        <button onClick={logEdges}>
                            <span>Próximo</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ComponentColor;
