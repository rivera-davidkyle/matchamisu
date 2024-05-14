import React from "react";
import { Paper, IconButton } from "@mui/material";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

let initialStyle = {
  border: "5px dashed",
  borderColor: "#4A490F",
  background: "#D8D796",
  display: "flex",
  height: "30vw",
  cursor: "pointer",
  justifyContent: "center",
  alignItems: "center",
};
function UploadZone(props) {
  const { onDrop, onFileChange } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item) {
        if (onDrop) {
          onDrop(item);
        }
      },
      collect: (monitor) => {
        const item = monitor.getItem();
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [props]
  );

  const isActive = canDrop && isOver;

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        id="raised-button-file"
        hidden
      />
      <label htmlFor="raised-button-file">
        <Paper ref={drop} sx={initialStyle}>
          {isActive ? "Release to drop" : "Drag file here"}
        </Paper>
      </label>
    </>
  );
}

export default UploadZone;
