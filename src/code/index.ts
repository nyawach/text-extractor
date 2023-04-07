import { Message } from "~/lib/message";
import { select } from "~/lib/select";
import { extract } from "~/lib/extract";
import { loadPages } from '~/code/loadPages';

figma.skipInvisibleInstanceChildren = true

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(320, 480)

figma.ui.onmessage = (msg: Message) => {
  switch(msg.type) {
    case 'load-pages':
      const pages = loadPages()
      figma.ui.postMessage({
        type: 'pages',
        payload: {
          data: pages,
        },
      })
      return
    case 'extract':
      const extractedData = extract(msg.payload)
      figma.ui.postMessage({
        type: 'result',
        payload: {
          data: extractedData,
        },
      })
      return
    case 'select':  
      select(msg.payload)
    default:
      throw Error(`This message is not supported: ${msg.type}`)
  }
}
