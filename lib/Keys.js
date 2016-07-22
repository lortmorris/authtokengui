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


    get(id) {
        let self = this;
        let id = id || null;
        let userid = id || null;

        debug(".get : " + id);
        return new Promise((resolve, reject)=> {
            let query = {};
            if (id) query.id = self.db.ObjectId(id);
            if (id) query.userid = self.db.ObjectId(userid);

            let select = {};

            self.db.keys.find(query, select, (err, docs)=> {
                err ? reject(err) : resolve(docs);
            });
        });
    }

}
