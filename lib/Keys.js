/* eslint-disable semi */
"use strict";

import {fdebug} from "./fdebug";
const debug = fdebug("authtoken:lib:Keys");

function Keys(main){
    this.db = main.db;
    debug('init');
}




Keys.prototype.add = function(data){
    var self = this;

    var params = {
        "userid": self.db.ObjectId(data.userid ||  ""),
        "apikey": data.apikey ||  "",
        "secret": data.secret || "",
        "ratelimit": data.ratelimit || 0,
        "allow": data.allow || [],
        "deny": data.deny || [],
        "added": new Date()
    };

    return new Promise((resolve, reject)=>{
        self.db.keys.insert(params, (err, doc)=>{
            err ? reject(err) : resolve(doc);
        });
    });
}


Keys.prototype.get = function(id){
    var self = this;
    var id = id || null;
    var userid = id || null;

    debug(".get : "+id);
    return new Promise((resolve, reject)=>{
        var query = {};
        if(id) query.id = self.db.ObjectId(id);
        if(id) query.userid = self.db.ObjectId(userid);

        var select = {};

        self.db.keys.find(query, select, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        });
    });
}





export {Keys};