import "./App.css";
import Upload from "./components/upload.jsx";
import Recipe from "./components/recipe.jsx";
import { Container, Grid } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import recipeStruct from "./static/recipe_structure.json";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_API_KEY);

// Function to convert image to base64
function convertBlobToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

function App() {
  const [jsonObject, setJsonObject] = useState();

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
    console.log(jsonString);
  }

  return (
    <div className="App">
      <Container disableGutters>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DndProvider backend={HTML5Backend}>
              <Upload onDrop={handleFileDrop} onFileChange={handleFileChange} />
            </DndProvider>
          </Grid>
          <Grid item xs={12}>
            <Recipe />
            {jsonObject && <div>{jsonObject["recipe"]["title"]}</div>}
          </Grid>
        </Grid>
      </Container>
    </div>
    // <div>
    //   <input type="file" onChange={handleFileChange} />
    //   <button onClick={getRecipe}>Upload</button>
    //   {jsonObject && <div>{jsonObject["recipe"]["title"]}</div>}
    // </div>
  );
}

export default App;
