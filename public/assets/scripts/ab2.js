    function ab() {
      let inFrame; try { inFrame = window !== top; } catch (e) { inFrame = true; }
      if (!inFrame && !navigator.userAgent.includes("Firefox")) { const popup = open("about:blank", "_blank"); if (!popup || popup.closed) { alert("Please allow popups and redirects."); } else { const doc = popup.document; const iframe = doc.createElement("iframe"); const style = iframe.style; const link = doc.createElement("link"); const name = localStorage.getItem("name") || "Home"; const icon = localStorage.getItem("icon") || "https://ssl.gstatic.com/classroom/favicon.png"; doc.title = name; link.rel = "icon"; link.href = icon; iframe.src = location.href; style.position = "fixed"; style.top = style.bottom = style.left = style.right = 0; style.border = style.outline = "none"; style.width = style.height = "100%"; doc.head.appendChild(link); doc.body.appendChild(iframe); location.replace("https://classroom.google.com"); } }
    }
    function buffedAB() {
      var myWindow1 = window.open(
        "",
        "myWindow1",
        "scrollbars=1,height=" + screen.availHeight + ",width=" + screen.availWidth,
      );
      myWindow1.document.write(
        '<!DOCTYPE html>\n\
<title>Classes</title>   <link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png"/><link rel="shortcut icon" href="https://ssl.gstatic.com/classroom/favicon.png"/>\n\
<p><iframe src="' +
        "https://" +
        window.location.host +
        '"frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%">\n\
<script>\n\
alert("");\n\
<\x2fscript>',
      );
      location.replace("https://classroom.google.com");
    }