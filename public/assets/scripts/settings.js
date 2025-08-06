(() => {
  // === About:Blank Cloaking ===
  const isAboutBlankEnabled = localStorage.getItem("aboutBlank") === "enabled";
  const name = localStorage.getItem("name") || "Home";
  const icon = localStorage.getItem("icon") || "https://ssl.gstatic.com/classroom/favicon.png";

  if (isAboutBlankEnabled) {
    let inFrame;
    try { inFrame = window !== top; } catch { inFrame = true; }
    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
      const popup = open("about:blank", "_blank");
      if (!popup || popup.closed) {
        alert("To hide from goguardian and other blockers, allow popups and reload. By pressing ok, you agree to our TOS and Privacy Policy.");
      } else {
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        const link = doc.createElement("link");
        doc.title = name;
        link.rel = "icon";
        link.href = icon;
        iframe.src = location.href;
        style.position = "fixed";
        style.top = style.bottom = style.left = style.right = 0;
        style.border = style.outline = "none";
        style.width = style.height = "100%";
        doc.head.appendChild(link);
        doc.body.appendChild(iframe);
        location.replace("https://www.google.com/search?q=math+help");
      }
    }
  }

  // === Tab Cloak Presets ===
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

  // === Hotkey Redirect ===
  let defaultHotkey = localStorage.getItem('hotkey') || '`';
  let redirectURL = localStorage.getItem('redirectURL') || 'https://google.com';

  const hotkeyInput = document.getElementById('hotkey-input');
  const redirectURLInput = document.getElementById('redirect-url-input');
  const changeHotkeyButton = document.getElementById('change-hotkey-btn');
  const changeURLButton = document.getElementById('change-URL-btn');

  hotkeyInput.value = defaultHotkey;
  redirectURLInput.value = redirectURL;

  hotkeyInput.addEventListener('keydown', e => {
    e.preventDefault();
    if (e.key.length === 1 || e.key === 'Escape' || e.key.startsWith('F')) {
      hotkeyInput.value = e.key;
    }
  });

  changeHotkeyButton.addEventListener('click', () => {
    const newHotkey = hotkeyInput.value.trim();
    if (newHotkey) {
      defaultHotkey = newHotkey;
      localStorage.setItem('hotkey', defaultHotkey);
      alert('Hotkey changed successfully to: ' + defaultHotkey);
    } else {
      alert('Enter a hotkey dummy.');
    }
  });

  changeURLButton.addEventListener('click', () => {
    let newURL = redirectURLInput.value.trim();
    if (newURL && !/^https?:\/\//i.test(newURL)) newURL = 'https://' + newURL;
    if (newURL && !/\.[a-z]{2,}$/i.test(newURL)) newURL += '.com';
    if (newURL) {
      redirectURL = newURL;
      localStorage.setItem('redirectURL', redirectURL);
      alert('Redirect URL changed successfully to: ' + redirectURL);
    } else {
      alert('Enter a valid URL idiot.');
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === defaultHotkey) location.replace(redirectURL);
  });

  // === Tab Cloak Auto Load ===
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

  // === About:Blank Enable/Disable ===
const aboutBlankToggle = document.getElementById("aboutBlankToggle");

// Set initial toggle state
aboutBlankToggle.checked = localStorage.getItem("aboutBlank") === "enabled";

// Toggle handler
aboutBlankToggle.addEventListener("change", () => {
  const value = aboutBlankToggle.checked ? "enabled" : "disabled";
  localStorage.setItem("aboutBlank", value);
  location.reload();
});


  // === Leave Confirmation ===
  if (localStorage.getItem("leaveConfirmation") === "enabled") {
    window.onbeforeunload = () => "";
  }

  // === Blob Launcher ===
  window.launchBlob = () => {
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
  };

  // === Ad Script Controls ===
  const adScriptLink = "https://partner.senty.com.au/partner-db4bbf29.js";

  function enableAds() {
    if (!document.querySelector(`script[src="${adScriptLink}"]`)) {
      const script = document.createElement("script");
      script.src = adScriptLink;
      script.id = "adScript";
      document.body.appendChild(script);
    }
    localStorage.setItem("ads", "enabled");
    alert("Ads Enabled");
  }

  function disableAds() {
    const script = document.querySelector(`script[src="${adScriptLink}"]`);
    if (script) script.remove();
    localStorage.setItem("ads", "disabled");
    alert("Ads Disabled.. 😔💔🥀");
  }

  if (localStorage.getItem("ads") === "enabled") {
    enableAds();
  }

  document.getElementById("enableAds").addEventListener("click", enableAds);
  document.getElementById("disableAds").addEventListener("click", disableAds);
})();