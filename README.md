# GUI for talking to OpenApi Specified Servers

Lazy Rest is an application that maps natural language requests from users to a list of HTTP calls (ie creates a plan) to achieve the request. Users give the application oas spec files, and configure the llm to use, entirely locally for privacy.

## Examples

### Spotify

You can download https://github.com/sonallux/spotify-web-api/blob/main/fixed-spotify-open-api.yml

## Development

Make sure you have npm installed. I
use [node version manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
to use multiple versions of npm on my computer at once. Then to develop as an electron app you can install once

```shell
npm install 
```

Now to run the development server run

```shell
npm start
```

## Features

### Select a model and chat with it

Select a model with context menu
Send message updates
Chat remembers selected responder

### REST planner

Me2RESTGPT "Recommend some war themed movies by Spielberg"

1. Planner: "Search with name "Spielberg""
2. API Selector "Get /search/person to search for the person with name Spielberg"
3. Caller: "GET/POST/PUT description and response "
4. Parser: "The id of the person is 488"
   The user should have the option to go back to 1 to continue execution of the planner, unless the planner returns end

Note a more realistic example would be:

```
Make a playlist containing songs of Mariah Carey and name it "Love Mariah"
```

since i'm starting with spotify integration

[restgpt](https://restgpt.github.io/)

### Code Signing

```md
On macOS, there are two layers of security technology for application distribution: code signing and notarization.  
Code Signing is the act of certifying the identity of the app's author and ensuring it was not tampered with before distribution.  
Notarization is an extra verification step where the app is sent to Apple servers for an automated malware scan.  
```

Install the `.cer` by downloading from [apple](https://developer.apple.com/account/resources/certificates/add/download/5Y97RA2VK8) and double click > trust > trust all

https://www.electronforge.io/guides/code-signing/code-signing-macos
