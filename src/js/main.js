import { getLocalStorage, loadHeaderFooter, manageTravelList, formatNumber, searchCountries} from "./utils.mjs";
import { getCountriesData, getCountryByFilter, getCountryByName } from "./externalServices.mjs";
loadHeaderFooter()

const removeButton = document.querySelector(".removeFilter") 
const header = document.querySelector("header");
const scrollToTopBtn = document.querySelector(".floating-button")

export async function renderContryCard(filteredData){
    let countriesData = []
    if(filteredData){
        countriesData = filteredData;
    }else{
        countriesData = await getCountriesData();
    }
    const sortedList = countriesData.sort((a, b) =>
    a.name.common.localeCompare(b.name.common));
    const mainElement = document.querySelector("#countriesContainer")
    const htmlElements = sortedList.map((item, index) => countryCardTemplate(item, index))
    mainElement.innerHTML = htmlElements.join("")
    updateIconColor()
  }


function countryCardTemplate(item, index){
    return `<div class="card ${index}">
            <a href="../countryPages/index.html?countryCode=${item.cca3}" class="countryLink" id="">
                <img src="${item.flags.png}" alt="${item.flags.alt}" class="" id="${item.cca3}">
                <div class="countryInfo" id="">
                    <h2 id="">${item.name.common}</h2>
                    <div class="countryDetails" id="">
                        <p><span class="bold" id="">Population:</span> ${formatNumber(item.population)}</p>
                        <p><span class="bold" id="">Region:</span> ${item.region}</p>
                        <p><span class="bold" id="">Capital:</span> ${item.capital || "N/A"}</p>
                        <i class="fa-regular fa-heart" style="color: #ff2600;text-align: end;
                        font-size: 25px;" id="${item.name.common}" title="Add country to my travel list"></i>
                    </div>
                </div>
            </a>
        </div>`
}

// Get the parent container
const filterContainer = document.getElementById("filterContainer");
const optionsElements = document.querySelectorAll("#filterContainer ul");
filterContainer.addEventListener("click", function(event) {
  const target = event.target;
  
  if (target.tagName === "SPAN" && target.parentNode.tagName === "DIV") {
    const optionsElement = target.parentNode.querySelector("ul");
    optionsElement.classList.toggle("active-options");
  }
});

window.addEventListener("click", function(event) {
    const isClickedInsideContainer = filterContainer.contains(event.target);
    if (!isClickedInsideContainer) {
      optionsElements.forEach(function(optionsElement) {
        optionsElement.classList.remove("active-options");
      });
    }
  });


async function loadFilterOptions(typeOfJson) {
    try {
      const response = await fetch(`../json/${typeOfJson}.json`);
      const data = await response.json();
      const items = data[typeOfJson];
  
      const optionsList = document.getElementById(`${typeOfJson}Options`);
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        if (typeOfJson == "currencies"){
            li.dataset.myData = item.code;
        }
        optionsList.appendChild(li);
        li.addEventListener("click",function(e){
            if (typeOfJson == "currencies"){
                getDataFiltered(e.target.dataset.myData, typeOfJson)
            }else{
                getDataFiltered(e.target.innerText, typeOfJson);
            }
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

  document.querySelector("#countriesContainer").addEventListener("click", async (e) =>{
    if (e.target.classList.contains("fa-heart")){
      e.preventDefault()
      const id = e.target.id;
      const countryData = await getCountryByName(id)
      manageTravelList(countryData)
      const heart = document.getElementById(`${id}`)
      if(heart.classList.contains("fa-solid")){
        heart.classList.remove("fa-solid")
      }else{
        heart.classList.add("fa-solid")
      }
    }
  })

  function updateIconColor() {
    const travelListItems = getLocalStorage("t-list") || [];
    const heartIcons = Array.from(document.getElementsByClassName("fa-heart"));
    heartIcons.forEach((icon) => {
      const id = icon.id;
  
      const isTravelListed = travelListItems.some((item) => item.name.common === id);
  
      if (isTravelListed) {
        icon.classList.add("fa-solid");
      } else {
        icon.classList.remove("fa-solid");
      }
    });
  }

  renderContryCard();


  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  scrollToTopBtn.addEventListener("click", scrollToTop);

  function handleIntersection(entries) {
    if (entries[0].isIntersecting) {
      scrollToTopBtn.classList.add("hide");
      setTimeout(() => {
        scrollToTopBtn.style.display = "none";
        
      }, 100);
    } else {
      scrollToTopBtn.style.display = "flex";
      setTimeout(() => {
        scrollToTopBtn.classList.remove("hide");
        
      }, 200);
      
    }
  }

  const observer = new IntersectionObserver(handleIntersection, {
    root: null, 
    threshold: 0,
  });

  observer.observe(header);
 
  document.addEventListener("DOMContentLoaded", async function() {
      
    await searchCountries()

   });
