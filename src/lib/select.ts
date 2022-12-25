import { SelectMessage } from "./message"

export const select = ({ nodeId, pageId } : SelectMessage['payload'] ) => {
    const page = figma.root.findOne(
        node => node.type === 'PAGE' && node.id === pageId
    )
    if (!page) {
        return
    }
    figma.currentPage = page as PageNode

    const node = figma.root.findOne(
        node => node.id === nodeId
    )
    if (!node) {
        return
    }
    figma.viewport.scrollAndZoomIntoView([node])
}
