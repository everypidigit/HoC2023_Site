// script.js

$(document).ready(function () {
    // Function to update the counter
    function updateCounter() {
        // Fetch the counter value from the server
        $.get('/counter', function (data) {
            $('#userCounter').text(data.userCounter);
        });
    }

    // Initial counter update
    updateCounter();

    // Set interval to update the counter every 5 seconds (adjust as needed)
    setInterval(updateCounter, 2000);

    document.getElementById('burger-menu').addEventListener('click', function () {
        var nav = document.getElementById('nav');
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    });

    $('#registerButton').click(function () {
        $('#registrationPopup').fadeIn();
    });

    // Close the pop-up when the "Close" button is clicked
    $('#closePopup').click(function () {
        $('#registrationPopup').fadeOut();
    });

    // Handle form submission
    $('#registrationForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate inputs before sending to the server
        if (validateInputs()) {
            const formData = {
                username: $('#username').val(),
                email: $('#email').val(),
                region: $('#region').val(),
                place: $('#place').val(),
                role: $('#role').val(),
                language: $('#language').val(),
                gender: $('#gender').val(),
                age: $('#age').val(),
                school: $('#school').val(),
            };

            // Send data to server
            $.ajax({
                type: 'POST',
                url: '/register',
                data: formData,
                success: function (response) {
                    console.log(response);
                    const selectedRole = $('#role').val();
                    const selectedLanguage = $('#language').val();
            
                    // Redirect to a specific URL based on the role
                    if (selectedRole === 'student') {
                        window.location.href = 'https://drive.google.com/file/d/1Y0tqcUUXLSuCHh1wBTM0jiLHMhttb7PG/view?usp=drive_link';

                        // if (selectedLanguage === 'russian') {
                        //     window.location.href = 'https://your-student-russian-url.com';
                        // } else if (selectedLanguage === 'kazakh') {
                        //     window.location.href = 'https://your-student-kazakh-url.com';
                        // } else if (selectedLanguage === 'english') {
                        //     window.location.href = 'https://your-student-english-url.com';
                        // }


                    } else {
                        // For other roles or no role specified, show the confirmation message
                        $('#registrationForm').hide();
                        $('#confirmationMessage').show();
                    }
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Validation failed, show error message
            showError('Запрещено вводить " , "!');
        }
    });

    // Close confirmation message
    $('#closeConfirmation').click(function () {
        $('#registrationPopup').fadeOut();
        // Reset form and show form fields
        $('#registrationForm').trigger('reset').show();
        $('#confirmationMessage').hide();
    });

    // Input validation function
    function validateInputs() {
        // Define prohibited characters
        const prohibitedCharacters = /[,&!?]/;

        // Check each input for prohibited characters
        const inputs = ['#username', '#email', '#region', '#place', '#role', '#language', '#gender', '#age', '#school'];
        for (const input of inputs) {
            const value = $(input).val();
            if (prohibitedCharacters.test(value)) {
                return false; // Validation failed
            }
        }

        return true; // Validation passed
    }

    // Function to show an error message
    function showError(message) {
        // Remove any existing error messages
        $('.error-message').remove();

        // Create and append a new error message
        const errorMessage = $('<div class="error-message"></div>').text(message);
        $('#registrationForm').append(errorMessage);
    }
});
