let news = [];
const getLatestNews = async() => {
  const url = new URL(`https://news-chaeyeon.netlify.app/top-headlines`);
  console.log("uuu", url)

  //URL 호출 하게 해주는 fetch함수
  const response = await fetch(url);
  const data = await response.json()
  //json은 파일 형식._텍스트이지만 객체처럼 생긴 타입 ex)png, jpeg
  news = data.articles
  console.log("rrr", news);
}

getLatestNews ()
