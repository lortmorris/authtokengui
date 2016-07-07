/* eslint-disable semi */
"use strict";

import {default as config} from "config";

const collections = ['users', 'keys'];

let db  =null;

var common = {
    collections: collections,
    config: config,
    getDB : function(){
        return db ? db :require('mongojs')(config.get('db'), collections);
    }
}


export  {common};