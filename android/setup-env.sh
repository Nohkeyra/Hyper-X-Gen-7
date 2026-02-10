#!/bin/bash

# ANSI Color Codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}--- HYPERXGEN Android Build Environment Setup ---${NC}"
echo "This script will check for required dependencies (Java 17 & Android SDK)."
echo "It does not install them automatically. Please follow the instructions."
echo ""

# --- Check for Java ---
echo -e "${YELLOW}Checking for Java (JDK 17)...${NC}"
if type -p java; then
    _java=java
elif [[ -n "$JAVA_HOME" ]] && [[ -x "$JAVA_HOME/bin/java" ]];  then
    _java="$JAVA_HOME/bin/java"
else
    echo -e "${RED}ERROR: 'java' command not found.${NC}"
    echo "Please install JDK 17 from https://adoptium.net/temurin/releases/?version=17"
    echo "And ensure it is in your system's PATH."
    exit 1
fi

if [[ "$_java" ]]; then
    version=$("$_java" -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo "Found Java version: $version"
    if [[ "$version" == "17"* ]]; then
        echo -e "${GREEN}JDK 17 found. OK.${NC}"
    else
        echo -e "${RED}ERROR: Incorrect Java version. JDK 17 is required.${NC}"
        echo "Please install JDK 17 from https://adoptium.net/temurin/releases/?version=17"
        echo "And make sure it's the default version in your environment."
        exit 1
    fi
fi
echo ""

# --- Check for Android SDK ---
echo -e "${YELLOW}Checking for Android SDK (ANDROID_HOME)...${NC}"
if [[ -n "$ANDROID_HOME" ]] && [[ -d "$ANDROID_HOME" ]]; then
    echo "ANDROID_HOME is set to: $ANDROID_HOME"
    if [[ -f "$ANDROID_HOME/platform-tools/adb" ]]; then
        echo -e "${GREEN}Android SDK found. OK.${NC}"
    else
        echo -e "${RED}ERROR: ANDROID_HOME seems to be set, but is not a valid SDK directory.${NC}"
        echo "'platform-tools/adb' not found inside."
        exit 1
    fi
else
    echo -e "${RED}ERROR: ANDROID_HOME environment variable is not set.${NC}"
    echo "Please install Android Studio from https://developer.android.com/studio"
    echo "Then, set the ANDROID_HOME variable. Example for macOS:"
    echo 'export ANDROID_HOME=$HOME/Library/Android/sdk'
    echo "Example for Linux:"
    echo 'export ANDROID_HOME=$HOME/Android/Sdk'
    exit 1
fi
echo ""

echo -e "${GREEN}--- Environment Check Complete ---${NC}"
echo "All dependencies seem to be correctly configured."
echo "You can now proceed to build the APK as per the README.md instructions."
