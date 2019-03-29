'use strict';
const assert = require('assert');

module.exports = (app, {User}) => {
    app.get('/', (req, res) => res.render('login'));

    app.post('/', async (req, res, next) => {
        try {
            assert(typeof req.body.email == 'string');
            assert(typeof req.body.password == 'string');
            const user = req.body.email && (await User.findOne({where: {email: req.body.email}}));
            if (!user || !(await user.authenticate(req.body.password)))
                return res.render('login', {error: 'invalid email/password'});
            req.session = {id: user.id, timestamp: Date.now()};
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    });

    return {guest: true};
};
