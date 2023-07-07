const BaseURL = import.meta.env.VITE_SERVER_URL;

export function loadHeaderFooter() {
    const headerTemplateFn = loadTemplate("/partials/header.html");
    const footerTemplateFn = loadTemplate("/partials/footer.html");
    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");
    renderWithTemplate(headerTemplateFn, headerElement, checkViewPreference);
    renderWithTemplate(footerTemplateFn, footerElement);
    
}
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

function loadTemplate(path) {
    // wait what?  we are returning a new function?
    // this is called currying and can be very helpful.
    return async function () {
      const res = await fetch(path);
      if (res.ok) {
        const html = await res.text();
        return html;
      }
    };
}
  
export async function renderWithTemplate(
    templateFn,
    parentElement,
    callback,
    position = "afterbegin",
    clear = true
  ) {
    if (clear) {
      parentElement.innerHTML = "";
    }
    const htmlString = await templateFn();
    parentElement.innerHTML = htmlString;
    if (callback) {
      callback();
    }
}

export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
  // save data to local storage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get(param);
    return product;
}

export function capitalize(text) {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
    qs(selector).addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    qs(selector).addEventListener("click", callback);
  }
  
const themeColor = {
    light: {
        textColor: "hsl(200, 15%, 8%)",
        backgroundColor: "hsl(0, 0%, 98%)",
        elementsBackground: "hsl(0, 0%, 100%)"
    },
    dark: {
        textColor: "hsl(0, 0%, 100%)",
        backgroundColor: "hsl(207, 26%, 17%)",
        elementsBackground: "hsl(209, 23%, 22%)"
    }
}

function setTheme(){
    let viewPreference = getLocalStorage("view-mode");
    const root = document.documentElement;
    let theme = themeColor[viewPreference];
    // root.style.setProperty('--transition-property', 'background-color');
    // root.style.setProperty('--transition-duration', '1s');
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--elements-background', theme.elementsBackground);
    root.style.setProperty('--background-color', theme.backgroundColor);
    
}

export function checkViewPreference(){
    let viewPreference = getLocalStorage("view-mode")
    
    if (!viewPreference){
        setLocalStorage("view-mode", "light");
        viewPreference = getLocalStorage("view-mode")
    }
    setTheme()
    
    console.log(viewPreference)
    setClick("#view-mode", changeViewPreference)
}


export function changeViewPreference(){
    const viewPreferenceIcon = document.querySelector("#view-mode-icon")
    const viewPreferenceDesc = document.querySelector("#view-mode-desc")

    let viewPreference = getLocalStorage("view-mode")
    
    if (viewPreference == "light"){
        viewPreferenceIcon.classList.replace("fa-sun", "fa-moon")
        viewPreferenceIcon.classList.replace("sun", "moon")
        setLocalStorage("view-mode", "dark");
        viewPreferenceDesc.textContent = "Dark Mode";
        setTheme()

    } else if(viewPreference == "dark"){
        
        viewPreferenceIcon.classList.replace("fa-moon", "fa-sun")
        viewPreferenceIcon.classList.replace("moon", "sun")
        setLocalStorage("view-mode", "light");
        viewPreferenceDesc.textContent = "Light Mode";
        setTheme()


    }
}

export async function getCountriesData(){
  const data = await fetch(BaseURL)
  const dataToJson = await data.json()
  return dataToJson
}

