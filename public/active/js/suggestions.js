const addressInput = document.getElementById("address");
const suggestionsContainer = document.getElementById("suggestions-container");
const suggestionsList = document.getElementById("suggestions-list");
const form = document.getElementById("form");

let currentHighlightedIndex = -1;
const worker = new Worker('/js/fetchSuggestions.js', { type: 'module' });

const fetchSuggestions = (query) => {
    return new Promise((resolve) => {
        const handleMessage = (event) => {
            worker.removeEventListener("message", handleMessage);
            resolve(event.data);
        };
        worker.addEventListener("message", handleMessage);
        worker.postMessage(query);
    });
};

const renderSuggestions = (suggestions) => {
    suggestionsList.innerHTML = "";
    currentHighlightedIndex = -1;

    if (suggestions.length === 0) {
        suggestionsContainer.classList.add("hidden");
        return;
    }

    suggestionsList.innerHTML = suggestions
        .map(
            (item, index) => `
            <li class="p-2 cursor-pointer hover:bg-gray-700 text-gray-100" data-index="${index}">
              ${item}
            </li>
          `
        )
        .join("");

    suggestionsList.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", (e) => {
            e.preventDefault();
            addressInput.value = li.textContent.trim();
            suggestionsContainer.classList.add("hidden");
            form.dispatchEvent(new Event("submit"));
            addressInput.blur();
        });
    });

    suggestionsContainer.classList.remove("hidden");
};

const highlightSuggestion = (index) => {
    const items = [...suggestionsList.children];
    if (items.length === 0) return;

    if (currentHighlightedIndex > -1 && items[currentHighlightedIndex]) {
        items[currentHighlightedIndex].classList.remove("bg-gray-700");
    }

    if (index >= 0 && index < items.length) {
        items[index].classList.add("bg-gray-700");
        addressInput.value = items[index].textContent.trim();
        currentHighlightedIndex = index;
    } else {
        addressInput.value = addressInput.dataset.originalValue.trim() || "";
        currentHighlightedIndex = -1;
    }
};

addressInput.addEventListener("input", async () => {
    const query = addressInput.value.trim();

    addressInput.dataset.originalValue =
        addressInput.dataset.originalValue || addressInput.value;

    if (query.length < 2) {
        suggestionsList.innerHTML = "";
        suggestionsContainer.classList.add("hidden");
        return;
    }

    const suggestions = await fetchSuggestions(query);
    renderSuggestions(suggestions);
});

addressInput.addEventListener("focus", async () => {
    const query = addressInput.value.trim();
    if (query.length >= 2 && suggestionsList.children.length > 0) {
        suggestionsContainer.classList.remove("hidden");
    } else if (query.length >= 2) {
        const suggestions = await fetchSuggestions(query);
        renderSuggestions(suggestions);
    }
});

addressInput.addEventListener("blur", () => {
    setTimeout(() => {
        suggestionsContainer.classList.add("hidden");
        if (
            currentHighlightedIndex === -1 &&
            addressInput.dataset.originalValue
        ) {
            addressInput.value = addressInput.dataset.originalValue;
        }
        delete addressInput.dataset.originalValue;
        currentHighlightedIndex = -1;
    }, 100);
});

addressInput.addEventListener("keydown", (e) => {
    const items = [...suggestionsList.children];
    if (
        items.length === 0 ||
        suggestionsContainer.classList.contains("hidden")
    ) {
        return;
    }

    const keyActions = {
        ArrowDown: () => {
            e.preventDefault();
            let newIndex = currentHighlightedIndex + 1;
            if (newIndex >= items.length) {
                newIndex = -1;
            }
            highlightSuggestion(newIndex);
        },
        ArrowUp: () => {
            e.preventDefault();
            let newIndex = currentHighlightedIndex - 1;
            if (newIndex < -1) {
                newIndex = items.length - 1;
            }
            highlightSuggestion(newIndex);
        },
        Enter: () => {
            if (currentHighlightedIndex > -1) {
                e.preventDefault();
                items[currentHighlightedIndex].click();
            }
        },
        Escape: () => {
            e.preventDefault();
            suggestionsContainer.classList.add("hidden");
            addressInput.value = addressInput.dataset.originalValue || "";
            delete addressInput.dataset.originalValue;
            currentHighlightedIndex = -1;
            addressInput.blur();
        },
    };

    const action = keyActions[e.key];
    if (action) {
        action();
    }
});
