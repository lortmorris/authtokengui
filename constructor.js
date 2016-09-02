import {common} from './lib/common';
import {default as express} from 'express';
import {default as http} from 'http';
import {default as socket} from 'socket.io';
import {default as swaggerTools} from 'swagger-tools';
import {default as path} from 'path';
import {default as yaml} from 'js-yaml';
import {default as fs} from 'fs';
import {default as cors} from 'cors';
import {default as exphbs} from 'express-handlebars';
import {default as shortid} from 'shortid';
import {default as session} from 'express-session';
import {default as connectMongo} from 'connect-mongo';

import {fdebug} from "./lib/fdebug";
import {Redis} from "./lib/redis";




import {makeControllers} from './controllers/';
import {Users} from "./lib/Users";
import {Keys} from "./lib/Keys";
import {MWS} from "./mws";
import {Routes} from "./routes";


const MongoStore = connectMongo(session);
const debug = fdebug('authtoken:app');

/**
 * Build the main application
 * @param {object} config - The module config
 * @returns {Promise}
 * @author César Casas
 */
function app(config) {

    var self = this;
    debug("init....");

    //this object is the main to return, has all properties need for application (factories, config, controllers, routers, etc).
    self.main = {
        config: config,
        db: common.getDB(),
        restEndpoint: config.get('service.protocol') + config.get('service.host') + config.get('service.pathname')
    };


    return new Promise((resolve, reject)=> {

        self.swaggerDoc()
            .then(()=> {
                return self.getApp();
            })
            .then(()=> {
                return self.io();
            })
            .then(()=> {
                return self.redisClient()
            })

            .then(()=> {
                return self.announce();
            })
            .then(()=> {
                return self.libs();
            })
            .then(()=> {
                return self.controllers();
            })
            .then(()=> {
                return self.routers();
            })
            .then(()=> {
                debug("Setup finish, run...");
                resolve(self.main);
            })
            .catch((err)=> {
                console.log("Error: ", err);
            })

    });


}

/**
 * inject swagger doc into main object.
 * @returns {Promise}
 */
app.prototype.swaggerDoc = function () {
    var self = this;

    debug("running swaggerDoc");
    return new Promise((resolve, reject)=> {
        var swaggerFile = path.join(__dirname, '/api/swagger/swagger.yaml');
        var swaggerString = fs.readFileSync(swaggerFile, 'utf8');
        var swaggerDoc = yaml.safeLoad(swaggerString);

        swaggerDoc.host = self.main.config.get('service.host');
        swaggerDoc.basePath = self.main.config.get('service.pathname');

        self.main.swaggerDoc = swaggerDoc;

        resolve({swaggerDoc: swaggerDoc});
    });
}

/**
 * Create the express instance an inject into main property the instance and server (http)
 * @returns {Promise}
 */
app.prototype.getApp = function () {
    var self = this;
    debug("getApp...");

    return new Promise((resolve, reject)=> {
        self.main.app = express();
        self.main.app.engine('.hbs', exphbs({'extname': '.hbs', defaultLayout: 'main'}));
        self.main.app.set('view engine', '.hbs');

        self.main.server = http.createServer(self.main.app);
        resolve({app: self.main.app, server: self.main.server});
    });
}

/**
 * create socket.io instance and inject into main object
 * @returns {Promise}
 */
app.prototype.io = function () {
    var self = this;

    debug("io...");

    return new Promise((resolve, reject)=> {
        var pathName = self.main.config.get('service.pathname');
        debug(pathName + '/socket.io');
        self.main.io = socket.listen(self.main.server, {path: '/' + pathName.replace(/^\//, '') + '/socket.io'});
        resolve({io: self.main.io});
    });
}

/**
 * create redisClient or sentinel instance, use own redis lib (return sentinel instance or redisClient). Inject the instance into main object.
 * @returns {Promise}
 */
app.prototype.redisClient = function () {
    var self = this;
    debug("redisClient");

    return new Promise((resolve, reject)=> {
        self.main.redisClient = new Redis();
        resolve({redisClient: self.main.redisClient});
    });
}

/**
 * Socket.io emit message. Using into controllers/index.js for wrapHandler
 * @returns {Promise}
 */
app.prototype.announce = function () {
    var self = this;
    debug("announce...");

    return new Promise((resolve, reject)=> {
        self.main.announce = function () {
            var args = Array.prototype.slice.apply(arguments);
            self.main.io.sockets.emit.apply(self.main.io.sockets, args);
        };

        resolve({announce: self.main.announce});
    });
}


/**
 * Create the common lib instances for all REST Application
 * @returns {Promise}
 */
app.prototype.libs = function () {
    var self = this;
    return new Promise((resolve, reject)=> {

        self.main.libs = {
            shortid: shortid
        };

        self.main.libs.Keys = new Keys(self.main);
        self.main.libs.Users = new Users(self.main);
        resolve(self.main.libs);
    });
}

app.prototype.controllers = function () {
    var self = this;
    debug("controllers...");

    return new Promise((resolve, reject)=> {
        self.main.controllers = makeControllers(self.main);
        resolve(self.main.controllers);
    });
}


app.prototype.routers = function () {
    var self = this;

    debug("routers...");

    self.main.mws = new MWS(self.main);


    return new Promise((resolve, reject)=> {

        var app = self.main.app;
        var options = {
            controllers: self.main.controllers
        };


        app.use(cors());
        app.set('basePath', self.main.swaggerDoc.basePath);

        var formatValidationError = function formatValidationError(err, req, res, next) {
            var error = {
                code: 'validation_error',
                message: err.message,
                details: err.results ? err.results.errors : null
            };

            res.json({error: error});
        };//end formatValidationError

        // Initialize the Swagger middleware
        function initMiddleWare(middleware, callback) {
            debug('initializating middleware');

            app.use((req, res, next)=> {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
                res.setHeader('Access-Control-Allow-Credentials', true);

                if (req.method === 'OPTIONS') return res.end();

                next();
            });

            app.use(middleware.swaggerMetadata());
            app.use(middleware.swaggerValidator(), formatValidationError);

            app.use(middleware.swaggerRouter(options));

            app.use((err, req, res, next) => {
                res.status(500);
                res.send(err);
                res.end();
            });


            app.use(middleware.swaggerUi({
                apiDocs: self.main.config.get('service.pathname') + '/api-docs',
                swaggerUi: self.main.config.get('service.pathname') + '/docs'
            }));

            app.use(express.static('public'));
            //this is for react bundle.js
            app.use(express.static("./src/public"));

            debug("loading router: ");
            Routes(self.main);

            /**
             * this are the locals vars using by layout.
             */


            let service = self.main.config.get("service");
            self.main.app.locals.endpoint = service.protocol + "://" + service.host + service.pathname;


            debug("calling callback");
            callback();
        };//end initMiddleWare


        /**
         * Sessions
         */

        self.main.app.set('trust proxy', 1);

        self.main.app.use(session({
            secret: 'gimethegroxodevelopers',
            store: new MongoStore({db: common.getDB()})
        }));


        swaggerTools.initializeMiddleware(self.main.swaggerDoc, (swaggerMiddleware) => {

            initMiddleWare(swaggerMiddleware, (err) => {
                resolve();
            });
        });


    });
}

module.exports = app;


