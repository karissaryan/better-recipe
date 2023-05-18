// Select the form element from the DOM
const form = document.querySelector('form');

// Add an event listener to the form submit button that will handle the form submission
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Retrieve the URL from the form input
  const urlInput = document.querySelector('input[name="recipe-url"]');
  const recipeUrl = urlInput.value;

  // Validate the recipe URL
  const validUrlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)*$/i;
  if (!validUrlRegex.test(recipeUrl)) {
    alert('Please enter a valid recipe URL');
    return;
  }

  // Fetch the recipe data
  fetch(recipeUrl)
    .then(response => response.text())
    .then(data => {
      // Parse the data using the parseRecipeData function
      const recipeData = parseRecipeData(data);

      // Do something with the parsed recipe data
      console.log(recipeData);
    })
    .catch(error => {
      console.error(error);
    });
});

function parseRecipeData(recipeHtml) {
  const parser = new DOMParser();
  const recipeDoc = parser.parseFromString(recipeHtml, "text/html");
  const recipe = {};

  // Retrieve the recipe title
  const titleElem = recipeDoc.querySelector('meta[property="og:title"]');
  recipe.title = titleElem ? titleElem.getAttribute("content") : "";

  // Retrieve the recipe image URL
  const imageElem = recipeDoc.querySelector('meta[property="og:image"]');
  recipe.image = imageElem ? imageElem.getAttribute("content") : "";

  // Retrieve the recipe ingredients
  const ingredientElems = recipeDoc.querySelectorAll(".recipe-ingredients ul li");
  recipe.ingredients = Array.from(ingredientElems).map((elem) => elem.textContent.trim());

  // Retrieve the recipe instructions
  const instructionElems = recipeDoc.querySelectorAll(".recipe-directions__list li");
  recipe.instructions = Array.from(instructionElems).map((elem) => elem.textContent.trim());

  return recipe;
}
