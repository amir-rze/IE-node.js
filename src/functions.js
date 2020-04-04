let inside = require("point-in-polygon")
// const turf = require("@turf/turf")
const logger = require('./logger')
const gjv = require("geojson-validation")
let data = require('./app')
let logic = require('./logic')
const datapath = './src/data.json'

let testpoint_middleware = (req,res,next) =>{
    res.header('content-type', 'application/json');
    logic.polygonsCoordinates = logic.getPolygonsCoordinates(data.database)
    next()
} 

let testpoint = (req,res) => {
    let {lat , long} = req.query
    let response = {polygons : []}
    lat=Number(lat)
    long=Number(long)
    let point = [lat , long]
    logic.polygonsCoordinates.forEach((coordinates,polygonName) =>{
        if(logic.pointInPolygon(point,coordinates)){
            response.polygons.push(polygonName)
        }
    })  
    console.log("testpoin request recieved")
    res.send(response)

}

// inside(point , coordinates

let polygon_add_middleware = (err,req,res,next) => {
    res.header('content-type', 'application/json')
    if(err.status === 400)
    {
        console.log("400")
        if (err) {
            logger.log.error({
              message: err.message,
              url: req.url,
              query: req.query,
              body: req.body,
            });
        }
        let response ={
            status : "Failed",
            error : "Invalid Json Format"
        }
        return res.send(response);
    }
    next()
}

let polygon_add = (req ,res) => {
    try{
        let jsonObject = req.body
        gjv.isFeature(jsonObject,function(valid ,errs){
            if(!valid){
                let dic ={
                        status : "Failed" ,
                        error : " Invalid Polygon Format"
                }
                return res.send(dic)
            }
            else{
                data.database.features.push(jsonObject)
                logic.writeGeoJsonToFile(JSON.stringify(data.database) , datapath)
                console.log(" databese updated")
                logic.readGeoJsonFromFile(datapath)
                // let dic = {
                //     status : "OK",
                //     polygons : data.database
                // }
                res.send(data.database)
            }
        })
    }
    catch (err) {
        let dic ={
            status : "Failed",
            error : "json has problem with parsing"
        }
        logger.log.error({
          message: err.message,
          url: req.url,
          query: req.query,
        });
        res.send(dic)
    }
}

module.exports = {
    testpoint,
    testpoint_middleware,
    polygon_add,
    polygon_add_middleware
}