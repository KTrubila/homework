//on page load - get pizza objects from sess. storage; convert to JS objects, and then push them into the array; finally, sort alphabetically;
const allPizzas = Object.values(sessionStorage);
let pizzasArr = [];
allPizzas.forEach((pizza) => pizzasArr.push(JSON.parse(pizza)));
pizzasArr.sort((a, b) => a.name.localeCompare(b.name));

//displayed content depends if returned array has pizzas
if (pizzasArr.length > 0) {
  document.getElementById("placeholderElement").classList.add("hidden");
  displayPizzas();
} else {
  document.getElementById("sortContainer").classList.add("hidden");
}

function displayPizzas() {
  pizzasArr.forEach(({ name, price, heat, toppings, photo }) => {
    //Create card for pizza - section as cards are related
    const pizzaContainer = document.createElement("section");
    pizzaContainer.className = "pizzaContainer";
    pizzaContainer.setAttribute("data-name", name);
    pizzaContainer.setAttribute("data-price", price);
    pizzaContainer.setAttribute("data-heat", heat);

    //Card has two main divs - pizzaInfoContainer and pizzaImageContainer. Creating pizzaInfoContainer;
    const pizzaInfoContainer = document.createElement("div");
    pizzaInfoContainer.className = "pizzaInfoContainer";

    //PizzaInfoContainer has 3-4 children: name, heat (optional), ingredients, price. Creating name related nodes:
    const pizzaName = document.createElement("h2");
    const pizzaNameText = document.createTextNode(name);
    pizzaName.appendChild(pizzaNameText);
    pizzaName.className = "pizzaName";

    //Append name nodes to infoContainer:
    pizzaInfoContainer.appendChild(pizzaName);

    //Creating heat related nodes - optional, hence if statement:
    let pizzaHeatContainer;
    if (heat !== "0") {
      pizzaHeatContainer = document.createElement("div");
      pizzaHeatContainer.className = "heatContainer";
      const pepperImgList = createHeatImage(heat);
      pepperImgList.forEach((img) => pizzaHeatContainer.append(img));

      //Append heat nodes to infoContainer:
      pizzaInfoContainer.appendChild(pizzaHeatContainer);
    }

    //Creating toppings related nodes:
    const toppingsContainer = document.createElement("p");
    toppingsContainer.className = "ingredientsContainer";
    const toppingsText = document.createTextNode(
      `Toppings: ${toppings.join(", ")}`
    );
    toppingsContainer.appendChild(toppingsText);

    //Append topping nodes to infoContainer:
    pizzaInfoContainer.appendChild(toppingsContainer);

    //Creating price related nodes:
    const priceContainer = document.createElement("p");
    priceContainer.className = "priceContainer";
    const priceText = document.createTextNode(`€ ${price}`);
    priceContainer.appendChild(priceText);

    //Append price nodes to infoContainer:
    pizzaInfoContainer.appendChild(priceContainer);

    //Creating delete button;
    const deleteBtn = document.createElement("button");
    const btnText = document.createTextNode("Delete");
    deleteBtn.appendChild(btnText);
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("data-pizza", name);
    deleteBtn.className = "deleteBtn";

    //Append deleteBtn to infoContainer
    pizzaInfoContainer.appendChild(deleteBtn);

    //PizzaInfoContainer ready, now creating imageContainer:
    const pizzaImageContainer = document.createElement("div");
    pizzaImageContainer.className = "pizzaImageContainer";

    //Photo is optional, hence if statement. Creating image:
    const pizzaImage = document.createElement("img");
    pizzaImage.setAttribute("src", photo);
    pizzaImage.setAttribute("alt", "pizza");
    pizzaImage.className = "pizzaImage";

    //Adding image to imageContainer:
    pizzaImageContainer.appendChild(pizzaImage);

    //Finishing-up - adding two main containers (info and image) to the card:
    pizzaContainer.append(pizzaInfoContainer, pizzaImageContainer);

    document.getElementById("menuContainer").appendChild(pizzaContainer);
  });
}

function createHeatImage(count) {
  let arr = [];

  for (let i = 0; i < count; i++) {
    const newImg = document.createElement("img");
    newImg.setAttribute("src", "images/pepper.svg");
    newImg.setAttribute("alt", "pepper-icon");
    newImg.className = "heatIcon";
    arr.push(newImg);
  }
  return arr;
}

//listeners on sort options;
const sortOptions = document.querySelectorAll('input[type="radio"]');
sortOptions.forEach((option) => {
  option.addEventListener("change", (event) => {
    if (event.target.value === "sortByName") {
      sortByName();
    } else if (event.target.value === "sortByPrice") {
      sortByPrice();
    } else if (event.target.value === "sortByHeat") {
      sortByHeat();
    }
  });
});

//sort functions
function sortByName() {
  const pizzaNameArr = pizzasArr.map((pizza) => pizza.name);
  pizzaNameArr.sort();

  pizzaNameArr.forEach((pizzaName) => {
    const pizzaContainer = document.querySelector(`[data-name="${pizzaName}"]`);
    document.getElementById("menuContainer").appendChild(pizzaContainer);
  });
}

function sortByPrice() {
  const pizzaPriceArr = pizzasArr.map((pizza) => pizza.price);
  pizzaPriceArr.sort((a, b) => parseFloat(a) - parseFloat(b));

  pizzaPriceArr.forEach((pizzaPrice) => {
    const pizzaContainer = document.querySelector(
      `[data-price="${pizzaPrice}"]`
    );
    document.getElementById("menuContainer").appendChild(pizzaContainer);
  });
}

function sortByHeat() {
  const pizzaHeatArr = pizzasArr.map((pizza) => pizza.heat);
  pizzaHeatArr.sort();
  console.log(pizzaHeatArr);

  pizzaHeatArr.forEach((pizzaHeat) => {
    const pizzaContainer = document.querySelector(`[data-heat="${pizzaHeat}"]`);
    document.getElementById("menuContainer").appendChild(pizzaContainer);
  });
}

//delete buttons logic
const deleteButtons = document.querySelectorAll("button");
deleteButtons.forEach((button) =>
  button.addEventListener("click", (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete pizza ${event.target.getAttribute(
          "data-pizza"
        )}?`
      )
    ) {
      const pizzaName = event.target.getAttribute("data-pizza");
      
      sessionStorage.removeItem(pizzaName);
      document
        .querySelector(`.pizzaContainer[data-name="${pizzaName}"]`)
        .remove();
      if (sessionStorage.length === 0) {
        document
          .getElementById("placeholderElement")
          .classList.remove("hidden");
        document.getElementById("sortContainer").classList.add("hidden");
      }
    }
  })
);
