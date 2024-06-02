# GUI for talking to OpenApi Specified Servers

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

### Other ideas

gemini / claude
https://console.anthropic.com/settings/keys

Select an agent
Media query for mobile like viewports

Group prompt/response as "Tasks"
Add assistant as concept
