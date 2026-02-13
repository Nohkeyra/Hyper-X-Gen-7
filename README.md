# HYPERXGEN - Android APK Build Package

## 📱 About HYPERXGEN
A high-precision synthesis engine for vector graphics and typographic art powered by Gemini AI.
Built with React, TypeScript, and wrapped for Android using Capacitor.

## 📦 What's Included
- ✅ Complete React/TypeScript source code
- ✅ Pre-built web application (`Appsgeyser` folder)
- ✅ Android project wrapper and setup scripts (`app` folder)
- ✅ All dependencies configuration files
- ✅ Build scripts and configurations

---

## 🚀 Building the Android APK

This guide provides instructions to compile the HYPERXGEN web application into a native Android APK.

### Step 1: Environment Setup (One-Time)

> **IMPORTANT:** This build package relies on you having Java (JDK 17) and the Android SDK installed on your system. **These tools are not included in this package** due to their large size and platform-specific nature. The included `jdk/` and `sdk/` folders are placeholders for structure only.
> 
> You must point your `JAVA_HOME` and `ANDROID_HOME` environment variables to your *actual* installation directories, not the empty placeholder folders in this project. The setup scripts provided below will help you verify your local installation.

Before you can build the APK, you must install the required development tools on your system. We have provided scripts to verify your installation.

**1. Install Dependencies:**
   - **Java Development Kit (JDK) 17:** The Android toolchain requires a specific version of Java.
     - **Download:** [Eclipse Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17)
   - **Android Studio:** This is the easiest way to get the Android SDK and build tools.
     - **Download:** [Android Studio](https://developer.android.com/studio)
     - During installation, ensure you install the "Android SDK Command-line Tools".

**2. Configure Environment Variables:**
   You must tell your system where to find the Java and Android SDK installations.

   **macOS / Linux:**
   Open your `~/.zshrc`, `~/.bashrc`, or `~/.profile` and add the following lines:
   ```bash
   # Adjust paths if you installed to a different location
   export JAVA_HOME="/path/to/your/jdk-17" # e.g., /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
   ```
   *Reload your shell after saving by running `source ~/.zshrc` or opening a new terminal.*

   **Windows:**
   Open PowerShell as Administrator and run these commands, adjusting the paths for your system:
   ```powershell
   # Use 'setx /M' to set system-wide environment variables
   setx /M JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot"
   setx /M ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   
   # Add to system PATH (be careful not to overwrite existing path)
   $oldPath = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name 'Path').Path
   $newPath = "$oldPath;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin"
   setx /M PATH "$newPath"
   ```
   *You must restart PowerShell/CMD and possibly your computer for these changes to take effect.*

**3. Verify Your Setup:**
   Run the verification script from the project root:
   ```bash
   # For macOS / Linux
   ./app/setup-env.sh
   
   # For Windows (CMD or PowerShell)
   .\app\setup-env.bat
   ```
   If the script reports success, you are ready to build! If not, follow the error messages to fix your setup. You can also run `npm run setup:android` for a hint.

---

### Step 2: Building the APK

With the environment configured, you can now build the APK.

**1. Build Web Assets:**
   First, compile the web application into static files.
   ```bash
   npm run build
   ```
   This command places the necessary web assets into the `Appsgeyser` directory. These assets need to be manually or script-copied into `app/src/main/assets/www`. (For this package, the assets are pre-compiled and included.)

**2. Build the APK:**
   You can now build the APK using either Android Studio or the command line.

   **Option A: Using Android Studio (Recommended)**
   1.  **Open Project:** Launch Android Studio, select "Open", and navigate to the `app` folder within this project.
   2.  **Gradle Sync:** Wait for Android Studio to index files and sync the project with Gradle. This can take several minutes on the first open.
   3.  **Build APK:** From the menu bar, go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`.
   4.  **Locate APK:** Once the build is complete, a notification will appear. Click "locate" or find the file at `app/build/outputs/apk/debug/app-debug.apk`.

   **Option B: Using the Command Line**
   1.  **Navigate to Folder:** Open your terminal and change the directory to the `app` folder:
       ```bash
       cd app
       ```
   2.  **Run Build Command (and make gradlew executable if needed):**
       ```bash
       # On macOS/Linux, you may need to grant execute permissions first:
       # chmod +x ./gradlew
       
       # For macOS / Linux
       ./gradlew assembleDebug
       
       # For Windows
       .\gradlew.bat assembleDebug
       ```
   3.  **Find APK:** The generated file will be at `app/build/outputs/apk/debug/app-debug.apk`.

---

### Step 3: Installing the APK

You can install the generated `app-debug.apk` on an Android device or emulator.

1.  **Enable USB Debugging** on your Android device (in Developer Options).
2.  **Connect Device:** Connect your device to your computer via USB.
3.  **Install via ADB:** Open a terminal and run:
    ```bash
    adb install app/build/outputs/apk/debug/app-debug.apk
    ```
    Alternatively, you can drag-and-drop the APK file onto an open Android Emulator window.

---

## 🔧 Development Workflow

1.  **Modify Web App:** Make changes to the React source code in the root directory.
2.  **Test Locally:** Run `npm run dev` to see your changes in a web browser.
3.  **Build Web Assets:** Run `npm run build`. This compiles the web app into the `Appsgeyser` directory.
4.  **Sync to Android:** **Manually copy** the contents of `Appsgeyser/` into the `app/src/main/assets/www/` directory, overwriting existing files.
5.  **Rebuild APK:** Use Android Studio or the command line to build a new APK with the updated code.

## 📄 License
Check project license files for usage terms.

---

**Built with:** React + TypeScript + Vite + Capacitor
**Target Platform:** Android 8.0+ (API Level 26+)
**Package Name:** com.hyperxgen.app