import { FC, useEffect, useState } from 'react'
import { ThemeProvider } from '~/ui/ThemeProvider';
import { Stack, Title, Checkbox, Button } from '@mantine/core'
import { ExtractedData } from '~/lib/extract';
import { ExtractMessage, ExtractResultMesage, LoadPagesMessage, MessageEventFromFigma, PagesMessage, postMessageToFigma } from '~/lib/message';
import ExtractedDataTable from './ExtractDataTable';

const App: FC = () => {

    const [isPrivate, setIsPrivate] = useState(false)
    const handleCheckPrivate = () => {
        setIsPrivate(!isPrivate)
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleClickExtract = () => {
        const message: ExtractMessage = {
            type: 'extract',
            payload: {
                privateNode: isPrivate,
                pageIds: selectedPageIds,
            },
        }
        setIsLoading(true)
        postMessageToFigma(message)
    }

    const [extractedData, setExtractedData] = useState<ExtractedData[]>([])

    const [pages, setPages] = useState<{ id: string; name: string }[]>([])
    
    const handleMessage = (evt: MessageEventFromFigma<PagesMessage | ExtractResultMesage>) => {
        switch(evt.data.pluginMessage.type) {
            case 'result':
                setExtractedData(evt.data.pluginMessage.payload.data)
                setIsLoading(false)
                return
            case 'pages':
                setPages(evt.data.pluginMessage.payload.data)
                return
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        const message: LoadPagesMessage = {
            type: 'load-pages',
        }
        postMessageToFigma(message)
    })

    const downloadJson = () => {
        const a = document.createElement('a')
        const blob = new Blob([JSON.stringify(extractedData, null, '  ')], {type: 'application\/json'})
        const url = URL.createObjectURL(blob)
        a.download = 'text.json'
        a.href = url
        a.click()
    }

    const [selectedPageIds, selectPageIds] = useState<string[]>([])
    const handleCheckPage = (id: string) => {
        const set = new Set(selectedPageIds)
        if (set.has(id)) {
            set.delete(id)
        } else {
            set.add(id)
        }
        selectPageIds([
            ...Array.from(set),
        ])
    }

    const[showExtractedData, setShowExtractedData] = useState(false)

    return (
        <ThemeProvider>
            <Stack justify="flex-start" p="lg">
                <Title order={1} mb="md">Text Extractor</Title>
                {
                    !!pages.length && (
                        <Checkbox.Group value={selectedPageIds} mb="lg">
                            <Stack justify="flex-start">
                                {
                                    pages.map((page => (
                                        <Stack>
                                            <Checkbox
                                                onClick={() => handleCheckPage(page.id)}
                                                value={page.id}
                                                label={page.name}
                                            />
                                        </Stack>
                                    )))
                                }
                            </Stack>
                        </Checkbox.Group>
                    )
                }
                <Stack>
                    <Stack mb="md">
                        <Checkbox
                            onChange={handleCheckPrivate}
                            checked={isPrivate}
                            label="非表示の要素も抽出する"
                        />
                    </Stack>
                </Stack>
                <Button onClick={handleClickExtract} loading={isLoading} mt="lg">Extract</Button>
                {!!extractedData.length && (
                    <Button onClick={downloadJson} mt="lg">Download</Button>
                )}
            </Stack>
        </ThemeProvider>
    )
}

export default App
