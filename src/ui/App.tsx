import { FC, useEffect, useState } from 'react'
import { ThemeProvider } from '~/ui/ThemeProvider';
import { Stack, Title, Checkbox, Button, Code } from '@mantine/core'
import { ExtractedData } from '~/lib/extract';
import { ExtractMessage, ExtractResultMesage, LoadPagesMessage, MessageEventFromFigma, PagesMessage, postMessageToFigma } from '~/lib/message';

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
        const blob = new Blob([JSON.stringify(filteredExtractedData, null, '  ')], {type: 'application\/json'})
        const url = URL.createObjectURL(blob)
        a.download = 'text.json'
        a.href = url
        a.click()
    }

    const  [showJson, setShowJson] = useState(false)
    const onChangeShowJson: React.ChangeEventHandler<HTMLInputElement> = () => {
        setShowJson(old => !old)
    }

    const [selectedPageIds, selectPageIds] = useState<string[]>([])
    const isAllChecked = selectedPageIds.length === pages.length
    const isAnyChecked = !!selectedPageIds.length
    const togglePages = () => {
        if (isAllChecked) {
            selectPageIds([])
        } else {
            selectPageIds(pages.map(page => page.id))
        }
    }
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

    const locationColumns = (extractedData.length ? Object.keys(extractedData[0].locations[0]) : []) as (keyof Location)[]
    const [columns, setColumns] = useState<(keyof Location)[]>([...locationColumns])
    const handleCheckColumn = (id: keyof Location) => {
        const set = new Set(columns)
        if (set.has(id)) {
            set.delete(id)
        } else {
            set.add(id)
        }
        setColumns([
            ...Array.from(set),
        ])
    }

    const isKeyof = (d: object, key: string): key is keyof typeof d =>{
        return key in d
    }

    const filteredExtractedData = extractedData.map(d => ({
        text: d.text,
        locations: d.locations.flatMap(l => {
            if (!columns.length) {
                return []
            }
            return columns.reduce((acc, key) => {
                if (isKeyof(l, key)) {
                    return {
                        ...acc,
                        [key]: l[key],
                    }
                }
                return acc
            }, {} as Partial<Location>)
        })
    }))

    return (
        <ThemeProvider>
            <Stack justify="flex-start" p="lg">
                <Title order={1} mb="md">Text Extractor</Title>
                {
                    !!pages.length && (
                        <Stack justify="flex-start">
                            <Checkbox
                                onChange={togglePages}
                                checked={isAllChecked}
                                label="全選択"
                            />
                            <Checkbox.Group value={selectedPageIds} mb="lg">
                                <Stack justify="flex-start">{
                                    pages.map((page => (
                                        <Checkbox
                                            onClick={() => handleCheckPage(page.id)}
                                            value={page.id}
                                            label={page.name}
                                        />
                                    )))
                                }</Stack>
                            </Checkbox.Group>
                        </Stack>
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
                <Button onClick={handleClickExtract} disabled={!isAnyChecked} loading={isLoading} mt="lg">Extract</Button>
                {!!extractedData.length && (
                    <>
                        <Checkbox.Group value={columns} mb="lg">
                            <Stack justify="flex-start">{
                                locationColumns.map((column => (
                                    <Checkbox
                                        onClick={() => handleCheckColumn(column)}
                                        value={column}
                                        label={column}
                                    />
                                )))
                            }</Stack>
                        </Checkbox.Group>
                        <Checkbox defaultChecked={showJson} onChange={onChangeShowJson} label="JSONを表示する" />
                        {showJson && (
                            <Code block>{JSON.stringify(filteredExtractedData, null, 2)}</Code>
                        )}
                        <Button onClick={downloadJson} loading={isLoading} mt="lg">Download</Button>
                    </>
                )}
            </Stack>
        </ThemeProvider>
    )
}

export default App
