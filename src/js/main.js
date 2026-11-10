const navItems = document.querySelectorAll(".nav-item")
const views = document.querySelectorAll(".view")
const pageTitle = document.querySelector("#page-title")

function initNavigation() {
    navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();

            const targetViewName = item.getAttribute("data-view")
            if (!targetViewName) return;

            navItems.forEach((nav) => {
                nav.classList.remove('active')
            })
            item.classList.add("active")
            views.forEach((view) => {
                if (view.id === targetViewName + "-view") {

                    view.classList.add("active")
                } else {
                    view.classList.remove("active")
                }
            })
            const spanText = item.querySelector("span")
            if (spanText && pageTitle) {
                pageTitle.textContent = spanText.textContent
            }
        })
    })
}
initNavigation()



// async function getCountriesData() {
//     const response = await fetch("https://date.nager.at/api/v3/AvailableCountries")
//     const countrieslist = await response.json()
//     return countrieslist
// }

// async function reternCountries() {
//     const dropdown = await getCountriesData()
//     renderCountrise(dropdown)
// }


// const globalCountry = document.getElementById('global-country')

// function renderCountrise(countries) {
//     countries.forEach(country => {
//         const option = document.createElement("option")
//         option.value = country.countryCode
//         option.textContent = country.name
//         globalCountry.appendChild(option)
//     })
// }
// reternCountries()
let countriesData = [];

async function getCountriesData() {
    try {
        const response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
        return await response.json();
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
}

async function reternCountries() {
    countriesData = await getCountriesData();
    renderCountries(countriesData);
}

const dropdown = document.getElementById('country-dropdown');
const selectBtn = document.getElementById('selected-value');
const searchInput = document.getElementById('country-search-input');
const optionsList = document.getElementById('countries-list');
const hiddenInput = document.getElementById('global-country');

selectBtn.addEventListener('click', () => {
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
        searchInput.focus();
    }
});

window.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

function renderCountries(countries) {
    optionsList.innerHTML = '';

    if (countries.length === 0) {
        optionsList.innerHTML = '<li style="color: #999; justify-content: center; padding: 10px;">No countries found</li>';
        return;
    }

    countries.forEach(country => {
        const li = document.createElement("li");
        const countryCodeLower = country.countryCode.toLowerCase();

        li.innerHTML = `
            <img src="https://flagcdn.com/w40/${countryCodeLower}.png" alt="${country.name}" style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px;">
            <span>${country.name}</span>
        `;

        li.addEventListener('click', () => {
            selectBtn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://flagcdn.com/w40/${countryCodeLower}.png" style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px;">
                    <span>${country.name}</span>
                </div>
            `;
            hiddenInput.value = country.countryCode;
            dropdown.classList.remove('active');
            searchInput.value = '';
        });

        optionsList.appendChild(li);
    });
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filteredCountries = countriesData.filter(country =>
        country.name.toLowerCase().includes(searchTerm)
    );
    renderCountries(filteredCountries);
});

reternCountries();

async function holidays(countryCode, year) {
    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
}

const cards = document.querySelectorAll('.holiday-card');

async function displayHoliday() {
    const selectedCountry = hiddenInput.value; 
    const yerSelect = document.getElementById('global-year');
    const selectedYear = yerSelect ? yerSelect.value : '';

  

    const dishole = await holidays(selectedCountry, selectedYear);

    cards.forEach(function (card, i) {
        const titleElement = card.querySelector('h3');
        const nameElement = card.querySelector('.holiday-name');
        const dayBox = card.querySelector('.day');
        const holidayTypeDadge = card.querySelector('.holiday-type-badge');

        if (dishole && dishole[i]) {
            const { date, localName, name, types } = dishole[i];
            if (titleElement) titleElement.textContent = localName;
            if (nameElement) nameElement.textContent = name;
            if (dayBox) dayBox.textContent = date.split('-')[2];
            if (holidayTypeDadge) holidayTypeDadge.textContent = Array.isArray(types) ? types.join(', ') : types;
        } else {
            if (titleElement) titleElement.textContent = '-';
            if (nameElement) nameElement.textContent = '-';
            if (dayBox) dayBox.textContent = '-';
            if (holidayTypeDadge) holidayTypeDadge.textContent = '-';
        }
    });
}

const searchBtn = document.getElementById('global-search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', function () {
        displayHoliday();
        
    });
}
async function events(countryCode) {
    const event = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&countryCode=${countryCode}&size=20`)
    const returnEvent = await event.json()
    console.log(returnEvent);

    return returnEvent._embedded.events
}

const eventCard = document.querySelectorAll('.event-card')
 const selectedCounter = document.getElementById('global-country').value.trim()
async function displayEvent() {
    const diseve = await events(selectedCounter)
    eventCard.forEach(function (event, i) {
        if (diseve[i]) {
            const { name, dates, images } = diseve[i]
            const titleElement = event.querySelector('h3')
            const dateBox = event.querySelector('.event-card-info div')
            const imgElement = event.querySelector('img')

            titleElement.textContent = name
            dateBox.innerHTML = dates
            imgElement.src = images[0].url

        }

    })


}
searchBtn.addEventListener('click', function () {
    

    displayEvent(selectedCounter)
})


// async function weather(lat, lng) {
//     const returnWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,
//         weather_code,
//         wind_speed_10m,wind_direction_10m,
//         uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,
//         temperature_2m_max,
//         temperature_2m_min,
//         apparent_temperature_max,apparent_temperature_min,sunrise,
//         sunset,uv_index_max,precipitation_sum,
//         precipitation_probability_max,
//         wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`)
//     const date = await returnWeather.json()
//     return date

// }

// const tempValue = document.querySelector('temp-value')
// const tempUnit = document.querySelector('temp-unit')
// const weatherFeels = document.querySelector('weather-feels')
// const high = document.querySelector('high')
// const low = document.querySelector('low')
// const detailValue = document.querySelectorAll('detail-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')
// const tempValue = document.querySelector('temp-value')

// async function displayWeather() {
//     const disWeather = await weather()

const lat = 51.5074;
const lng = -0.1278;



async function fetchWeather(lat, lng) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`);

    const data = await response.json();
    return data;
}



async function displayWeather(lat, lng) {

    const weatherData = await fetchWeather(lat, lng);

    if (!weatherData) {
        console.log("فشل في جلب البيانات");
        return;
    }


    const currentTempElement = document.querySelector(".temp-value");
    const humidityElement = document.querySelector(".detail-value:nth-child(1)");
    const windElement = document.querySelector(".detail-value:nth-child(2)");
    const uvElement = document.querySelector(".detail-value:nth-child(3)");
    const precipElement = document.querySelector(".detail-value:nth-child(4)");

    if (currentTempElement) {
        currentTempElement.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
    }
    if (humidityElement) {
        humidityElement.textContent = `${weatherData.current.relative_humidity_2m}%`;
    }
    if (windElement) {
        windElement.textContent = `${weatherData.current.wind_speed_10m} km/h`;
    }
    if (uvElement) {
        uvElement.textContent = weatherData.current.uv_index;
    }
    if (precipElement) {
        precipElement.textContent = `${weatherData.hourly.precipitation_probability[0]}%`;
    }


    const hourlyItems = document.querySelectorAll(".hourly-item");
    hourlyItems.forEach(function (item, index) {
        const timpSpan = item.querySelector(".hourly-timp");
        const tempSpan = item.querySelector(".hourly-temp")
        tempSpan.textContent = weatherData.hourly.temperature_2m[index]
        // timpSpan.textContent= weatherData.hourly.time[index]
    });


    const dayCards = document.querySelectorAll(".forecast-day");
    dayCards.forEach(function (card, index) {
        const maxSpan = card.querySelector(".temp-max");
        const minSpan = card.querySelector(".temp-min");

        if (weatherData.daily.temperature_2m_max[index] !== undefined) {
            if (maxSpan) {
                maxSpan.textContent = `${Math.round(weatherData.daily.temperature_2m_max[index])}°`;
            }
            if (minSpan) {
                minSpan.textContent = `${Math.round(weatherData.daily.temperature_2m_min[index])}°`;
            }
        }
    });

    console.log("تم تحديث الواجهة بنجاح!");
}


displayWeather(lat, lng);




async function weekEnds(countryCode, year) {
    const weekEnd = await fetch(`https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`)
    const returnWeekEnd = await weekEnd.json()
    return returnWeekEnd

}

const lwCard = document.querySelectorAll(".lw-card")
const lwDates = document.querySelectorAll(".lw-dates")
const lwBadge = document.querySelectorAll(".lw-badge")
async function displayWeekEnd() {
    const selectedCountant = document.getElementById('global-country').value.trim()
        const selectedYesr = document.getElementById('global-year').value
    
    const disweek = await weekEnds(selectedCountant, selectedYesr)

    lwCard.forEach((week, i) => {
        if (disweek[i]) {
            const { startDate, endDate, dayCount } = disweek[i]
            lwBadge[i].innerHTML = `${dayCount}Days`
            lwDates[i].innerHTML = `${startDate}-${endDate}`

        }
    })

}
searchBtn.addEventListener('click', function () {
    const selectedCountant = document.getElementById('global-country').value.trim()
        const selectedYesr = document.getElementById('global-year').value
    

    displayWeekEnd(selectedCountant,selectedYesr)
})



const amountInput = document.getElementById("currency-amount");
const currencyFrom = document.getElementById("currency-from");
const currencyTo = document.getElementById("currency-to");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-currencies-btn");
const resultAmountFrom = document.querySelector(".conversion-from .amount");
const resultCurrencyFrom = document.querySelector(".conversion-from .currency-code");
const resultAmountTo = document.querySelector(".conversion-to .amount");
const resultCurrencyTo = document.querySelector(".conversion-to .currency-code");
const rateInfoText = document.querySelector(".exchange-rate-info p");
const lastUpdatedText = document.querySelector(".exchange-rate-info small");


async function handleConversion() {
    const amount = amountInput.value || 1;
    const fromCurr = currencyFrom.value;
    const toCurr = currencyTo.value;

    const apiKey = "805842951e5953ad31497176";

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurr}/${toCurr}/${amount}`);
        const data = await response.json();

        if (data.result === "success") {

            resultAmountFrom.textContent = amount;
            resultCurrencyFrom.textContent = fromCurr;

            resultAmountTo.textContent = data.conversion_result.toLocaleString();
            resultCurrencyTo.textContent = toCurr;


            rateInfoText.textContent = `1 ${fromCurr} = ${data.conversion_rate} ${toCurr}`;
            lastUpdatedText.textContent = `Last updated: ${data.time_last_update_utc || "Recent"}`;

            console.log("تم تحديث الواجهة بنجاح");
        } else {
            console.log("فشل في جلب البيانات");
        }
    } catch (error) {
        console.error("حدث خطأ في الاتصال:", error);
    }
}


function swapCurrencies() {
    const temp = currencyFrom.value;
    currencyFrom.value = currencyTo.value;
    currencyTo.value = temp;
    handleConversion();
}


if (convertBtn) {
    convertBtn.addEventListener("click", function () {
        handleConversion();
    });
}

if (swapBtn) {
    swapBtn.addEventListener("click", function () {
        swapCurrencies();
    });
}


const popularCards = document.querySelectorAll(".popular-currency-card");
popularCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const currencyCodeElement = card.querySelector("img");
        if (currencyCodeElement) {
            const targetCurrency = currencyCodeElement.getAttribute("alt").trim();

            currencyTo.value = targetCurrency;
            handleConversion();
        }
    });
});

async function sunTime(lat, lng) {
    const resultSun = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}}&lng=${lng}}&date=2026-01-25&formatted=0`)
    const dateSun = await resultSun.json()
    return dateSun.results

}

const sunTimeCard = document.querySelectorAll(".sun-time-card")
const time = document.querySelectorAll("time")
const dayStat = document.querySelectorAll(".day-stat")
const value = document.querySelector(".value")


async function displaySun() {
    const disSun = await sunTime(lat, lng)
    sunTimeCard.forEach((sun, i) => {
        if (disSun) {
            const timeElement = sun.querySelector(".time")
            if (sun.classList.contains("dawn")) {
                timeElement.textContent = formatTime(disSun.civil_twilight_begin)
            }
            if (sun.classList.contains("sunrise")) {
                timeElement.textContent = formatTime(disSun.sunrise)
            }
            if (sun.classList.contains(" noon")) {
                timeElement.textContent = formatTime(disSun.solar_noon)
            }
            if (sun.classList.contains("sunset")) {
                timeElement.textContent = formatTime(disSun.sunset)
            }
            if (sun.classList.contains("daylight")) {
                timeElement.textContent = formatTime(disSun.day_length)
            }
            if (sun.classList.contains("dusk")) {
                timeElement.textContent = formatTime(disSun.civil_twilight_end)
            }


        }

    })
    dayStat.forEach((lang, i) => {
        if (disSun) {
            const valueEliment = lang.querySelector('.value')
            if (lang.classList.contains("light")) {

                valueEliment.textContent = formatTime(disSun.astronomical_twilight_begin)
            }
            if (lang.classList.contains("hours")) {

                valueEliment.textContent = formatTime(disSun.nautical_twilight_begin) + "%"
            }
            if (lang.classList.contains("dark")) {

                valueEliment.textContent = formatTime(disSun.astronomical_twilight_end)
            }
        }
    })




}
displaySun()

function formatTime(isoString) {
    if (!isoString) return
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-Us', {
        hour: 'numeric',
        minute: "2-digit",
        hour12: true
    })
}



function handleSaveCard(event) {
    const button = event.target.closest('.holiday-action-btn, .event-card-save, .btn-event');
    if (!button) return;

    const lwCard = button.closest('.lw-card');
    const holidayCard = button.closest('.holiday-card');
    const eventCard = button.closest('.event-card');

    let cardData = {};

    if (lwCard) {
        cardData = {
            type: 'lw-card',
            badgeText: lwCard.querySelector('.lw-badge').innerHTML,
            title: lwCard.querySelector('h3').innerText,
            dates: lwCard.querySelector('.lw-dates').innerHTML,
            infoBoxHTML: lwCard.querySelector('.lw-info-box') ? lwCard.querySelector('.lw-info-box').outerHTML : '',
            daysVisual: lwCard.querySelector('.lw-days-visual').innerHTML
        };
    } else if (holidayCard) {
        cardData = {
            type: 'holiday-card',
            dayNum: holidayCard.querySelector('.day').innerText,
            month: holidayCard.querySelector('.month').innerText,
            title: holidayCard.querySelector('h3').innerText,
            subtitle: holidayCard.querySelector('.holiday-name').innerText,
            dayName: holidayCard.querySelector('.holiday-day-badge').innerHTML,
            holidayType: holidayCard.querySelector('.holiday-type-badge').innerText
        };
    } else if (eventCard) {
        cardData = {
            type: 'event-card',
            imgSrc: eventCard.querySelector('.event-card-image img').getAttribute('src'),
            category: eventCard.querySelector('.event-card-category').innerText,
            title: eventCard.querySelector('h3').innerText,
            eventInfo: eventCard.querySelector('.event-card-info').innerHTML
        };
    }


    let savedPlans = JSON.parse(localStorage.getItem('mySavedPlans')) || [];


    const exists = savedPlans.some(item => item.title === cardData.title);

    if (!exists) {
        savedPlans.push(cardData);
        localStorage.setItem('mySavedPlans', JSON.stringify(savedPlans));
        alert('تمت إضافة العنصر إلى خطتك بنجاح!');


        if (document.getElementById('plans-content')) {
            renderSavedPlans();
        }
    } else {
        alert('هذا العنصر موجود بالفعل في خطتك!');
    }
}


function renderSavedPlans() {
    const plansContainer = document.getElementById('plans-content');
    if (!plansContainer) return;

    const savedPlans = JSON.parse(localStorage.getItem('mySavedPlans')) || [];

    if (savedPlans.length === 0) {
        plansContainer.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
              <h3>No Saved Plans Yet</h3>
              <p>Start exploring and save holidays, events, or long weekends you like!</p>
              <button class="btn-primary" id="start-exploring-btn">
                <i class="fa-solid fa-compass"></i> Start Explori
              </button>
            </div>
        `;
        return;
    }

    plansContainer.innerHTML = '';

    savedPlans.forEach((plan, index) => {
        const cardDiv = document.createElement('div');

        if (plan.type === 'lw-card') {
            cardDiv.className = 'lw-card';
            cardDiv.innerHTML = `
                <div class="lw-card-header">
                    <span class="lw-badge">${plan.badgeText}</span>
                    <button class="holiday-action-btn delete-saved-btn" data-index="${index}">
                        <i class="fa-solid fa-trash" style="color: #e74c3c;"> Remove</i>
                    </button>
                </div>
                <h3>${plan.title}</h3>
                <div class="lw-dates">${plan.dates}</div>
                ${plan.infoBoxHTML}
                <div class="lw-days-visual">
                    ${plan.daysVisual}
                </div>
            `;
        } else if (plan.type === 'holiday-card') {
            cardDiv.className = 'holiday-card';
            cardDiv.innerHTML = `
                <div class="holiday-card-header">
                    <div class="holiday-date-box"><span class="day">${plan.dayNum}</span><span class="month">${plan.month}</span></div>
                    <button class="holiday-action-btn delete-saved-btn" data-index="${index}">
                        <i class="fa-solid fa-trash" style="color: #e74c3c;"></i>
                    </button>
                </div>
                <h3>${plan.title}</h3>
                <p class="holiday-name">${plan.subtitle}</p>
                <div class="holiday-card-footer">
                    <span class="holiday-day-badge">${plan.dayName}</span>
                    <span class="holiday-type-badge">${plan.holidayType}</span>
                </div>
            `;
        } else if (plan.type === 'event-card') {
            cardDiv.className = 'event-card';
            cardDiv.innerHTML = `
                <div class="event-card-image">
                    <img src="${plan.imgSrc}" alt="${plan.title}">
                    <span class="event-card-category">${plan.category}</span>
                    <button class="event-card-save delete-saved-btn" data-index="${index}">
                        <i class="fa-solid fa-trash" style="color: #e74c3c;">}</i>
                    </button>
                </div>
                <div class="event-card-body">
                    <h3>${plan.title}</h3>
                    <div class="event-card-info">
                        ${plan.eventInfo}
                    </div>
                    <div class="event-card-footer">
                        <button class="btn-event delete-saved-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> Remove</button>
                    </div>
                </div>
            `;
        }

        plansContainer.appendChild(cardDiv);
    });
}


function removeSavedPlan(index) {
    let savedPlans = JSON.parse(localStorage.getItem('mySavedPlans')) || [];
    savedPlans.splice(index, 1);
    localStorage.setItem('mySavedPlans', JSON.stringify(savedPlans));
    renderSavedPlans();
}


document.addEventListener('DOMContentLoaded', () => {

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.holiday-action-btn, .event-card-save, .btn-event')) {
            const deleteBtn = e.target.closest('.delete-saved-btn');
            if (deleteBtn) {
                const index = deleteBtn.dataset.index;
                removeSavedPlan(index);
            } else {
                handleSaveCard(e);
            }
        }
    });


    const plansContainer = document.getElementById('plans-content');
    if (plansContainer) {
        renderSavedPlans();
    }

    const clearAllBtn = document.getElementById('clear-all-plans-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من مسح كل الرحلات المحفوظة؟')) {
                localStorage.removeItem('mySavedPlans');
                renderSavedPlans();
            }
        });
    }
});
