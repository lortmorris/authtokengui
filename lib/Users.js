/* eslint-disable semi */
"use strict";

import {fdebug} from "./fdebug";
const debug = fdebug("authtoken:lib:Users");


export class Users {
    constructor(main) {
        this.db = main.db;
        debug('init');
    }


    add(data) {
        var self = this;

        var params = {
            "email": data.email || "",
            "fname": data.fname || "",
            "lname": data.lname || "",
            "city": data.city || "",
            "phone": data.phone || "",
            added: new Date()
        };

        return new Promise((resolve, reject)=> {
            self.db.users.insert(params, (err, doc)=> {
                err ? reject(err) : resolve(doc);
            });
        });
    }


    edit(id, data){
        let self = this;

        return new Promise((resolve, reject)=>{
            self.db.users.update({_id: self.db.ObjectId(id)}, {$set: data}, (err, doc)=>{
                err ? reject(err) : resolve(doc);
            });
        });
    }

    del(id){
        let self = this;
        return new Promise((resolve, reject)=>{
            self.db.users.remove({_id: self.db.ObjectId(id)}, (err, doc)=>{
                if(err) return reject(err);

                resolve();
                //todo: remove all keys asociate
            })
        })
    }

    get(id) {
        let self = this;
        let id = id || null;

        debug(".get : " + id);
        return new Promise((resolve, reject)=> {
            let query = id ? {id: id} : {};
            let select = {};


            debug(JSON.stringify({query: query, select: select}));
            if (id) {
                self.db.users.findOne(query, select, (err, doc)=> {
                    err ? reject(err) : resolve(doc);
                });
            } else {
                self.db.users.find(query, select, (err, doc)=> {
                    err ? reject(err) : resolve(doc);
                });
            }

        });
    }

}


export {Users};