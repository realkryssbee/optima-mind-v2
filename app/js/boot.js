const fallback = document.getElementById('boot-fallback');
const app = document.getElementById('app');

if (fallback && app) {
  const reveal = () => {
    if (!app.children.length) fallback.hidden = false;
  };
  const timer = window.setTimeout(reveal, 4000);
  const observer = new MutationObserver(() => {
    if (app.children.length) {
      fallback.hidden = true;
      window.clearTimeout(timer);
      observer.disconnect();
    }
  });
  observer.observe(app, { childList: true });

  fallback.querySelector('[data-boot-reload]')?.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', Date.now().toString());
    window.location.replace(url.toString());
  });
}
