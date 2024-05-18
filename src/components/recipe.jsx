import React from "react";
import {
  List,
  Paper,
  Typography,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

let initialStyle = {
  border: "5px dashed",
  borderColor: "#4A490F",
  background: "#D8D796",
  display: "block",
  justifyContent: "center",
  alignItems: "center",
};

function recipe(props) {
  const { recipe } = props.recipe;
  const loading = props.loading;
  if (loading)
    return (
      <Paper sx={initialStyle}>
        <CircularProgress />
      </Paper>
    );
  if (recipe && Object.keys(recipe).length > 0) {
    return (
      <Paper sx={initialStyle}>
        <Typography>{recipe["title"]}</Typography>
        <Typography>{recipe["description"]}</Typography>
        <Typography>Ingredients</Typography>

        <List>
          {recipe["ingredients"] &&
            recipe["ingredients"].map((item, index) => (
              <ListItem key={index}>
                <Typography>{item}</Typography>
              </ListItem>
            ))}
        </List>
        <Typography>Instructions</Typography>
        <List>
          {recipe["instructions"] &&
            recipe["instructions"].map((item, index) => (
              <ListItem key={index}>
                <Typography>{item}</Typography>
              </ListItem>
            ))}
        </List>
        <Typography>Preparation Time: {recipe["prep_time"]}</Typography>
        <Typography>Cooking Time: {recipe["cook_time"]}</Typography>
        <Typography>Total Time: {recipe["total_time"]}</Typography>
        <Typography>Servings: {recipe["servings"]}</Typography>
      </Paper>
    );
  }
}

export default recipe;
