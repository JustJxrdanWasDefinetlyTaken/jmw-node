    const presets = {
      google: { title: "Google", favicon: "/assets/images/cloaks/gsearch.ico" },
      classroom: { title: "Home", favicon: "https://ssl.gstatic.com/classroom/favicon.png" },
      bing: { title: "Bing", favicon: "https://bing.com/favicon.ico" },
      nearpod: { title: "Nearpod", favicon: "https://nearpod.com/favicon.ico" },
      powerschool: { title: "PowerSchool Sign In", favicon: "https://powerschool.com/favicon.ico" },
      edge: { title: "New Tab", favicon: "/assets/images/newtabedge.png" },
      chrome: { title: "New Tab", favicon: "/assets/images/newtab.png" },
      lausd: { title: "Los Angeles Unified School District / Homepage", favicon: "https://www.lausd.org/cms/lib/CA01000043/Centricity/template/globalassets/images/favicon/favicon1.ico" }
    };

    const titleInput = document.getElementById("customTitle");
    const faviconInput = document.getElementById("customFavicon");
    const select = document.getElementById("presetSelect");

    function applySettings(title, favicon) {
      if (title) {
        document.title = title;
        localStorage.setItem("TabCloak_Title", title);
      }
      if (favicon) {
        const link = document.querySelector("link[rel~='icon']");
        if (link) link.href = favicon;
        localStorage.setItem("TabCloak_Favicon", favicon);
      }
    }

    document.getElementById("applyBtn").addEventListener("click", () => {
      applySettings(titleInput.value, faviconInput.value);
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      localStorage.removeItem("TabCloak_Title");
      localStorage.removeItem("TabCloak_Favicon");
      document.title = "Jordan's Math Work - V7";
      document.querySelector("link[rel~='icon']").href = "/assets/images/jmw.png";
      titleInput.value = "";
      faviconInput.value = "";
      select.value = "";
    });

    select.addEventListener("change", () => {
      const selected = presets[select.value];
      if (selected) {
        titleInput.value = selected.title;
        faviconInput.value = selected.favicon;
        applySettings(selected.title, selected.favicon);
      }
    });

    window.addEventListener("DOMContentLoaded", () => {
      const savedTitle = localStorage.getItem("TabCloak_Title");
      const savedFavicon = localStorage.getItem("TabCloak_Favicon");
      if (savedTitle) {
        document.title = savedTitle;
        titleInput.value = savedTitle;
      }
      if (savedFavicon) {
        const link = document.querySelector("link[rel~='icon']");
        if (link) link.href = savedFavicon;
        faviconInput.value = savedFavicon;
      }
    });