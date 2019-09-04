import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as helmet from 'helmet';

import {NextFunction, Request, Response} from "express";
import routes from './routes';

createConnection().then(async connection => {

    // create express app
    const app = express();

    //call middlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // routes config
    app.use("/", routes);

    // register express routes from defined application routes

    // setup express app here

    // start express server
    app.listen(3000);


    console.log("Express server has started on port 3000. Open http://localhost:3000/ to see results");

}).catch(error => console.log(error));
