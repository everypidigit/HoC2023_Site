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
    setInterval(updateCounter, 5000);

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
            city: $('#city').val(),
            region: $('#region').val(),
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
                $('#registrationPopup').fadeOut();
                
            },
            error: function (error) {
                console.error('Error:', error);

                // window.location.href = '/index.html';
            }
        });
    });

});
