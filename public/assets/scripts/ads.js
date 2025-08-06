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