import { FC, ReactEventHandler, useEffect, useState } from 'react'
import { ThemeProvider } from './ThemeProvider';
import { Stack, Title, Checkbox, Button, List } from '@mantine/core'
import { ExtractOption } from 'lib/extract';


type ExtractMessage = {
    type: 'extract'
    payload: ExtractOption
}

type CancelMessage = {
    type: 'cancel'
}

type Message = ExtractMessage | CancelMessage

const NODE_TYPES: NodeType[] = [
    'SHAPE_WITH_TEXT',
    'TEXT',
]

const postMessage = (message: Message) => {
    const TARGET_ORIGIN = '*'
    parent.postMessage({ pluginMessage: message }, TARGET_ORIGIN)
}

const App: FC = () => {

    const [isPrivate, setIsPrivate] = useState(false)
    const handleCheckPrivate = () => {
        setIsPrivate(!isPrivate)
    }

    const [nodeTypes, setNodeTypes] = useState<string[]>([...NODE_TYPES])

    const handleClickExtract = () => {
        const message: ExtractMessage = {
            type: 'extract',
            payload: {
                privateNode: isPrivate,
                nodeTypes: nodeTypes as NodeType[],
            }
        }
        postMessage(message)
    }

    const [texts, setTexts] = useState<string[]>([])
    
    const handleMessage = (evt: MessageEvent<{pluginMessage: { type: 'result', payload: {texts: string[]} }}>) => {
        console.log(evt.data);
        setTexts(evt.data.pluginMessage.payload.texts)
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    return (
        <ThemeProvider>
            <Stack justify="flex-start" p="lg">
                <Title order={1} mb="md">Text Extractor</Title>
                <Stack>
                    <Stack mb="md">
                        <Checkbox
                            onChange={handleCheckPrivate}
                            checked={isPrivate}
                            label="非表示の要素も抽出する"
                        />
                    </Stack>
                    <Checkbox.Group
                        orientation="vertical"
                        label="対象の Data Types を選んでください"
                        description="https://www.figma.com/plugin-docs/api/data-types"
                        value={nodeTypes}
                        onChange={setNodeTypes}
                        offset="md"
                    >
                        {NODE_TYPES.map(nodeType => (
                            <Checkbox value={nodeType} label={nodeType} />
                        ))}
                    </Checkbox.Group>
                </Stack>
                <Button onClick={handleClickExtract} mt="lg">Extract</Button>
                {
                    !!texts.length
                        ? (
                            <List>
                                { texts.map(text => (
                                    <List.Item>{text}</List.Item>
                                )) }
                            </List>
                        )
                        : null
                }
            </Stack>
        </ThemeProvider>
    )
}

export default App
