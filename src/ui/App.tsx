import { FC, useEffect, useState } from 'react'
import { ThemeProvider } from '~/ui/ThemeProvider';
import { Stack, Title, Checkbox, Button, List, Anchor, Text } from '@mantine/core'
import { ExtractedData, ExtractResultMesage, Location } from '~/lib/extract';
import { ExtractMessage, MessageEventFromFigma, postMessageToFigma, SelectMessage } from '~/lib/message';
import ExtractedDataTable from './ExtractDataTable';

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
        postMessageToFigma(message)
    }

    const [extractedData, setExtractedData] = useState<ExtractedData[]>([])
    
    const handleMessage = (evt: MessageEventFromFigma<ExtractResultMesage>) => {
        setExtractedData(evt.data.pluginMessage.payload.data)
    }

    const handleClickAnchor = ({ page: { id: pageId }, frame: {id: frameId}, node: { id: nodeId }}: Location) => {
        const message: SelectMessage = {
            type: 'select',
            payload: {
                nodeId: nodeId || frameId,
                pageId
            }
        }
        postMessageToFigma(message)
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
                <ExtractedDataTable data={extractedData} />
            </Stack>
        </ThemeProvider>
    )
}

export default App
