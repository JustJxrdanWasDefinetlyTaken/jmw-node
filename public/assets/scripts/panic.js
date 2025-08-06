    var defaultHotkey = localStorage.getItem('hotkey') || '`';
    var redirectURL = localStorage.getItem('redirectURL') || 'https://google.com';

    window.addEventListener('DOMContentLoaded', function () {
      var hotkeyInput = document.getElementById('hotkey-input');
      var redirectURLInput = document.getElementById('redirect-url-input');
      var changeHotkeyButton = document.getElementById('change-hotkey-btn');
      var changeURLButton = document.getElementById('change-URL-btn');

      hotkeyInput.value = defaultHotkey;
      redirectURLInput.value = redirectURL;

      hotkeyInput.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (e.key.length === 1 || e.key === 'Escape' || e.key.startsWith('F')) {
          hotkeyInput.value = e.key;
        }
      });

      changeHotkeyButton.addEventListener('click', function () {
        var newHotkey = hotkeyInput.value.trim();
        if (newHotkey) {
          defaultHotkey = newHotkey;
          localStorage.setItem('hotkey', defaultHotkey);
          alert('Hotkey changed successfully to: ' + defaultHotkey);
        } else {
          alert('Enter a hotkey dummy.');
        }
      });

      changeURLButton.addEventListener('click', function () {
        var newURL = redirectURLInput.value.trim();

        if (newURL && !newURL.match(/^https?:\/\//i)) {
          newURL = 'https://' + newURL;
        }

        if (newURL && !newURL.match(/\.[a-z]{2,}$/i)) {
          newURL += '.com';
        }

        if (newURL) {
          redirectURL = newURL;
          localStorage.setItem('redirectURL', redirectURL);
          alert('Redirect URL changed successfully to: ' + redirectURL);
        } else {
          alert('Enter a valid URL idiot.');
        }
      });

      window.addEventListener('keydown', function (event) {
        if (event.key === defaultHotkey) {
          location.replace(redirectURL);
        }
      });
    });