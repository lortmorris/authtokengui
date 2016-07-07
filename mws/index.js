/* eslint-disable semi */
"use strict";

const debug = require("debug")('authtoken:mws:index');
import {Home} from "./home";


export function MWS(main){
    debug("init.");

    return {
        home: Home(main)
    }
}


