document.addEventListener('DOMContentLoaded', () => {
    // Fetch user session data
    fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                alert('You are not logged in. Redirecting to home page.');
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error fetching session data:', error);
        });

    const updateEmailForm = document.getElementById('update-email-form');
    updateEmailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newEmail = document.getElementById('new-email').value;

        try {
            const response = await fetch('/update-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newEmail })
            });

            const data = await response.json();
            if (data.success) {
                alert('Email updated successfully!');
            } else {
                alert('Failed to update email: ' + data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating email:', error);
            alert('An error occurred: ' + error.message);
        }
    });

    const deleteAccountButton = document.getElementById('delete-account');
    deleteAccountButton.addEventListener('click', async () => {
        const confirmation = confirm('Are you sure you want to delete your account?');
        if (confirmation) {
            try {
                console.log('Sending DELETE request to /delete-account');
                const response = await fetch('/delete-account', {
                    method: 'DELETE'
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError('Oops, we haven\'t got JSON!');
                }

                const data = await response.json();
                console.log('Response from /delete-account:', data);
                if (data.success) {
                    alert('Account deleted successfully!');
                    window.location.href = 'index.html';
                } else {
                    alert('Failed to delete account: ' + data.message);
                }
            } catch (error) {
                console.error('An error occurred while deleting account:', error);
                alert('An error occurred: ' + error.message);
            }
        }
    });

    const backToHomeButton = document.getElementById('back-to-home');
    backToHomeButton.addEventListener('click', () => {
        console.log('Redirecting to home page');
        window.location.href = 'index.html';
    });
});
