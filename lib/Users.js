/* eslint-disable semi */
"use strict";

import {fdebug} from "./fdebug";
const debug = fdebug("authtoken:lib:Users");

function Users(main){
    this.db = main.db;
    debug('init');
}




Users.prototype.save = function(data){
    var self = this;

    var params = {
        "email": data.email ||  "",
        "fname": data.fname ||  "",
        "lname": data.lname || "",
        "city": data.city || "",
        "phone": data.phone || "",
        added: new Date()
    };

    return new Promise((resolve, reject)=>{
       self.db.users.insert(params, (err, doc)=>{
            err ? reject(err) : resolve(doc);
        });
    });
}


Users.prototype.get = function(id){
    var self = this;
    var id = id || null;

    debug(".get : "+id);
    return new Promise((resolve, reject)=>{
        var query = id ? {id:id} : {};
        var select = {};


        debug(JSON.stringify({query: query, select: select}));
        if(id){
            self.db.users.findOne(query, select, (err, doc)=>{
                err ? reject(err): resolve(doc);
            });
        }else{
            self.db.users.find(query, select, (err, doc)=>{
                err ? reject(err): resolve(doc);
            });
        }

    });
}





export {Users};