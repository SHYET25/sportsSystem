<?php
header('Content-Type: application/json');
include "../connection/connection.php";

$response = [];

if (isset($_POST['athNum']) && isset($_POST['athFirst']) && isset($_POST['athLast']) && isset($_POST['athEmail']) && isset($_POST['athPass']) && isset($_POST['athSport']) && isset($_POST['athPostition'])) {

    $num = $_POST['athNum'];
    $first = $_POST['athFirst'];
    $last = $_POST['athLast'];
    $sport = $_POST['athSport'];
    $position = $_POST['athPostition'];
    $email = $_POST['athEmail'];
    $pass = $_POST['athPass'];
    $img = "sample.png";

    // Check if the email already exists
    $stmt_check = $conn->prepare('SELECT ath_email, ath_num FROM athlete_tbl WHERE ath_email = ? OR ath_num = ?');
    if ($stmt_check === false) {
        $response['status'] = 'error';
        $response['message'] = 'Prepare failed: ' . $conn->error;
        echo json_encode($response);
        exit();
    }

    $stmt_check->bind_param("si", $email, $num);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Email already exists
        $response['status'] = 'error';
        $response['message'] = 'User already registered';
        $stmt_check->close();
        $conn->close();
        echo json_encode($response);
        exit();
    }
    
    $stmt_check->close();

    // If email does not exist, insert the new user
    $stmt_register = $conn->prepare('INSERT INTO athlete_tbl(ath_num, ath_first, ath_last, ath_sport, ath_position, ath_email, ath_pass, ath_img) VALUES (?,?,?,?,?,?,?,?)');
    if ($stmt_register === false) {
        $response['status'] = 'error';
        $response['message'] = 'Prepare failed: ' . $conn->error;
        echo json_encode($response);
        exit();
    }

    $stmt_register->bind_param("isssssss", $num, $first, $last, $sport, $position, $email, $pass, $img) ;

    if ($stmt_register->execute()) {
        $response['status'] = 'success';
        $response['message'] = '../../index.html'; // Redirect URL or success message
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Execute statement failed: ' . $stmt_register->error;
    }

    $stmt_register->close();
    $conn->close();

} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid input';
}

echo json_encode($response);
?>
