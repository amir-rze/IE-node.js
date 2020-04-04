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
        console.log("File Loaded to memory");
    })
}
module.exports ={
    getPolygonsCoordinates,
    writeGeoJsonToFile,
    readGeoJsonFromFile,
    polygonsCoordinates
}