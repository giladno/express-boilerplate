'use strict';
const assert = require('assert');

module.exports = (app, {User}) => {
    app.get('/', (req, res) => res.render('register'));

    app.post('/', async (req, res, next) => {
        try {
            const {email, password} = req.body;
            assert(typeof email == 'string');
            assert(typeof password == 'string');
            if (password != req.body.password2) return res.render('register', {error: 'passwords do not match'});
            await User.create({email, password});
            res.redirect('/login');
        } catch (err) {
            for (const {type} of err.errors || []) {
                if (type == 'unique violation') return res.render('register', {error: 'already registered'});
            }
            next(err);
        }
    });

    return {guest: true};
};
