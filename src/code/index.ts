import { extract } from "../lib/extract";

figma.skipInvisibleInstanceChildren = true

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(480, 640)

figma.ui.onmessage = msg => {
  if (msg.type === 'extract') {
    const texts = extract(msg.payload)
    figma.ui.postMessage({
      type: 'result',
      payload: {
        texts,
      },
    })
    return
  }
}
