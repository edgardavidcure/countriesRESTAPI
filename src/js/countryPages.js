import { loadHeaderFooter, getParam } from "./utils.mjs";
import { getCountryByCode } from "./externalServices.mjs";

loadHeaderFooter();
const countryCode = getParam("countryCode")
const countryData = await getCountryByCode(countryCode)
console.log(countryData)

async function renderCountryPage(){
    const mainElement = document.querySelector(".countryPage");
    const nativeName = getNativeName();
    const currencies = getCurrencies();
    const languages = getLanguages();

    const htmlElements = countryPageTemplate(countryData, nativeName, currencies, languages)
    mainElement.innerHTML = htmlElements
    createCountryBorders()

  }

function getNativeName(){
    const countryNativeName = countryData.name.nativeName
    const countryLanguage = countryData.languages
    let nativeName;
    if (countryLanguage){
        for(let language in countryLanguage){
            if(countryNativeName[language]){
                nativeName = countryNativeName[language].official
                return nativeName
    
            } else{
                nativeName = countryData.name.official
                console.log(nativeName)
                return nativeName
    
            }
    }
    
    } else{
        return countryData.name.official
    }
}

function getCurrencies(){
    const countryCurrency = countryData.currencies
    if (countryCurrency){
        const currencyKey = Object.keys(countryCurrency)
        const currencyName = countryCurrency[currencyKey].name
        return currencyName
    } else{
        return "N/A"
    }
    
}

function getLanguages(){
    const countryLanguages = countryData.languages
    let languages = []
    if (countryLanguages){
        for (let language in countryLanguages){
            languages.push(countryLanguages[language])
        }
        const stringifyLanguages = languages.join(", ")
        return stringifyLanguages
    } else{
        return "N/A"
    }
    }
    

function countryPageTemplate(item, nativeName, currencies, languages){
    return `
            <img src="${item.flags.png}" alt="${item.flags.alt}">
            <div>
                <h1>${item.name.common}</h1>
                <div class="countryDetails" id="">
                    <p id="nativeName"><span class="bold" id="">Native Name:</span> ${nativeName}</p>
                    <p><span class="bold" id="">Population:</span> ${item.population}</p>
                    <p><span class="bold" id="">Region:</span> ${item.region}</p>
                    <p><span class="bold" id="">Sub Region:</span> ${item.subregion || "N/A"}</p>
                    <p><span class="bold" id="">Capital:</span> ${item.capital || "N/A"}</p>
                    <p><span class="bold" id="">Top Level Domain:</span> ${item.tld[0]}</p>
                    <p><span class="bold" id="">Currencies:</span> ${currencies}</p>
                    <p><span class="bold" id="">Languages:</span> ${languages}</p>
                </div>
                <div class="borders countryDetails">
                    <p><span class="bold">Border Countries:</span></p>
                </div>
            </div>
        `
}

 function createCountryBorders(){
    const borders = countryData.borders
    const bordersParentElement = document.querySelector(".borders")
    if (borders){
        borders.forEach(async countryCode => {
            let newLink = document.createElement("a")
            newLink.setAttribute("href", `/countryPages/index.html?countryCode=${countryCode}`)
            const country = await getCountryByCode(countryCode)
            newLink.innerText = country.name.common
            bordersParentElement.insertAdjacentElement("beforeend", newLink )
        });
    } else {
         bordersParentElement.style.display = "none"
    }
}

renderCountryPage()