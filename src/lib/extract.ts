export type ExtractOption = {
    privateNode: boolean
    pageIds: string[]
}

export type ExtractedData = {
    text: string
    locations: Location[]
}

export type Location = {
    page: {
        id: string
        name: string
    }
    frame: {
        id: string
        name: string
    }
    node: {
        id?: string
        name: string
    }
}

export const extract = ({ privateNode, pageIds }: ExtractOption) => {
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
    const textMap = new Map<string, Location[]>()
    const pages = figma.root.findAll(node => node.type === 'PAGE' && pageIds.includes(node.id)) as PageNode[]
    pages.forEach(page => {
        const frames = page.findAllWithCriteria({ types: ['FRAME'] })
        frames.forEach(frame => {
            const nodes = frame.findAll(filterFn) as (TextNode | TextSublayerNode)[]
            nodes.forEach(node => {
                const text = node.characters
                const location: Location = {
                    page: {
                        id: page.id,
                        name: page.name,
                    },
                    frame: {
                        id: frame.id,
                        name: frame.name,
                    },
                    node: {
                        id: (node as BaseNode).id,
                        name: text,
                    },
                }
                const reference = textMap.get(text)
                if (reference) {
                    textMap.set(text, [...reference, location])
                    return
                }
                textMap.set(text, [location])
            })
        })
    })
    const result: ExtractedData[] = Array.from(textMap.entries()).map(([text, locations]) => ({
        text,
        locations,
    }))
    return result
}
