<?php
$f = 'resources/js/Pages/Anggaran/Index.jsx';
$c = file_get_contents($f);
$c = str_replace('<Cell key={cell-} fill={entry.color} />', '<Cell key={`cell-${index}`} fill={entry.color} />', $c);
file_put_contents($f, $c);
echo "OK\n";
?>