import express from "express";
import bodyparser from "body-parser";
import passport from "passport";
import Auth0Strategy from "passport-auth0";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.listen(5000, () => {
    console.log("Server listening to 5000 port");
});
