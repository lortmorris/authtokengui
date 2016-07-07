/* eslint-disable semi */
"use strict";

import {fdebug}  from "../lib/fdebug";
const debug = fdebug("authtoken:controllers:Users");


export function Users(main){
    debug("init.");
    return {

        'all': (req, res, next)=>{
            debug(".all called");

            main.libs.Users.get(null)
                .then((profiles)=>{
                    res.json(profiles);
                })
                .catch(next);
        },
        'add': (req, res, next)=>{

            main.libs.users.add({
                fname: req.swagger.params.fname.value,
                lname: req.swagger.params.lname.value,
                email: req.swagger.params.email.value,
                phone: req.swagger.params.phone.value,
                city: req.swagger.params.city.value
            })
            .then((doc)=>{
                    res.json(doc);
                })
            .catch(next);

        }//end login

    };
}

