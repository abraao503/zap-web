import React, { memo, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

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

    function onChangeType(evt) {
        const { nodeInternals } = store.getState();

        if (evt.target.value === 'TEXT') {
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
        <>
            <div className="custom-node__header">
                This is a <strong>custom node</strong>
                <button onClick={() => data.removeNode(id)}>Remove</button>
            </div>
            <Handle type="target" position={Position.Left} id={id} />
            {data.type === 'TEXT' && (
                <>
                    <input className="nodrag" value={value} onChange={onChangeInput} />
                    <Handle type="source" position={Position.Right} id={id} />
                </>
            )}
            <select className="nodrag" value={data.type} onChange={(e) => onChangeType(e)}>
                <option value="TEXT">Texto</option>
                <option value="OPTIONS">Opções</option>
            </select>
            <div className="custom-node__body">
                {data.type === 'OPTIONS' &&
                    Object.keys(data.inputs).map((handleId) => (
                        <div key={handleId}>
                            <button onClick={(e) => removeInput(e, handleId)}>Remove</button>
                            <TextInput nodeId={id} value={data.inputs[handleId]} handleId={handleId} />
                        </div>
                    ))}
            </div>
            <button onClick={addInput}>Add input</button>
        </>
    );
}

export default memo(CustomNode);
