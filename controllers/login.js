'use strict';
const assert = require('assert');
const {User} = require('../db');

const app = (module.exports = require('express')());

app.get('/', (req, res) => res.render('login'));

app.post('/', async (req, res, next) => {
    try {
        assert(typeof req.body.email == 'string');
        assert(typeof req.body.password == 'string');
        let user = req.body.email && (await User.findOne({email: req.body.email}));
        if (!user || !(await user.authenticate(req.body.password)))
            return res.render('login', {error: 'invalid email/password'});
        req.session = {id: user.id, timestamp: Date.now()};
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});
