const WEATHER_API_KEY = process.env.WEATHER_API_KEY

let fs = require('fs')
let formatDistance = require('date-fns/formatDistance')
let weather = require('openweather-apis')
let qty = require('js-quantities')

const emojis = {
  '01d': '☀️',
  '02d': '⛅️',
  '03d': '☁️',
  '04d': '☁️',
  '09d': '🌧',
  '10d': '🌦',
  '11d': '🌩',
  '13d': '❄️',
  '50d': '🌫'
}

// Time working at PlanetScale
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
const today = convertTZ(new Date(), "Asia/Seoul");
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

const psTime = formatDistance(new Date(2020, 12, 14), today, {
  addSuffix: false
})

// Today's weather
weather.setLang('en')
weather.setCoordinate(37.517235, 127.047325)
weather.setUnits('imperial')
weather.setAPPID(WEATHER_API_KEY)

weather.getWeatherOneCall(function (err, data) {
  if (err) console.log(err)

  const degF = Math.round(data.daily[0].temp.max)
  const degC = Math.round(qty(`${degF} tempF`).to('tempC').scalar)
  const icon = data.daily[0].weather[0].icon

  fs.readFile('template.svg', 'utf-8', (error, data) => {
    if (error) {
      console.error(error)
      return
    }

    data = data.replace('{degF}', degF)
    data = data.replace('{degC}', degC)
    data = data.replace('{weatherEmoji}', emojis[icon])
    data = data.replace('{psTime}', psTime)
    data = data.replace('{todayDay}', todayDay)

    data = fs.writeFile('chat.svg', data, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  })
})
