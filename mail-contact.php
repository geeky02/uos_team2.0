<?php

	$to = "deptop725@gmail.com"; // this is your Email address
	$from  = $_POST['email']; // this is the sender's Email address
	$sender_name = $_POST['name'];
	$phone = $_POST['phone'];
	$note = $_POST['note'];


	$message = $sender_name . " has send the contact message. His / her phone number is " . $phone . ". He / she wrote the following... ". "\n\n" . $note;

	$headers = 'From: ' . $from;
	mail($to, $message, $headers);

?>