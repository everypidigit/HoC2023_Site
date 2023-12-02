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

    $('#registrationForm').submit(function (event) {
        event.preventDefault();

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
                        // window.location.href = 'https://drive.google.com/file/d/1Y0tqcUUXLSuCHh1wBTM0jiLHMhttb7PG/view?usp=drive_link';

                        if (selectedLanguage === 'russian') {
                            window.location.href = 'https://drive.google.com/file/d/1Y0tqcUUXLSuCHh1wBTM0jiLHMhttb7PG/view?usp=drive_link';
                        } else if (selectedLanguage === 'kazakh') {
                            window.location.href = 'https://drive.google.com/file/d/1zIs_9Vo4r-iV08KhFkvNFrAgvIa9EwuX/view';
                        } else if (selectedLanguage === 'english') {
                            window.location.href = 'https://drive.google.com/file/d/1o9Pp6EeDc4vCy2I3v2nwAVbjlYPea4Xb/view?usp=drive_link';
                        }


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
        const prohibitedCharacters = /[,&!?%^#+-]/;

        // Check each input for prohibited characters
        const inputs = ['#username', '#email', '#region', '#place', '#role', '#language', '#gender', '#age', '#school'];
        for (const input of inputs) {
            const value = $(input).val().trim();

            // Check if the input is empty
            if (!value) {
                alert(`Please fill in ${input}`);
                return false;
            }

            // Additional validation for gender
            if (input === '#gender' && !isInArray(value.toLowerCase(), ['male', 'female'])) {
                alert('Invalid gender. Please choose either "Male" or "Female".');
                return false;
            }

            // Check for prohibited characters
            if (prohibitedCharacters.test(value)) {
                alert(`Запрещено вводить ,&!?%^#+-`);
                return false;
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

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }
});
