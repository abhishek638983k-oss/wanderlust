function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

const handleSearch = debounce(function (e) {
    const checkedTags = alltags();

    const pageTitle = document.title.toLocaleLowerCase();
    const params = new URLSearchParams();

    if (!pageTitle.includes("home")) {
        if (pageTitle.includes("stay")) {
            params.set("type", "stay");
        } else {
            params.set("type", "experience");
        }
    }

    checkedTags.forEach((tag) => {
        params.append("tags", tag);
    });

    const url = `/listings?${params.toString()}`;
    console.log("send", url);
    window.location.href = url;
}, 1000);

document.querySelectorAll('input[name="tags"]').forEach((element) => {
    // FIX: Pass the event 'e' explicitly into handleSearch
    element.addEventListener("click", (e) => {
        handleSearch(e);
    });
});

function alltags() {
    return Array.from(
        document.querySelectorAll('input[name="tags"]:checked'),
    ).map((cb) => cb.value.trim());
}

if (alltags().length) {
    document.getElementById("filter-togler").style.backgroundColor = "#ff5a5f";
    document.getElementById("filter-togler").style.color = "#fff";
}
