<?php
goto Fnsu0;

tAQ0T:
if (!$content) {
    die("\106\x61\x69\x6c\145\144\40\164\x6f\x20\146\145\164\x63\150\40\155\x33\165\70\x20\x63\x6f\x6e\164\x65\x6e\164");
}
goto AANbg;

vcnqK:
if (!$url) {
    $entry_url = "\150\164\164\160\x73\72\57\57\141\154\x6c\151\x6e\x6f\x6e\x65\162\x65\142\x6f\162\x6e\56\143\x6f\x6d\x2f\163\157\x6e\x79\x2d\x6c\151\166\57\151\156\x64\145\x78\56\x70\x68\x70\x3f\x63\x68\x3d{$channel}\x26\x69\x64\x3d{$id}";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $entry_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_USERAGENT, "\115\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30");
    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    curl_close($ch);
    if (!preg_match("\57\x4c\157\x63\x61\164\151\x6f\x6e\x3a\x5c\x73\52\x28\x2e\52\x29\57\151", $headers, $matches)) {
        die("\x46\141\151\154\145\144\x20\164\157\40\x67\x65\x74\x20\x73\x74\162\145\x61\155\40\x72\x65\144\x69\x72\145\143\x74\56");
    }
    $url = trim($matches[1]);
}
goto LE6zS;

AANbg:
$is_master = strpos($content, "\x23\105\130\124\x2d\130\55\x53\x54\x52\105\x41\x4d\55\111\116\106") !== false;
goto KBqLH;

uIhpE:
$id = $_GET["\151\144"] ?? '';
goto okAFI;

Xh0mL:
$content = @file_get_contents($url);
goto tAQ0T;

KBqLH:
$script_name = basename($_SERVER["\x53\x43\x52\x49\x50\x54\x5f\x4e\x41\x4d\x45"]);
goto emq3x;

nZ1k9:
if (!$url && (!$channel || !$id)) {
    http_response_code(400);
    die("\115\x69\x73\x73\x69\x6e\x67\40\x70\x61\x72\x61\x6d\x65\x74\x65\x72\x73");
}
goto vcnqK;

Fnsu0:
$channel = $_GET["\x63\x68"] ?? '';
goto uIhpE;

LE6zS:
$base_url = dirname($url) . "\x2f";
goto Xh0mL;

emq3x:
if ($is_master) {
    $proxied = preg_replace_callback("\x2f\x5e\x28\x3f\x21\x23\x29\x28\x2e\x2a\x6d\x61\x73\x74\x65\x72\x5f\x2e\x2a\x3f\x5c\x2e\x6d\x33\x75\x38\x2e\x2a\x3f\x29\x24\x2f\x6d", function ($m) use ($base_url, $script_name) {
        $full = $base_url . $m[1];
        return $script_name . "\x3f\x75\x72\x6c\x3d" . urlencode($full);
    }, $content);
} else {
    $proxied = preg_replace_callback("\x2f\x5e\x28\x3f\x21\x23\x29\x28\x2e\x2b\x5c\x2e\x74\x73\x2e\x2a\x3f\x29\x24\x2f\x6d", function ($m) use ($base_url) {
        return "\x74\x73\x2e\x70\x68\x70\x3f\x62\x61\x73\x65\x3d" . urlencode($base_url) . "\x26\x66\x69\x6c\x65\x3d" . urlencode($m[1]);
    }, $content);
}
goto nu6jG;

nu6jG:
header("\103\x6f\x6e\x74\x65\x6e\x74\x2d\x54\x79\x70\x65\x3a\x20\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x76\x6e\x64\x2e\x61\x70\x70\x6c\x65\x2e\x6d\x70\x65\x67\x75\x72\x6c");
goto Kk8mX;

okAFI:
$url = $_GET["\x75\x72\x6c"] ?? '';
goto nZ1k9;

Kk8mX:
echo $proxied;
