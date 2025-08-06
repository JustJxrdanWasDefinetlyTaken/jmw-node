    function launchBlob() {
      const host = location.host;
      const frame = `<iframe src="https://${host}/index.html" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>`;
      const blob = new Blob([frame], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      if (win) {
        win.onload = () => {
          win.document.title = "Inbox (100) - GMail";
          const link = win.document.createElement('link');
          link.rel = 'icon';
          link.href = `https://${host}/assets/images/cloaks/gmail.ico`;
          win.document.head.appendChild(link);
        };
      }
    }