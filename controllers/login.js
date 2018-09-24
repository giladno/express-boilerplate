'use strict';
const assert = require('assert');

const app = (module.exports = require('express').Router());

app.get('/', (req, res) => res.render('login'));

app.post('/', async (req, res, next) => {
    const {User} = req.app.get('db');
    try {
        assert(typeof req.body.email == 'string');
        assert(typeof req.body.password == 'string');
        let user = req.body.email && (await User.findOne({where: {email: req.body.email}}));
        if (!user || !(await user.authenticate(req.body.password)))
            return res.render('login', {error: 'invalid email/password'});
        req.session = {id: user.id, timestamp: Date.now()};
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});
