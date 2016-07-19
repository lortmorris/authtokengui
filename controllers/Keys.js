/* eslint-disable semi */
"use strict";

import {fdebug}  from "../lib/fdebug";
const debug = fdebug("authtoken:controllers:Keys");


export function Keys(main){
    debug("init.");
    return {

        'all': (req, res, next)=>{
            debug(".all called");

            main.libs.Keys.get(null)
                .then((profiles)=>{
                    res.json(profiles);
                })
                .catch(next);
        },
        'add': (req, res, next)=>{
            main.libs.Keys.add({
                userid: req.swagger.params.key.value.userid,
                apikey: req.swagger.params.key.value.apikey,
                secret: req.swagger.params.key.value.secret,
                ratelimit: req.swagger.params.key.value.ratelimit,
                allow: req.swagger.params.key.value.allow,
                deny: req.swagger.params.key.value.deny
            })
                .then((doc)=>{
                    res.json(doc);
                })
                .catch(next);

        }//end login

    };
}

