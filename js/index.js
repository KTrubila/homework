const form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formValid = validateForm();

  if (formValid) {
    sessionStorage.setItem(formValid.name, JSON.stringify(formValid));
    document.querySelectorAll(".error").forEach((small) => {
        //to make sure errors are removed on submit
      if (!small.classList.contains("errorHidden")) {
        small.classList.add("errorHidden");
      }
    });
    form.reset();
    //show success message for 5 sec
    const success = document.getElementById('successMessage');
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 5000);
  }
});


function validateForm() {
  //no need to validate heat inside if because it's optional and all answers to it will suffice - hence it is not included to if statement
  const nameValidated = validateName();
  const priceValidated = validatePrice();
  const heatValidated = validateHeat();
  const toppingsValidated = validateToppings();
  const photoValidated = validatePhoto();

  if (
    nameValidated &&
    priceValidated &&
    toppingsValidated &&
    photoValidated
  ) {
    return {
      name: nameValidated,
      price: priceValidated,
      heat: heatValidated,
      toppings: toppingsValidated,
      photo: photoValidated,
    };
  } else return false;
}

//validator functions - if something doesn't pass, each will return false, which is then used to display errors;
// Otherwise, returns the finalized value (i.e name -  converted to lower case)
function validateName() {
  const pizzaName = document.getElementById("name").value;

  if (pizzaName.length > 30) {
    activateError(
      "nameError",
      "The name is too long, please make sure it contains up to 30 symbols"
    );
    return false;
  } else if (pizzaName.trim() === "") {
    activateError("nameError", "The name cannot be empty");
    return false;
  } else if (
    Object.keys(sessionStorage).includes(pizzaName.trim().toLowerCase())
  ) {
    activateError(
      "nameError",
      "The pizza with this name is already in the menu, consider changing the name"
    );
    return false;
  } else {
      const finalized = pizzaName.trim().toLowerCase();
      return finalized;
  }
}

function validatePrice() {
  const price = document.getElementById("price").value;
  const regex = /^\d+(\.\d{1,2})?$/;

  if (price.trim() === "") {
    activateError("priceError", "You must provide a price of the pizza");
    return false;
  } else if (price <= 0) {
    activateError("priceError", "The price has to be a positive number");
    return false;
  } else if(price.trim().length > 8) {
      activateError('priceError', 'The maximum length of the number has been reached - please make sure you type in the correct price')
  }else if (!regex.test(price)) {
    activateError(
      "priceError",
      "Please make sure the number has up to two decimal places and doesn't include any symbols other than digits and dot (.)"
    );
    return false;
  } else {
      const finalized = parseFloat(price).toFixed(2);
      return finalized;
  }
}

function validateHeat() {
  const heat = document.getElementById("heat").value;
  return heat;
}

function validateToppings() {
  const toppings = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((topping) => topping.value);

  if (toppings.length < 2) {
    activateError("toppingsError", "You must choose at least two toppings");
    return false;
  } else return toppings;
}

function validatePhoto() {
  const photo = document.querySelector('input[type="radio"]:checked')
    ? document.querySelector('input[type="radio"]:checked').value
    : "images/defaultpizza.jpg";
  return photo;
}

//error function
function activateError(errorElementId, errorText) {
  const targetErrorElement = document.getElementById(errorElementId);
  targetErrorElement.classList.remove("errorHidden");
  targetErrorElement.innerText = errorText;

}

//no need for add remove error event listeners for select element as it will always be OK. Hence collecting only inputs (this makes sure error message is removed once the input is 
//changed)
const formControlsList = document.querySelectorAll("input");

formControlsList.forEach((element) =>
  element.addEventListener("input", (event) => {
    const errorElement = document.getElementById(`${event.target.name}Error`);
    if (!errorElement.classList.contains("errorHidden")) {
      errorElement.classList.add("errorHidden");
    }
  })
);

