const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs")
const logger = require('./logger')
const logic = require('./logic')
const gjv =require("geojson-validation")    
var func = require('./functions')
const database = undefined


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/gis/testpoint' , func.testpoint_middleware)
app.get('/gis/testpoint',func.testpoint)
app.use('/gis/addpolygon' ,func.polygon_add_middleware) 
app.put('/gis/addpolygon' ,func.polygon_add) 



app.listen(process.env.PORT , () =>{

    logic.readGeoJsonFromFile('./src/data.json')
    console.log(`Listening on port ${process.env.PORT}` )
});

module.exports={
    database
}