/**
 * Shared utilities — fetch wrapper, toast notifications, clipboard.
 */

/* ============================================================
   Toast Notification System
   ============================================================ */

/** Ensure the toast container exists in the DOM. */
function getToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration — ms before auto-dismiss
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = getToastContainer();

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = (icons[type] || '') + '<span>' + escapeHtml(message) + '</span>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('removing');
    toast.addEventListener('animationend', function () {
      toast.remove();
    });
  }, duration);
}

/* ============================================================
   Fetch Wrapper
   ============================================================ */

/**
 * POST JSON to the backend and return the `data` field.
 * Throws on network / API errors with a readable message.
 * @param {string} url
 * @param {object} body
 * @returns {Promise<object>}
 */
async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(function () {
    return {};
  });
  if (!res.ok || !json.success) {
    throw new Error(json.error || res.statusText || 'Request failed');
  }
  return json.data;
}

/* ============================================================
   Clipboard
   ============================================================ */

/**
 * Copy text to clipboard and show a toast.
 * @param {string} text
 * @param {string} label — friendly label for the toast, e.g. "Public Key"
 */
async function copyToClipboard(text, label) {
  if (!text || !text.trim()) {
    showToast('Tidak ada yang bisa disalin', 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast(label + ' berhasil disalin!', 'success');
  } catch (_e) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(label + ' berhasil disalin!', 'success');
  }
}

/* ============================================================
   Helpers
   ============================================================ */

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Set a button into loading state.
 * Returns a restore function to call when done.
 * @param {HTMLButtonElement} btn
 * @returns {() => void}
 */
function setLoading(btn) {
  const original = btn.innerHTML;
  const width = btn.offsetWidth;
  btn.style.minWidth = width + 'px';
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';
  return function restore() {
    btn.disabled = false;
    btn.innerHTML = original;
    btn.style.minWidth = '';
  };
}

/* ============================================================
   Sidebar toggle (mobile)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!hamburger || !sidebar) return;

  function toggleSidebar() {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  // Close sidebar when clicking a nav link (mobile)
  sidebar.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });
});
