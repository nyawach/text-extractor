import { FC } from 'react'
import { ThemeProvider } from './ThemeProvider';


type CreateRectanglesMessageType = {
    type: 'create-rectangles'
    count: number
}

type CancelMessageType = {
    type: 'cancel'
}

type MessageTypes = CreateRectanglesMessageType | CancelMessageType

type PostMessagePayload = {
    pluginMessage: MessageTypes
}

const NODE_TYPES: NodeType[] = [
    'BOOLEAN_OPERATION',
    'CODE_BLOCK',
    'COMPONENT',
    'COMPONENT_SET',
    'CONNECTOR',
    'DOCUMENT',
    'ELLIPSE',
    'EMBED',
    'FRAME',
    'GROUP',
    'HIGHLIGHT',
    'INSTANCE',
    'LINE',
    'LINK_UNFURL',
    'MEDIA',
    'PAGE',
    'POLYGON',
    'RECTANGLE',
    'SECTION',
    'SHAPE_WITH_TEXT',
    'SLICE',
    'STAMP',
    'STAR',
    'STICKY',
    'TEXT',
    'VECTOR',
    'WASHI_TAPE',
    'WIDGET',
]

const TARGET_ORIGIN = '*'

const App: FC = () => {
    const handleClickCreate = () => {
        const textbox = document.getElementById('count');
        const count = parseInt((textbox as HTMLInputElement)?.value ?? '0', 10);
        const payload: PostMessagePayload = {
            pluginMessage: {
                type: 'create-rectangles',
                count,
            },
        }
        parent.postMessage(payload, TARGET_ORIGIN)
    }
    const handleClickCancel = () => {
        const payload: PostMessagePayload = {
            pluginMessage: { type: 'cancel' }
        }
        parent.postMessage(payload, TARGET_ORIGIN)
    }
    return (
        <ThemeProvider>
            <h2>Text Extractor</h2>
            <button id="create" onClick={handleClickCreate}>Create</button>
            <button id="cancel" onClick={handleClickCancel}>Cancel</button>
            <ul>
                {NODE_TYPES.map(nodeType => (
                    <li>
                        <label>
                            <input type="checkbox" value={nodeType} />
                            {nodeType}
                        </label>
                    </li>
                ))}
            </ul>
        </ThemeProvider>
    )
}

export default App
