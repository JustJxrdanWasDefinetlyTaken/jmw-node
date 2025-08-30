//////////////////////////////
///          Init          ///
//////////////////////////////
import { BareMuxConnection } from "/mux/index.mjs";

//////////////////////////////
///         Options        ///
//////////////////////////////
const connection = new BareMuxConnection("/mux/worker.js");

let wispURL;
let transportURL = "/epoxy/index.mjs";
let proxyOption;

export let tabCounter = 0;
export let currentTab = 0;
export let framesElement;
export let currentFrame;
export const addressInput = document.getElementById("address");

await import("/scram/scramjet.all.js");
		await import("/vu/uv.bundle.js");
		await import("/vu/uv.config.js");
const { ScramjetController } = window.$scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
	flags: {
		rewriterLogs: false,
		naiiveRewriter: false,
		scramitize: false,
	},
	siteFlags: {
		"https://www.google.com/(search|sorry).*": {
			naiiveRewriter: true,
		},
	},
});

scramjet.init();

//////////////////////////////
///           SW           ///
//////////////////////////////
const stockSW = "/sw.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Registers the service worker if supported and allowed.
 * @returns {Promise<void>}
 * @throws Will throw if service workers are unsupported or not HTTPS on disallowed hosts.
 */
async function registerSW() {
	if (!navigator.serviceWorker) {
		if (
			location.protocol !== "https:" &&
			!swAllowedHostnames.includes(location.hostname)
		)
			throw new Error("Service workers cannot be registered without https.");

		throw new Error("Your browser doesn't support service workers.");
	}

	await navigator.serviceWorker.register(stockSW);
}

if (window.self === window.top) {
	await registerSW();
	console.log("lethal.js: Service Worker registered");
}

//////////////////////////////
///        Functions       ///
//////////////////////////////

/**
 * Creates a valid URL from input or returns a search URL.
 * @param {string} input - The input string or URL.
 * @param {string} [template="https://search.brave.com/search?q=%s"] - Search URL template.
 * @returns {string} Valid URL string.
 */
export function makeURL(input, template = "https://search.brave.com/search?q=%s") {
	try {
		return new URL(input).toString();
	} catch (err) {}

	const url = new URL(`http://${input}`);
	if (url.hostname.includes(".")) return url.toString();

	return template.replace("%s", encodeURIComponent(input));
}

/**
 * Updates BareMux connection with current transport and wisp URLs.
 * @returns {Promise<void>}
 */
async function updateBareMux() {
	if (transportURL != null && wispURL != null) {
		console.log(`lethal.js: Setting BareMux to ${transportURL} and Wisp to ${wispURL}`);
		await connection.setTransport(transportURL, [{ wisp: wispURL }]);
	}
}

/**
 * Sets the wisp URL and updates BareMux.
 * @param {string} wisp - Wisp URL.
 * @returns {Promise<void>}
 */
export async function setWisp(wisp) {
	console.log(`lethal.js: Setting Wisp to ${wisp}`);
	wispURL = wisp;
	await updateBareMux();
}

/**
 * Gets the current wisp URL.
 * @returns {string | undefined}
 */
export function getWisp() {
	return wispURL;
}

/**
 * Sets the proxy backend option and dynamically imports scripts if needed.
 * @param {string} proxy - Proxy backend name.
 * @returns {Promise<void>}
 */
export async function setProxy(proxy) {
	console.log(`lethal.js: Setting proxy backend to ${proxy}`);
	if (proxy === "uv") {
		await import("/vu/uv.bundle.js");
		await import("/vu/uv.config.js");
	}
	proxyOption = proxy;
}

/**
 * Gets the current proxy backend option.
 * @returns {string | undefined}
 */
export function getProxy() {
	return proxyOption;
}

/**
 * Gets the proxied URL based on the current proxy option.
 * @param {string} input - The input URL or hostname.
 * @returns {Promise<string>}
 */
export async function getProxied(input) {
	const url = makeURL(input);
	if (proxyOption === "scram") return scramjet.encodeUrl(url);
	return window.__uv$config.prefix + window.__uv$config.encodeUrl(url);
}

/**
 * Sets the container element for frames.
 * @param {HTMLElement} frames - The frames container element.
 */
export function setFrames(frames) {
	framesElement = frames;
}

/**
 * Class representing a browser tab with its own iframe.
 */
export class Tab {
  /**
   * Creates a new tab with an iframe and appends it to frames container.
   */
  constructor() {
    tabCounter++;
    this.tabNumber = tabCounter;

    this.frame = document.createElement("iframe");
    this.frame.setAttribute(
      "style",
      "width: 99vw; height: 82vh; border: 0; position: fixed;",
    );
    this.frame.setAttribute("title", "Poxy Frame");
    this.frame.setAttribute("id", `frame-${tabCounter}`);
    this.frame.setAttribute("src", "/active/newtab.html");
    framesElement.appendChild(this.frame);

    this.switch();

    this.frame.addEventListener("load", () => this.handleLoad());

    document.dispatchEvent(
      new CustomEvent("new-tab", {
        detail: { tabNumber: tabCounter },
      }),
    );
  }

  /**
   * Switches to this tab, hiding other iframes and updating the address input.
   */
  switch() {
    currentTab = this.tabNumber;
    const frames = document.querySelectorAll("iframe");
    [...frames].forEach((frame) => frame.classList.add("hidden"));
    this.frame.classList.remove("hidden");

    currentFrame = document.getElementById(`frame-${this.tabNumber}`);

    try {
      addressInput.value = decodeURIComponent(
        this.frame?.contentWindow?.location.href.split("/").pop(),
      );

      if (this.frame.contentWindow?.location.href === "newtab.html") {
        addressInput.value = "jmw://newtab";
      }

    } catch { }

    document.dispatchEvent(
      new CustomEvent("switch-tab", {
        detail: { tabNumber: this.tabNumber },
      }),
    );
  }

  /**
   * Closes this tab by removing its iframe and dispatching a close event.
   */
  close() {
    this.frame.remove();

    document.dispatchEvent(
      new CustomEvent("close-tab", {
        detail: { tabNumber: this.tabNumber },
      }),
    );
  }

  /**
   * Handles iframe load event: updates history and address input.
   */
  handleLoad() {
    let url = decodeURIComponent(
      this.frame?.contentWindow?.location.href.split("/").pop(),
    );
    let title = this.frame?.contentWindow?.document.title;

    let history = localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history"))
      : [];
    history = [...history, { url, title }];
    localStorage.setItem("history", JSON.stringify(history));

    document.dispatchEvent(
      new CustomEvent("url-changed", {
        detail: { tabId: currentTab, title, url },
      }),
    );

    if (url === "newtab") url = "jmw://newtab";
    addressInput.value = url;
  }
}

/**
 * Creates a new tab.
 * @returns {Promise<void>}
 */
export async function newTab() {
	new Tab();
}

/**
 * Switches to the specified tab number.
 * @param {number} tabNumber - Tab number to switch to.
 */
export function switchTab(tabNumber) {
	const frames = document.querySelectorAll("iframe");
	[...frames].forEach((frame) => {
		frame.classList.toggle("hidden", frame.id !== `frame-${tabNumber}`);
	});

	currentTab = tabNumber;
	currentFrame = document.getElementById(`frame-${tabNumber}`);

	addressInput.value = decodeURIComponent(
		currentFrame?.contentWindow?.location.href.split("/").pop()
	);

	document.dispatchEvent(
		new CustomEvent("switch-tab", {
			detail: { tabNumber },
		}),
	);
}

/**
 * Closes the tab with the specified tab number.
 * @param {number} tabNumber - Tab number to close.
 */
export function closeTab(tabNumber) {
	const frames = document.querySelectorAll("iframe");
	[...frames].forEach((frame) => {
		if (frame.id === `frame-${tabNumber}`) {
			frame.remove();
		}
	});

	if (currentTab === tabNumber) {
		const otherFrames = document.querySelectorAll('iframe[id^="frame-"]');
		if (otherFrames.length > 0) {
			switchTab(parseInt(otherFrames[0].id.replace("frame-", "")));
		} else {
			newTab();
		}
	}

	document.dispatchEvent(
		new CustomEvent("close-tab", {
			detail: { tabNumber },
		}),
	);
}

window.registerSW = registerSW;
