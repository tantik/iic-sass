<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
require_once('vendor/autoload.php');

$loader = new \Twig\Loader\FilesystemLoader('./templates');
$twig = new \Twig\Environment($loader);

$mail = new PHPMailer(true);

$data = [
	'name' => filter_var($_POST["name"], FILTER_SANITIZE_STRING),
	'companyName' => filter_var($_POST["companyName"], FILTER_SANITIZE_STRING),
	'email' => filter_var($_POST["email"], FILTER_SANITIZE_EMAIL),
	'message' => filter_var($_POST["message"], FILTER_SANITIZE_STRING),
];

print_r($data);

//
$admin_message = $twig->render('admin.twig', $data);

try {

// 	$mail->SMTPDebug = 0;
// 	$mail->isSMTP();
// 	$mail->Host = 'mail.adm.tools';
// 	$mail->SMTPAuth = true;
// 	$mail->Username = 'agazade@izumi-it-company.com';
// 	$mail->Password = 'SL+aV~kx8~98';
// 	$mail->SMTPSecure = 'ssl';
// 	$mail->Port = 465;

	$mail->setFrom('izumi@izumi-it-company.com', 'IZUMI IT COMPANY');
	$mail->addAddress('izumi@izumi-it-company.com');
	$mail->isHTML(true);

	// Admin message
	$mail->Subject = 'New Form Request';
	$mail->Body = $admin_message;
	$mail->send();

	echo 'Message has been sent';

} catch (Exception $e) {
	echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
