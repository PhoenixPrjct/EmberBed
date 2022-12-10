import express from "express";
import routes from './routes';
const app: express.Application = express();

app.use(express.json());



import * as path from "path";
import * as bodyParser from 'body-parser';
import cors from "cors";
import history from 'connect-history-api-fallback';

const PORT = process.env.PORT || 3000;

require('dotenv').config();


const corsOptions = {
    origin: "*",
}

app.use(cors(corsOptions));
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (!process.env.IS_DEV) {
app.use(express.static(path.join(__dirname, "../dist")))
app.use(routes);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'spa', 'index.html'))
})
// }

app.use(history())
// db.once('open', () => {
app.listen(PORT, () => {
    console.log({ IS_DEV: process.env.IS_DEV })
    console.log(`🌍 Now listening on localhost:${PORT}`)

})
// })
