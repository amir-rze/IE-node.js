let datas = require('./app')
const fs = require("fs")
let polygonsCoordinates = undefined
const logger = require('./logger')

const getPolygonsCoordinates = (jsonObject) => {
    let featuresArray = jsonObject.features
    let polygonsCoordinates = new Map()
    for(let feature of featuresArray)
    {
        let name = feature.properties.name
        if(name=== undefined){
            name = "undefined"
        }
        let coordinates = feature.geometry.coordinates[0]
        polygonsCoordinates.set(name, coordinates)
    }
    return polygonsCoordinates
}


let writeGeoJsonToFile = (geoJsonString, datapath) => {
    fs.writeFile(datapath, geoJsonString, (err) => {
        if(err) throw err
        console.log("Database Updated");
    })
}

let readGeoJsonFromFile = (datapath) =>{
    fs.readFile(datapath, "utf-8", (err, data) => {
        if(err) {
            logger.log.error({
                message: err.message
            })
        }
        datas.database = JSON.parse(data)
        console.log("Database Loaded To Memory Successfully");
    })
}


let pointInPolygon = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];        
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};


module.exports ={
    getPolygonsCoordinates,
    writeGeoJsonToFile,
    readGeoJsonFromFile,
    polygonsCoordinates,
    pointInPolygon
}

