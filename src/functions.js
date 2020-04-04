const express = require("express")
const router = express.Router()
let inside = require("point-in-polygon")
const logger = require('./logger')
const gjv = require("geojson-validation")
let data = require('./app')
let logic = require('./logic')

router.use('/testpoint' ,(req,res,next) =>{
    logic.polygonsCoordinates = logic.getPolygonsCoordinates(data.database)
    next()
} )

router.get('/testpoint',(req,res) => {
    let {lat , long} = req.query
    let response = {polygons : []}
    logic.polygonsCoordinates.forEach((polygonName , coordinates) =>{
        if(inside([lan,long] , coordinates)){
            response.polygons.push(polygonName)
        }
    })  
    res.send(response)

})


router.use('/addpolygon' ,(err,req,res,next) => {
    if(err.status === 400)
    {
        if (err) {
            logger.log.error({
              message: err.message,
              url: req.url,
              query: req.query,
              body: req.body,
            });
        }
        let response = {success : false,
            message : 'Wrong Json Format'}
        
        return res.send(response);
    }
    next()
})

router.put('/addpolygon' , (req ,res) => {
    let jsonObject = req.body
    gjv.isFeature(jsonObject,function(valid ,errs){
        if(!valid){
            let dic ={
                    status : "Failed" ,
                    error : " Invalid Polygon"
            }
            return res.send(dic)
        }
        else{
            data.database.features.push(jsonObject)
            logic.writeGeoJsonToFile(JSON.stringify(data.database) , data.datapath)
            console.log(" databese updated")
            logic.readGeoJsonFromFile(data.datapath)
            let dic = {
                status : "OK",
                answer : data.database
            }
            res.send(dic)
        }
    })
})

module.exports = router