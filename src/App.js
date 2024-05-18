import "./App.css";
import Upload from "./components/upload.jsx";
import Recipe from "./components/recipe.jsx";
import { Container, Grid } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import recipeStruct from "./static/recipe_structure.json";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as Yup from "yup";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_API_KEY);

const RecipeSchema = Yup.object().shape({
  recipe: Yup.object()
    .shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      ingredients: Yup.array()
        .of(Yup.string())
        .required("Ingredients are required"),
      instructions: Yup.array()
        .of(Yup.string())
        .required("Instructions are required"),
      prep_time: Yup.string(),
      cook_time: Yup.string(),
      total_time: Yup.string(),
      servings: Yup.number().integer().required("Servings must be provided"),
      tags: Yup.array().of(Yup.string()),
    })
    .required(),
});

function validateJSON(jsonString) {
  try {
    let recipe = JSON.parse(jsonString);
    let isValid = RecipeSchema.validate(recipe);
    console.log("VALID?", isValid);
    return isValid;
  } catch (error) {
    console.log("INVALID JSON, CANNOT PARSE", false);
    return false;
  }
}

// Function to convert image to base64
function convertBlobToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

function App() {
  const [jsonObject, setJsonObject] = useState({});
  const [loading, setLoading] = useState(false);

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = `Create a recipe of this image following this schema ${JSON.stringify(
    recipeStruct
  )}. Don't format in markdown, but just a JSON string.`;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    getRecipe(file);
  };

  const handleFileDrop = useCallback((item) => {
    if (item) {
      const file = item.files[0];
      getRecipe(file);
    }
  }, []);

  async function getRecipe(files) {
    setLoading(true);
    let jsonString = "";
    console.log("Getting recipe..");
    try {
      while (!validateJSON(jsonString)) {
        const base64String = await convertBlobToBase64(files);
        const image = {
          inlineData: {
            data: base64String,
            mimeType: "image/jpeg",
          },
        };
        const result = await model.generateContent([prompt, image]);
        console.log("Called google API");
        const response = await result.response;
        jsonString = response.text();
      }
    } catch (error) {
      console.log(error);
    }
    setJsonObject(JSON.parse(jsonString));
    setLoading(false);
  }

  return (
    <div className="App">
      <Container disableGutters>
        <Grid container spacing={4}>
          {!loading && Object.keys(jsonObject).length === 0 && (
            <Grid item xs={12}>
              <DndProvider backend={HTML5Backend}>
                <Upload
                  onDrop={handleFileDrop}
                  onFileChange={handleFileChange}
                  shorten={false}
                />
              </DndProvider>
            </Grid>
          )}
          <Grid item xs={12}>
            <Recipe recipe={jsonObject} loading={loading} />
          </Grid>
          {!loading && Object.keys(jsonObject).length > 0 && (
            <Grid item xs={12}>
              <DndProvider backend={HTML5Backend}>
                <Upload
                  onDrop={handleFileDrop}
                  onFileChange={handleFileChange}
                  shorten={true}
                />
              </DndProvider>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
