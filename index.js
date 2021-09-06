/*---------------------------------------------------------------------------------*/
/*-- Query selectors to get DOM elements --*/

// querySelectorAll returns a HTMLCollection of all elements with that CSS identifier
const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
const removeProductButtons = document.querySelectorAll('.btn-remove-product');
const orderRows = document.querySelectorAll('.order-row');
const orderQuantities = document.querySelectorAll('.quantity');
const orderPrices = document.querySelectorAll('.price');
const orderSubtotals = document.querySelectorAll('.subtotal');

// querySelector returns a single element with that CSS identifier
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
/*-- Signup user function --*/

// This function will be invoked whenever a user submits a signup form, using the provided information to create a new user
// and push it onto the end of the users array.
// Because the data is not being persisted, any created users will be lost if the page is reloaded.

// Class for creating new user instances
class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

function signupUser() {
  // Create a new user instance with the provided values
  let newUser = new User(
    signupUsernameInput.value.trim(),
    signupEmailInput.value.trim(),
    signupPasswordInput.value.trim()
  );
  users.push(newUser); // Push the newly created user onto the end of the users array
  closeSignupModalButton.click(); // Programatically click the button to dismiss the signup modal
}

signupForm.addEventListener('submit', signupUser);

/*---------------------------------------------------------------------------------*/
/*-- Login user function --*/

// This function checks if the values entered are contained in the users array.
// If so, the user is logged in and the modal is dismissed.

function loginUser() {
  // Use find method to loop over users array and find a user object whose name property matches the provided username
  // If there is one, assign it to the variable matchedUser.
  // trim method used to remove whitespace
  if (users.find((user) => user.name === loginUsernameInput.value.trim())) {
    let matchedUser = users.find((user) => {
      user.name === loginUsernameInput.value.trim();
      return user;
    });
    loginUsernameInput.style.borderColor = 'green'; // Make the the username input border green.

    // If the provided password matches the existing password for the matched user...
    if (matchedUser.password === loginPasswordInput.value.trim()) {
      loginPasswordInput.style.borderColor = 'green'; // ... make the password input green
      isLoggedIn = true; // Log the user in
      orderSummarySection.style.display = 'block'; // Display the order summary section
      loginButton.style.display = 'none'; // Don't display the login button
      signupButton.style.display = 'none'; // Don't display the signup button
      logoutButton.style.display = 'block'; // Display the logout button
      closeLoginModalButton.click(); // Programatically click the button to dismiss the login modal
    } else {
      // If no password match was found, make the password input red
      loginPasswordInput.style.borderColor = 'red';
      return;
    }
  } else {
    // If no username match was found, make the username input red
    loginUsernameInput.style.borderColor = 'red';
    return;
  }
}

loginForm.addEventListener('submit', loginUser);

/*---------------------------------------------------------------------------------*/
/*-- Logout user function --*/

// This function is invoked when the user clicks the logout button, and logs them out.

function logoutUser() {
  // Check that the user is logged in
  if (isLoggedIn === true) {
    isLoggedIn = false; // Log the user out
    loginButton.style.display = 'block'; // Display the login button
    signupButton.style.display = 'block'; // Display the signup button
    logoutButton.style.display = 'none'; // Don't display the logout button
    orderSummarySection.style.display = 'none'; // Don't display the order summary section
  }
}

logoutButton.addEventListener('click', logoutUser);

/*---------------------------------------------------------------------------------*/
/*-- Show login alert function --*/

// This function will be invoked whenever a user clicks on an add to cart button when they are not logged in.
// It will trigger an alert tooltip to display at the bottom of the screen prompting them to login.

function showLoginAlert() {
  // Show the login alert prompting the user to login
  loginAlert.style.display = 'block';
}

/*---------------------------------------------------------------------------------*/
/*-- Close login alert function --*/

// This function will be invoked when the user clicks the x button on the login alert, closing the alert.

function closeLoginAlert() {
  // Show the login alert prompting the user to login
  loginAlert.style.display = 'none';
}

closeLoginAlertButton.addEventListener('click', closeLoginAlert);

/*---------------------------------------------------------------------------------*/
/*-- Set order row display function --*/

// This function is invoked by the below two functions after the products order quantity has been changed.
// It checks if the current product order quantity is 0. If it is, the order information for that product in
// the order summary is not displayed.

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
/*-- Add to cart function --*/

// This function runs every time an add to cart button is pressed. It increments the products quantity, and
// then updates the subtotal value for that product and the overall total order cost.

// Use forEach to iterate over the 6 add to cart buttons
const addToCart = addToCartButtons.forEach((addToCartButton, currentProductIndex) => {
  // Add a click event listener to each add to cart button
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

    // To calculate the updated subtotal value, parse the existing values into numbers, using substring to remove the € sign from the price value,
    // then multiply the quantity by the price
    let updatedSubtotal =
      parseInt(currentProductQuantity.innerHTML) *
      parseFloat(currentProductPrice.innerHTML.substring(1));
    // String template literals are used to add back the € sign, and toFixed is used to limit the number to two decimal places
    currentProductSubtotal.innerHTML = `€${updatedSubtotal.toFixed(2)}`;

    // To calculate the updated total order, parse existing values into numbers and remove the € sign like above,
    // then add the product price to the total order value
    let updatedTotalOrder =
      parseFloat(totalOrder.innerHTML.substring(1)) +
      parseFloat(currentProductPrice.innerHTML.substring(1));
    totalOrder.innerHTML = `€${updatedTotalOrder.toFixed(2)}`;

    // Invoke function to check if order row should be displayed or not based on the products quantity
    setOrderRowDisplay(currentProductIndex, currentProductQuantity);
  });
});

/*---------------------------------------------------------------------------------*/
/*-- Remove from cart function --*/

// This function runs every time a remove from cart button is pressed. It decrements the products quantity, and
// then updates the subtotal value for that product and the overall total order cost.

// Works very similar to above, except an if statement checks if the product quantity is above 0, and
// then decrements the quantity
const removeFromCart = removeProductButtons.forEach((removeProductButton, currentProductIndex) => {
  // Add a click event listener to each remove product button
  removeProductButton.addEventListener('click', () => {
    let currentProductQuantity = orderQuantities[currentProductIndex];
    let currentProductPrice = orderPrices[currentProductIndex];
    let currentProductSubtotal = orderSubtotals[currentProductIndex];

    // Checks to ensure product quantity is greater than 0
    if (parseInt(currentProductQuantity.innerHTML) > 0) {
      // Decrement the current products quantity HTML value to remove a unit from the cart
      currentProductQuantity.innerHTML--;

      let updatedSubtotal =
        parseInt(currentProductQuantity.innerHTML) *
        parseFloat(currentProductPrice.innerHTML.substring(1));
      currentProductSubtotal.innerHTML = `€${updatedSubtotal.toFixed(2)}`;

      let updatedTotalOrder =
        parseFloat(totalOrder.innerHTML.substring(1)) -
        parseFloat(currentProductPrice.innerHTML.substring(1));
      totalOrder.innerHTML = `€${updatedTotalOrder.toFixed(2)}`;

      setOrderRowDisplay(currentProductIndex, currentProductQuantity);
    }
  });
});

/*---------------------------------------------------------------------------------*/
/*-- Check valid checkout form inputs function --*/

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
