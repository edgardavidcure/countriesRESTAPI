import { getCountryByName } from "./externalServices.mjs";
import {
  getLocalStorage,
  loadHeaderFooter,
  manageTravelList,
  searchCountries
} from "./utils.mjs";

const travelItems = getLocalStorage("t-list");

loadHeaderFooter();

function renderContryCard(countries) {
  const countriesData = countries || [];
  const mainElement = document.querySelector("#countriesContainer");

  if(countries && countries.length > 0){
    const htmlElements = countriesData.map((item, index) =>
      countryCardTemplate(item, index)
    );
    mainElement.innerHTML = htmlElements.join("");
    updateIconColor();
  } else{
    mainElement.innerHTML = "<h4>No items to show &#128547;</h4>";
  }
}

function countryCardTemplate(item, index) {
  return `<div class="card ${index}">
            <a href="../countryPages/index.html?countryCode=${
              item.cca3
            }" class="countryLink" id="">
                <img src="${item.flags.png}" alt="${
    item.flags.alt
  }" class="" id="${item.cca3}">
                <div class="countryInfo" id="">
                    <h2 id="">${item.name.common}</h2>
                    <div class="countryDetails" id="">
                        <p><span class="bold" id="">Population:</span> ${
                          item.population
                        }</p>
                        <p><span class="bold" id="">Region:</span> ${
                          item.region
                        }</p>
                        <p><span class="bold" id="">Capital:</span> ${
                          item.capital || "N/A"
                        }</p>
                        <i class="fa-regular fa-heart" style="color: #ff2600;text-align: end;
                        font-size: 25px;" id="${
                          item.name.common
                        }" title="Remove country from my travel list"></i>
                    </div>
                </div>
            </a>
        </div>`;
}

document
  .querySelector("#countriesContainer")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-heart")) {
      e.preventDefault();
      const id = e.target.id;
      const countryData = await getCountryByName(id);
      manageTravelList(countryData);
      const heart = document.getElementById(`${id}`);
      heart.classList.remove("fa-solid");
      const newTravelList = getLocalStorage("t-list")
      renderContryCard(newTravelList)
    }
  });

function updateIconColor() {
  const travelListItems = getLocalStorage("t-list") || [];
  const heartIcons = Array.from(document.getElementsByClassName("fa-heart"));
  heartIcons.forEach((icon) => {
    const id = icon.id;

    const isTravelListed = travelListItems.some(
      (item) => item.name.common === id
    );

    if (isTravelListed) {
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
    }
  });
}

renderContryCard(travelItems);
document.addEventListener("DOMContentLoaded", function() {
      
  searchCountries()

 });