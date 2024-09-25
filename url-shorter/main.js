/**
 * selectElement - A utility function that selects a DOM element based on a CSS selector.
 * 
 * @param {string} selector - The CSS selector used to identify the element.
 * @returns {HTMLElement} - The selected DOM element.
 * @throws {Error} - Throws an error if the element is not found.
 */
const selectElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) return element;
    throw new Error(`cannot find element ${selector}`);
};

// Selects form, input, result container, hamburger icon, and navigation menu elements
const form = selectElement('form');
const input = selectElement('input');
const result = selectElement('.result');
const hamburger = selectElement('.hamburger');
const navMenu = selectElement('.nav-menu');

/**
 * Event listener for the hamburger menu.
 * Toggles the 'active' class for both the hamburger icon and navigation menu, 
 * which triggers visibility of the mobile menu when clicked.
 */
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

/**
 * Event listener for the form submission.
 * Prevents the default form submission behavior, retrieves the input value (URL),
 * and calls the `shortenUrl` function to shorten the provided URL.
 * 
 * @param {Event} e - The form submission event.
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;  // Retrieves the URL from the input field
    shortenUrl(url);  // Calls the function to shorten the URL
});

/**
 * shortenUrl - An asynchronous function that sends a POST request to the TinyURL API to shorten a given URL.
 * 
 * @param {string} url - The original URL to be shortened.
 * @returns {void}
 * 
 * This function:
 * 1. Sends a request to TinyURL API with the provided URL and API key.
 * 2. Handles response: if successful, it updates the UI with the shortened URL.
 * 3. Adds a 'Copy' button to copy the shortened URL to the clipboard.
 * 4. If the request fails, it catches the error and displays an alert to the user.
 */
async function shortenUrl(url) {
    try {
        const res = await fetch('https://api.tinyurl.com/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <your_api_key>'  // Replace with your actual TinyURL API token
            },
            body: JSON.stringify({
                url: url,  // Original URL passed as the body of the POST request
                domain: "tiny.one"  // Specifies the domain to use for the shortened URL
            })
        });

        if (!res.ok) {
            // Handles HTTP response errors
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();  // Parse the JSON response
        const shortenedUrl = data.data.tiny_url;  // Extract the shortened URL

        // Creates a new DOM element to display the shortened URL and a 'Copy' button
        const newUrl = document.createElement('div');
        newUrl.classList.add('item');
        newUrl.innerHTML = `
            <p>${shortenedUrl}</p>
            <button class="newUrl-btn">Copy</button>
        `;

        result.prepend(newUrl);  // Adds the new shortened URL at the top of the result section

        // Adds an event listener to the 'Copy' button to copy the shortened URL to the clipboard
        const copyBtn = document.querySelector('.newUrl-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(copyBtn.previousElementSibling.textContent);  // Copies the URL text to the clipboard
        });

        input.value = "";  // Clears the input field after submission
    } catch (error) {
        console.log(error);  // Logs the error for debugging
        alert("Failed to shorten the URL. Please try again later.");  // Alerts the user if there's a failure
    }
}
