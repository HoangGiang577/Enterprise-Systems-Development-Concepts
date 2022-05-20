const LocalStrategy = require('passport-local').Strategy;
const User = require('./modals/user');

module.exports = function (passport) {

    //session setup

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // client login
    passport.use('client-login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) { // callback với email và password từ html form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            // tìm một user với email
            // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
            User.findOne({'Email': username}, function (err, user) {
                if (err) {
                    return done(err, null);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'Không tồn tại user !'));
                }
                if (user.validPassword(password)&& user.Status === 1) {
                    return done(null, user);
                }

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Sai mật khẩu !'));
                }

                if (user.Status == 0) {
                    return done(null,false, req.flash('loginMessage', 'Tài khoản hiện đang bị khoá ! Vui lòng liên hệ quản trị viên !'))
                }
            });
        })
    );
}