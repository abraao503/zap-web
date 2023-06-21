import React, { memo, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

const handleStyle = {
    top: '24px',
    right: '-15px',
    width: '6px',
    height: '10px',
    borderRadius: '2px',
    backgroundColor: '#778899'
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    padding: theme.spacing(1)
}));

function TextInput({ value: initialValue, handleId, nodeId }) {
    const { setNodes } = useReactFlow();
    const [value, setValue] = useState(initialValue);
    const store = useStoreApi();

    const onChange = (evt) => {
        const { nodeInternals } = store.getState();
        console.log('nodeInternals', nodeInternals);
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        inputs: {
                            ...node.data.inputs,
                            [handleId]: evt.target.value
                        }
                    };
                }

                return node;
            })
        );
        setValue(evt.target.value);
    };

    return (
        // <div className="custom-node__select">
        //     <TextField className="nodrag" onChange={onChange} value={value} fullWidth />
        // </div>
        <div className="custom-node__select">
            <div>Opção</div>
            <input className="nodrag" onChange={onChange} value={value} />
            <Handle type="source" position={Position.Right} id={handleId} />
        </div>
    );
}

function CustomNode({ id, data }) {
    const { setNodes } = useReactFlow();
    const [value, setValue] = useState(data.label);
    // const [image, setImage] = useState(data.image);
    // const [audio, setAudio] = useState(data.audio);

    const store = useStoreApi();

    function addInput(e) {
        // stop propagation to prevent the node from being selected

        e.stopPropagation();
        e.preventDefault();
        const { nodeInternals } = store.getState();

        const newId = `input-handle-${Object.keys(data.inputs).length}`;
        console.log('newId', newId);
        const newNode = Array.from(nodeInternals.values()).map((node) => {
            if (node.id === id) {
                node.data = {
                    ...node.data,
                    inputs: {
                        ...node.data.inputs,
                        [newId]: 'teste'
                    }
                };
                console.log('node.data', node.data);
            }

            return node;
        });

        console.log('newNode', newNode);

        setNodes(newNode);
    }

    // a function to remove an input
    function removeInput(e, handleId) {
        // stop propagation to prevent the node from being selected
        e.stopPropagation();
        e.preventDefault();

        const newInputs = Object.keys(data.inputs).reduce((acc, id) => {
            if (id !== handleId) {
                acc[id] = data.inputs[id];
            }

            return acc;
        }, {});

        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        inputs: newInputs
                    };
                }

                return node;
            })
        );
    }

    function onChangeInput(evt) {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        label: evt.target.value
                    };
                }

                return node;
            })
        );
        setValue(evt.target.value);
    }

    function changeImage(file) {
        const { nodeInternals } = store.getState();
        console.log('file', file);
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        image: file
                    };
                }

                return node;
            })
        );
        // setImage(file);
    }

    function changeAudio(file) {
        const { nodeInternals } = store.getState();
        console.log('file', file);
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        audio: file
                    };
                }

                return node;
            })
        );
        // setAudio(file);
    }

    function onChangeType(evt) {
        const { nodeInternals } = store.getState();

        if (evt.target.value !== 'OPTIONS') {
            const inputs = Object.keys(data.inputs);
            data.removeInputsEdges(id, inputs);
        } else if (evt.target.value === 'OPTIONS') {
            data.removeSourceEdges(id);
        }

        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        type: evt.target.value
                    };
                }

                return node;
            })
        );
    }

    return (
        <Item sx={{ minWidth: 275 }}>
            <Handle type="target" position={Position.Left} id={id} style={handleStyle} />
            {data.type !== 'OPTIONS' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    id={id}
                    style={{
                        ...handleStyle
                        // marginRight: -84
                    }}
                />
            )}

            <Grid container>
                <Grid item xs={12}>
                    <IconButton
                        color="error"
                        onClick={() => data.removeNode(id)}
                        size="medium"
                        classes={{
                            root: 'nodrag'
                        }}
                    >
                        <CloseOutlined />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <FormControl
                        fullWidth
                        classes={{
                            root: 'nodrag'
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={data.type}
                            label="Age"
                            onChange={(e) => onChangeType(e)}
                        >
                            <MenuItem value={'TEXT'}>Texto</MenuItem>
                            <MenuItem value={'OPTIONS'}>Opções</MenuItem>
                            <MenuItem value={'IMAGE'}>Imagem</MenuItem>
                            <MenuItem value={'AUDIO'}>Áudio</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{
                        mt: 2
                    }}
                >
                    {['TEXT', 'OPTIONS'].includes(data.type) && (
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Mensagem"
                            multiline
                            maxRows={4}
                            value={value}
                            onChange={onChangeInput}
                            fullWidth
                            classes={{
                                root: 'nodrag'
                            }}
                        />
                    )}
                    {data.type === 'IMAGE' && (
                        // choose a image to upload
                        <input
                            type="file"
                            accept="image/*"
                            className="nodrag"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                changeImage(file);
                            }}
                        />
                    )}
                    {data.type === 'AUDIO' && (
                        // choose a audio to upload
                        <input
                            type="file"
                            accept="audio/*"
                            className="nodrag"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                changeAudio(file);
                            }}
                        />
                    )}
                    <div className="custom-node__body">
                        {data.type === 'OPTIONS' &&
                            Object.keys(data.inputs).map((handleId) => (
                                <Grid container key={handleId}>
                                    <Grid item xs={1}>
                                        {/* <button onClick={(e) => removeInput(e, handleId)}>Remove</button> */}
                                        <IconButton
                                            color="error"
                                            onClick={(e) => removeInput(e, handleId)}
                                            size="medium"
                                            classes={{
                                                root: 'nodrag'
                                            }}
                                        >
                                            <CloseOutlined />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <TextInput nodeId={id} value={data.inputs[handleId]} handleId={handleId} />
                                        {/* <Handle
                                            type="source"
                                            position={Position.Right}
                                            id={handleId}
                                            // style={{
                                            //     ...handleStyle,
                                            //     top: 200
                                            // }}
                                        /> */}
                                    </Grid>
                                </Grid>
                            ))}
                    </div>
                    {data.type === 'OPTIONS' && (
                        <button className="nodrag" onClick={addInput}>
                            Add input
                        </button>
                    )}
                </Grid>
            </Grid>
        </Item>
    );
}

export default memo(CustomNode);
