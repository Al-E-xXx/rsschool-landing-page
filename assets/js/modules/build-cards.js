async function loadProducts(filePath = './assets/json/products.json') {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`File upload error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to read JSON file:', error);
    throw error;
  }
}

function buildElement(tag = 'div', classes = [], attributes = {}, text = '', parent = null) {
  const element = document.createElement(tag);

  if (typeof classes === 'string') {
    classes.split(' ').forEach(function(cls) {
      if (cls.trim()) element.classList.add(cls.trim());
    });
  } else if (Array.isArray(classes)) {
    classes.forEach(function(cls) {
      if (cls) element.classList.add(cls);
    });
  }

  if (attributes && typeof attributes === 'object') {
    Object.keys(attributes).forEach(function(key) {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (text) {
    element.textContent = text;
  }

  if (parent) {
    parent.append(element);
  }

  return element;
}

function buildCard(product, index, parent = null, localIndex = 0) {
  const name = (product.name || '').trim();
  const description = (product.description || '').trim();
  const price = (product.price || '').trim();
  const src = (product.src || '').trim();

  const card = buildElement(
    'div',
    'goods__item',
    { 
      'data-index': index,
      'style': `animation-delay: ${localIndex * 0.1}s`
    },
    '',
    parent
  );

  const imgWrapper = buildElement('div', 'goods__img-wrapper', {}, '', card);
  buildElement('img', 'goods__img', {
    src: src,
    alt: 'a cup of ' + name
  }, '', imgWrapper);

  const contentWrapper = buildElement('div', 'goods__content-wrapper', {}, '', card);
  buildElement('h2', 'goods__title', {}, name, contentWrapper);
  buildElement('p', 'goods__description', {}, description, contentWrapper);
  buildElement('div', 'goods__price', {}, '$' + price, contentWrapper);

  return card;
}

function getIndexesByCategory(products, category) {
  const indexes = [];

  products.forEach(function(product, index) {
    const productCategory = (product['category'] || product['category '] || '').trim();

    if (productCategory === category.trim()) {
      indexes.push(index);
    }
  });

  return indexes;
}

function showGoods(products, indexes = null, category = null) {
  const container = document.getElementById('goods-wrapper');
  if (!container) return;

  let indexesToShow = [];
  if (category) {
    indexesToShow = getIndexesByCategory(products, category);
  } else if (indexes && Array.isArray(indexes)) {
    indexesToShow = indexes;
  } else {
    indexesToShow = products.map(function(_, index) { return index; });
  }

  container.innerHTML = '';

  // Передаём и глобальный index, и локальный localIndex
  indexesToShow.forEach(function(globalIndex, localIndex) {
    if (globalIndex >= 0 && globalIndex < products.length) {
      buildCard(products[globalIndex], globalIndex, container, localIndex);
    }
  });
}

function initOptions(products) {
  const optionsWrapper = document.getElementById('options-wrapper');

  if (!optionsWrapper) {
    console.error('Блок #options-wrapper не найден');
    return;
  }

  optionsWrapper.addEventListener('click', function(event) {
    const button = event.target.closest('.menu-section__option');

    if (!button) return;

    if (button.classList.contains('menu-section__option_active')) return;

    const category = button.dataset.optionName;

    const allButtons = optionsWrapper.querySelectorAll('.menu-section__option');
    allButtons.forEach(function(btn) {
      btn.classList.remove('menu-section__option_active');
    });

    button.classList.add('menu-section__option_active');

    showGoods(products, null, category);
  });
}

export async function initCards() {
  const products = await loadProducts();  
  
  // Default products: coffee
  showGoods(products, null, 'coffee');

  // Init Category Listener
  initOptions(products);
}