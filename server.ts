import {Express, Request, Response} from 'express';
import express from 'express';
import * as mysql from 'mysql2/promise'

// setup database
let database: mysql.Connection;
mysql.createConnection({
    user: 'artir.guri@mni.thm.de',
    password: 'agur11',
    database: 'WebP2_agur11',
    host: 'ip1-dbs.mni.thm.de'
}).then(connection => {
    database = connection;
}).catch(err => {
    console.log('error in connection establishment: ', err);
});

const app: Express = express();
app.listen(8080);

app.use(express.json());
app.use(express.urlencoded({extended: false}));