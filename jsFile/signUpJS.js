function getSports() {
    $.ajax({
        url: '../onloadFunction/getSports.php', // The PHP file that fetches sports data
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var sportInput = document.getElementById("sportInput");
            sportInput.innerHTML = '<option value="--">--</option>'; // Reset options
            data.forEach(function(sport) {
                var option = document.createElement("option");
                option.value = sport;
                option.text = sport;
                sportInput.appendChild(option);
            });
        },
        error: function(error) {
            console.error('Error fetching sports:', error);
        }
    });
}

function getPositions(sport) {
    if (sport === "--") {
        // Reset positions dropdown if the default option is selected
        document.getElementById("positionInput").innerHTML = '<option value="--">--</option>';
        return;
    }

    $.ajax({
        url: '../onloadFunction/getPosition.php', // The PHP file that fetches positions data
        method: 'GET',
        data: { sport: sport },
        dataType: 'json',
        success: function(data) {
            var positionInput = document.getElementById("positionInput");
            positionInput.innerHTML = '<option value="--">--</option>'; // Reset options
            data.forEach(function(position) {
                var option = document.createElement("option");
                option.value = position.id;
                option.text = position.position;
                positionInput.appendChild(option);
            });
        },
        error: function(error) {
            console.error('Error fetching positions:', error);
        }
    });
}

function validateSignUp(){
    let isValid = true;
    const athNum = $('#athNum');

    if (athNum.val().trim() === '') {
        athNum.attr('placeholder', 'Invalid input. Enter 9-digit or N/A');
        isValid = false;
    } else {
        athNum.attr('placeholder', 'asd input. Enter 9-digit or N/A');
    }
   
    
    return isValid;
}

$(document).ready(function() {

    getSports();

    document.getElementById("sportInput").addEventListener("change", function() {
        var selectedSport = this.value;
        getPositions(selectedSport);
    });

    $('#signUpButton').on('click', function() {
       
            const athNum = $('#athNum').val();
            const athFirst = $('#athFirst').val();
            const athLast = $('#athLast').val();
            const athEmail = $('#athEmail').val();
            const athPass = $('#athPass').val();
            const athPostition = $('#positionInput').val();
            const athSport = $('#sportInput').val();

            $.ajax({
                type: 'POST',
                url: '../buttonFunction/signUpButton.php',
                data: {
                    athNum: athNum,
                    athFirst: athFirst,
                    athLast: athLast,
                    athEmail: athEmail,
                    athPostition: athPostition,
                    athSport: athSport,
                    athPass: athPass
                },
                dataType: 'json',
                success: function(response) {
                    if(validateSignUp()) {
                        if (response.status === 'success') {
                            alert('User registered successfully!');
                            $('#buttonText').text('Inserted');

                            window.location.href = response.message;

                            
                        } else {
                            alert('Error: ' + response.message);
                            $('#buttonText').text('Error Inserting');
                            setTimeout(function() {
                                $('#buttonText').text('Sign Up');
                            }, 2000);
                        }
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    alert('AJAX Error: ' + status + ' - ' + error);
                },

                complete: function() {
                    // Hide the spinner when the AJAX request is complete
                    $('#signUpButton .spinner-border').hide();
                }

                
            });

       
    });

    

});