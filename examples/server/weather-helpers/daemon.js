var r = require('request')
  , fs = require('fs')
  , generate = require('./generate-url')

//var url = "http://api.openweathermap.org/data/2.5/group?id=5809844,5350937,5506956,5586437,5780993,5308655,5640350,5821086,5419384,5454711,5688025,5768233,5074472,4393217,4544349,4684888,4699066,5037649,4853828,4119403,4241704,4335045,5263045,4887442,4990729,4260977,4299276,4644585,4641239,4180439,4167147,4164138,4277241,4305974,4140963,5128638,4930956&units=imperial&APPID="+process.env.APPID
var url = "http://api.openweathermap.org/data/2.5/group?id=5809844,5350937&units=imperial&APPID="+process.env.APPID

console.log("start fetch weather: " + url)
r(url, function(err, res, body) {   

   if (!err && res.statusCode == 200) {
       console.log(body)
       var query = generate(body)
       console.log(query)
       fs.writeFileSync('../weather.dat', query)
   }
   else {
      console.log("code: " + res.statusCode)
      console.log(err)
   }
   
})