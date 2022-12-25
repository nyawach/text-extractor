export type ExtractOption = {
    privateNode: boolean
}

export type Location = {
    id: string
    name: string
    pageId: string
    pageName: string
}

export type ExtractedData = {
    text: string
    locations: Location[]
}

export const extract = ({ privateNode }: ExtractOption) => {
    const targetNodeTypes: NodeType[] = ['TEXT', 'SHAPE_WITH_TEXT']
    const filterFn = (node: SceneNode) => {
        if (!targetNodeTypes.includes(node.type)) {
            return false
        }
        const shouldExtractPrivateNode = privateNode
            ? true 
            : node.visible
        return shouldExtractPrivateNode
    }
    const results: ExtractedData[] = []
    const pages = figma.root.findAllWithCriteria({ types: ['PAGE'] })
    pages.forEach(page => {
        const frames = page.findAllWithCriteria({ types: ['FRAME'] })
        frames.forEach(frame => {
            const nodes = frame.findAll(filterFn) as (TextNode | TextSublayerNode)[]
            nodes.forEach(node => {
                const data: ExtractedData = {
                    text: node.characters,
                    locations: [
                        {
                            pageId: page.id,
                            pageName: page.name,
                            id: frame.id,
                            name: frame.name,
                        },
                    ]
                }
                results.push(data)
            })
        })
    })
    return Array.from(new Set([...results]))
}
