import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBoxInput = document.querySelector('[id="search-box"]');
const countryList = document.querySelector('.country-list'); 
const countryInfo = document.querySelector('.country-info'); 

searchBoxInput.addEventListener('input', debounce(countryInput, DEBOUNCE_DELAY));

function countryInput(){
    fetchCountries(searchBoxInput.value.trim()).then(country => {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
        if(country.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if(country.length <= 10 && country.length >= 2) {
            listOfCountry(country);
        } else if(country.length === 1) {
            countryInformation(country);
        }
    }).catch(errorNotify);
}

function listOfCountry(country) {
    const countryMarkup = country.map(({ flags, name }) => {
      return `<li class="country-list"> 
             <img class="flag-list" src ="${flags.svg}" alt="Flag of ${name.common}"  width="50"/>
             <span class = "name-list">${name.common}</span></li>`;
    }).join('');
    countryList.innerHTML = countryMarkup;
}

function countryInformation([{ name, flags, capital, population, languages }]) {
    countryInfo.innerHTML = `<img src ="${flags.svg}" class="flags"  alt="Flag of ${name.official}" width="50"/>
                            <span class="country-name">${name.official}</span>
                            <p class = "info"> Capital: <span class = "info-span">${capital}</span></p>
                            <p class = "info"> Population: <span class = "info-span">${population}</span></p>
                            <p class = "info"> Languages: <span class = "info-span">${Object.values(languages).join(', ')}</span></p>`;
 }

function errorNotify(){
    Notify.failure('Oops, there is no country with that name');
}

