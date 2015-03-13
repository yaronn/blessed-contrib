
var fs = require('fs')

var res = "curl http://localhost:1337/\?"
var json = JSON.parse(fs.readFileSync('./weather.json').toString())

var cities = json.list
res += "markerCount="+cities.length

for (var i=0; i<cities.length; i++) {

   if (cities[i].id===3882428) {
      cities[i].coord.lat *= -1      
   }

   res += "&lon" + i +"=" + cities[i].coord.lat
   res += "&lat" + i +"=" + cities[i].coord.lon
   res += "&char" + i +"=" + Math.round(cities[i].main.temp)
}

console.log(res)
