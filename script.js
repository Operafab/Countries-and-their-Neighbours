"use strict"

const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".btn-company");
const countryForm = document.querySelector(".country-form");
const countryInput = document.querySelector(".country-input");

const renderCountry =function(data, className = ""){
  const countryCurrencies = Object.values(data.currencies);
  const currencyName = Object.values(countryCurrencies[0])


  const html = `
  <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${Object.values(data.name).slice(1, 2)}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} million people </p>
        <p class="country__row"><span>🗣</span>${Object.values(data.languages).join(', ')}</p>
        <p class="country__row"><span>💵</span>${currencyName.join('')}</p>
      </div>
    </article>`

countriesContainer.insertAdjacentHTML("beforeend", html);
countriesContainer.style.opacity = 1

}


const getCountryAndNeighbour = function (country){
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(response=>{
    if(!response.ok) throw new Error("Country not found");
    return response.json();
  })
  .then(([data])=>{
    renderCountry(data);

    const neighbour = data.borders ? data.borders[0] : null;
    if(!neighbour) return ;
    return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
  })

  .then(response => {
    if(!response) return;

    return response.json()
  })
  .then(([neighbourData])=>{
    renderCountry(neighbourData, "neighbour")
  })
  .catch(err => console.error(`${err.message}`))

}



countryForm.addEventListener("submit", function(e){
  e.preventDefault();

  const countryName = countryInput.value.trim();

  if(countryName){
    countriesContainer.innerHTML = "";
    getCountryAndNeighbour(countryName);
  }
})
getCountryAndNeighbour("Canada")