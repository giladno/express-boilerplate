# Express Boilerplate example app

> ### A simple Node.js app (Express + Sequelize) with the purpose of providing a compact, clear and concise example to how Node.js apps can be built

This repo is a work in progress — Feel free to open issues and PRs.

# Requirements

- Node.js >= 10.8.0
- PostgreSQL/MySQL (to use with Sequelize)

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm start` to start the local server
- Open your favorite browser and navigate to http://localhost:3000 (default port)

# Environment Variables
- NODE_ENV - defines the node environment, the default is `development`
- LOG_LEVEL - defines `winston`'s logging level (see [Logging Levels](https://github.com/winstonjs/winston#logging-levels)); defaults to 'info'
- COOKIE_SECRET - used by `cookie-session`, defaults to 'secret'
- COOKIE_AGE - used by `cookie-session`, defaults to a fixed number
- PORT - the port the app is listening to, defaults to 3000

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [Sequelize](http://docs.sequelizejs.com/) - a promise-based ORM for Node.js v4 and up, used to handle database migrations and queries
- [Morgan](https://github.com/expressjs/morgan) - an HTTP request logger
- [longjohn](https://github.com/mattinsler/longjohn) - A module that helps display more info regarding stack traces
- [require-all](https://github.com/felixge/node-require-all) - An easy way to require all files within a directory.
- [winston](https://github.com/winstonjs/winston) - Like console.log(), but better :)
- [cookie-session](https://github.com/expressjs/cookie-session) - Simple cookie-based session middleware, used to save and sync user session between the client and server
- [ejs](http://ejs.co/) - A templating engine for JavaScript
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - A password hashing function for JavaScript, based on [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)

## Application Structure

- `server.js` - The entry point to our application. This file requires some of the above dependencies, starts logging requests, sets up the view engine, handles the creation and handling of cookies, sets up routing and eventually listens for a connection from the client.

- `db.js` - We use this file to connect to our database using Sequelize, set up our models, hooks, and authentication mechanism

- `controllers` - This folder contains the controllers used in our routes. These contain the logic of what happend when a user requests a certain page or endpoint.

- `views/` - This folder contains the `.ejs` files that get served from our controllers

## To do

- Email verification
- Password reset
- Adding Webpack to demonstrate bundle serving to the client
- Improve the project file structure, maybe separate to `config`, `models` etc.

## Contributors

[<img title="Gilad Novik" src="https://avatars1.githubusercontent.com/u/417148?s=50&v=4">](https://github.com/giladno)
[<img title="Tal Koren" src="https://avatars1.githubusercontent.com/u/4380333?s=50&v=4">](https://github.com/Ardethian)