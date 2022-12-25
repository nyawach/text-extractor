import { ExtractOption } from "./extract"

export type Message = ExtractMessage | SelectMessage

export type ExtractMessage = {
    type: 'extract'
    payload: ExtractOption
}

export type SelectMessage = {
    type: 'select',
    payload: {
        nodeId: string
        pageId: string
    }
}

export type MessageEventFromFigma<T extends any> = MessageEvent<{ pluginMessage: T }>

export const postMessageToFigma = (message: Message) => {
    const TARGET_ORIGIN = '*'
    parent.postMessage({ pluginMessage: message }, TARGET_ORIGIN)
}
