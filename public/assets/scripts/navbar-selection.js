const select = document.getElementById("navbar-select");
const savedLayout = localStorage.getItem("navbarLayout") || "side";
const currentPath = window.location.pathname;

select.value = savedLayout;

select.addEventListener("change", () => {
  const layout = select.value;
  localStorage.setItem("navbarLayout", layout);

  if (layout === "top" && !currentPath.includes("top-nav")) {
    window.location.href = "/top-nav.html";
  } else if (layout === "side" && currentPath.includes("top-nav")) {
    window.location.href = "/";
  }
});

if (savedLayout === "top" && !currentPath.includes("top-nav")) {
  window.location.href = "/top-nav.html";
} else if (savedLayout === "side" && currentPath.includes("top-nav")) {
  window.location.href = "/";
}
