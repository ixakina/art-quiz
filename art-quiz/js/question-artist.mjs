import {
  data,
  chosenCategory,
  questionArtist,
  questionPicture,
  artistCardsList,
  showScore,
} from './category-cards.mjs';

import { firstScreen } from '../index.mjs';
import { answers } from './local-storage.mjs';
import { playAudio } from './audio.mjs';

const modalShowAnswer = document.querySelector('.modal-show-answer');
const imageQuestion = document.querySelector('.question-card__pic img');
const authorQuestionText = document.querySelector(
  '.question-pic .question__text'
);
const answerBtns = document.querySelectorAll('.answers__button');
const answerPictures = document.querySelectorAll('.question-pic__pictures img');

const nextQuestionBtn = document.querySelector('.modal-show-answer__button');
const gameOverModal = document.querySelector('.modal-game-over');
const scoreModalInfo = document.querySelector('.modal-game-over__score');

const gameOverHomeBtn = gameOverModal.querySelectorAll('button')[0];
const gameOverNextBtn = gameOverModal.querySelectorAll('button')[1];

const pagination = document.querySelectorAll('.pagination__dot');
const paginationArtist = document.querySelectorAll(
  '.question-artist .pagination__dot'
);
const paginationPic = document.querySelectorAll(
  '.question-pic .pagination__dot'
);

const paginationArrayArtist = Array.from(paginationArtist);
const paginationArrayPic = Array.from(paginationPic);

let questionNumber = 0;
let isTrueAnswer;

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let res = Math.floor(Math.random() * (max - min + 1)) + min;
  return res;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getRaundScore() {
  const res = await JSON.parse(localStorage.getItem('answers'));
  return res[chosenCategory - 1].filter((answer) => answer).length;
}

export async function renderQuestions() {
  const raundQuestions = await data.filter(
    (image) => image.category == chosenCategory
  );
  if (chosenCategory <= 12) {
    startArtistsQuis(raundQuestions);
  } else {
    startPicturesQuis(raundQuestions);
  }
}

function fillInModal(arrayQuestions, src) {
  modalShowAnswer.querySelector('img').src = src;
  modalShowAnswer.querySelector('.modal-show-answer__imageName').textContent =
    arrayQuestions[questionNumber].name;
  modalShowAnswer.querySelector(
    '.modal-show-answer__imageInfo'
  ).textContent = `${arrayQuestions[questionNumber].author}, ${arrayQuestions[questionNumber].year}`;
  modalShowAnswer.querySelector(
    '.modal-show-answer__indicator'
  ).style.background = `url('assets/icons/${isTrueAnswer}-answer.svg') center / cover no-repeat`;
}

function startArtistsQuis(arrayQuestions) {
  questionArtist.classList.remove('hide');

  const answersSet = new Set();

  imageQuestion.src = `https://raw.githubusercontent.com/ixakina/image-data/master/img/${arrayQuestions[questionNumber].imageNum}.jpg`;

  answersSet.add(arrayQuestions[questionNumber].author);

  while (answersSet.size < 4) {
    answersSet.add(data[`${getRandomNum(0, 240)}`].author);
  }

  let resultAnswers = Array.from(answersSet);
  shuffle(resultAnswers);

  for (let i = 0; i < 4; i++) {
    answerBtns[i].textContent = resultAnswers[i];
  }

  questionArtistTimer(questionArtist, arrayQuestions);

  answerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.target.textContent === arrayQuestions[questionNumber].author) {
        isTrueAnswer = true;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, imageQuestion.src);
        modalShowAnswer.classList.remove('hide');
        paginationArrayArtist[questionNumber].style.background = '#3dda69';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      } else {
        isTrueAnswer = false;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, imageQuestion.src);
        modalShowAnswer.classList.remove('hide');
        paginationArrayArtist[questionNumber].style.background = '#ff7e7e';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      }
    });
  });
}

function startPicturesQuis(arrayQuestions) {
  questionPicture.classList.remove('hide');

  authorQuestionText.textContent = `Автором какой картины является ${arrayQuestions[questionNumber].author}?`;

  const answersSet = new Set();
  const rightAnswerImageSrc = `https://raw.githubusercontent.com/ixakina/image-data/master/img/${arrayQuestions[questionNumber].imageNum}.jpg`;

  answersSet.add(rightAnswerImageSrc);

  while (answersSet.size < 4) {
    const randomImageSrc = `https://raw.githubusercontent.com/ixakina/image-data/master/img/${
      data[getRandomNum(0, 240)].imageNum
    }.jpg`;

    const randomAuthor = data[parseInt(randomImageSrc.match(/\d+/))].author;

    if (!(randomAuthor == arrayQuestions[questionNumber].author)) {
      answersSet.add(randomImageSrc);
    }
  }

  let resultAnswers = Array.from(answersSet);
  shuffle(resultAnswers);

  for (let i = 0; i < 4; i++) {
    answerPictures[i].src = resultAnswers[i];
  }

  answerPictures.forEach((pic) => {
    pic.addEventListener('click', (e) => {
      if (e.target.src === rightAnswerImageSrc) {
        isTrueAnswer = true;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, rightAnswerImageSrc);
        modalShowAnswer.classList.remove('hide');
        paginationArrayPic[questionNumber].style.background = '#3dda69';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      } else {
        isTrueAnswer = false;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, rightAnswerImageSrc);
        modalShowAnswer.classList.remove('hide');
        paginationArrayPic[questionNumber].style.background = '#ff7e7e';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      }
    });
  });
}

function questionArtistTimer(quizPage, arrayQuestions) {
  const questionTime = document.querySelector('.question__time');
  let time = localStorage.getItem('timerStep');
  let timer = localStorage.getItem('timer');

  if (timer == 'off') {
    return;
  }

  let interval = setInterval(gameTimer, 1000);
  gameTimer();

  function gameTimer() {
    questionTime.textContent = time < 10 ? `0 : 0${time}` : `0 : ${time}`;
    time--;

    quizPage.addEventListener('click', (e) => {
      if (
        e.target.textContent === arrayQuestions[questionNumber].author &&
        time > 0
      ) {
        clearInterval(interval);
        isTrueAnswer = true;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, imageQuestion.src);
        modalShowAnswer.classList.remove('hide');
        paginationArrayArtist[questionNumber].style.background = '#3dda69';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      } else if (
        e.target.textContent != arrayQuestions[questionNumber].author &&
        !e.target.classList.contains('.close-btn') &&
        time > 0
      ) {
        clearInterval(interval);
        isTrueAnswer = false;
        playAudio(`assets/audio/${isTrueAnswer}.wav`);
        fillInModal(arrayQuestions, imageQuestion.src);
        modalShowAnswer.classList.remove('hide');
        paginationArrayArtist[questionNumber].style.background = '#ff7e7e';
        answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
      } else {
        clearInterval(interval);
      }
    });

    if (time < 0) {
      clearInterval(interval);
      isTrueAnswer = false;
      playAudio(`assets/audio/${isTrueAnswer}.wav`);
      fillInModal(arrayQuestions, imageQuestion.src);
      modalShowAnswer.classList.remove('hide');
      paginationArrayArtist[questionNumber].style.background = '#ff7e7e';
      answers[chosenCategory - 1][questionNumber] = isTrueAnswer;
    }
  }
}

nextQuestionBtn.addEventListener('click', async () => {
  modalShowAnswer.classList.add('hide');
  questionNumber++;
  if (questionNumber < 10) {
    renderQuestions();
  } else {
    localStorage.setItem('answers', JSON.stringify(answers));
    playAudio(`assets/audio/end.wav`);
    scoreModalInfo.textContent = `${await getRaundScore()}/10`;
    gameOverModal.classList.remove('hide');
    questionNumber = 0;
    pagination.forEach((dot) => (dot.style.background = ''));
  }
});

gameOverHomeBtn.addEventListener('click', () => {
  gameOverModal.classList.add('hide');
  firstScreen.classList.remove('hide');
  if (chosenCategory <= 12) {
    questionArtist.classList.add('hide');
  } else {
    questionPicture.classList.add('hide');
  }
});

gameOverNextBtn.addEventListener('click', () => {
  gameOverModal.classList.add('hide');
  artistCardsList.classList.remove('hide');
  showScore();
  if (chosenCategory <= 12) {
    questionArtist.classList.add('hide');
  } else {
    questionPicture.classList.add('hide');
  }
});
