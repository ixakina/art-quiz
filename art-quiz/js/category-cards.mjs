import { renderQuestions } from './question-artist.mjs';
import { firstScreen } from '../index.mjs';

export const cardsContainer = document.querySelector('.cards-wrapper');
export const artistCardsList = document.querySelector('.artists');
export const questionArtist = document.querySelector('.question-artist');
export const questionPicture = document.querySelector('.question-pic');
const scorePage = document.querySelector('.score');
const scorePicturesContainer = document.querySelector('.score__cards-wrapper');
const homeBtnFromScore = scorePage.querySelector('.btn_home');
const categoryBtnFromScore = scorePage.querySelector('.btn_category');

const url =
  'https://raw.githubusercontent.com/ixakina/image-data/master/images.json';

export let chosenCategory;
export const data = await renderData();

export function createCategoryCard() {
  const card = document.createElement('div');
  card.classList = 'artists__card';
  card.innerHTML = `
    <div class="card__header">
        <span class="card__title">Category <span class="category-number"></span></span>
        <span class="card__score"></span>
    </div>
    <div class="card__pic">
    <img src="" alt="">
    </div>
    <button class="card__button">Счет</button>
`;
  return card;
}

export function insertCards() {
  cardsContainer.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    cardsContainer.append(createCategoryCard());
  }
}

export function addCategoryCardTitles() {
  const titles = document.querySelectorAll('.category-number');
  for (let i = 0; i < 12; i++) {
    titles[i].textContent = i + 1;
  }
}

export function addImageCardSrc(first, last) {
  const images = cardsContainer.querySelectorAll('img');
  for (let i = first, j = 0; i < last, j < 12; i++, j++) {
    const categoryImages = data.filter((image) => image.category == i + 1);
    images[
      j
    ].src = `https://raw.githubusercontent.com/ixakina/image-data/master/img/${categoryImages[0].imageNum}.jpg`;
  }
}

export function showScore() {
  const categoryCards = document.querySelectorAll('.artists__card');
  categoryCards.forEach((card) => {
    const scoreBtn = card.querySelector('.card__button');
    const score = card.querySelector('.card__score');
    const imgContainer = card.querySelector('.card__pic');

    const numImage = parseInt(card.querySelector('img').src.match(/\d+/));
    const categoryCard = data[numImage].category;
    const localStorageAnswers = JSON.parse(localStorage.getItem('answers'));
    if (
      localStorage.getItem('answers') &&
      localStorageAnswers[categoryCard - 1].length === 10
    ) {
      let trueAnswers = 0;
      localStorageAnswers[categoryCard - 1].forEach((item) => {
        if (item == true) trueAnswers++;
      });
      score.textContent = `${trueAnswers}/10`;
      scoreBtn.style.display = 'block';
      imgContainer.style.filter = 'grayscale(0%)';
    }
  });
}

function createScorePage() {
  scorePicturesContainer.innerHTML = '';

  scorePage.classList.remove('hide');
  const categoryImages = data.filter(
    (image) => image.category == chosenCategory
  );

  for (let i = 0; i < categoryImages.length; i++) {
    const pictureContainer = document.createElement('div');
    pictureContainer.classList = 'score__card';
    pictureContainer.innerHTML = `
    <img src="https://raw.githubusercontent.com/ixakina/image-data/master/img/${categoryImages[i].imageNum}.jpg" alt="">
    <div class="card__info">
        <span class="info__name">${categoryImages[i].name}</span>
        <span class="info__author">${categoryImages[i].author}, ${categoryImages[i].year}</span>
    </div>
    `;
    scorePicturesContainer.append(pictureContainer);
  }

  const pictures = document.querySelectorAll('.score__card');
  const localStorageRaundAnswers = JSON.parse(localStorage.getItem('answers'))[
    chosenCategory - 1
  ];

  localStorageRaundAnswers.forEach((answer, i, arr) => {
    if (arr[i]) {
      pictures[i].style.filter = 'grayscale(0%)';
    }
  });

  pictures.forEach((picture) => {
    picture.addEventListener('click', () => {
      const picInfo = picture.querySelector('.card__info');
      picInfo.classList.toggle('show');
    });
  });
}

async function getFetchData() {
  const responce = await fetch(url);
  const data = await responce.json();
  return data;
}

export async function renderData() {
  const data = await getFetchData();
  return data;
}

export async function defineCategory(e) {
  let clickedcategory = e.target
    .closest('.artists__card')
    .querySelector('img').src;
  let numImage = parseInt(clickedcategory.match(/\d+/));

  chosenCategory = data[numImage].category;
  return chosenCategory;
}

cardsContainer.addEventListener('click', (e) => {
  defineCategory(e);
  artistCardsList.classList.add('hide');

  if (e.target.classList.contains('card__button')) {
    scorePage.classList.remove('hide');
    createScorePage();
  } else {
    renderQuestions();
  }
});

homeBtnFromScore.addEventListener('click', () => {
  scorePage.classList.add('hide');
  firstScreen.classList.remove('hide');
});

categoryBtnFromScore.addEventListener('click', () => {
  scorePage.classList.add('hide');
  artistCardsList.classList.remove('hide');
});
