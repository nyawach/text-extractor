import { ExtractedData, ExtractOption } from "./extract"

export type ExtractMessage = {
    type: 'extract'
    payload: ExtractOption
}

export type ExtractResultMesage = { type: 'result', payload: { data: ExtractedData[]} }

export type SelectMessage = {
    type: 'select',
    payload: {
        nodeId: string
        pageId: string
    }
}

export type LoadPagesMessage = {
    type: 'load-pages',
}

export type PagesMessage = {
    type: 'pages',
    payload: {
        data: {
            id: string
            name: string
        }[],
    },
}

export type Message = 
    | ExtractMessage
    | ExtractResultMesage
    | SelectMessage
    | LoadPagesMessage
    | PagesMessage

export type MessageEventFromFigma<T extends any> = MessageEvent<{ pluginMessage: T }>

export const postMessageToFigma = (message: Message) => {
    const TARGET_ORIGIN = '*'
    parent.postMessage({ pluginMessage: message }, TARGET_ORIGIN)
}
