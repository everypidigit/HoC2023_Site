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

                // Hide registration form and show confirmation message
                $('#registrationForm').hide();
                $('#confirmationMessage').show();
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    });

    // Close confirmation message
    $('#closeConfirmation').click(function () {
        $('#registrationPopup').fadeOut();
        // Reset form and show form fields
        $('#registrationForm').trigger('reset').show();
        $('#confirmationMessage').hide();
    });

});

