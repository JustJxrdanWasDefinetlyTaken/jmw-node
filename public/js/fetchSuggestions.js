
self.onmessage = async function (e) {
  const query = e.data;

  if (!query) {
    self.postMessage([]);
    return;
  }

  try {
    const response = await fetch(
      `https://corsproxy.io/?url=https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    const suggestions = data.map(item => item.phrase);
    self.postMessage(suggestions);
  } catch (err) {
    self.postMessage([]);
  }
};
