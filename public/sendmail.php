<?php
/**
 * Macan Group — contact / inquiry handler for cPanel (static site + PHP).
 *
 * The site is a static export; this is the only dynamic endpoint. The React
 * forms POST multipart/form-data here (fetch → /sendmail.php) and expect a
 * JSON reply: {"ok":true} or {"ok":false,"error":"..."}.
 *
 * Setup:
 *   1. Create the mailbox contact@macanco.com in cPanel → Email Accounts.
 *   2. Set $TO / $FROM below (same domain as the site so SPF/DKIM pass).
 *   3. Configure SPF, DKIM and DMARC (see docs/email-dns.md).
 *
 * No third-party libraries — uses PHP mail() via the server's local MTA (Exim
 * on cPanel), which signs with DKIM automatically once enabled.
 */

// ------------------------------------------------------------------ config ---
$TO          = 'contact@macanco.com';        // where inquiries are delivered
$FROM        = 'website@macanco.com';         // envelope sender (must be a real
                                              // address / alias on this domain)
$FROM_NAME   = 'Macan Group Website';
$SUBJECT_TAG = '[macanco.com]';
$MAX_TOTAL_UPLOAD = 10 * 1024 * 1024;         // 10 MB across all attachments
$ALLOWED_EXT = ['pdf','dwg','dxf','step','stp','igs','iges','zip','doc','docx','png','jpg','jpeg'];
$RATE_SECONDS = 20;                           // min gap between sends per IP
// ---------------------------------------------------------------------------

// Optional server-only overrides that survive redeploys (not in the repo,
// excluded from the deploy sync). Copy sendmail.config.example.php to
// sendmail.config.php on the server to change $TO/$FROM without a rebuild.
if (is_file(__DIR__ . '/sendmail.config.php')) {
    require __DIR__ . '/sendmail.config.php';
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}
function ok() {
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

// --- Honeypot: bots fill hidden fields. Pretend success, send nothing. ------
if (!empty($_POST['company_website'])) {
    ok();
}

// --- Simple per-IP rate limit --------------------------------------------------
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lock = sys_get_temp_dir() . '/macan_mail_' . md5($ip);
if (is_file($lock) && (time() - filemtime($lock)) < $RATE_SECONDS) {
    fail('Please wait a moment before sending another message.', 429);
}
@touch($lock);

// --- Collect fields ---------------------------------------------------------
$subject = trim($_POST['_subject'] ?? 'Website enquiry');
$lang    = preg_replace('/[^a-z]/', '', strtolower($_POST['_lang'] ?? ''));

$senderEmail = trim($_POST['Email'] ?? '');
$senderName  = trim($_POST['Name'] ?? '');
$validReply  = filter_var($senderEmail, FILTER_VALIDATE_EMAIL) ? $senderEmail : '';

// Build a readable body from every non-internal field.
$lines = [];
foreach ($_POST as $key => $value) {
    if ($key[0] === '_' || $key === 'company_website') continue;
    if (is_array($value)) $value = implode(', ', $value);
    $value = trim((string) $value);
    if ($value === '') continue;
    $lines[] = str_pad($key . ':', 16) . $value;
}
if (!$lines) {
    fail('Your message looks empty.');
}
$lines[] = '';
$lines[] = 'Language : ' . ($lang ?: 'en');
$lines[] = 'IP       : ' . $ip;
$lines[] = 'Time     : ' . gmdate('Y-m-d H:i:s') . ' UTC';
$bodyText = implode("\r\n", $lines) . "\r\n";

// --- Attachments ----------------------------------------------------------
$attachments = [];
$totalBytes  = 0;
if (!empty($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
    $f = $_FILES['attachments'];
    $count = count($f['name']);
    for ($i = 0; $i < $count; $i++) {
        if ($f['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
        if ($f['error'][$i] !== UPLOAD_ERR_OK) {
            fail('One of the uploaded files could not be read.');
        }
        $name = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($f['name'][$i]));
        $ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, $ALLOWED_EXT, true)) {
            fail('File type not allowed: .' . $ext);
        }
        $totalBytes += (int) $f['size'][$i];
        if ($totalBytes > $MAX_TOTAL_UPLOAD) {
            fail('Attachments exceed the 10 MB limit.');
        }
        $data = file_get_contents($f['tmp_name'][$i]);
        if ($data === false) {
            fail('One of the uploaded files could not be read.');
        }
        $attachments[] = ['name' => $name, 'data' => $data];
    }
}

// --- Assemble the message ------------------------------------------------
$to      = $TO;
$subject = $SUBJECT_TAG . ' ' . $subject;

$fromHeader = sprintf('%s <%s>', $FROM_NAME, $FROM);
$headers    = [];
$headers[]  = 'From: ' . $fromHeader;
$headers[]  = 'Reply-To: ' . ($validReply
    ? sprintf('%s <%s>', $senderName ?: $validReply, $validReply)
    : $fromHeader);
$headers[]  = 'MIME-Version: 1.0';
$headers[]  = 'X-Mailer: macanco-sendmail';

if ($attachments) {
    $boundary = 'b_' . bin2hex(random_bytes(12));
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

    $parts   = [];
    $parts[] = "--$boundary\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $bodyText . "\r\n";

    foreach ($attachments as $a) {
        $parts[] = "--$boundary\r\n"
            . 'Content-Type: application/octet-stream; name="' . $a['name'] . "\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . 'Content-Disposition: attachment; filename="' . $a['name'] . "\"\r\n\r\n"
            . chunk_split(base64_encode($a['data'])) . "\r\n";
    }
    $parts[] = "--$boundary--\r\n";
    $message = implode('', $parts);
} else {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $message   = $bodyText;
}

$sent = @mail($to, $subject, $message, implode("\r\n", $headers), '-f ' . $FROM);

if (!$sent) {
    fail('The mail server rejected the message. Please email us directly.', 502);
}
ok();
