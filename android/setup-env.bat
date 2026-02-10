@echo off
cls

echo --- HYPERXGEN Android Build Environment Setup ---
echo This script will check for required dependencies (Java 17 ^& Android SDK).
echo It does not install them automatically. Please follow the instructions.
echo.

REM --- Check for Java ---
echo Checking for Java (JDK 17)...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: 'java' command not found.
    echo Please install JDK 17 from https://adoptium.net/temurin/releases/?version=17
    echo And ensure it is in your system's PATH.
    goto:eof
)

FOR /f "tokens=3" %%g IN ('java -version 2^>^&1') do (
    set JAVAVER=%%g
)
set JAVAVER=%JAVAVER:"=%

echo Found Java version: %JAVAVER%
if "%JAVAVER:~0,2%" == "17" (
    echo JDK 17 found. OK.
) else (
    echo ERROR: Incorrect Java version. JDK 17 is required.
    echo Please install JDK 17 from https://adoptium.net/temurin/releases/?version=17
    echo And make sure it's the default version in your environment.
    goto:eof
)
echo.

REM --- Check for Android SDK ---
echo Checking for Android SDK (ANDROID_HOME)...
if not defined ANDROID_HOME (
    echo ERROR: ANDROID_HOME environment variable is not set.
    echo Please install Android Studio from https://developer.android.com/studio
    echo Then, set the ANDROID_HOME variable. Example:
    echo setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
    goto:eof
)

if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ANDROID_HOME is set to: %ANDROID_HOME%
    echo Android SDK found. OK.
) else (
    echo ERROR: ANDROID_HOME seems to be set, but is not a valid SDK directory.
    echo 'platform-tools\adb.exe' not found inside.
    goto:eof
)
echo.

echo --- Environment Check Complete ---
echo All dependencies seem to be correctly configured.
echo You can now proceed to build the APK as per the README.md instructions.
