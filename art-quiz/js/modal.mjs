export const closeModal = (e) => {
  e.target.closest('.modal').classList.add('hide');
};

export function showModal() {
  const modal = document.querySelector('.modal-close-game');
  modal.classList.remove('hide');
}

export function handleModalBtns(e) {
  const clickedBtn = e.target;
  const currentQuestionPages = document.querySelectorAll('.question-card');
  const firstScreen = document.querySelector('.first-screen');
  const cardsContainer = document.querySelector('.cards-wrapper');

  if (clickedBtn.textContent == 'Выход') {
    closeModal(e);
  } else if (clickedBtn.textContent == 'Да') {
    closeModal(e);

    currentQuestionPages.forEach((page) => {
      if (!page.classList.contains('hide')) {
        page.classList.add('hide');
      }
    });

    firstScreen.classList.remove('hide');
    cardsContainer.innerHTML = '';
  }
}
