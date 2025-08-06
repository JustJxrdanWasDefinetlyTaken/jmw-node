(() => {
  const btnLaunch     = document.getElementById('createSession');
  const btnEnd        = document.getElementById('endSessionBtn');
  const frameBox      = document.getElementById('iframeContainer');
  const vmFrame       = document.getElementById('hyperFrame');
  const countdownTxt  = document.getElementById('countdown');
  const statusTxt     = document.getElementById('status');
  const bottomBar     = document.getElementById('bottomBar');
  const fullScreenBtn = document.getElementById('fc');
  const launchScreen  = document.getElementById('launchScreen');

  const API_URL = 'https://virtualmachinethingy.brawlstarrer6.workers.dev';
  const MAX_SESSION_SECONDS = 810;
  const MIN_LAUNCH_INTERVAL_MS = 60000;
  const MAX_DAILY_SESSIONS = 10;

  let countdownId = null;
  let sessionId = null;

  const ui = {
    setStatus: msg => { statusTxt.textContent = msg; statusTxt.style.display = 'block'; },
    clearStatus: () => statusTxt.style.display = 'none',
    setLaunchBtn: (txt, disabled = false) => { btnLaunch.textContent = txt; btnLaunch.disabled = disabled; },
    showPlayerUI: () => { frameBox.style.display = 'block'; launchScreen.style.display = 'none'; bottomBar.style.display = 'flex'; fullScreenBtn.style.display = 'block'; },
    resetUI: () => { frameBox.style.display = 'none'; bottomBar.style.display = 'none'; fullScreenBtn.style.display = 'none'; launchScreen.style.display = 'block'; },
    fmtTime: sec => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`
  };

  const storage = {
    lastLaunch: () => +localStorage.getItem('vm_last_launch') || 0,
    setLaunch: () => localStorage.setItem('vm_last_launch', Date.now().toString()),
    dailyCount: () => +(JSON.parse(localStorage.getItem('vm_daily') || '{"date":0,"count":0}').count),
    bumpDaily: () => {
      const today = new Date().toLocaleDateString('en-CA');
      const data = JSON.parse(localStorage.getItem('vm_daily') || '{"date":0,"count":0}');
      const obj = data.date === today ? { date: today, count: data.count + 1 } : { date: today, count: 1 };
      localStorage.setItem('vm_daily', JSON.stringify(obj));
    }
  };

  async function killSession() {
    if (!sessionId) return;
    ui.setStatus('Ending session…');
    try {
      await fetch(`${API_URL}/kill-vm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch {}
    clearInterval(countdownId);
    sessionId = null;
    ui.setStatus('Session ended');
    setTimeout(() => location.reload(), 1200);
  }

  function beginCountdown(sec = MAX_SESSION_SECONDS) {
    countdownTxt.textContent = ui.fmtTime(sec);
    countdownTxt.style.color = '';
    countdownId = setInterval(() => {
      sec--;
      countdownTxt.textContent = ui.fmtTime(sec);
      if (sec <= 60) countdownTxt.style.color = '#ff6b6b';
      if (sec <= 0) killSession();
    }, 1000);
  }

  btnLaunch.addEventListener('click', async () => {
    const now = Date.now();
    if (now - storage.lastLaunch() < MIN_LAUNCH_INTERVAL_MS) {
      ui.setStatus('Slow down — wait a minute between launches.');
      return;
    }
    if (storage.dailyCount() >= MAX_DAILY_SESSIONS) {
      ui.setStatus('Daily session limit reached.');
      return;
    }

    ui.setLaunchBtn('Launching…', true);
    ui.clearStatus();

    try {
      const res = await fetch(`${API_URL}/start-vm`);
      const data = await res.json();

      if (data.error || !data.session_id) {
        ui.setStatus(`Error: ${data.error || 'Unknown'}`);
        ui.setLaunchBtn('Try again', false);
        return;
      }

      sessionId = data.session_id;
      vmFrame.src = data.embed_url;
      storage.setLaunch();
      storage.bumpDaily();
      ui.showPlayerUI();
      beginCountdown();

      vmFrame.onload = ui.clearStatus;
    } catch {
      ui.setStatus('No sessions available.');
      ui.setLaunchBtn('Launch VM', false);
    }
  });

  btnEnd.addEventListener('click', killSession);

  window.addEventListener('beforeunload', () => {
    if (sessionId) navigator.sendBeacon(`${API_URL}/kill-vm`, JSON.stringify({ sessionId }));
  });

  fullScreenBtn.addEventListener('click', () => {
    const elem = vmFrame;
    if (!document.fullscreenElement) elem.requestFullscreen().catch(e => alert(e.message));
    else document.exitFullscreen();
  });
})();