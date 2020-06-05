# SproutKit

* This project is a work in progress. (Local development is a little cumbersome to setup.)
* Everything points to the Coding Garden Twitch channel
  * I'm working on moving things into configuration files...
* The electron app and overlay depend on the Coding Garden API: https://github.com/CodingGarden/api
* The components have no other dependencies.
  * I am working on moving those components into a separate project that will be published to npm as web components.

## Setup

```sh
npm install
```

## SproutKit Components

```sh
npm run styleguide
```

## Electron Chat Overlay

```sh
npm run electron:serve
```

## Lofi Intro / Break Screen

```sh
npm run serve:overlay
```