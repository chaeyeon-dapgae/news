let newsList = [];
const getLatestNews = async() => {
  const url = new URL(`https://news-chaeyeon.netlify.app/top-headlines`);
  // console.log("uuu", url)

  //URL 호출 하게 해주는 fetch함수
  const response = await fetch(url);
  const data = await response.json()
  //json은 파일 형식._텍스트이지만 객체처럼 생긴 타입 ex)png, jpeg
  newsList = data.articles
  // console.log(newsList)
  render()
}

getLatestNews ()


// ########## menu ##########
let hamburgerButton = document.querySelector('.xi-bars');
let closeButton = document.querySelector('.xi-close');
let menuGroup = document.querySelector('.menus');

let menuSlideOn = () =>  menuGroup.style.left = '0';
let menuSlideOff = () => menuGroup.style.left = '-100%';

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);

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

goButton.addEventListener("click", function (){
  searchTxt.value = ""
  searchClicked = false;
  searchArea.style.width = '0';
  searchArea.style.opacity = '0';
})



searchButton.addEventListener("click", searching)

// ########## api에서 받은 데이터를 이용하여 UI 변경 ##########
const render = () => {
  const newsHTML = newsList.map((news)=>{
    // map은 반드시 return
    return `<div class="row news"> 
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage}" onError="this.src='https://t3.ftcdn.net/jpg/05/52/37/18/360_F_552371867_LkVmqMEChRhMMHDQ2drOS8cwhAWehgVc.jpg'"/>
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
          ${news.description == null || news.description == '' ? '내용없음' : news.description.length > 200 ? news.description.substr(0, 200) + '...':news.description}
        </p>
        <div>
          ${news.source.name == null || news.source.name == '' ? 'no source' : news.source.name} * ${news.publishedAt} * ${news.publishedAt}
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
  }