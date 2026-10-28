$content = Get-Content "C:\Users\macsv\OneDrive\Documents\GitHub\basura-alert\about.html" -Raw
$newContent = $content -replace 'href="css/style.css"', 'href="./css/style.css"'
$newContent | Set-Content "C:\Users\macsv\OneDrive\Documents\GitHub\basura-alert\about.html" -NoNewline -Encoding UTF8
