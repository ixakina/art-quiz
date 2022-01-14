import {
  cardsContainer,
  insertCards,
  addCategoryCardTitles,
  addImageCardSrc,
  showScore,
} from './js/category-cards.mjs';
import { showModal, closeModal, handleModalBtns } from './js/modal.mjs';

const chooseQuisBtns = document.querySelectorAll('.first-screen_button');
const closeModalBtns = document.querySelectorAll('.modal__close-btn');
const modalBtnsContainer = document.querySelector('.modal__buttons');
const closeQuestionCardBtns = document.querySelectorAll(
  '.question-card__close-btn'
);

const homeBtn = document.querySelector('.header__btn');

export const firstScreen = document.querySelector('.first-screen');
const artistCardsList = document.querySelector('.artists');

chooseQuisBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    insertCards();
    addCategoryCardTitles();
    firstScreen.classList.add('hide');
    artistCardsList.classList.remove('hide');
    if (btn.classList.contains('artist-quize-btn')) {
      addImageCardSrc(0, 12);
    } else {
      addImageCardSrc(12, 24);
    }
    showScore();
  });
});

homeBtn.addEventListener('click', () => {
  cardsContainer.innerHTML = '';
  artistCardsList.classList.add('hide');
  firstScreen.classList.remove('hide');
});

closeQuestionCardBtns.forEach((btn) => {
  btn.addEventListener('click', showModal);
});

closeModalBtns.forEach((btn) => {
  btn.addEventListener('click', closeModal);
});

modalBtnsContainer.addEventListener('click', (e) => {
  cardsContainer.innerHTML = '';
  handleModalBtns(e);
});
