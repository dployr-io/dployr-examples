<?php

$port = $_ENV['PORT'] ?? 3000;
$host = $_ENV['HOST'] ?? 'localhost';
$documentRoot = $_ENV['DOCUMENT_ROOT'] ?? __DIR__;
echo "Old County Times PHP server starting on http://$host:$port\n";
echo "Document root: $documentRoot\n";
echo "Press Ctrl+C to stop the server\n\n";

// Start the PHP built-in server
$command = "php -S $host:$port -t $documentRoot index.php";
passthru($command);
?>