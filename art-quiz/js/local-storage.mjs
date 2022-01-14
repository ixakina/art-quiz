import { volume, timer, timerStep } from './settings.mjs';

export let answers;

export async function initLocalStorage() {
  if (localStorage.getItem('answers')) {
    answers = JSON.parse(localStorage.getItem('answers'));
  } else {
    answers = [];
    for (let i = 0; i < 24; i++) {
      answers.push([]);
    }
  }

  if (localStorage.getItem('volume')) {
    volume.value = localStorage.getItem('volume');
  } else {
    localStorage.setItem('volume', '0');
    volume.value = localStorage.getItem('volume');
  }

  if (localStorage.getItem('timer')) {
    localStorage.getItem('timer') === 'on'
      ? timer.classList.add(localStorage.getItem('timer'))
      : timer.classList.remove(localStorage.getItem('timer'));
  } else {
    localStorage.setItem('timer', 'off');
  }

  if (localStorage.getItem('timerStep')) {
    timerStep.value = localStorage.getItem('timerStep');
  } else {
    localStorage.setItem('timerStep', '5');
    timerStep.value = localStorage.getItem('timerStep');
  }
}

initLocalStorage();
