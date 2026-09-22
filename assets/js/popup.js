(function () {
  // Inject styles once
  if (!document.getElementById('popup-styles')) {
    const style = document.createElement('style');
    style.id = 'popup-styles';
    style.textContent = `
      .popup {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 40px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        padding: 40px;
        box-sizing: border-box;
        overflow: auto;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .popup.popup--visible {
        opacity: 1;
        transform: scale(1);
      }
    `;
    document.head.appendChild(style);
  }

  function showPopup(content) {
    // Оверлей
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100vw',
      'height:100vh',
      'background:rgba(0,0,0,0.5)',
      '-webkit-backdrop-filter:blur(8px)',
      'backdrop-filter:blur(8px)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'z-index:9999',
      'opacity:0',
      'transition:opacity 0.4s ease'
    ].join(';');

    // Popup
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Крестик
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = [
      'position:absolute',
      'top:15px',
      'right:20px',
      'width:36px',
      'height:36px',
      'line-height:34px',
      'text-align:center',
      'font-size:28px',
      'color:#555',
      'cursor:pointer',
      'border-radius:50%',
      'user-select:none',
      'transition:background 0.2s ease, color 0.2s ease'
    ].join(';');
    closeBtn.onmouseenter = function () {
      closeBtn.style.background = 'rgba(0,0,0,0.1)';
      closeBtn.style.color = '#000';
    };
    closeBtn.onmouseleave = function () {
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = '#555';
    };

    // Контент
    const body = document.createElement('div');
    body.style.cssText = 'width:100%;height:100%;overflow:auto;';
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof Node) {
      body.appendChild(content);
    }

    popup.appendChild(closeBtn);
    popup.appendChild(body);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Плавное появление
    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
      popup.classList.add('popup--visible');
    });

    // Закрытие
    function close() {
      overlay.style.opacity = '0';
      popup.classList.remove('popup--visible');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 400);
    }

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });

    // Клик по оверлею (но не по самому окну)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    // ESC
    const escHandler = function (e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return { close: close, overlay: overlay, popup: popup };
  }

  // Экспонируем глобально
  window.showPopup = showPopup;
})();


showPopup(`
    <h2 class="popup-h2">
    Уважаемый Reviewer1!<br>
    Наша чудесная кофейня откроется только завтра(
    </h2>
    <h3 class="popup-h3">Но если вам не терпится оценить полуфабрикат, а не настоящий кофе, приготовленный не самыми плохими в RSS барристами, то как я могу вам помешать?)</h3>
    `
);