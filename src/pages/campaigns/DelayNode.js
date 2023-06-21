import React, { memo, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

function DelayNode({ id, data }) {
    const { setNodes } = useReactFlow();
    const [value, setValue] = useState(data.delay);

    const store = useStoreApi();

    function onChangeInput(evt) {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        delay: evt.target.value
                    };
                }

                return node;
            })
        );
        setValue(evt.target.value);
    }

    return (
        <>
            <div className="custom-node__header">
                Delay
                <button className="nodrag" onClick={() => data.removeNode(id)}>
                    Remove
                </button>
            </div>
            <Handle type="target" position={Position.Left} id={id} />
            <Handle type="source" position={Position.Right} id={id} />
            <input className="nodrag" value={value} type="number" onChange={onChangeInput} />
        </>
    );
}

export default memo(DelayNode);
