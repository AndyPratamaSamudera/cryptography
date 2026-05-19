/**
 * RSA page logic.
 * Depends on: api.js (postJson, showToast, copyToClipboard, setLoading)
 */

(function () {
  'use strict';

  var btnGenerate = document.getElementById('btnGenerateKeys');
  var publicKeyOut = document.getElementById('publicKeyOut');
  var privateKeyOut = document.getElementById('privateKeyOut');
  var btnCopyPublic = document.getElementById('btnCopyPublic');
  var btnCopyPrivate = document.getElementById('btnCopyPrivate');

  var encPlainText = document.getElementById('encPlainText');
  var encPublicKey = document.getElementById('encPublicKey');
  var btnEncrypt = document.getElementById('btnEncrypt');
  var encOutput = document.getElementById('encOutput');
  var btnCopyCipher = document.getElementById('btnCopyCipher');

  var decCipherText = document.getElementById('decCipherText');
  var decPrivateKey = document.getElementById('decPrivateKey');
  var btnDecrypt = document.getElementById('btnDecrypt');
  var decOutput = document.getElementById('decOutput');
  var btnCopyPlain = document.getElementById('btnCopyPlain');

  btnGenerate.addEventListener('click', async function () {
    var restore = setLoading(btnGenerate);
    try {
      var data = await postJson('/api/rsa/generate-key-pair', {});
      publicKeyOut.value = data.publicKey;
      privateKeyOut.value = data.privateKey;
      encPublicKey.value = data.publicKey;
      decPrivateKey.value = data.privateKey;
      showToast('Key pair berhasil dibuat!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      restore();
    }
  });

  btnEncrypt.addEventListener('click', async function () {
    var restore = setLoading(btnEncrypt);
    try {
      var data = await postJson('/api/rsa/encrypt', {
        plainText: encPlainText.value,
        publicKey: encPublicKey.value,
      });
      encOutput.textContent = data.cipherTextBase64;
      showToast('Enkripsi berhasil!', 'success');
    } catch (e) {
      encOutput.textContent = '';
      showToast(e.message, 'error');
    } finally {
      restore();
    }
  });

  btnDecrypt.addEventListener('click', async function () {
    var restore = setLoading(btnDecrypt);
    try {
      var data = await postJson('/api/rsa/decrypt', {
        cipherTextBase64: decCipherText.value,
        privateKey: decPrivateKey.value,
      });
      decOutput.textContent = data.plainText;
      showToast('Dekripsi berhasil!', 'success');
    } catch (e) {
      decOutput.textContent = '';
      showToast(e.message, 'error');
    } finally {
      restore();
    }
  });

  btnCopyPublic.addEventListener('click', function () {
    copyToClipboard(publicKeyOut.value, 'Public Key');
  });
  btnCopyPrivate.addEventListener('click', function () {
    copyToClipboard(privateKeyOut.value, 'Private Key');
  });
  btnCopyCipher.addEventListener('click', function () {
    copyToClipboard(encOutput.textContent, 'Cipher Text');
  });
  btnCopyPlain.addEventListener('click', function () {
    copyToClipboard(decOutput.textContent, 'Plain Text');
  });

  var btnResetAll = document.getElementById('btnResetAll');
  if (btnResetAll) {
    btnResetAll.addEventListener('click', function () {
      publicKeyOut.value = '';
      privateKeyOut.value = '';
      encPlainText.value = '';
      encPublicKey.value = '';
      encOutput.textContent = '';
      decCipherText.value = '';
      decPrivateKey.value = '';
      decOutput.textContent = '';
      showToast('Semua field berhasil di-reset!', 'success');
    });
  }
})();
