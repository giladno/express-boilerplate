# Express Boilerplate example app

> ### A simple Node.js app (Express + Sequelize) with the purpose of providing a compact, clear and concise example to how Node.js apps can be built

This repo is a work in progress — Feel free to open issues and PRs.

# Requirements

-   Node.js >= 10.8.0

# Getting started

To get the Node server running locally:

-   Clone this repo
-   `npm install` to install all required dependencies
-   `npm start` to start the local server
-   Open your favorite browser and navigate to http://localhost:3000 (default port)

# Environment Variables

-   NODE_ENV - defines the node environment, the default is `development`
-   LOG_LEVEL - defines [winston](https://github.com/winstonjs/winston#logging-levels)'s logging level, defaults to `info`
-   COOKIE_SECRET - used by [cookie-session](https://github.com/expressjs/cookie-session#secret), defaults to `secret`
-   COOKIE_AGE - used by [cookie-session](https://github.com/expressjs/cookie-session#cookie-options), defaults to a 30 days
-   PORT - the port the app is listening to, defaults to 3000
-   DATABASE_URL - connection url, defaults to in-memory SQLite instance

# Code Overview

## Dependencies

-   [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
-   [Sequelize](http://docs.sequelizejs.com/) - a promise-based ORM for Node.js v4 and up, used to handle database migrations and queries
-   [Morgan](https://github.com/expressjs/morgan) - an HTTP request logger
-   [longjohn](https://github.com/mattinsler/longjohn) - A module that helps display more info regarding stack traces
-   [require-all](https://github.com/felixge/node-require-all) - An easy way to require all files within a directory
-   [winston](https://github.com/winstonjs/winston) - Like console.log(), but better :)
-   [cookie-session](https://github.com/expressjs/cookie-session) - Simple cookie-based session middleware, used to save and sync user session between the client and server
-   [ejs](http://ejs.co/) - A templating engine for JavaScript

## Application Structure

-   `server.js` - The entry point to our application. This file requires some of the above dependencies, starts logging requests, sets up the view engine, handles the creation and handling of cookies, sets up routing and eventually listens for a connection from the client

-   `models/` - This folder contains the database models

-   `controllers/` - This folder contains the controllers used in our routes. These contain the logic of what happens when a user requests a certain page or endpoint. By default, all controllers require an authenticated user. To allow public access, a controller needs to return `{guest: true}`

-   `views/` - This folder contains the `.ejs` files that get served from our controllers

## To do

-   Email verification
-   Password reset
-   Adding Webpack to demonstrate bundle serving to the client
-   Improve the project file structure, maybe separate to `config` etc.

## Contributors

[<img title="Gilad Novik" src="https://avatars1.githubusercontent.com/u/417148?s=50&v=4">](https://github.com/giladno)
[<img title="Tal Koren" src="https://avatars1.githubusercontent.com/u/4380333?s=50&v=4">](https://github.com/Ardethian)

## License

MIT
