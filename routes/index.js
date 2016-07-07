/* eslint-disable semi */
"use strict";

const debug = require("debug")('authtoken:routes:index');



export function Routes(main){
    debug("init...");
    main.app.get('/', main.mws.home);
}


