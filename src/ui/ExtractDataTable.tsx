import { Anchor, Table } from '@mantine/core'
import { FC } from 'react'
import { ExtractedData, Location } from "~/lib/extract"
import { postMessageToFigma, SelectMessage } from '~/lib/message'

const THead: FC = () => {
    return (
        <thead>
            <th>Text</th>
            <th>Page</th>
            <th>Frame</th>
            <th>Node</th>
            <th>Link</th>
        </thead>
    )
}

const Row: FC<{ data: ExtractedData }> = ({ data }) => {
    const handleClickAnchor = ({ page: { id: pageId }, frame: {id: frameId}, node: { id: nodeId }}: Location) => {
        const message: SelectMessage = {
            type: 'select',
            payload: {
                nodeId: nodeId || frameId,
                pageId
            }
        }
        postMessageToFigma(message)
    }

    return (
        <>
        {data.locations.map((location, index) => (
            <tr>
                {!index && <td rowSpan={data.locations.length}>{data.text}</td>}
                <td>{location.page.name}</td>
                <td>{location.frame.name}</td>
                <td>{location.node.name}</td>
                <td>
                    <Anchor onClick={() => handleClickAnchor(location)}>Link</Anchor>
                </td>
            </tr>
        ))}
        </>
    )
}

type Props = {
    data: ExtractedData[]
}

const ExtractedDataTable: FC<Props> = ({ data }) => {
    if (!data.length) {
        return null
    }
    return (
        <Table>
            <THead />
            <tbody>
                {data.map(d => (
                    <Row data={d} />
                ))}
            </tbody>
        </Table>
    )
}

export default ExtractedDataTable
