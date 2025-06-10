<?php
$base = $_GET['base'] ?? '';
$file = $_GET['file'] ?? '';

if (!$base || !$file) {
    http_response_code(400);
    exit('Invalid parameters');
}

$url = $base . $file;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Referer: https://www.sonyliv.com/',
]);

$data = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

header("Content-Type: $contentType");
echo $data;
