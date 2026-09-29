const SCROLL_LOCK_CLASS = 'modal-no-scroll';

let lockedScrollY = 0;

export function lockScroll() {
  lockedScrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.setProperty('--modal-scrollbar-width', scrollbarWidth + 'px');
  document.body.classList.add(SCROLL_LOCK_CLASS);
}

export function unlockScroll() {
  document.body.classList.remove(SCROLL_LOCK_CLASS);
  document.body.style.removeProperty('--modal-scrollbar-width');
  window.scrollTo(0, lockedScrollY);
}