// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    console.log(figma.currentPage.findAll(node => node.type === 'TEXT' && node.visible))
    return
  }
  if (msg.type === 'cancel') {
    figma.ui.close()
    return
  }
}
