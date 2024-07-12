const API_KEY = "062a34e0cdaa457d9e176b95056f3ded";
let url = new URL('https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}')

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;


const getNews = async() => {
  try {
    const response = await fetch(url)
    const data = await response.json();
    console.log(data)
    if(response.status === 200 ) {
      if(data.articles.length < 1) {
        throw new Error("No result for this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults
      render()
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
      // console.log("error", error.message);
      errorRender(error.message)
  }
}

let newsList = [];
const getLatestNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  getNews();
};

getLatestNews();

// #################### menu ####################
let hamburgerButton = document.querySelector(".xi-bars");
let closeButton = document.querySelector(".xi-close");
let menuGroup = document.querySelector(".menus");

let menuSlideOn = () => (menuGroup.style.left = "0");
let menuSlideOff = () => (menuGroup.style.left = "-100%");

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);

// #################### search - input ####################
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

// #################### render - keyword & button Category ####################
const menus = document.querySelectorAll('.menus button');
let inputTxt = document.querySelector('#search-text');
let goButton = document.querySelector('#go-button')
menus.forEach(menu => menu.addEventListener("click", (event) => {getNewsByCategory(event)}))
menus.forEach((menu)=>menu.addEventListener("click", menuSlideOff));
goButton.addEventListener("click", ()=>{getNewsByKeyword()})

inputTxt.addEventListener("keyup", (enterKeyCode) => {
  let enterKey = enterKeyCode.code;
  if (enterKey == "Enter" || enterKey == "NumpadEnter") {
    if(inputTxt.value == "") {
      return;
    } else if(inputTxt.value) {
      getNewsByKeyword()
    }
  }
})

// 1. 메뉴 버튼'들'에 클릭이벤트 줘야함
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기 render
const getNewsByCategory = async(event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  getNews()
}

const getNewsByKeyword = async() => {
  const keyword = inputTxt.value;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
  getNews()
  inputTxt.value =""
}

// #################### api에서 받은 데이터를 이용하여 UI 변경 ####################
const render = () => {
  const newsHTML = newsList.map((news) =>
    {
      // map은 반드시 return
      return `<div class="row news"> 
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage || 'https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'}" onError="this.src='https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'"/>
      </div>
      <div class="col-lg-8">
        <h2><a href="${news.url}" target='_blank'>${news.title}</a></h2>
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
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;//bootstrap
  document.getElementById("news-board").innerHTML = errorHTML;
};

/*
//에러 핸들링
//ex
try {
  //소스코드를 씀
  // 이 안에서 에러가 발생하면 Cath로 감
  //에러가 발생하는 순간 try문 끝남
  chaeyeon
  if (조건문) {
    throw new Error("에러를 강제로 발생")
  }
  console.log("에러발생!") //에러가 발생하면 실행X
} catch(error) {
  //catch가 에러를 잡아줌
  console.log("내가 잡은 에러는?", error.message)
}
*/

const paginationRender = () => {
  // totalResult
  // totalPage
  // page
  // pageSize
  // GroupSize
  // pageGroup (몇번째 그룹에 속했는지)
  const pageGroup = Math.ceil(page / groupSize)
  // lastPage
  const lastPage = pageGroup * groupSize;
  // firstPage
  const firstPage = lastPage - (groupSize - 1);

  let pagiNationHTML = ``;

  for(let i = firstPage; i <= lastPage; i++) {
    pagiNationHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
  }

  document.querySelector(".pagination").innerHTML = pagiNationHTML;
//   <nav aria-label="Page navigation example">
//   <ul class="pagination">
//     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
//     <li class="page-item"><a class="page-link" href="#">1</a></li>
//     <li class="page-item"><a class="page-link" href="#">2</a></li>
//     <li class="page-item"><a class="page-link" href="#">3</a></li>
//     <li class="page-item"><a class="page-link" href="#">Next</a></li>
//   </ul>
// </nav>
};
paginationRender ();