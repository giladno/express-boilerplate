'use strict';

module.exports = app => {
    app.get('/', async (req, res, next) => {
        try {
            await req.user.update({logout: new Date()});
            req.session = null;
            res.redirect('/login');
        } catch (err) {
            next(err);
        }
    });
};
