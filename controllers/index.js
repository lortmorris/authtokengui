/* eslint-disable semi */
"use strict";

import {fdebug}  from '../lib/fdebug';
import {Users} from './Users';
const debug = fdebug('authtoken:controllers:index');



/**
 * Create controllers for Application (swagger)
 */
 

/**
 * wrap all controllers (redefine the 'next'. If next has argument, throw error (redis and res.json.end).
 * @param {function} handler - The function for controller.
 * @param {object} announce - The socket.io method for notify to channel 'bot-api:error'
 * @returns {Function} - the wrap function.
 */
function wrapHandler(handler, announce) {
    debug("wrapHandler called");
    return  (req, res, next) =>{
        try {
            handler(req, res, (err) => {
                if (err) {
                    debug(err);
                    console.error(err.stack);

                    announce('authtoken:error', err.message ? err.message : err);
                    // send 503 and error as string
                    res.status(503).json({
                        code: 'controller_error',
                        message: typeof(err) === 'string' ? err : err.message
                    }).end();
                }
                else {
                    next();
                }
            });
        } catch (e) {
            debug(e);
            announce('authtoken:error', e.message ? e.message : err);

            res.status(503).json({
                code: 'controller_error',
                message: typeof(e) === 'string' ? e : e.message
            }).end();
        }
    };
}


/**
 * each the controllers function and call to wrap function.
 * @param {object} controllers - The controllers list (object)
 * @param {object} announce - the socket.io method for send notification
 * @returns {*}
 */
function wrapControllers(controllers, announce) {
    debug("wrapControllers called");
    for (var k in controllers) {
        debug("setting wrapHandler to: " + k);
        controllers[k] = wrapHandler(controllers[k], announce);
    }

    return controllers;
}



/**
 * Create and return the controllers Object for swagger & routers.
 * @param {object} main - The main object create by Application instance (app.js)
 * @returns {object} - Controller object
 */
function makeControllers(main){


    debug("main function called");

    var controllers = {
        Users: Users(main)
    };


    return wrapControllers({
        'users.all_get': controllers.Users.all,
        'users.add_post': controllers.Users.add,

    }, main.announce);
}


export {makeControllers}