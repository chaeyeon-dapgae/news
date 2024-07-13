const API_KEY = "062a34e0cdaa457d9e176b95056f3ded";
let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)

let newsList = [];
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

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

const getNews = async() => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url)
    const data = await response.json();
    if(response.status === 200 ) {
      if(data.articles.length < 1) {
        paginationRender ();
        throw new Error("No result for this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults
      render()
      paginationRender ();
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    // console.log("error", error.message);
    errorRender(error.message)
  }
}

const getLatestNews = async () => {
  page = 1;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  await getNews();
};

const getNewsByCategory = async(event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  await getNews();
}

const getNewsByKeyword = async() => {
  const keyword = inputTxt.value;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${keyword}&apiKey=${API_KEY}`)
  await getNews();
  inputTxt.value =""
}

const moveToPage = (pageNum) => {
  page = pageNum;
  window.scrollTo({top: 0, behavior: "smooth"});
  getNews();
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
  // page
  // pageSize
  // totalPage
  const totalPages = Math.ceil(totalResults / pageSize);
  // GroupSize
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize)
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막 페이지그룹이 그룹사이즈보다 작다? -> lastpage = totalPages
  if(lastPage > totalPages) {
    lastPage = totalPages;
  }
  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0? 1 : lastPage - (groupSize - 1);
  let pagiNationHTML = ``;

  if(1 < page){
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(${firstPage})">
        <a class="page-link">
          <i class="xi-angle-left-min"></i>
          <i class="xi-angle-left-min"></i>
        </a>
      </li>
      <li class="page-item" onclick="moveToPage(${page-1})">
        <a class="page-link">
          <i class="xi-angle-left-min"></i>
        </a>
      </li>`
  }
  for(let i = firstPage; i <= lastPage; i++) {
    pagiNationHTML += `<li class="page-item ${i===page?'active':''}"} onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }
  if (page < lastPage) {
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(${page-1})">
        <a class="page-link">
          <i class="xi-angle-right-min"></i>
          </a>
          </li>
          <li class="page-item" onclick="moveToPage(${lastPage})">
          <a class="page-link">
          <i class="xi-angle-right-min"></i>
          <i class="xi-angle-right-min"></i>
        </a>
      </li>`
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

getLatestNews();