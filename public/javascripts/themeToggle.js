document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("themeToggle");
    const body = document.body;

    // Проверяем, есть ли сохранённая тема в localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggleBtn.textContent = "☀️";
    }

    themeToggleBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggleBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeToggleBtn.textContent = "🌙";
        }
    });
});
