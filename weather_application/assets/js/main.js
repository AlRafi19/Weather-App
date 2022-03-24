
const weatherStore= {
    privateCity: 'Pirojpur',
    privateCountry: 'Bangladesh',
    API_KEY: '994c0c8ea7bd429814ca7a82d38ed2c8',
    set city(name){
        console.log('city name')
        //validation
        this.privateCity = name

    },
    set country(name){
        console.log('country Name')
        this.privateCountry = name

    },
   async fetchWeatherData(){
     const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_KEY}`)

     return await res.json()
 
    }

} 
const storage = {
    privateCity:'',
    privateCountry: '',

    set city(name){
        this.privateCity = name

    },
    set country(name){
        this.privateCountry = name

    },
    saveItem(){
        localStorage.setItem('BD-weather-city', this.privateCity)
        localStorage.setItem('BD-weather-country', this.privateCountry)
    }
}

const UI = {
 
    loadSelectore(){
        const formElm = document.querySelector('#form')
        const countryElm = document.querySelector('#country')
        const cityElm = document.querySelector('#city')
        const cityInfoELm= document.querySelector('#w-city')
        const iconElm = document.querySelector('#w-icon')
        const temparatureELm= document.querySelector('#w-temp')
        const pressureElm = document.querySelector('#w-pressure')
        const humidityELm= document.querySelector('#w-humidity')
        const feelELm= document.querySelector('#w-feel')
        const messageElm = document.querySelector('#messageWrapper')

        return{
            formElm,
            countryElm,
            cityElm,
            cityInfoELm,
            iconElm,
            temparatureELm,
            pressureElm,
            humidityELm,
            feelELm,
            messageElm
        }

    },
    getInputValues(){
        const {cityElm, countryElm} = this.loadSelectore()
        const city = cityElm.value 
        const country = countryElm.value

        return {
            city,
            country
        }

    },

    validateInput(city,country){
        let error =false

        if(city ==='' || country === ''){
            error= true

        } 
        return error

    },
    hideMessage(){
        const msgElm = document.querySelector('.err-msg')
        
        if(msgElm){
            setTimeout(()=>{
                msgElm.remove()
            },2000)
            
        }

    },
    showMessage(errMessage){
        const {messageElm} = this.loadSelectore()
        const msgContentElm = document.querySelector('.err-msg')
        const elm = `<div class='alert alert-danger err-msg' > ${errMessage}</div>`
        if(!msgContentElm){
            messageElm.insertAdjacentHTML('afterbegin', elm)
        }
        
        this.hideMessage()

    },
    getIconSource(iconCode){

        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },
    printWeather(data){
        const {
            cityInfoELm,
            temparatureELm,
            pressureElm,
            humidityELm,
            feelELm,
            iconElm,

        } = this.loadSelectore()
        const{main, weather, name} = data 

        console.log(data)
        cityInfoELm.textContent= name
        pressureElm.textContent = `pressure: ${main.pressure}kpa`
        temparatureELm.textContent = `temparature: ${main.temp}`
        humidityELm.textContent = `humidity: ${main.humidity}kpa`
        feelELm.textContent = weather[0].description
        const src=this.getIconSource(weather[0].icon)
        iconElm.setAttribute('src', src)
       

    },
    resetInput(){
        const { countryElm,cityElm } = this.loadSelectore()
        cityElm.textContent = ''
        countryElm.textContent = ''
    },
  
    init(){
        const {formElm} = this.loadSelectore()
        formElm.addEventListener('submit', async(e)=>{
            e.preventDefault()
            // get InputValues
           const{city,country} =  this.getInputValues()
           //reset Input
           this.resetInput()
           // validate Input
          const error= this.validateInput(city,country)
          if (error){
              // Show Error Message IN UI
              return this.showMessage('Please Provide Valid Input')
          }
       

        
          //Setting Data To Weather Data Store

          weatherStore.city = city
          weatherStore.country = country

          // setting to local Storage
            storage.city = city
            storage.country = country
            storage.saveItem()
        // Send Request To API Server

       const data= await weatherStore.fetchWeatherData()
       this.printWeather(data)

        })

        document.addEventListener('DOMContentLoaded', async e=>{
            //Load Data From LocalStorage
            if(localStorage.getItem('BD-weather-city')){
             //Setting Data To data Store
                weatherStore.city = localStorage.getItem('BD-weather-city')
            }
            if(localStorage.getItem('BD-weather-country')){
                   //Setting Data To data Store
                weatherStore.country = localStorage.getItem('BD-weather-country')
            }

         
            //send Request to API Server
           const data= await weatherStore.fetchWeatherData()
            //Show Data To UI
            this.printWeather(data)
        })

    },
    

}
UI.init()

