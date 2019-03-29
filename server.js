'use strict';
const path = require('path');
const express = require('express');
const winston = require('winston');
const require_all = require('require-all');
const sequelize = require('./models');

const {User} = sequelize.models;

const __DEV__ = process.env.NODE_ENV == 'development';

winston.add(
    new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(winston.format.colorize({level: true}), winston.format.simple()),
    })
);

const app = express();

app.set('db', {...sequelize.models, sequelize});
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));
app.set('x-powered-by', false);
app.locals.__DEV__ = __DEV__;

app.use(
    require('cookie-session')({
        keys: [process.env.COOKIE_SECRET || 'secret'],
        maxAge: Number(process.env.COOKIE_AGE) || 30 * 86400000,
    })
);
app.use(express.static(path.resolve(__dirname, './static')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (__DEV__) {
    require('longjohn');
    app.use(require('morgan')('dev'));
    app.use((req, res, next) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}

app.use(async (req, res, next) => {
    res.locals.url = req.url;
    next();
});

app.use(async (req, res, next) => {
    try {
        const user = req.session.id && (await User.findOne({where: {id: req.session.id || 0}}));
        if (user && (Number(req.session.timestamp) || 0) > (Number(user.logout) || 0))
            res.locals.user = req.user = user;
    } catch (err) {
        winston.error(err.message, {err});
    } finally {
        next();
    }
});

for (const [name, controller] of Object.entries(require_all({dirname: path.resolve(__dirname, './controllers')}))) {
    winston.info(`Registering controller /${name}`);
    const router = express.Router();
    const {guest} = controller(router, sequelize.models) || {};
    app.use(
        `/${name}`,
        (req, res, next) => {
            if (guest) return next();
            if (!req.user) return res.render('401');
            next();
        },
        router
    );
}

app.get('/', (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('index');
});

app.use((req, res) => res.render('404'));

app.use((err, req, res, next) => {
    winston.error(err.message, {url: req.url, err});
    res.render('500', {err});
    next;
});

process.on('unhandledRejection', err => {
    winston.error(err.message, {err});
    throw err;
});

(async () => {
    await sequelize.sync();
    await new Promise((resolve, reject) =>
        require('http')
            .Server(app)
            .listen(Number(process.env.PORT) || 3000, resolve)
            .on('error', reject)
    );
    winston.info('server is running...');
})();
