import { getParam } from "./utils.mjs";
const baseURL = import.meta.env.VITE_SERVER_URL;

export async function getCountriesData(){
  const data = await fetch(baseURL + `/all`)
  const dataToJson = await data.json()
  return dataToJson
}

export async function getCountryByCode(code){
    const countryData = await fetch(baseURL + `/alpha/${code}`)
    const [data] = await convertToJson(countryData)
    return data
}

async function convertToJson(res) {
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw { name: "servicesError", message: data };
    }
  }