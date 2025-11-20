let ingredients = [];
let apiKey = "apiKey=d44b8b150df44c22b9027a6f6e6f235e";

function addIngredient() {
  let newIngredient = $(".ingredients").val();
  ingredients.push(newIngredient);
  console.log(ingredients);
  $("#added-ingredients").text(`Ingredients: ${ingredients}`);
  $(".ingredients").val("");
}
$(".ingredients").on("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent default form submission behavior
    addIngredient();
    $(".ingredients").val("");
  }
});
function reset() {
  ingredients = [];
  $("#added-ingredients").text("Ingredients");
  $("#recipe-title").text("");
  $(".found-recipe").css("display", "none");
  $(".recipes-table tbody tr").each(function (index) {
    $(this).find(`.ingredientName${index}`).text("");
    $(this).find(`.amount${index}`).text("");
    $(this).find(`.have-in-hand${index} a`).text("").attr("href", "#");
  });
}
function searchForRecipies() {
  let IngredientsCall = "&ingredients=" + ingredients[0];
  for (let i = 1; i < ingredients.length; i++) {
    console.log(ingredients[i]);
    IngredientsCall += "," + ingredients[i];
  }

  IngredientsCall += "&number=1&ignorePantry=True";
  console.log(IngredientsCall);

  const request = new XMLHttpRequest();
  const url =
    "https://api.spoonacular.com/recipes/findByIngredients?" +
    apiKey +
    IngredientsCall;
  console.log(url);

  request.open("GET", url);
  request.onload = function () {
    if (this.response === "undefined") {
      $(".recipeTitle").text(`No recipes found.`);
    } else {
      let data = JSON.parse(this.response);
      data = data[0];
      console.log(data);
      if (request.status >= 200 && request.status < 400) {
        let recipeImg = data.image;
        let recipeTitle = data.title;
        console.log(recipeTitle);

        let presentIngredients = data.usedIngredients;
        let missingIngredients = data.missedIngredients;

        $(".found-recipe").css("display", "block");
        $("#recipe-title").text(` ${recipeTitle}`);
        $(".food-img").attr("src", recipeImg);

        // Single `row` counter for both present and missing ingredients
        let row = 0;

        // Loop through present ingredients
        for (let i = 0; i < presentIngredients.length; i++) {
          let ingredient = presentIngredients[i];
          let amount = ingredient.amount + " " + ingredient.unit;

          // Dynamically target the row based on the index
          let rowElement = $(`#row-${row}`);
          if (rowElement.length > 0) {
            $(`.ingredientName${row}`).text(ingredient.name);
            $(`.amount${row}`).text(amount);
            $(`.have-in-hand${row}`).css("background-color", "green");
            $(`.have-in-hand${row}`).text("Yes");
            $(`.have-in-hand${row} a`).attr(
              "href",
              `https://www.walmart.com/search?q=+${ingredient.name}`
            );

            row++;
          }
        }

        // Loop through missing ingredients
        for (let i = 0; i < missingIngredients.length; i++) {
          let ingredient = missingIngredients[i];
          let amount = ingredient.amount + " " + ingredient.unit;

          // Dynamically target the row based on the index
          let rowElement = $(`#row-${row}`);

          if (rowElement.length > 0) {
            $(`.ingredientName${row}`).text(ingredient.name);
            $(`.amount${row}`).text(amount);
            $(`.have-in-hand${row}`).css("background-color", "red");
            $(`.have-in-hand${row} a`).text("No");
            $(`.have-in-hand${row} a`).attr(
              "href",
              `https://www.walmart.com/search?q=+${ingredient.name}`
            );
            row++;
          }
        }
      }
    }
  };

  request.send();
}
