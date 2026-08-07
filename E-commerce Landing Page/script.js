const themeBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
}
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙";
    }
});

const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookie");
const declineBtn = document.getElementById("decline-cookie");

if (localStorage.getItem("cookieAccepted")) {
    cookieBanner.style.display = "none";
}

acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.style.display = "none";
});

declineBtn.addEventListener("click", () => {
    cookieBanner.style.display = "none";

});