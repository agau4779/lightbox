"use strict";

const LIMIT = "100"
const GIPHY_URL_BASE = "http://api.giphy.com/v1/gifs/search?&limit=" + LIMIT + "&api_key=dc6zaTOxFJmzC&q=";
const SAMPLE_QUERIES = ["Pikachu", "succulents", "dragon", "Thanks Obama", "Disney", "beer", "bacon", "San Francisco", "hedgehogs"];

var search_input = document.querySelector('input[name="search"]');
var results = document.querySelector('#results');

var index = 0;
var imageData = [];

document.onkeydown = checkKey;

// Initialize document with sample query for images
let exampleQuery = SAMPLE_QUERIES[Math.floor(Math.random() * SAMPLE_QUERIES.length)];
getImages(exampleQuery);
search_input.value = exampleQuery;


// Lets document listen for the left or right arrow key inputs. Renders image at index.
function checkKey(e) {
  e = e || window.event;

  if (imageData.length == 0) {
    return;
  }

  if (e.keyCode == '37') {
    index--;
  } else if (e.keyCode == '39') {
    index++;
  }

  renderImage();
}


// Event handler for when Enter is typed in the searchbar.
function handleSearch(e) {
  if (e.keyCode == 13) {
    getImages(search_input.value);
    search_input.blur();
  }
}

// Event handler for when the Magnifying Glass is clicked on.
function handleSearchClick(e) {
  getImages(search_input.value);
}


// Send an asynchronous request for images to Giphy, then renders the image once hte images come back.
function getImages(query) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', GIPHY_URL_BASE + query);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      let response = JSON.parse(xhr.responseText);
      imageData = response.data.map(function (data) {
        return data;
      });
      renderImage();
    }
  };
}


// Clears the old image from the DOM.
function clearOldResults() {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
}


// Renders the image in the DOM. Image links to its original URL.
function renderImage() {
  clearOldResults();

  let fixed_height_attrs = imageData[index].images.fixed_height

  let link = document.createElement("a");
  link.href = imageData[index].url;

  let img = document.createElement("img");
  img.src = fixed_height_attrs.url;
  img.height = fixed_height_attrs.height;
  img.width = fixed_height_attrs.width;
  img.alt = imageData[index].slug;

  let desc = document.createElement("p");
  let text = document.createTextNode("Source: ");
  desc.appendChild(text)

  let source = document.createElement("a");
  source.href = imageData[index].url;
  let title = document.createTextNode(imageData[index].slug)
  source.appendChild(title)
  
  desc.appendChild(source)

  link.appendChild(img)
  results.appendChild(link);
  results.appendChild(desc);
}
