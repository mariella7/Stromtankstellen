const axios = require('axios');
const API_KEY = '19fe6e525f8cea3e2984a7d7be94fa98' 
const API_URL = 'api.goingelectric.de';
//radius = 15 km, can be changed
const API_PATH = `/chargepoints/?key=${API_KEY}&radius=15&orderby=distance&`

const apiCall = axios.create({
    baseURL: "https://" + API_URL,
    method: "get",
    responseType: "json",
    timeout: 6000, //6seconds timeout, give skill 2seconds to complete processing for lambda function, as max. Alexa response time is 8 seconds
})

/**
 * used for Alexa inside a handler
 */
let lat, lng;
/*
var isGeoSupported = handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Geolocation;
var geoObject = handlerInput.requestEnvelope.context.Geolocation;
if (isGeoSupported && geoObject) {
    console.log(JSON.stringify(geoObject));  // Print the geo-coordinates object if accuracy is within 100 meters
    lat = geoObject.coordinate.latitudeInDegrees;
    lng = geoObject.coordinate.longitudeInDegrees;
}
*/

//enable geo permissions ("Location Services") in Alexa Developer Console! see: https://developer.amazon.com/en-US/docs/alexa/custom-skills/location-services-for-alexa-skills.html
//maybe think about fallback using device address API, see: https://developer.amazon.com/en-US/docs/alexa/custom-skills/device-address-api.html

    //generate lat / long for geoCoordinates from Alexa device
    let prepend_url = "lat=" + lat + "&lng=" + lng;
    
    //generate endpoint URL for API call
    let endpoint = API_PATH + prepend_url;
    
    //example
    endpoint = API_PATH + "lat=51.5113001&lng=6.8822701";
    console.log("endpoint: "+endpoint)

    async function run() { 
        //call API
        const data = await apiCall
            .get(endpoint)
            .then((res) => res.data)
            .catch((err) => {
                log.error(err)
                return
            })
        
        //console.log('returned Data from API: '+JSON.stringify(data))

        //how to read data from JSON?
        //example:

        let firstCharger = data.chargelocations[0];
        console.log("firstCharger data: "+JSON.stringify(firstCharger));

        let name = firstCharger.name;
        let address = firstCharger.address.street;

        console.log("Name: "+name)
        console.log("Adresse: "+address)
    }                      

run();


