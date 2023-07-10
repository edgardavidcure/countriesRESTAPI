import { getLocalStorage, loadHeaderFooter, setLocalStorage} from "./utils.mjs";
import { getCountriesData } from "./externalServices.mjs";
loadHeaderFooter()


async function renderContryCard(){
    const countriesData = await getCountriesData()
    const mainElement = document.querySelector("main")
    const htmlElements = countriesData.map((item, index) => countryCardTemplate(item, index))
    mainElement.innerHTML = htmlElements.join("")
  }

function countryCardTemplate(item, index){
    return `<div class="card ${index}">
            <a href="../countryPages/index.html?countryCode=${item.cca3}" class="countryLink" id="">
                <img src="${item.flags.png}" alt="${item.flags.alt}" class="" id="${item.cca3}">
                <div class="countryInfo" id="">
                    <h2 id="">${item.name.common}</h2>
                    <div class="countryDetails" id="">
                        <p><span class="bold" id="">Population:</span> ${item.population}</p>
                        <p><span class="bold" id="">Region:</span> ${item.region}</p>
                        <p><span class="bold" id="">Capital:</span> ${item.capital}</p>
                    </div>
                    
                </div>
            </a>
        </div>`
}

renderContryCard();