/* eslint-disable semi */
"use strict";

import {fdebug} from "./fdebug";
const debug = fdebug("authtoken:lib:Keys");


export class Keys {
    constructor(main) {
        this.db = main.db;
        debug("init");
    }

    add(data) {
        let self = this;

        let params = {
            "userid": self.db.ObjectId(data.userid || ""),
            "apikey": data.apikey || "",
            "secret": data.secret || "",
            "ratelimit": data.ratelimit || 0,
            "allow": data.allow || [],
            "deny": data.deny || [],
            "added": new Date()
        };

        return new Promise((resolve, reject)=> {
            self.db.keys.insert(params, (err, doc)=> {
                err ? reject(err) : resolve(doc);
            });
        });
    }


    update(data){
        let self = this;

        debug(".update called: "+JSON.stringify(data));

        return new Promise((resolve, reject)=>{
            let id = data._id;
            delete data._id;

            self.db.keys.update({_id: self.db.ObjectId(id)}, {$set: data}, (err, doc)=>{
                err ? reject(err) : resolve(doc);
            });
        });
    }


    delByUser(userid){
        let self = this;
        debug(".delByUser called");
        return new Promise((resolve, reject)=>{
           self.db.keys.remove({userid: self.db.ObjectId(userid)}, (err, doc)=>{
               err ? reject(err) : resolve(doc);
           })
        });
    }

    del(id){
        let self = this;
        debug(".del called");
        return new Promise((resolve, reject)=>{
            self.db.keys.remove({_id: self.db.ObjectId(id)}, (err, doc)=>{
                if(err) return reject(err);
                resolve(doc);
            })
        })
    }


    get(id=null, userid=null) {
        let self = this;

        debug(".get : " + id);
        return new Promise((resolve, reject)=> {
            let query = {};
            if (id) query.id = self.db.ObjectId(id);
            if (userid) query.userid = self.db.ObjectId(userid);

            let select = {};

            self.db.keys.find(query, select, (err, docs)=> {
                err ? reject(err) : resolve(docs);
            });
        });
    }

}
