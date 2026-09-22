document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  toggleBtn.addEventListener('click', () => {
    // Проверяем текущее состояние атрибута на теге html
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});

