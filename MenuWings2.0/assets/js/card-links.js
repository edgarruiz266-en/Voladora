// assets/js/card-links.js
(() => {
  // Lee el prefijo desde #sidebar-root (en index: data-base="menu/", en /menu/: data-base="")
  const base = (document.querySelector('#sidebar-root')?.getAttribute('data-base') || '').trim();

  // Une rutas evitando // dobles o / faltantes
  const join = (a, b) => {
    if (!a) return b || '';
    if (!b) return a || '';
    return a.replace(/\/+$/,'') + '/' + b.replace(/^\/+/,'');
  };

  // Todas las imágenes con data-link navegan (excepto las que abren modal)
  document.querySelectorAll('img[data-link]').forEach(img => {
    if (img.hasAttribute('data-modal')) return; // seguridad
    const href = img.getAttribute('data-link');
    if (!href) return;

    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      window.location.href = join(base, href);
    });

    // Accesibilidad con teclado
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click();
      }
    });
  });
})();
