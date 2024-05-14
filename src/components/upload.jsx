import React from 'react'
import { Paper } from "@mui/material";
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

let paperStyle = {

}

function upload(props) {
    const { onDrop } = props
    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
        accept: [NativeTypes.FILE],
        drop(item) {
            if (onDrop) {
            onDrop(item)
            }
        },
        canDrop(item) {
            console.log('canDrop', item.files, item.items)
            return true
        },
        hover(item) {
            console.log('hover', item.files, item.items)
        },
        collect: (monitor) => {
            const item = monitor.getItem()
            if (item) {
            console.log('collect', item.files, item.items)
            }
            return {
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            }
        },
        }),
        [props],
    )
    const isActive = canDrop && isOver
  return (
    <Paper ref={drop}>
        {isActive ? 'Release to drop' : 'Drag file here'}
    </Paper>
  )
}

export default upload