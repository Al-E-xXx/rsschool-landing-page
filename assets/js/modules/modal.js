import { lockScroll, unlockScroll } from './lock-scroll.js';
import { buildElement } from './build-element.js';

const overlay = document.getElementById('modal-overlay');
const closeButton = document.getElementById('modal-close-button');
const totalPrice = document.getElementById('modal-total-price');
const sizeButtons = document.querySelectorAll('#modal-size-options .modal__option');
const additiveButtons = document.querySelectorAll('#modal-additive-options .modal__option');

const picture = document.getElementById('modal-photo-wrapper');
const name = document.querySelector('.modal__title');
const description = document.querySelector('.modal__description');
const sizeS = document.getElementById('size-s');
const sizeSText = document.getElementById('size-s-text');
const sizeM = document.getElementById('size-m');
const sizeMText = document.getElementById('size-m-text');
const sizeL = document.getElementById('size-l');
const sizeLText = document.getElementById('size-l-text');
const additive1 = document.getElementById('additive-1');
const additive1Text = document.getElementById('additive-1-text');
const additive2 = document.getElementById('additive-2');
const additive2Text = document.getElementById('additive-2-text');
const additive3 = document.getElementById('additive-3');
const additive3Text = document.getElementById('additive-3-text');

const OPEN_CLASS = 'modal-overlay_open';
const ACTIVE_CLASS = 'modal__option_active';

export function openModal(data) {
  if (!data) return;

  lockScroll();
  overlay.classList.add(OPEN_CLASS);
  clearCard();
  fillCard(data);
}

function closeModal() {
  overlay.classList.remove(OPEN_CLASS);
  unlockScroll();
  clearCard();
}


function sumActivePrices(buttons) {
  let sum = 0;
  buttons.forEach(function (item) {
    if (item.classList.contains(ACTIVE_CLASS)) {
      sum += parseFloat(item.dataset.price);
    }
  });
  return sum;
}

function updateTotal() {
  const basePrice = +totalPrice.dataset.price;
  const total = basePrice + sumActivePrices(sizeButtons) + sumActivePrices(additiveButtons);
  totalPrice.textContent = total.toFixed(2);
}

function isModalOpen() {
  return overlay.classList.contains(OPEN_CLASS);
}

function clearCard() {
  picture.replaceChildren();
  name.textContent = '';
  description.textContent = '';
  sizeS.dataset.price = 0;
  sizeSText.textContent = '';
  sizeM.dataset.price = 0;
  sizeMText.textContent = '';
  sizeL.dataset.price = 0;
  sizeLText.textContent = '';
  additive1.dataset.price = 0;
  additive1Text.textContent = '';
  additive2.dataset.price = 0;
  additive2Text.textContent = '';
  additive3.dataset.price = 0;
  additive3Text.textContent = '';
  totalPrice.dataset.price = 0;
  totalPrice.textContent = (0).toFixed(2);

  sizeButtons.forEach(function (item) {
    item.classList.remove(ACTIVE_CLASS);
  });
  sizeButtons[0].classList.add(ACTIVE_CLASS);

  additiveButtons.forEach(function (item) {
    item.classList.remove(ACTIVE_CLASS);
  });
}

function fillCard(data) {
  if (!data) return;

  buildElement(
    'img',
    'modal__photo-img',
    { 
      'src': data.src,
      'alt': data.name
    },
    '',
    picture
  );

  name.textContent = data.name;
  description.textContent = data.description;

  sizeS.dataset.price = data.sizes.s['add-price'];
  sizeSText.textContent = data.sizes.s.size;

  sizeM.dataset.price = data.sizes.m['add-price'];
  sizeMText.textContent = data.sizes.m.size;

  sizeL.dataset.price = data.sizes.l['add-price'];
  sizeLText.textContent = data.sizes.l.size;

  additive1.dataset.price = data.additives[0]['add-price'];
  additive1Text.textContent = data.additives[0].name;

  additive2.dataset.price = data.additives[1]['add-price'];
  additive2Text.textContent = data.additives[1].name;

  additive3.dataset.price = data.additives[2]['add-price'];
  additive3Text.textContent = data.additives[2].name;
  
  totalPrice.dataset.price = Number(data.price);
  totalPrice.textContent = data.price;
}

function handleOverlayClick(event) {
  if (event.target === overlay) {
    closeModal();
  }
}

function handleCloseClick() {
  closeModal();
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isModalOpen()) {
    closeModal();
  }
}

function handleSizeClick(event) {
  const button = event.currentTarget;
  console.log(button.id);
  sizeButtons.forEach(function (item) {
    item.classList.remove(ACTIVE_CLASS);
  });
  button.classList.add(ACTIVE_CLASS);
  updateTotal();
}

function handleAdditiveClick(event) {
  const button = event.currentTarget;
  console.log(button.id);
  button.classList.toggle(ACTIVE_CLASS);
  updateTotal();
}

// Listeners
document.addEventListener('keydown', handleKeydown);
closeButton.addEventListener('click', handleCloseClick);
overlay.addEventListener('click', handleOverlayClick);

sizeButtons.forEach(function (button) {
  button.addEventListener('click', handleSizeClick);
});
additiveButtons.forEach(function (button) {
  button.addEventListener('click', handleAdditiveClick);
});