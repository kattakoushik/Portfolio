// IMPORTANT: Replace the empty string below with your Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTYP5ONq5l8y8KcjsKeQDgYVRG31nmAdPa5uja80YmzknLv2zM5wmOE6P7EVeQzw2_/exec'; 

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const btnText = submitBtn.querySelector('.btn-text');
const successMsg = document.getElementById('successMessage');
const errorMsg = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI state: Loading
        setLoading(true);
        hideMessages();

        // Get form data
        const formData = new FormData(contactForm);
        const params = new URLSearchParams(formData);

        try {
            if (!SCRIPT_URL || SCRIPT_URL.trim() === '') {
                throw new Error('Script URL is missing. Please set it up in the script section.');
            }

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors if returning simple text/redirects
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // With no-cors, we can't read the response body, so we assume success if no exception
            showSuccess();
            contactForm.reset();

        } catch (error) {
            console.error('Fetch error:', error);
            showError(error.message);
        } finally {
            setLoading(false);
        }
    });
}

function setLoading(isLoading) {
    if (!submitBtn || !loader || !btnText) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
        loader.style.display = 'block';
        btnText.style.display = 'none';
    } else {
        loader.style.display = 'none';
        btnText.style.display = 'block';
    }
}

function showSuccess() {
    if (successMsg) successMsg.style.display = 'block';
}

function showError(customMessage) {
    if (!errorMsg) return;
    errorMsg.style.display = 'block';
    if (customMessage) {
        errorMsg.textContent = customMessage;
    }
}

function hideMessages() {
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) {
        errorMsg.style.display = 'none';
        errorMsg.textContent = 'Oops! Something went wrong. Please try again later.';
    }
}
