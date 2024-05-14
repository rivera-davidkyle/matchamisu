import React from "react";
import { Paper, Button } from "@mui/material";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

let initialStyle = {
  border: "5px dashed",
  borderColor: "#4A490F",
  background: "#D8D796",
  display: "block",
};
const UploadZone = (props) => {
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
    <Paper ref={drop} sx={initialStyle}>
      {isActive ? "Release to drop" : "Drag file here"}
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        id="raised-button-file"
        hidden
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span">
          Upload
        </Button>
      </label>
    </Paper>
  );
};

export default UploadZone;
