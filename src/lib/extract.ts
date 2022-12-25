export type ExtractOption = {
    nodeTypes: NodeType[]
    privateNode: boolean
}

export const extract = ({ nodeTypes, privateNode }: ExtractOption) => {
    const filterFn = (node: SceneNode) => {
        if (!nodeTypes.includes(node.type)) {
            return false
        }
        const shouldExtractPrivateNode = privateNode
            ? true 
            : node.visible
        return shouldExtractPrivateNode
    }
    const results: string[] = []
    const pages = figma.root.findAllWithCriteria({ types: ['PAGE'] })
    pages.forEach(page => {
        const frames = page.findAllWithCriteria({ types: ['FRAME'] })
        frames.forEach(frame => {
            const nodes = frame.findAll(filterFn) as (TextNode | TextSublayerNode)[]
            const texts = nodes.map(node => node.characters)
            results.push(...texts)
        })
    })
    return Array.from(new Set([...results]))
}
