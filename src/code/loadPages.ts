export const loadPages = () => {
    const pages = figma.root.findAllWithCriteria({
        types: ['PAGE'],
    })
    return pages.map(({ id, name }) => ({
        id,
        name,
    }))
}
