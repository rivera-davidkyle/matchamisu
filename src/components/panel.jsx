import React from 'react'
import { Container, Paper, Box } from "@mui/material";

function panel() {
  return (
    <Container sx={primaryStyle} disableGutter={true}>
        <Paper>
          Upload
        </Paper>
        <Paper>
          Recipe
        </Paper>
    </Container>
  )
}

export default panel