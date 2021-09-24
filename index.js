/*---------------------------------------------------------------------------------*/
/*-- Query selectors to get DOM elements --*/

// HTMLCollections
const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
const removeProductButtons = document.querySelectorAll('.btn-remove-product');
const orderRows = document.querySelectorAll('.order-row');
const orderQuantities = document.querySelectorAll('.quantity');
const orderPrices = document.querySelectorAll('.price');
const orderSubtotals = document.querySelectorAll('.subtotal');

// Single elements
const loginButton = document.querySelector('.login-btn');
const signupButton = document.querySelector('.signup-btn');
const logoutButton = document.querySelector('.logout-btn');
const loginForm = document.querySelector('.login-form');
const loginUsernameInput = document.querySelector('#login-username');
const loginPasswordInput = document.querySelector('#login-password');
const closeLoginModalButton = document.querySelector('.close-login-modal-button');
const signupForm = document.querySelector('.signup-form');
const signupUsernameInput = document.querySelector('#signup-username');
const signupEmailInput = document.querySelector('#signup-email');
const signupPasswordInput = document.querySelector('#signup-password');
const closeSignupModalButton = document.querySelector('.close-signup-modal-button');
const loginAlert = document.querySelector('.login-alert');
const closeLoginAlertButton = document.querySelector('.close-login-alert-btn');
const orderSummarySection = document.querySelector('.order-summary');
const totalOrder = document.querySelector('.total-order');
const checkoutButton = document.querySelector('.checkout-btn');
const checkoutForm = document.querySelector('.checkout-form');

/*---------------------------------------------------------------------------------*/
/*-- Global Variables --*/

// To keep track of whether the user is logged in or not, user is not logged in by default
let isLoggedIn = false;

// To store the login credentials of existing users
const user1 = { name: 'user', email: 'user@gmail.com', password: 'pass' };
const user2 = { name: 'bob', email: 'bob@gmail.com', password: 'passbob' };
const user3 = { name: 'mike', email: 'mike@gmail.com', password: 'passmike' };

const users = [user1, user2, user3];

/*---------------------------------------------------------------------------------*/
/*-- Signup and Login/Logout Functionality --*/

/*-- SignupUser function --*/

// This function will be invoked whenever a user submits a signup form, using the provided information to create a new user
// and push it onto the end of the users array.
// Because the data is not being persisted, any created users will be lost if the page is reloaded.

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

function signupUser() {
  // Create a new user
  let newUser = new User(
    signupUsernameInput.value.trim(),
    signupEmailInput.value.trim(),
    signupPasswordInput.value.trim()
  );
  users.push(newUser);

  authorizeUser(); // Log that user in with helper function
  closeSignupModalButton.click(); // Programatically click the button to dismiss the signup modal
}

signupForm.addEventListener('submit', signupUser);

/*-- Validate login info function --*/

// This function validates the input username and password against those in the users array.
// If a matching username and password combination is entered, the user is logged in and the modal is dismissed.

function validateLoginCredentials() {
  let inputUsername = loginUsernameInput.value.trim();
  let inputPassword = loginPasswordInput.value.trim();

  // Find a user matching the input username
  let matchedUser = users.find((user) => user.name === inputUsername);

  if (!matchedUser) {
    // If no user matching that username found, give error feedback and exit function
    loginUsernameInput.style.borderColor = 'red';
    return;
  } else {
    loginUsernameInput.style.borderColor = 'green';
  }

  // Check that the input password is the password for the matched user
  if (matchedUser.password === inputPassword) {
    loginPasswordInput.style.borderColor = 'green';
    authorizeUser(); // Log the user in with helper function
    closeLoginModalButton.click(); // Programatically click the button to dismiss the login modal
  } else {
    // If incorrect password entered, give error feedback and exit function
    loginPasswordInput.style.borderColor = 'red';
    return;
  }
}

loginForm.addEventListener('submit', validateLoginCredentials);

/*-- Authorize user function --*/

// This helper function logs the user in and changes the styling of the page to
// display content that should only be seen after logging in

function authorizeUser() {
  isLoggedIn = true;

  // Display content that requires authorization, hide login/sign up buttons
  orderSummarySection.style.display = 'block';
  loginButton.style.display = 'none';
  signupButton.style.display = 'none';
  logoutButton.style.display = 'block';
}

/*-- Logout user function --*/

// This function is invoked when the user clicks the logout button, and logs them out.

function logoutUser() {
  if (isLoggedIn === true) {
    isLoggedIn = false;

    // Hide content that requires authorization, show login/signup buttons
    loginButton.style.display = 'block';
    signupButton.style.display = 'block';
    logoutButton.style.display = 'none';
    orderSummarySection.style.display = 'none';
  }
}

logoutButton.addEventListener('click', logoutUser);

/*--------------------------------------------------------------------------------*/
/*-- Login Alert functionality --*/

/*-- Show login alert function --*/

// This function will be invoked whenever a user clicks on an add to cart button when they are not logged in.
// It will trigger an alert tooltip to display at the bottom of the screen prompting them to login.

function showLoginAlert() {
  loginAlert.style.display = 'block';
}

/*-- Close login alert function --*/

// This function will be invoked when the user clicks the x button on the login alert, closing the alert.

function closeLoginAlert() {
  loginAlert.style.display = 'none';
}

closeLoginAlertButton.addEventListener('click', closeLoginAlert);

/*---------------------------------------------------------------------------------*/
/*-- Order Form Functionality --*/

/*-- Add to cart function --*/

// This function runs every time an add to cart button is pressed. It increments the products quantity, and
// uses helper functions to show that product in the order form, and update the subtotal and total cost.
const addToCart = addToCartButtons.forEach((addToCartButton, currentProductIndex) => {
  addToCartButton.addEventListener('click', () => {
    // Check if the user is logged in
    if (isLoggedIn === false) {
      showLoginAlert(); // If not, invoke function to show the alert, and return to exit the function
      return;
    }

    // The index of the current button being iterated over will be used to find the price, quantity, and subtotal of that product
    // in the different HTMLCollections.
    // Eg addToCartButtons[0], orderQuantities[0], orderPrices[0], and orderSubtotals[0] are all associated with the Lenovo Ideapad,
    // addToCartButtons[1], orderQuantities[1], orderPrices[1], and orderSubtotals[1] are all associated with the Havik Mechanical Keyboard, etc
    let currentProductQuantity = orderQuantities[currentProductIndex];
    let currentProductPrice = orderPrices[currentProductIndex];
    let currentProductSubtotal = orderSubtotals[currentProductIndex];

    // Increment the current products quantity HTML value to add an extra unit to the cart
    currentProductQuantity.innerHTML++;

    updateSubtotal(currentProductQuantity, currentProductPrice, currentProductSubtotal);

    // Update the total order cost
    let updatedTotalOrder =
      parseFloat(totalOrder.innerHTML.substring(1)) +
      parseFloat(currentProductPrice.innerHTML.substring(1));
    totalOrder.innerHTML = `€${updatedTotalOrder.toFixed(2)}`;

    // Invoke helper function to check if order row should be displayed or not based on the products quantity
    setOrderRowDisplay(currentProductIndex, currentProductQuantity);
  });
});

/*-- Remove from cart function --*/

// This function runs every time a remove from cart button is pressed. Works very similar to above, except an
// if statement checks if the product quantity is above 0, and then decrements the quantity
const removeFromCart = removeProductButtons.forEach((removeProductButton, currentProductIndex) => {
  removeProductButton.addEventListener('click', () => {
    let currentProductQuantity = orderQuantities[currentProductIndex];
    let currentProductPrice = orderPrices[currentProductIndex];
    let currentProductSubtotal = orderSubtotals[currentProductIndex];

    // Checks to ensure product quantity is greater than 0
    if (parseInt(currentProductQuantity.innerHTML) > 0) {
      // Decrement the current products quantity HTML value to remove a unit from the cart
      currentProductQuantity.innerHTML--;

      updateSubtotal(currentProductQuantity, currentProductPrice, currentProductSubtotal);

      let updatedTotalOrder =
        parseFloat(totalOrder.innerHTML.substring(1)) -
        parseFloat(currentProductPrice.innerHTML.substring(1));
      totalOrder.innerHTML = `€${updatedTotalOrder.toFixed(2)}`;

      setOrderRowDisplay(currentProductIndex, currentProductQuantity);
    }
  });
});

/*-- Update subtotal function --*/

// This helper function is used to recalculate and display the subtotal for a product,
// and is invoked whenever a product is added or removed from the cart
function updateSubtotal(productQuantity, productPrice, productSubtotal) {
  // Calculate the new subtotal
  let updatedSubtotal =
    parseInt(productQuantity.innerHTML) * parseFloat(productPrice.innerHTML.substring(1));
  // Display the new subtotal
  productSubtotal.innerHTML = `€${updatedSubtotal.toFixed(2)}`;
}

/*-- Set order row display function --*/

// This helper function checks if the current product order quantity is 0. If it is, the order information for that product in
// the order summary is not displayed.
// It is invoked whenever a product is added or removed from the cart.
function setOrderRowDisplay(currentProductIndex, currentProductQuantity) {
  // Find the order row for the current product using the currentProductIndex
  let currentProductRow = orderRows[currentProductIndex];

  // If the current product quantity is 0, dont display the order row for that product
  if (parseInt(currentProductQuantity.innerHTML) === 0) {
    currentProductRow.style.display = 'none';
  } else {
    // Otherwise do display the order row for that product
    currentProductRow.style.display = 'table-row';
  }
}

/*---------------------------------------------------------------------------------*/
/*-- Checkout form functionality --*/

/*-- Validate checkout form function --*/

// This function is invoked when the user presses the confirm order button on the checkout form modal and submits the form.
// It checks if there are any invalid fields, and if there are, it prevents form submission and displays the error messages.
const validateCheckoutForm = (event) => {
  // Check if the form inputs are valid
  if (checkoutForm.checkValidity() === false) {
    // If not, prevent the form from being submitted and the submit event from being propagated
    event.preventDefault();
    event.stopPropagation();
  }
  // Add was-validated class after the form was validated to add validation styling and give the user feedback
  checkoutForm.classList.add('was-validated');
};

checkoutForm.addEventListener('submit', validateCheckoutForm);
