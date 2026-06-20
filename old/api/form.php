<?php


$fields = [
  'fullName' => filter_var($_POST["fullName"], FILTER_SANITIZE_STRING),
  'companyName' => filter_var($_POST["companyName"], FILTER_SANITIZE_STRING),
  'email' => filter_var($_POST["email"], FILTER_SANITIZE_EMAIL),
  'hear' => filter_var($_POST["hear"], FILTER_SANITIZE_STRING),
  'inquiry' => filter_var($_POST["inquiry"], FILTER_SANITIZE_STRING),
];

$admin_address = 'izumi@izumi-it-company.com';
$client_address = $fields['email'];
$admin_subject = 'New Form Request | IZUMI IT COMPANY';
$client_subject = 'お問い合わせを承りました｜IZUMI IT COMPANY';

$admin_message = '<p>お名前（必須）: ' . $fields['fullName'] . '<br>
会社名: ' . $fields['companyName'] . '<br>
E-mail（必須）: ' . $fields['email'] . '<br>
どこから当社をお知りになりましたか？: ' . $fields['hear'] . '<br>
お問い合わせ内容（必須）: ' . $fields['inquiry'] . '</p>
';

$client_message = '<p>' . $fields['fullName'] . '様<br>
この度は弊社HPよりお問い合わせくださり、誠にありがとうございます。<br>
折り返しご連絡差し上げますので、どうぞよろしくお願いいたします。<br><br>
ーーーーーーーーーーーーーーーーーーー<br>
IZUMI IT COMPANY OU <br>
<a href="https://www.izumi-it-company.com" target="_blank">https://www.izumi-it-company.com</a><br>
ーーーーーーーーーーーーーーーーーーー</p>';


$headers = 'Content-Type: text/html; charset=utf-8' . "\r\n" .
  "From: IZUMI IT COMPANY <info@izumi-it-company> \r\n";

mail($admin_address, $admin_subject, $admin_message, $headers);
mail($client_address, $client_subject, $client_message, $headers);
