const settingsPage = document.querySelector('.settings');
const settingsCloseBtn = settingsPage.querySelector('.header__btn-close');
const settingsOpenBtns = document.querySelectorAll('.settings-icon');
const saveBtn = settingsPage.querySelector('.save');
const defaultBtn = settingsPage.querySelector('.default');
export const volume = settingsPage.querySelector('.progress-volume');
export const timer = settingsPage.querySelector('.toggle-time__button');
export const timerStep = settingsPage.querySelector('.number');

settingsOpenBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    settingsPage.classList.remove('close');
  });
});

settingsCloseBtn.addEventListener('click', () => {
  settingsPage.classList.add('close');
});

timer.addEventListener('click', () => {
  timer.classList.toggle('on');
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem('volume', volume.value);
  localStorage.setItem('timer', timer.classList.contains('on') ? 'on' : 'off');
  localStorage.setItem('timerStep', timerStep.value);
});

defaultBtn.addEventListener('click', () => {
  localStorage.setItem('volume', '0');
  localStorage.setItem('timer', 'off');
  localStorage.setItem('timerStep', '5');
  volume.value = '0';
  timer.classList.remove('on');
  timerStep.value = '5';
});
