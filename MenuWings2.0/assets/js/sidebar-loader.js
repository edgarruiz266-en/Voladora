// ============================
// 📁 assets/js/sidebar-loader.js
// ============================

async function loadSidebar(options = {}) {
  const {
    target = '#sidebar-root',
    src = new URL('../../partials/menu_lateral.html', import.meta.url).href,
  } = options;

  const root = document.querySelector(target);
  if (!root) {
    console.warn('⚠️ No se encontró el contenedor del menú lateral.');
    return;
  }

  try {
    const res = await fetch(src, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    root.innerHTML = html;
  } catch (err) {
    console.error('❌ Error al cargar el menú lateral:', err);
    return;
  }

  // Prefijo opcional para enlaces (si estás en subcarpetas)
  const base = root.getAttribute('data-base') || '';
  if (base) {
    root.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!/^https?:|^#|^mailto:/i.test(href)) {
        a.setAttribute('href', base + href);
      }
    });
  }

  // Interacción
  const menuBtn = root.querySelector('#menu-btn');
  const cerrarBtn = root.querySelector('#cerrar-btn');
  const menuLateral = root.querySelector('#menu-lateral');
  const flechaFlotante = document.querySelector('.flecha-flotante');

  const closeMenu = () => {
    if (!menuLateral) return;
    menuLateral.classList.remove('abierto');
    document.body.style.overflow = '';
    menuBtn?.setAttribute('aria-expanded', 'false');
    toggleArrowVisibility(); // Llamada al cerrar el menú
  };

  const toggleMenu = () => {
    if (!menuLateral) return;
    const isOpen = menuLateral.classList.toggle('abierto');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuBtn?.setAttribute('aria-expanded', String(isOpen));
    toggleArrowVisibility(); // Llamada al abrir/cerrar el menú
  };

  menuBtn?.addEventListener('click', toggleMenu);
  cerrarBtn?.addEventListener('click', closeMenu);

  root.querySelectorAll('.menu-lista a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', e => {
    if (
      menuLateral?.classList.contains('abierto') &&
      !menuLateral.contains(e.target) &&
      !menuBtn?.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Función para ocultar la flecha cuando se abre el menú lateral en móviles y tablets
  function toggleArrowVisibility() {
    const menuLateral = document.querySelector('#menu-lateral');
    const flechaFlotante = document.querySelector('.flecha-flotante');

    // Verifica el tamaño de la pantalla
    if (window.innerWidth <= 1024) { // Si el ancho es móvil o tablet (máximo 1024px)
      if (menuLateral.classList.contains('abierto')) {
        flechaFlotante.style.display = 'none'; // Oculta la flecha cuando el menú está abierto
      } else {
        flechaFlotante.style.display = 'flex'; // Muestra la flecha cuando el menú está cerrado
      }
    } else {
      flechaFlotante.style.display = 'flex'; // Siempre visible en pantallas grandes
    }
  }

  // Ejecuta la función cuando el menú se abre/cierra
  toggleArrowVisibility();
}

// Ejecuta
loadSidebar();
