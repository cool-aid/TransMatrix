# TransMatrix

A powerful translation extension leveraging Chrome's latest built-in AI capabilities, supporting translation from one language to multiple languages simultaneously.

## Features

- Seamless integration with Chrome's latest built-in AI APIs, the Language Detection API and the Translator API.
- Translates selected text into multiple languages simultaneously, up to 3 languages at a time for performance reasons at the moment.
- Automatically detects the language of the selected text
- Supports offline translation
- Modern and user-friendly interface
- Languages supported:
    - Chinese
    - English
    - French
    - German
    - Italian
    - Japanese
    - Korean
    - Portuguese
    - Russian
    - Spanish

## Requirements

### Prerequisites:
- Make sure that you are using Chrome on one of these platforms: Windows, Mac, or Linux.
- Download Chrome Canary or Chrome dev channel, and confirm that your version is equal to or newer than 131.0.6778.2.
- Navigate to chrome://flags/#language-detection-api
- Select Enabled.
- Navigate to chrome://flags/#translation-api
- Select Enabled without language pack limit
- Relaunch Chrome.

### Installation
- Download the extension as a .zip file from GitHub
- Unzip the file
- Navigate to chrome://extensions/
- Enable "Developer mode"
- Click "Load unpacked"
- Select the folder containing the extension files

### Usage
- Click on the extension icon in the toolbar
- Select the source language or leave it as "Auto Detect"
- Select the target languages, up to 3 languages due to performance reasons
- Select the text you want to translate
- Click on the icon showing up next to the selected text
- The translation window will open
- You can drag the window around
- Click on the X button or click on the page outside the window to close it


## License

This project is released under the [Apache License 2.0](LICENSE).