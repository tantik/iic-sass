<?php
// LINE Business OS — contact form handler (native PHP, no dependencies).
// Receives a POST from /contact.html, validates server-side, then sends the
// admin notification, a best-effort Gmail backup copy, and a best-effort client
// auto-reply. Success ({ok:true}) requires ONLY the primary admin email
// (izumi@izumiit.com) to be accepted by mail(); the backup copy and the
// auto-reply are best-effort and never block the user-facing result.
// Returns JSON only.

declare(strict_types=1);

mb_internal_encoding('UTF-8');
// Force UTF-8 output for mb_send_mail (headers + body) when available.
if (function_exists('mb_language')) {
    @mb_language('uni');
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---- Configuration ---------------------------------------------------------
// Two separate admin messages are sent (not a single Cc), because relying on
// Cc has proven unreliable for delivery to the Gmail backup mailbox.
const ADMIN_TO            = 'izumi@izumiit.com';
const ADMIN_BACKUP_TO     = 'konstantin.chvykov@gmail.com';
// From address. If the host rejects izumi@izumiit.com, change this to an
// address the server is allowed to send from; keep REPLY_TO as izumi@izumiit.com.
const FROM_NAME           = 'IZUMI IT COMPANY';
const FROM_EMAIL          = 'izumi@izumiit.com';
const REPLY_TO_CLIENT     = 'izumi@izumiit.com';
const ADMIN_SUBJECT       = '【LINE Business OS】導入相談フォーム';
const ADMIN_BACKUP_SUBJECT= '【LINE Business OS】導入相談フォーム（コピー）';
const CLIENT_SUBJECT      = 'お問い合わせを承りました｜IZUMI IT COMPANY';
const MESSAGE_MAX         = 1200;
// ---------------------------------------------------------------------------

/** Send a JSON response and stop. */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Strip CR/LF and null bytes to prevent header injection. */
function clean_header(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

/** Trim and normalise a plain text value. */
function clean_text(string $value): string
{
    $value = str_replace("\0", '', $value);
    return trim($value);
}

/**
 * Send a UTF-8 plain-text email. Prefers mb_send_mail (which encodes the
 * Japanese subject/body correctly) and falls back to mail() with a
 * MIME-encoded subject. $baseHeaders should contain only From / Reply-To.
 */
function send_mail(string $to, string $subjectRaw, string $body, array $baseHeaders): bool
{
    if (function_exists('mb_send_mail')) {
        // mb_send_mail encodes the subject/body and emits a UTF-8
        // Content-Type itself (mb_language 'uni'); do not add one here.
        return @mb_send_mail($to, $subjectRaw, $body, implode("\r\n", $baseHeaders));
    }

    $headers = array_merge($baseHeaders, [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);

    return @mail(
        $to,
        mb_encode_mimeheader($subjectRaw, 'UTF-8'),
        $body,
        implode("\r\n", $headers)
    );
}

// Accept POST only.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'method_not_allowed']);
}

// Honeypot: silently accept without sending.
if (clean_text((string)($_POST['website'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

// Note: `started_at` is intentionally NOT used to block or silently drop
// submissions. A time trap caused legitimate fast submissions (real users and
// QA testers) to be dropped without sending, making the form look broken.

// Collect fields.
$name        = clean_text((string)($_POST['name'] ?? ''));
$company     = clean_text((string)($_POST['company'] ?? ''));
$email       = clean_text((string)($_POST['email'] ?? ''));
$phone       = clean_text((string)($_POST['phone'] ?? ''));
$businessType= clean_text((string)($_POST['business_type'] ?? ''));
$storeCount  = clean_text((string)($_POST['store_count'] ?? ''));
$staffCount  = clean_text((string)($_POST['staff_count'] ?? ''));
$lineOfficial= clean_text((string)($_POST['line_official'] ?? ''));
$timeline    = clean_text((string)($_POST['timeline'] ?? ''));
$message     = clean_text((string)($_POST['message'] ?? ''));
$consent     = clean_text((string)($_POST['privacy_consent'] ?? ''));

$services = [];
if (isset($_POST['service']) && is_array($_POST['service'])) {
    foreach ($_POST['service'] as $service) {
        $service = clean_text((string) $service);
        if ($service !== '') {
            $services[] = $service;
        }
    }
}

// Server-side validation.
$errors = [];
if ($name === '')         { $errors[] = 'name'; }
if ($company === '')      { $errors[] = 'company'; }
if ($email === '')        { $errors[] = 'email'; }
if ($businessType === '') { $errors[] = 'business_type'; }
if ($storeCount === '')   { $errors[] = 'store_count'; }
if ($staffCount === '')   { $errors[] = 'staff_count'; }
if ($lineOfficial === '') { $errors[] = 'line_official'; }
if ($timeline === '')     { $errors[] = 'timeline'; }
if ($message === '')      { $errors[] = 'message'; }
if (count($services) === 0) { $errors[] = 'service'; }
if ($consent === '')      { $errors[] = 'privacy_consent'; }

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email_format';
}
if (mb_strlen($message) > MESSAGE_MAX) {
    $errors[] = 'message_length';
}

if (count($errors) > 0) {
    respond(422, ['ok' => false, 'message' => 'validation_error']);
}

// Build the admin email body (plain text).
$submittedAt = date('Y-m-d H:i:s');
$ip          = clean_header((string)($_SERVER['REMOTE_ADDR'] ?? ''));

$adminLines = [
    'LINE Business OS 導入相談フォームに新しいお問い合わせがありました。',
    '',
    'お名前: ' . $name,
    '会社名・店舗名: ' . $company,
    'メールアドレス: ' . $email,
    '電話番号: ' . ($phone !== '' ? $phone : '（未記入）'),
    '業種: ' . $businessType,
    '店舗数: ' . $storeCount,
    'スタッフ数: ' . $staffCount,
    '興味のあるサービス: ' . implode('、', $services),
    'LINE公式アカウントの有無: ' . $lineOfficial,
    '希望する導入時期: ' . $timeline,
    '',
    '現在の課題・相談内容:',
    $message,
    '',
    '--',
    '送信日時: ' . $submittedAt,
    'IP: ' . ($ip !== '' ? $ip : '不明'),
];
$adminBody = implode("\r\n", $adminLines);

// Build the client auto-reply body (plain text).
$clientLines = [
    $name . ' 様',
    '',
    'この度は、LINE Business OS についてお問い合わせいただき、誠にありがとうございます。',
    '内容を確認のうえ、担当者よりご連絡いたします。',
    '',
    '──────────────',
    '送信内容',
    '──────────────',
    'お名前: ' . $name,
    '会社名・店舗名: ' . $company,
    'メールアドレス: ' . $email,
    '電話番号: ' . ($phone !== '' ? $phone : '（未記入）'),
    '業種: ' . $businessType,
    '店舗数: ' . $storeCount,
    'スタッフ数: ' . $staffCount,
    '興味のあるサービス: ' . implode('、', $services),
    'LINE公式アカウントの有無: ' . $lineOfficial,
    '希望する導入時期: ' . $timeline,
    '',
    '現在の課題・相談内容:',
    $message,
    '',
    '──────────────',
    '',
    'IZUMI IT COMPANY',
    'https://izumiit.com/',
];
$clientBody = implode("\r\n", $clientLines);

$fromHeader   = mb_encode_mimeheader(FROM_NAME, 'UTF-8') . ' <' . FROM_EMAIL . '>';
$replyToAdmin = clean_header($email);

// Admin headers: Reply-To is the submitted customer email so a reply from the
// admin mailbox goes back to the customer.
$adminHeaders = [
    'From: ' . $fromHeader,
    'Reply-To: ' . $replyToAdmin,
];

// 1) Primary admin mailbox — the ONLY blocking email.
$primarySent = send_mail(ADMIN_TO, ADMIN_SUBJECT, $adminBody, $adminHeaders);

if (!$primarySent) {
    respond(500, ['ok' => false, 'message' => 'send_failed']);
}

// 2) Dedicated Gmail backup/admin copy — best-effort only. A failure here must
// not block user success and is never surfaced to the user or logged with PII.
send_mail(ADMIN_BACKUP_TO, ADMIN_BACKUP_SUBJECT, $adminBody, $adminHeaders);

// 3) Client auto-reply — best-effort only. Reply-To routes replies to izumi@.
$clientHeaders = [
    'From: ' . $fromHeader,
    'Reply-To: ' . REPLY_TO_CLIENT,
];
send_mail($email, CLIENT_SUBJECT, $clientBody, $clientHeaders);

respond(200, ['ok' => true]);
