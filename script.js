const catContainer = document.getElementById('cat-rain');
function createCat() {
    const cat = document.createElement('img');
    cat.src = 'cat.png';
    cat.classList.add("cat");
    cat.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 40 + 40;
    cat.style.width = size + "px"
    const duration = Math.random() * 3 + 4;
    cat.style.animationDuration = duration + "s";
    catContainer.appendChild(cat);
    setTimeout(() => cat.remove(), duration * 1000);
}
setInterval(createCat, 500);

const recipeName = document.getElementById("recipe-name");
const recipeDescription = document.getElementById("recipe-description");
const recipeIngredients = document.getElementById("recipe-ingredients");
const recipeInstructions = document.getElementById("recipe-instructions");
const recipeImg = document.getElementById("recipe-img");
const imgContainer = document.getElementById("recipe-image-container");
const divider = document.getElementById("divider");
const getRecipeBtn = document.getElementById("getRecipeBtn");
const categorySelect = document.getElementById("categorySelect");

async function fetchRecipe() {
    const category = categorySelect.value;
    let url = "https://www.themealdb.com/api/json/v1/1/random.php";
    
    if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    }

    try {
        getRecipeBtn.textContent = "Loading...";
        const response = await fetch(url);
        const data = await response.json();
        
        let meal;
        if (category) {
            
            const randomIndex = Math.floor(Math.random() * data.meals.length);
            const selectedMeal = data.meals[randomIndex];
            
            
            const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedMeal.idMeal}`);
            const detailData = await detailRes.json();
            meal = detailData.meals[0];
        } else {
            meal = data.meals[0];
        }

        displayRecipe(meal);
    } catch (error) {
        recipeName.textContent = "Oops! Connection error.";
    } finally {
        getRecipeBtn.textContent = "Get Recipe";
    }
}

function displayRecipe(meal) {
    recipeName.textContent = meal.strMeal;
    recipeDescription.textContent = `Category: ${meal.strCategory} | Origin: ${meal.strArea}`;
    recipeInstructions.textContent = meal.strInstructions;
    
    recipeImg.src = meal.strMealThumb;
    imgContainer.style.display = "block";
    divider.style.display = "block";

    recipeIngredients.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = `${measure} ${ingredient}`;
            recipeIngredients.appendChild(li);
        }
    }

    imgContainer.scrollIntoView({ behavior: 'smooth' });
}

getRecipeBtn.addEventListener("click", fetchRecipe);