// assets/js/modal-alitas.js
(() => {
  // Lee el prefijo desde #sidebar-root para construir rutas relativas correctas.
  // En index.html (raíz): data-base="menu/"
  // En páginas dentro de /menu/: data-base=""
  const base = (document.querySelector('#sidebar-root')?.getAttribute('data-base') || '').trim();

  // Helper para unir rutas evitando dobles o faltantes de "/"
  const join = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    return a.replace(/\/+$/,'') + '/' + b.replace(/^\/+/,'');
  };

  // Rutas de destino según la opción elegida en el modal
  const routes = {
    alitas:   join(base, 'alitas.html'),
    boneless: join(base, 'boneless.html'),
    mixto:    join(base, 'mixto.html'),
  };

  // --- Modal
  const overlay  = document.getElementById('alitas-modal');
  const hasModal = !!overlay;

  // Si la página no tiene el modal (por ejemplo alguna subpágina), no hacemos nada más.
  if (!hasModal) return;

  const btnClose = overlay.querySelector('[data-close]');
  const items    = overlay.querySelectorAll('.modal-item');

  const openModal = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  // Cerrar modal por fondo / botón / ESC
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  btnClose?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Botones del modal -> redirección según selección
  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = btn.dataset.opt; // 'alitas' | 'boneless' | 'mixto'
      const url = routes[opt];
      if (url) window.location.href = url;
    });
  });

  // --- Disparadores para abrir el modal

  // 1) Imagen de alitas del index (marca esa img con data-modal="alitas")
  document.querySelectorAll('[data-modal="alitas"], img[src*="alitas.png"]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      // Si la imagen también tiene un enlace, evitamos navegar
      e.preventDefault?.();
      openModal();
    });
  });

  // 2) Opción del menú lateral “ALITAS Y BONELESS”
  //    En tu partial, agrega data-modal-trigger="alitas" al <a> correspondiente.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-modal-trigger="alitas"]');
    if (!a) return;
    e.preventDefault();   // No navegar, mostramos el modal
    openModal();
  });

  // Exponer funciones por si necesitas abrir/cerrar desde otros scripts
  window.openAlitasModal = openModal;
  window.closeAlitasModal = closeModal;
})();
