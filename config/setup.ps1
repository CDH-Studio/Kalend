"Installing Chocolatey"
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
""
""

"Installing node.js"
choco install -y nodejs.install
""
""

"Installing Python"
choco install -y python2
""
""

"Installing JDK"
choco install -y jdk8
""
""

"Installing yarn"
choco install -y yarn
$ENV:PATH="$ENV:PATH;C:\Program Files (x86)\Yarn\bin"
""
""

"Installing React Native"
yarn global add react-native-cli
""
""

"Installing Android Studio"
choco install -y androidstudio
""
""

"Please go through the installation of Android Studio, then close Android Studio"
& "C:\Program Files\Android\Android Studio\bin\studio64.exe" /run | out-null
""
""

"Adding ANDROID_HOME environment variable"
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:userprofile\AppData\Local\Android\Sdk", "User")
""
""

"Adding android tools to Path"
[System.Environment]::SetEnvironmentVariable("PATH", $Env:Path + ";$env:userprofile\AppData\Local\Android\Sdk\platform-tools;$env:userprofile\AppData\Local\Android\Sdk\tools\bin;$env:userprofile\AppData\Local\Android\Sdk\tools", "User")
$ENV:PATH="$ENV:PATH;$env:userprofile\AppData\Local\Android\Sdk\tools\bin"
""
""

"Please accept the following licenses"
sdkmanager --licenses
""
""

"Installing Android SDK for React Native"
sdkmanager "platforms;android-28" "build-tools;28.0.3" "sources;android-28"
""
""

"Installing Android SDK for React Native Google Sign In"
sdkmanager "add-ons;addon-google_apis-google-23" "add-ons;addon-google_apis-google-22" "platforms;android-23" "platforms;android-22" "extras;intel;Hardware_Accelerated_Execution_Manager" "extras;google;google_play_services" "extras;google;m2repository" "extras;android;m2repository" "tools" "platform-tools" "build-tools;27.0.3" "build-tools;28.0.3"
""
""

"Matching the keystore file on this system to the one on GitHub"
copy "debug.keystore" "$Env:userprofile\.android"
""
""

Write-Host -NoNewLine 'Installation done, press any key to continue...';
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');