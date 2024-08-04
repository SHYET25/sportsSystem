<?php
    header('Content-Type: application/json');
    include "../connection/connection.php";

    $query = "SELECT DISTINCT sport FROM position_tbl";
    $result = $conn->query($query);

    $sports = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sports[] = $row['sport'];
        }
    }

    echo json_encode($sports);

    $conn->close();

?>