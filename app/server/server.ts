import express from "express";
import { Request, Response } from "express";
import routes from './routes';
// import * as db from "./config/connection";
import * as path from "path";
import * as bodyParser from 'body-parser';
import cors from "cors";
import history from 'connect-history-api-fallback';
require('dotenv').config();

const app: express.Application = express();

app.use(express.json());




const PORT = process.env.PORT || 3000;



const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (!process.env.IS_DEV) {
app.use(express.static(path.join(__dirname + "/dist/spa")))
app.use(routes);
app.get('/*', (req: Request, res: Response) => {
    console.log({ DIRNAME: __dirname })
    res.sendFile(path.join(__dirname, 'dist', 'spa', 'index.html'))
})
// }

app.use(history())
// db.default.once('open', () => {
app.listen(PORT, () => {
    // console.log({ IS_DEV: process.env.NODE_ENV })
    console.log(`🌍 Now listening on localhost:${PORT}`)

})
// })
