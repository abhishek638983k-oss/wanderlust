const filters = document.querySelectorAll(".header-filters");

// Uses RegEx to case-insensitively find "Wanderlust" or "Wonderlust",
// followed by a colon and any spaces, and removes it.
const currentTitle = document.title
    .replace(/w[a|o]nderlust\s*:\s*/i, "")
    .trim();

function filterUnderline(currFilter) {
    if (!currFilter) return;
    filters.forEach((box) => box.classList.add("hide-border"));
    currFilter.classList.remove("hide-border");
}

const actionsByTitle = {
    experience: () =>
        filterUnderline(document.getElementById("experienceListing")),
    Home: () => filterUnderline(document.getElementById("allListing")),
    stay: () => filterUnderline(document.getElementById("stayListing")),
};

if (currentTitle in actionsByTitle) {
    actionsByTitle[currentTitle]();
}
