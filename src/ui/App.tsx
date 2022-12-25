import { FC, ReactEventHandler, useEffect, useState } from 'react'
import { ThemeProvider } from './ThemeProvider';
import { Stack, Title, Checkbox, Button, List, Anchor, Text } from '@mantine/core'
import { ExtractedData, ExtractOption } from 'lib/extract';


type ExtractMessage = {
    type: 'extract'
    payload: ExtractOption
}

type SelectMessage = {
    type: 'select',
    payload: {
        nodeId: string
        pageId: string
    }
}

type Message = ExtractMessage | SelectMessage

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

    const handleClickExtract = () => {
        const message: ExtractMessage = {
            type: 'extract',
            payload: {
                privateNode: isPrivate,
            }
        }
        postMessage(message)
    }

    const [extractedData, setExtractedData] = useState<ExtractedData[]>([])
    
    type ExtractResultMesage = { type: 'result', payload: { data: ExtractedData[]} }
    const handleMessage = (evt: MessageEvent<{pluginMessage: ExtractResultMesage }>) => {
        setExtractedData(evt.data.pluginMessage.payload.data)
    }

    const handleClickAnchor = (nodeId: string, pageId: string) => {
        const message: SelectMessage = {
            type: 'select',
            payload: {
                nodeId,
                pageId
            }
        }
        postMessage(message)
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
                </Stack>
                <Button onClick={handleClickExtract} mt="lg">Extract</Button>
                {
                    !!extractedData.length
                        ? (
                            <List>
                                { extractedData.map(data => (
                                    <List.Item>
                                        <Text>{data.text}</Text>
                                        <List>
                                            {
                                                data.locations.map(location => (
                                                    <List.Item>
                                                        <Anchor onClick={() => handleClickAnchor(location.id, location.pageId)}>{location.pageName} {'->'} {location.name}</Anchor>
                                                    </List.Item>
                                                ))
                                            }
                                        </List>
                                    </List.Item>
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
