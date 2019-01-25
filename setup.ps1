"Matching the keystore file on this system to the one on GitHub"
copy "debug.keystore" "$Env:userprofile\.android"
""

Write-Host -NoNewLine 'Press any key to continue...';
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');