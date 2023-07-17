import { loadHeaderFooter, getParam, formatNumber } from "./utils.mjs";
import { getCountryByCode } from "./externalServices.mjs";

loadHeaderFooter();
const countryCode = getParam("countryCode")

async function renderCountryPage(){
    const countryData = await getCountryByCode(countryCode)

    const mainElement = document.querySelector(".countryPage");
    const nativeName = await getNativeName();
    const currencies = await getCurrencies();
    const languages = await getLanguages();
    const domains = await getTopLevelDomain();
    const htmlElements = countryPageTemplate(countryData, nativeName, currencies, languages, domains)
    mainElement.innerHTML = htmlElements
    createCountryBorders()

  }

async function getNativeName(){
    const countryData = await getCountryByCode(countryCode)

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
                return nativeName
    
            }
    }
    
    } else{
        return countryData.name.official
    }
}

async function getCurrencies(){
    const countryData = await getCountryByCode(countryCode)

    const countryCurrency = countryData.currencies
    if (countryCurrency){        
        const currencyKey = Object.keys(countryCurrency)
        const currencyNames = currencyKey.map(key => countryCurrency[key].name);
        return currencyNames.join(", ")
    } else{
        return "N/A"
    }
    
}

async function getLanguages(){
    const countryData = await getCountryByCode(countryCode)

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

async function getTopLevelDomain(){
    const countryData = await getCountryByCode(countryCode)

    const countryDomains = countryData.tld
    let domains = []
    if (countryDomains){
        for (let domain in countryDomains){
            domains.push(countryDomains[domain])
        }
        const stringifyDomain = domains.join(", ")
        return stringifyDomain
    } else{
        return "N/A"
    }
}

function countryPageTemplate(item, nativeName, currencies, languages, domains){
    return `
            <img src="${item.flags.png}" alt="${item.flags.alt}">
            <div>
                <h1>${item.name.common}</h1>
                <div class="countryDetails" id="">
                    <p id="nativeName"><span class="bold" id="">Native Name:</span> ${nativeName}</p>
                    <p><span class="bold" id="">Population:</span> ${formatNumber(item.population)}</p>
                    <p><span class="bold" id="">Region:</span> ${item.region}</p>
                    <p><span class="bold" id="">Sub Region:</span> ${item.subregion || "N/A"}</p>
                    <p><span class="bold" id="">Capital:</span> ${item.capital || "N/A"}</p>
                    <p><span class="bold" id="">Top Level Domain:</span> ${domains || "N/A"}</p>
                    <p><span class="bold" id="">Currencies:</span> ${currencies}</p>
                    <p><span class="bold" id="">Languages:</span> ${languages}</p>
                </div>
                <div class="borders countryDetails">
                    <p><span class="bold">Border Countries:</span></p>
                </div>
            </div>
        `
}

async function createCountryBorders(){
    const countryData = await getCountryByCode(countryCode)

    const borders = countryData.borders
    const bordersParentElement = document.querySelector(".borders")
    if (borders){
        borders.forEach(async codeCountry => {
            let newLink = document.createElement("a")
            newLink.setAttribute("href", `/countryPages/index.html?countryCode=${codeCountry}`)
            const country = await getCountryByCode(codeCountry)
            newLink.innerText = country.name.common
            bordersParentElement.insertAdjacentElement("beforeend",newLink)
        });
    } else {
         bordersParentElement.style.display = "none"
    }
}

renderCountryPage()