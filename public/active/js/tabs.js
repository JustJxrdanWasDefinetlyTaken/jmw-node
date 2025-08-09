import { newTab, switchTab, closeTab } from "/cat.mjs";

window.newTab = newTab;
alert("a");
let tabs = [];
const tabsDiv = document.getElementById("tabs");

const getIcon = (url) =>
	/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(url)
		? `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL&size=64&url=${url}`
		: "/assets/images/jmw.png";

function createTab(id, title = "New Tab", url = "") {
	const tab = document.createElement("div");
	tab.dataset.tabId = id;
	tab.draggable = true;

	tab.innerHTML = `
    <img alt="Favicon" src="${getIcon(url)}" />
    <span class="tab">${title}</span>
    <button>&times;</button>
  `;

	tab.querySelector("button").onclick = (e) => {
		e.stopPropagation();
		closeTab?.(id);
	};
	tab.onclick = () => switchTab?.(id);

	tabsDiv?.appendChild(tab);
	tabs.push({ id, element: tab, title, url });

	return tab;
}

function checkState() {
	const frames = [...document.querySelectorAll('iframe[id^="frame-"]')];
	const frameIds = frames.map((f) => parseInt(f.id.replace("frame-", ""), 10));

	tabs = tabs.filter(({ id, element }) => {
		if (!frameIds.includes(id)) {
			element.remove();
			return false;
		}
		return true;
	});

	frameIds.forEach((id) => {
		if (!tabs.some((t) => t.id === id)) createTab(id);
	});

	const visible = frames.find((f) => !f.classList.contains("hidden"));
	if (visible) {
		const activeId = parseInt(visible.id.replace("frame-", ""), 10);
		tabs.forEach(({ id, element }) => {
			const isActive = id === activeId;
			element.classList.toggle("active", isActive);
		});
	}
}

document
	.getElementById("new-tab-btn")
	?.addEventListener("click", () => newTab?.());

document.addEventListener("new-tab", (e) => {
	if (!tabs.some((t) => t.id === e.detail.tabNumber))
		createTab(e.detail.tabNumber);
	checkState();
});

document.addEventListener("switch-tab", (e) => {
	const activeId = e.detail.tabNumber;
	tabs.forEach(({ id, element }) => {
		const isActive = id === activeId;
		element.classList.toggle("active", isActive);
	});
});

document.addEventListener("url-changed", (e) => {
	const tab = tabs.find((t) => t.id === e.detail.tabId);
	if (!tab) return;
	tab.title = e.detail.title || "New Tab";
	tab.url = e.detail.url || "";
	tab.element.querySelector(".tab").textContent = tab.title;
	tab.element.querySelector("img").src = getIcon(tab.url);
});

document.addEventListener("close-tab", (e) => {
	const idx = tabs.findIndex((t) => t.id === e.detail.tabNumber);
	if (idx === -1) return;
	tabs[idx].element.remove();
	tabs.splice(idx, 1);
	checkState();
});

checkState();

let dragged;

tabsDiv.addEventListener("dragstart", (e) => {
	dragged = e.target;
	e.target.style.opacity = "0.5";
});

tabsDiv.addEventListener("dragend", (e) => {
	e.target.style.opacity = "";
});

tabsDiv.addEventListener("dragover", (e) => {
	e.preventDefault();
	const afterElement = getDragAfterElement(tabsDiv, e.clientX);
	if (afterElement == null) {
		tabsDiv.appendChild(dragged);
	} else {
		tabsDiv.insertBefore(dragged, afterElement);
	}
});

function getDragAfterElement(container, x) {
	const draggableElements = [
		...container.querySelectorAll("[data-tab-id]:not(.dragging)"),
	];

	return draggableElements.reduce(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = x - box.left - box.width / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY },
	).element;
}
