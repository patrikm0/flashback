document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const recaptchaToken = grecaptcha.getResponse();

    if (!recaptchaToken) {
        alert('Bitte verifiziere, dass du kein Roboter bist.');
        return;
    }

    // Send form data and token to the server
    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, recaptchaToken })
    });

    const data = await response.json();
    if (data.success) {
        alert('Sign up successful!');
        // Handle successful sign-up
    } else {
        alert('Sign up failed: ' + data.message);
    }
});
