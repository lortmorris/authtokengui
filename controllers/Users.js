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

            main.libs.Users.add({
                fname: req.swagger.params.user.value.fname,
                lname: req.swagger.params.user.value.lname,
                email: req.swagger.params.user.value.email,
                phone: req.swagger.params.user.value.phone,
                city: req.swagger.params.user.value.city
            })
            .then((doc)=>{
                    res.json(doc);
                })
            .catch(next);

        },//end login

        'del': (req, res, next)=>{

            let id = req.swagger.params.user.value.id;

            main.libs.Users.del(id)
            .then((doc)=>{
                    res.json(doc);
                })
            .catch(next);
        },

        'update': (req, res, next)=>{

            let user = req.swagger.params.user.value;

            main.libs.Users.update(user)
                .then((doc)=>{
                    res.json(doc);
                })
                .catch(next);
        }

    };
}

