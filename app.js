const joke = document.querySelector('.joke');
const btn = document.getElementById('btn');
const jokeParagraph = document.querySelector('.joke p');

//Getting data from api using fetch with async await syntax
btn.addEventListener('click', getRamdom);
getRamdom();
async function getRamdom() {
  const jokeRes = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  });
  const resJson = await jokeRes.json();
  jokeParagraph.innerHTML = resJson.joke;
}