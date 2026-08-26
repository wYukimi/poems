// List of available poems. Add a new entry here to add a poem to the site.
const poems = [
    { title: "Nature", file: "poems/nature.txt" },
    { title: "Bunny in Snowy Weather", file: "poems/bunny.txt" },
];

let currentPoem = null;

const libraryView = document.getElementById("library-view");
const poemView = document.getElementById("poem-view");
const poemList = document.getElementById("poem-list");
const poemCount = document.getElementById("poem-count");
const poemTitle = document.getElementById("poem-title");
const poemText = document.getElementById("poem-text");
const backButton = document.getElementById("back-button");

// Build the poem-slug used in the URL hash from a title.
function slugify(title) {
    return title.toLowerCase().trim().replace(/\s+/g, "-");
}

function renderLibrary() {
    poemList.innerHTML = "";

    poems.forEach((poem, i) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.className = "poem-entry";
        button.setAttribute("aria-label", `Open poem: ${poem.title}`);

        const index = document.createElement("span");
        index.className = "index";
        index.textContent = String(i + 1).padStart(2, "0");

        const marker = document.createElement("span");
        marker.className = "marker";
        marker.textContent = "›";

        const title = document.createElement("span");
        title.textContent = poem.title;

        button.append(index, marker, title);
        button.addEventListener("click", () => openPoem(poem));

        li.appendChild(button);
        poemList.appendChild(li);
    });

    poemCount.textContent = `${poems.length} poem${poems.length !== 1 ? "s" : ""}`;
}

function showLibrary() {
    currentPoem = null;
    poemView.hidden = true;
    libraryView.hidden = false;
    if (location.hash) history.pushState("", document.title, location.pathname + location.search);
}

function showPoemView() {
    libraryView.hidden = true;
    poemView.hidden = false;
    backButton.focus();
}

async function openPoem(poem) {
    currentPoem = poem;
    poemTitle.textContent = poem.title;
    poemText.textContent = "";
    poemText.classList.remove("error");
    location.hash = slugify(poem.title);
    showPoemView();

    // Note: fetch() on local files may be blocked by the browser's
    // file:// security policy. Serve this project through a local
    // server (or GitHub Pages) for the poems to load correctly.
    try {
        const response = await fetch(poem.file);
        if (!response.ok) throw new Error("Not found");
        poemText.textContent = await response.text();
    } catch (err) {
        poemText.textContent = "Unable to load this poem.";
        poemText.classList.add("error");
    }
}

function openFromHash() {
    const slug = location.hash.slice(1);
    if (!slug) {
        showLibrary();
        return;
    }
    const poem = poems.find(p => slugify(p.title) === slug);
    if (poem) {
        openPoem(poem);
    } else {
        showLibrary();
    }
}

backButton.addEventListener("click", showLibrary);
window.addEventListener("hashchange", openFromHash);

renderLibrary();
openFromHash();
