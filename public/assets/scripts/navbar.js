    document.addEventListener("DOMContentLoaded", function () {
      const links = document.querySelectorAll('.sidebar-links li');
      const iframe = document.getElementById("main-frame");
      const settingsPanel = document.getElementById("settings-panel");

      links.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', () => {
          const url = link.getAttribute('data-url');

          document.querySelectorAll('.sidebar-links li').forEach(el => el.classList.remove('active'));
          link.classList.add('active');

          if (url === "/ezimotsuc/") {
            iframe.style.display = "none";
            settingsPanel.style.display = "block";
          } else {
            iframe.src = url;
            iframe.style.display = "block";
            settingsPanel.style.display = "none";
          }
        });
      });
    });