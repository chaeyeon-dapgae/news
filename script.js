let newsList = [];
const getLatestNews = async() => {
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  //URL 호출 하게 해주는 fetch함수
  const response = await fetch(url);
  const data = await response.json()
  //json은 파일 형식._텍스트이지만 객체처럼 생긴 타입 ex)png, jpeg
  newsList = data.articles
  // console.log(newsList)
  render()
}

getLatestNews ()

// #################### menu ####################
let hamburgerButton = document.querySelector('.xi-bars');
let closeButton = document.querySelector('.xi-close');
let menuGroup = document.querySelector('.menus');

let menuSlideOn = () =>  menuGroup.style.left = '0';
let menuSlideOff = () => menuGroup.style.left = '-100%';

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);
const menus = document.querySelectorAll('.menus button');
menus.forEach(menu => menu.addEventListener("click", (event) => {getNewsByCategory(event)}))

// ########## search - input ##########
let searchButton = document.querySelector('.xi-search');
let searchClicked = false;
let searchArea = document.querySelector('.input-area');
let goButton = document.getElementById('go-button');
let searchTxt = document.getElementById('search-text');

let searching = () => {
  if(searchClicked === false) {
    searchClicked = true;
    searchArea.style.width = '100%';
    searchArea.style.opacity = '1';
  } else if (searchClicked === true) {
    searchClicked = false;
    searchArea.style.width = '0';
    searchArea.style.opacity = '0';
  }
}
searchButton.addEventListener("click", searching)

// #################### render - keyword & button Category ####################

// 1. 메뉴 버튼'들'에 클릭이벤트 줘야함
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기 render
const getNewsByCategory = async(event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category)
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
  const response = await fetch(url)
  const data = await response.json();
  // console.log(data)
  newsList = data.articles
  render()
}

const getNewsByKeyword = async() => {
  const keyword = inputTxt.value;
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
  const response = await fetch(url)
  const data = await response.json();
  // console.log(keyword)
  // console.log(data)
  newsList = data.articles
  render()
  inputTxt.value =""
}




goButton.addEventListener("click", function (){
  searchTxt.value = ""
  searchClicked = false;
  searchArea.style.width = '0';
  searchArea.style.opacity = '0';
})




// ########## api에서 받은 데이터를 이용하여 UI 변경 ##########
const render = () => {
  const newsHTML = newsList.map((news)=>{
    // map은 반드시 return
    return `<div class="row news"> 
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage || 'https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'}" onError="this.src='https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'"/>
      </div>
      <div class="col-lg-8">
        <h2><a href="${news.url}">${news.title}</a></h2>
        <p>
          ${news.description == null || news.description == '' ? '내용없음' : news.description.length > 200 ? news.description.substr(0, 200) + '...':news.description}
        </p>
        <div>
          ${news.source.name || 'no source'} * ${moment(news.publishedAt, "YYYYMMDD").fromNow()}
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
  }

