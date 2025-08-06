    if (localStorage.getItem("aboutBlank") !== "enabled") {
      let inFrame;
      try {
        inFrame = window !== top;
      } catch (e) {
        inFrame = true;
      }

      if (!inFrame && !navigator.userAgent.includes("Firefox")) {
        const popup = open("about:blank", "_blank");
        if (!popup || popup.closed) {
          alert("To hide from goguardian and other blockers, allow popups and reload. By pressing ok, you agree to our TOS and Privacy Policy.");
        } else {
          const doc = popup.document;
          const iframe = doc.createElement("iframe");
          const style = iframe.style;
          const link = doc.createElement("link");

          const name = localStorage.getItem("name") || "Home";
          const icon = localStorage.getItem("icon") || "https://ssl.gstatic.com/classroom/favicon.png";

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