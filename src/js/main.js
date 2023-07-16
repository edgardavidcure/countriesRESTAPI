import { loadHeaderFooter} from "./utils.mjs";
import { getCountriesData, getCountryByFilter } from "./externalServices.mjs";
loadHeaderFooter()

const removeButton = document.querySelector(".removeFilter") 
export async function renderContryCard(filteredData){
    let countriesData = []
    if(filteredData){
        countriesData = filteredData;
    }else{
        countriesData = await getCountriesData();
    }
    const mainElement = document.querySelector("#countriesContainer")
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
                        <p><span class="bold" id="">Capital:</span> ${item.capital || "N/A"}</p>
                        <i class="fa-regular fa-heart" style="color: #ff2600;text-align: end;
                        font-size: 25px;" id="${item.name}" title="Add country to my travel list"></i>
                    </div>
                </div>
            </a>
        </div>`
}

// Get the parent container
const filterContainer = document.getElementById("filterContainer");

// Add a click event listener to the parent container
filterContainer.addEventListener("click", function(event) {
  const target = event.target;
  
  // Check if the clicked element is a span inside a div
  if (target.tagName === "SPAN" && target.parentNode.tagName === "DIV") {
    const optionsElement = target.parentNode.querySelector("ul");
    optionsElement.classList.toggle("active-options");
  }
});

async function loadFilterOptions(typeOfJson) {
    try {
      const response = await fetch(`../public/json/${typeOfJson}.json`);
      const data = await response.json();
      const items = data[typeOfJson];
  
      const optionsList = document.getElementById(`${typeOfJson}Options`);
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        optionsList.appendChild(li);
        li.addEventListener("click",function(e){
            getDataFiltered(e.target.innerText, typeOfJson);
            document.getElementById("filterBy").innerHTML = `${typeOfJson} : ${e.target.innerText}`.toUpperCase()
            removeButton.style.visibility = "visible";
            optionsList.classList.toggle("active-options");
        })
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  loadFilterOptions("regions");
  loadFilterOptions("currencies");
  loadFilterOptions("languages");
  
  async function getDataFiltered(value, parent){
    let filter;

    switch (parent) {
        case "regions":
            filter = "region";    
            break;
        case "languages":
            filter = "lang";
            break;
        case "currencies":
            filter = "currency";    
            break;
        default:
            break;
    }

    const dataFiltered = await getCountryByFilter(filter, value)
    renderContryCard(dataFiltered)
  }

  removeButton.addEventListener("click", () =>{
    document.getElementById("filterBy").innerHTML = "";
      renderContryCard();
      removeButton.style.visibility = "hidden"
  })

  renderContryCard();
