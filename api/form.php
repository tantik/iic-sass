<?php
// LINE Business OS — contact form handler (Web3Forms proxy).
// Receives a POST from /contact.html, validates server-side, then forwards the
// submission to the Web3Forms API server-side. The Web3Forms access key is
// loaded ONLY from api/form-provider.local.php (never exposed to the frontend).
// Success ({ok:true}) requires Web3Forms to report success. Returns JSON only.

declare(strict_types=1);

mb_internal_encoding('UTF-8');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---- Configuration ---------------------------------------------------------
const FROM_NAME      = 'IZUMI IT COMPANY';
const ADMIN_SUBJECT  = '【LINE Business OS】導入相談フォーム';
const BACKUP_EMAIL   = 'konstantin.chvykov@gmail.com';
const PAGE_URL       = 'https://izumiit.com/contact.html';
const WEB3FORMS_URL  = 'https://api.web3forms.com/submit';
const MESSAGE_MAX    = 1200;
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
 * Resolve the Web3Forms access key. Prefers api/form-provider.local.php and
 * falls back to the WEB3FORMS_ACCESS_KEY environment variable. Returns '' when
 * no key can be found.
 */
function resolve_access_key(): string
{
    $configPath = __DIR__ . '/form-provider.local.php';
    if (is_file($configPath)) {
        $config = require $configPath;
        if (is_array($config) && !empty($config['web3forms_access_key'])) {
            return trim((string) $config['web3forms_access_key']);
        }
    }

    $envKey = getenv('WEB3FORMS_ACCESS_KEY');
    if ($envKey !== false && trim($envKey) !== '') {
        return trim($envKey);
    }

    return '';
}

/**
 * POST a payload to Web3Forms. Uses curl when available and falls back to
 * stream_context_create. Returns true only when Web3Forms reports success.
 */
function send_to_web3forms(array $payload): bool
{
    $body = http_build_query($payload);

    if (function_exists('curl_init')) {
        $ch = curl_init(WEB3FORMS_URL);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
            ],
        ]);
        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return web3forms_ok($response === false ? null : (string) $response, $httpCode);
    }

    // Fallback: stream context.
    $context = stream_context_create([
        'http' => [
            'method'        => 'POST',
            'header'        => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json\r\n",
            'content'       => $body,
            'timeout'       => 20,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents(WEB3FORMS_URL, false, $context);

    $httpCode = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $headerLine) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $headerLine, $m)) {
                $httpCode = (int) $m[1];
            }
        }
    }

    return web3forms_ok($response === false ? null : (string) $response, $httpCode);
}

/** Interpret a Web3Forms response as success. */
function web3forms_ok(?string $response, int $httpCode): bool
{
    if ($response === null) {
        return false;
    }
    $decoded = json_decode($response, true);
    if (is_array($decoded) && array_key_exists('success', $decoded)) {
        return $decoded['success'] === true;
    }
    // Fall back to HTTP status when the body is not the expected JSON.
    return $httpCode === 200;
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

// Server-side validation. Only name / company / email / message / consent are
// required; the remaining fields are optional and accepted empty.
$errors = [];
if ($name === '')    { $errors[] = 'name'; }
if ($company === '') { $errors[] = 'company'; }
if ($email === '')   { $errors[] = 'email'; }
if ($message === '') { $errors[] = 'message'; }
if ($consent === '') { $errors[] = 'privacy_consent'; }

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email_format';
}
if (mb_strlen($message) > MESSAGE_MAX) {
    $errors[] = 'message_length';
}

if (count($errors) > 0) {
    respond(422, ['ok' => false, 'message' => 'validation_error']);
}

// Resolve the Web3Forms access key (local config or env).
$accessKey = resolve_access_key();
if ($accessKey === '') {
    respond(500, ['ok' => false, 'message' => 'config_missing']);
}

// Build the Web3Forms payload.
$payload = [
    'access_key'    => $accessKey,
    'subject'       => ADMIN_SUBJECT,
    'from_name'     => FROM_NAME,
    'name'          => $name,
    'email'         => $email,
    'company'       => $company,
    'phone'         => $phone !== '' ? $phone : '（未記入）',
    'business_type' => $businessType,
    'store_count'   => $storeCount,
    'staff_count'   => $staffCount,
    'service'       => count($services) > 0 ? implode('、', $services) : '未選択',
    'line_official' => $lineOfficial,
    'timeline'      => $timeline,
    'message'       => $message,
    'page'          => PAGE_URL,
    'backup_email'  => BACKUP_EMAIL,
];

// Forward to Web3Forms. Success only if Web3Forms reports success.
if (!send_to_web3forms($payload)) {
    respond(500, ['ok' => false, 'message' => 'send_failed']);
}

respond(200, ['ok' => true]);
