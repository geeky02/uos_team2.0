<?php

	// $to = "contact@unios.site"; // this is your Email address
	// $from  = $_POST['email']; // this is the sender's Email address
	// $sender_name = $_POST['name'];
	// $phone = $_POST['phone'];
	// $note = $_POST['note'];
	// $subject = $_POST['subject'];

	// $subject = "Form submission";

	// $message = $sender_name . " has send the contact message. His / her phone number is " . $phone . ". He / she wrote the following... ". "\n\n" . $note;

	// $headers = 'From: ' . $from;
	// mail($to, $subject, $message, $headers);

	$formData = [
        'access_key' => '30f5bf3d-3282-4d62-92b4-b6b271ecae89', // Your API access key
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
        'note' => $_POST['note'],
    ];

    // Convert data to JSON format
    $jsonData = json_encode($formData);

    // cURL setup
    $ch = curl_init('https://api.web3forms.com/submit');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

    // Execute the POST request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Close the cURL session
    curl_close($ch);

    // Handle response
    $result = json_decode($response, true);

    if ($httpCode === 200 && isset($result['success']) && $result['success']) {
        echo 'Form submission successful: ' . $result['message'];
    } else {
        echo 'Form submission failed: ' . $result['message'];
    }
?>