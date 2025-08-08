"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await registerSW();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const url = search(address.value, "https://www.duckduckgo.com/?q=%s");

  sessionStorage.setItem("url", __uv$config.prefix + __uv$config.encodeUrl(url))
  location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});