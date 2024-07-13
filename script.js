let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
let newsList = [];

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

// #################### menu ####################
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
const menus = document.querySelectorAll('.menus button');
let inputTxt = document.querySelector('#search-text');
let goButton = document.querySelector('#go-button')

menus.forEach((menu)=>menu.addEventListener("click", menuSlideOff));

menus.forEach(menu => menu.addEventListener("click", (event) => {getNewsByCategory(event)}))

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
  try{
    url.searchParams.set("page", page)
    // url.searchParams.set("pageSize", pageSize)

    const response = await fetch(url);
    const data = await response.json()
    if(response.status === 200) {
      if(data.articles.length < 1) {
        page = 0;
        totalPages = 0;
        paginationRender()
        throw new Error("No result for this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults
      render()
      paginationRender()
    } else {
      page = 0;
      totalPages = 0;
      paginationRender()
      throw new Error(data.message)
    }
  } catch (error) {
    errorRender(error.message);
    page = 0;
    totalPages = 0;
    paginationRender()
  }
}

const getLatestNews = async() => {
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  await getNews();
}


const getNewsByCategory = async(event) => {
  const category = event.target.textContent.toLowerCase();
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`)
  await getNews();
}

const getNewsByKeyword = async() => {
  const keyword = inputTxt.value;
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`)
  await getNews();
  inputTxt.value =""
}

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews()
}

// ########## api에서 받은 데이터를 이용하여 UI 변경 ##########
const render = () => {
  const newsHTML = newsList.map((news) =>
    { 
      return `<div class="row news"> 
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage || 'https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'}" onError="this.src='https://cdn.iconscout.com/icon/free/png-256/free-no-image-1771002-1505134.png'"/>
      </div>
      <div class="col-lg-8">
        <h2><a href="${news.url}" target="_blank">${news.title}</a></h2>
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

let errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
}

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  // console.log("totalPages: ",totalPages) // 20출력
  // console.log(totalResults) // 196 출력
  const pageGroup = Math.ceil(page / groupSize)
  let lastPage = pageGroup * groupSize;
  //console.log(lastPage, totalPages) 
  if(lastPage > totalPages) {
    lastPage = totalPages;
  }
  const firstPage = lastPage - (groupSize - 1) <= 0? 1 : lastPage - (groupSize - 1);
  let pagiNationHTML = ``;
  
  if(lastPage == totalPages) {
    pagiNationHTML = ``;
  } else if (1 < page) {
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(1)">
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
  if(lastPage == totalPages) {
    pagiNationHTML += ``;
  } else if (page < totalPages) {
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(${page+1})">
        <a class="page-link">
          <i class="xi-angle-right-min"></i>
          </a>
          </li>
          <li class="page-item" onclick="moveToPage(${totalPages})">
          <a class="page-link">
          <i class="xi-angle-right-min"></i>
          <i class="xi-angle-right-min"></i>
        </a>
      </li>`
  }
  document.querySelector(".pagination").innerHTML = pagiNationHTML;
}

getLatestNews ()