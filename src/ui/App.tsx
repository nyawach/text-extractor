import { useEffect, FC } from 'react'

const App: FC = () => {
    useEffect(() => {
        const createButton = document.getElementById('create')
    
        createButton?.addEventListener('click', () => {
            const textbox = document.getElementById('count');
            const count = parseInt((textbox as HTMLInputElement)?.value ?? '0', 10);
            parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
        })
        
        const cancelButton = document.getElementById('cancel')
        
        cancelButton?.addEventListener('click', () => {
            parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
        })
    }, [])
    return (<></>)
}

export default App
