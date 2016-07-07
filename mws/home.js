/* eslint-disable semi */
"use strict";


const debug = require("debug")('authtoken:mws:home');

export function Home(main){

    return (req, res, next)=>{
        debug(".home called");
        var data = {};

        debug("visit home: "+ JSON.stringify(req.session));
        if(req.session.user){
            data.user = req.session.user;
            data.css = "logged";
            data.logged = true;
        }
        res.render("empty",data);
    };

}
