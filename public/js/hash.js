/**
 * Hash page logic.
 * Depends on: api.js (postJson, showToast, copyToClipboard, setLoading)
 */

(function () {
  'use strict';

  var hashInput = document.getElementById('hashInput');
  var algorithm = document.getElementById('algorithm');
  var btnHash = document.getElementById('btnHash');
  var hashOutput = document.getElementById('hashOutput');
  var btnCopyHash = document.getElementById('btnCopyHash');

  btnHash.addEventListener('click', async function () {
    var restore = setLoading(btnHash);
    try {
      var data = await postJson('/api/hash', {
        plainText: hashInput.value,
        algorithm: algorithm.value,
      });
      hashOutput.textContent = data.hashHex;
      showToast('Hash berhasil dibuat!', 'success');
    } catch (e) {
      hashOutput.textContent = '';
      showToast(e.message, 'error');
    } finally {
      restore();
    }
  });

  btnCopyHash.addEventListener('click', function () {
    copyToClipboard(hashOutput.textContent, 'Hash');
  });
})();
