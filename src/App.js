import "./App.css";
import Upload from "./components/upload.jsx";
import Recipe from "./components/recipe.jsx";
import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import recipeStruct from "./static/recipe_structure.json";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAf-dX29W94ZIHES3kLLSz6-byjokYQzk8");

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

let secondaryStyle = {

}

function App() {
  const [jsonObject, setJsonObject] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = `Create a recipe of this image following this schema ${JSON.stringify(
    recipeStruct
  )}. Don't format in markdown, but just a JSON string.`;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function getRecipe() {
    let jsonString = "";
    try {
      while (!validateJSON(jsonString)) {
        // const blob = await convertImageToBlob(foodtest);
        const base64String = await convertBlobToBase64(selectedFile);
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
        // jsonString = JSON.stringify(sampleRecipe);
      }
    } catch(error) {
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
            <Upload />
          </Grid>
          <Grid item xs={12}>
            <Recipe />
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
