    const enableBtn = document.getElementById('enableBtn');
    const disableBtn = document.getElementById('disableBtn');
    const overlay = document.getElementById('debugOverlay');
    const debugText = document.getElementById('debugText');
    const canvas = document.getElementById('fpsGraph');
    const ctx = canvas.getContext('2d');
    const minBtn = document.getElementById('minBtn');

    let debugActive = false;
    let minimized = false;
    let frames = 0;
    let fps = 0;
    let ping = 0;
    let cpu = 0;
    let lastTime = performance.now();
    let pingInterval;
    let fpsHistory = Array(canvas.width).fill(0);

    async function getPing() {
      const start = performance.now();
      try {
        await fetch('https://www.google.com/favicon.ico', {cache: 'no-store', mode:'no-cors'});
      } catch {}
      return Math.round(performance.now() - start);
    }

    function simulateCPU() {
      return Math.floor(10 + Math.random() * 30 + (fps < 50 ? 40 : 0));
    }

    function drawFPSGraph() {
      if (!debugActive || minimized) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#007aff';
      for (let i = 0; i < fpsHistory.length; i++) {
        const h = Math.min(fpsHistory[i], 60) * (canvas.height / 60);
        ctx.fillRect(i, canvas.height - h, 1, h);
      }
    }

    function fpsLoop() {
      if (!debugActive) return;
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        fps = frames;
        cpu = simulateCPU();
        lastTime = now;
        frames = 0;
        fpsHistory.push(fps);
        if (fpsHistory.length > canvas.width) fpsHistory.shift();
        drawFPSGraph();
        updateOverlay();
      }
      requestAnimationFrame(fpsLoop);
    }

    async function updatePing() {
      if (!debugActive) return;
      ping = await getPing();
      updateOverlay();
    }

    function updateOverlay() {
      if (!debugActive) return;
      debugText.textContent = `FPS: ${fps} | Ping: ${ping}ms | CPU: ${cpu}%`;
    }

    function startDebug() {
      if (debugActive) return;
      debugActive = true;
      overlay.style.display = 'block';
      fps = 0;
      ping = 0;
      cpu = 0;
      frames = 0;
      lastTime = performance.now();
      fpsHistory = Array(canvas.width).fill(0);
      fpsLoop();
      updatePing();
      pingInterval = setInterval(updatePing, 2000);
    }

    function stopDebug() {
      debugActive = false;
      overlay.style.display = 'none';
      clearInterval(pingInterval);
    }

    function toggleMinimize() {
      minimized = !minimized;
      canvas.style.display = minimized ? 'none' : 'block';
      minBtn.textContent = minimized ? 'Maximize' : 'Minimize';
      drawFPSGraph(); // update once on expand
    }

    enableBtn.onclick = startDebug;
    disableBtn.onclick = stopDebug;
    minBtn.onclick = toggleMinimize;