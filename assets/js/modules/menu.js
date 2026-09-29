const menuButton = document.querySelector('.header__mob-menu');
const menu = document.querySelector('.header__menu-wrapper');
const menuLinks = document.querySelectorAll('.header__menu-wrapper a');

const DESKTOP_BREAKPOINT = 768;
const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT + 1}px)`);

const resetMobileMenu = () => {
  menuButton.classList.remove('header__mob-menu_active');
  menu.classList.remove('header__menu-wrapper_show');
  document.body.classList.remove('modal-no-scroll');
};



export function initMenu() {
  menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('header__mob-menu_active');
    menu.classList.toggle('header__menu-wrapper_show');
    document.body.classList.toggle('modal-no-scroll');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      resetMobileMenu();
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      resetMobileMenu();
    });
  });
}