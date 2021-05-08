const reqPromise = require('request-promise')
const { exec } = require("child_process")
const moment = require('moment')

const PINCODE = '560078'
const SONG = 'Dance_Jane_Dance.mp3'
const AGE = 18
const DISTRICT_ID = 294
const reqOptions = {
    method: 'GET',
    json: true,
    timeout: 10000
}
const reqOptionsByPinCode = {
    uri: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin',
    qs: {
        pincode: PINCODE
    }
}
const reqOptionsByDistrict = {
    uri: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict',
    qs: {
        district_id: DISTRICT_ID
    }
}
Object.assign(reqOptionsByPinCode, reqOptions)
Object.assign(reqOptionsByDistrict, reqOptions)
let hits = 0

const fetch = (reqOptions) => {
    const startDate = moment().format('DD-MM-yyyy')
    const inClauseString = reqOptions.qs.pincode ? ` pincode ${reqOptions.qs.pincode}` : ` district ${reqOptions.qs.district_id}`
    reqOptions.qs.date = startDate
    hits++
    
    console.log(`Hits: ${hits}`)
    console.log(`Fetching slots for age ${AGE} in` + inClauseString + ` from ${startDate}...`)

    return new Promise((resolve, reject) => {
        reqPromise(reqOptions)
            .then(res => {
                //fetch all res.cetnters.sessions where min_age_limit = 18
                if (res.centers && res.centers.length) {
                    let slots = res.centers.find(x => {
                        return x.sessions.find(y => y.min_age_limit == AGE && y.available_capacity > 0)
                    })
                    if (slots) {
                        console.log(slots)
                        console.log('Slot found')
                        exec('afplay ' + SONG)
                        console.log("To stop music, do 'ps -a' and kill afplay process with 'kill -9 pid'.")
                        process.exit(0)
                    } else {
                        console.log(`No slots found`)
                    }
                } else {
                    console.log(`No slots found`)
                }
                resolve()
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

const repeat = () => {
    setInterval(() => {
        fetch(reqOptionsByPinCode)
            .then(() => {
                return fetch(reqOptionsByDistrict)
            })
            .catch(err => {
                console.log('Waiting 10 sec before starting again...')
                setTimeout(() => {
                    repeat()
                }, 10000)
            })
        console.log(`Press Ctrl+c to stop`)
    }, 5000)
}

repeat()
