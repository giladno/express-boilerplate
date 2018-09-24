'use strict';

const app = (module.exports = require('express').Router());

app.get('/', async (req, res, next) => {
    try {
        if (req.user) await req.user.update({logout: new Date()});
        req.session = null;
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
});
