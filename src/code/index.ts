import { Message } from "~/lib/message";
import { select } from "~/lib/select";
import { extract } from "../lib/extract";

figma.skipInvisibleInstanceChildren = true

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(480, 640)

figma.ui.onmessage = (msg: Message) => {
  switch(msg.type) {
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
  }
}
