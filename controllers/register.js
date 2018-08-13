'use strict';
const _ = require('lodash');
const assert = require('assert');
const {User} = require('../db');

const app = (module.exports = require('express')());

app.get('/', (req, res) => res.render('register'));

app.post('/', async (req, res, next) => {
    try {
        assert(typeof req.body.email == 'string');
        assert(typeof req.body.password == 'string');
        if (req.body.password != req.body.password2) return res.render('register', {error: 'passwords do not match'});
        await User.create(_.pick(req.body, 'email', 'password'));
        res.redirect('/login');
    } catch (err) {
        for (let {type} of err.errors || []) {
            if (type == 'unique violation') return res.render('register', {error: 'already registered'});
        }
        next(err);
    }
});
