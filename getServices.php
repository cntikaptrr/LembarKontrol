<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "daftarlayanan";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT * FROM services";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
    exit();
}

$services = $result->fetch_all(MYSQLI_ASSOC);

$conn->close();

echo json_encode($services);
?>
