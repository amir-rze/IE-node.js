const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs")
const datapath = './data.json'
const logger = require('./logger')
const logic = require('./logic')
let func = require('./functions')
const database = undefined

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/gis' , func)


app.listen(process.env.PORT , () =>{

    logic.readGeoJsonFromFile(datapath)
    console.log(`Listening on port ${process.env.PORT}` )
});


exports.database = database
exports.datapath = datapath