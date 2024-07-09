const API_KEY = "062a34e0cdaa457d9e176b95056f3ded";
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  //URL 호출 하게 해주는 fetch함수
  const response = await fetch(url);
  const data = await response.json();
  //json은 파일 형식._텍스트이지만 객체처럼 생긴 타입 ex)png, jpeg
  newsList = data.articles;
  console.log("rrr", newsList);
  render();
};

getLatestNews();

// ########## menu ##########
let hamburgerButton = document.querySelector(".xi-bars");
let closeButton = document.querySelector(".xi-close");
let menuGroup = document.querySelector(".menus");

let menuSlideOn = () => (menuGroup.style.left = "0");
let menuSlideOff = () => (menuGroup.style.left = "-100%");

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);

// ########## search - input ##########
let searchButton = document.querySelector(".xi-search");
let searchClicked = false;
let searchArea = document.querySelector(".input-area");

let searching = () => {
  if (searchClicked === false) {
    searchClicked = true;
    searchArea.style.width = "100%";
    searchArea.style.opacity = "1";
  } else if (searchClicked === true) {
    searchClicked = false;
    searchArea.style.width = "0";
    searchArea.style.opacity = "0";
  }
};

searchButton.addEventListener("click", searching);

// ########## api에서 받은 데이터를 이용하여 UI 변경 ##########
const render = () => {
  const newsHTML = newsList.map((news) =>
    {
    // map은 반드시 return
    return `<div class="row news"> 
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage}"/>
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
          ${news.description}
        </p>
        <div>
          ${news.source.name} * ${news.publishedAt}
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
};
