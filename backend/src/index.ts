import express from "express";
import expressSession from "express-session";
import bodyparser from "body-parser";
import querystring from "querystring";
import passport from "passport";
import Auth0Strategy from "passport-auth0";
import cors from "cors";
import path from "path";
import util from "util";
import url from "url";

const app = express();
app.use(cors());
app.use(bodyparser.json());


const sess = {
    secret: "save-martha",
    cookie: {},
    resave: false,
    saveUninitialized: true
}
app.use(expressSession(sess));

const strategy = new Auth0Strategy.Strategy({
    domain: "dev-0-ouvcd1.auth0.com",
    clientID: "SlvNFZ3B6z4gUdD44NVcqaW4QdcRO0WM",
    clientSecret: "rtOmFwXleyl6sZUcgNHtX-DNOadf7QoeRoENJ3xvsGDc2t5HFUHxES9J4ufKmEWb",
    callbackURL: "http://localhost:5000/callback",
},
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    });

passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/login", passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

app.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect("/login"); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            // @ts-ignore
            delete req.session.returnTo;
            res.redirect("/");
        });
    })(req, res, next);
});

app.get("/logout", (req, res, next) => {
    req.logOut();
    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ":" + port;
    }
    const logoutURL = new url.URL(
        util.format("https://%s/v2/logout", "dev-0-ouvcd1.auth0.com")
    );
    const searchString = querystring.stringify({
        client_id: "SlvNFZ3B6z4gUdD44NVcqaW4QdcRO0WM",
        returnTo,
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL.toString());
});

app.get("/session", (req, res, next) => {
    if (!req.user) {
        return res.json({ loggedIn: false, user: null });
    }
    console.log(req.user);
    res.json({ loggedIn: true, user: req.user });
});

app.listen(5000, () => {
    console.log("Server listening to 5000 port");
});
