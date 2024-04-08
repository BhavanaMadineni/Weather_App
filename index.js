const searchTab = document.querySelector("[data-searchWeather]");
const userTab = document.querySelector("[data-userWeather]");
const userContainer = document.querySelector(".weather-container");
const grantContainer = document.querySelector(".grant-container");
const grantBtn = document.querySelector("[ data-grant]");
const searchForm = document.querySelector("[data-searchform]");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY = "8d84d2628d968303f008d955c3633ca8";
let currentTab = userTab;
currentTab.classList.add("current_tab");
grantContainer.classList.add("active");

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantContainer.classList.add("active");
    
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(tab){
    if(tab!=currentTab){
        currentTab.classList.remove("current_tab");
        currentTab = tab;
        currentTab.classList.add("current_tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantContainer.classList.remove("active");
            searchForm.classList.add("active");
            searchInput.value = "";
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderUi(data);
    }
    catch(e){
        loadingContainer.classList.remove("active");
    }
}

function renderUi(data){
    const cityName = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-desc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-clouds]");

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloud.innerText = `${data?.clouds?.all}%`;
}

function getLocation(){
    //console.log("accesses");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    else{
        alert("No Geolocation Support");
    }
}

function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

grantBtn.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInpot]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(searchInput.value);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantContainer.classList.remove("active");
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await res.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderUi(data);
    }
    catch(e){
         
    }
    
}
