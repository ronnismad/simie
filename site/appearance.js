// Apply persisted appearance before painting; no external resources are used.
try {
  const stored=localStorage.getItem('simie-theme');
  document.documentElement.dataset.theme=stored||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
} catch {document.documentElement.dataset.theme='light';}
