const filters = document.querySelectorAll(".header-filters");

filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        filters.forEach((box) => box.classList.add("hide-border"));
        filter.classList.remove("hide-border");
    });
});
