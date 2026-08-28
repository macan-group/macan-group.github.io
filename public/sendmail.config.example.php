<?php
/**
 * Optional server-side config for sendmail.php.
 *
 * Rename to  sendmail.config.php  in the site's document root on cPanel.
 * It is loaded (if present) after the defaults in sendmail.php, and is
 * excluded from the deploy sync, so it survives every redeploy.
 *
 * Only override what you need.
 */

$TO        = 'contact@macanco.com';
$FROM      = 'website@macanco.com';   // must be a real mailbox/alias on the domain
$FROM_NAME = 'Macan Group Website';

// $RATE_SECONDS = 20;
// $MAX_TOTAL_UPLOAD = 10 * 1024 * 1024;
