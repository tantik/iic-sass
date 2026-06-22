<?php
return [
    'provider' => 'web3forms',
    'web3forms_access_key' => 'PASTE_ACCESS_KEY_HERE',
    'admin_email' => 'izumi@izumiit.com',
    'backup_email' => 'konstantin.chvykov@gmail.com',
    // Optional, temporary debugging aid. When set, a POST that includes a
    // matching `debug_token` field makes form.php return the missing FIELD
    // NAMES (never values) in the 422 response. Omit to disable.
    // 'debug_token' => 'CHOOSE_A_RANDOM_TOKEN',
];
