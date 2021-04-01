const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultEl = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const single_mealEl = document.getElementById('single-meal');;



// Fetch(search) for meal
function searchMeal(e) {
    e.preventDefault();
    
    const searchedMeal = search.value;

    if(searchedMeal.trim()) {

        single_mealEl.innerHTML = '';

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`)
        .then(res => res.json())
        .then(data => {
            resultEl.innerHTML = `<h2>Search Results for ${searchedMeal}</h2>`;

            if(data.meals === null) {
                resultHeading.innerHTML = "There are no results, Please try something else";
            } else {
                mealsEl.innerHTML = data.meals
                    .map(
                        meal => `
                            <div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                <div class="meal-info" data-mealId="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>
                        `
                ).join('');
            }
        });

    } else {
        resultEl.innerHTML = '<h2>Please enter a search term</h2>';
    };



};



// Get meal by ID
function getMealById(mealID) {

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        
        const meal = data.meals[0];

        addMealToDOM(meal);

    })

}


// Add meal to DOM
function addMealToDOM(meal) {

    console.log(meal);
    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}]`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    
    single_mealEl.innerHTML = `

        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map( ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>

    `;

}


// Get random meal
function getRandomMeal() {

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {

        const meal = data.meals[0];

        const ingredients = [];

        console.log(meal);

        if(meal) {

            mealsEl.innerHTML = '';
            
            resultEl.innerHTML = '';

            for(let i = 1; i <= 20; i++) {
                if(meal[`strIngredient${i}`]) {
                    ingredients.push(`
                        ${meal[`strIngredient${i}`]}
                    `);
                } else {
                    break;
                }
            }

            single_mealEl.innerHTML = `

            <div class="single-meal">
                <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="single-meal-info">
                    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
                </div>
                <div class="main">
                    <p>${meal.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                        ${ingredients.map( ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
            </div>
    
        `;

        } else {
            resultEl.innerHTML = 'There are no search results please try again';
        }

    })

}





// Event listener
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {

    const mealInfo = e.path.find( item => {

        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }

    });

   if(mealInfo) {
       const mealID = mealInfo.getAttribute('data-mealid');
       getMealById(mealID);
   }

});