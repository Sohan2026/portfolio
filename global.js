console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "contact/", title: "Contact" },
    { url: "cv/", title: "CV" },
    {url: "https://github.com/Sohan2026", title: "GitHub"}
  ];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = !ARE_WE_HOME && !p.url.startsWith("http")
    ? "../" + p.url
    : p.url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = p.title;

    if (a.host !== location.host && !url.startsWith("")) {
        a.target = "_blank";
      }

    a.classList.toggle(
        "current",
        a.host === location.host && a.pathname === location.pathname
    );
    nav.append(a);
  }
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
      Theme:
      <select id="theme-select">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

  const select = document.querySelector(".color-scheme select");

  if ("colorScheme" in localStorage) {
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty("color-scheme", savedScheme);
    select.value = savedScheme;
  }
  select.addEventListener("input", function (event) {
    const newValue = event.target.value;
    document.documentElement.style.setProperty("color-scheme", newValue);
    localStorage.colorScheme = newValue;
  });
