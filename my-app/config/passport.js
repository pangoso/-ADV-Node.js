var passport = require('passport')
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user)
    })
})

// Sign-up
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid e-mail').notEmpty().isEmail()
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4})
    var errors = req.validationErrors()
    if (errors) {
        var messages = []
        errors.forEach(function(error) {
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({'email': email}, function(error, user) {
        if (error) {
            return done(error)
        }
        if (user) {
            return done(null, false, {message: 'E-mail is already in use.'})
        }
        var newUser = new User()
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)
        newUser.save(function(error, result) {
            if (error) {
                return done(error)
            }
            return done(null, newUser)
        })
    })
}))

// Sign-in
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid e-mail').notEmpty().isEmail()
    req.checkBody('password', 'Invalid password').notEmpty()
    var errors = req.validationErrors()
    if (errors) {
        var messages = []
        errors.forEach(function(error) {
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }

    User.findOne({'email': email}, function(error, user) {
        if (error) {
            return done(error)
        }
        if (!user) {
            return done(null, false, {message: 'No such user.'})
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'})
        }
        return done(null, user)
    })
}))