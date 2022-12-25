import { extract } from "../lib/extract";

figma.skipInvisibleInstanceChildren = true

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(480, 640)

figma.ui.onmessage = msg => {
  if (msg.type === 'extract') {
    const extractedData = extract(msg.payload)
    figma.ui.postMessage({
      type: 'result',
      payload: {
        data: extractedData,
      },
    })
    return
  }
  if (msg.type === 'select') {
    const page = figma.root.findOne(node => node.type === 'PAGE' && node.id === msg.payload.pageId)
    if (!page) return
    figma.currentPage = page as PageNode
    const node = figma.root.findOne(node => node.id === msg.payload.nodeId)
    if (!node) return
    figma.viewport.scrollAndZoomIntoView([node])
  }
}
