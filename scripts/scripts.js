const defaultExtensions = [
    {
        "id": 1,
        "logo": "./assets/images/logo-devlens.svg",
        "name": "DevLens",
        "description": "Quickly inspect page layouts and visualize element boundaries.",
        "isActive": true
    },
    {
        "id": 2,
        "logo": "./assets/images/logo-style-spy.svg",
        "name": "StyleSpy",
        "description": "Instantly analyze and copy CSS from any webpage element.",
        "isActive": true
    },
    {
        "id": 3,
        "logo": "./assets/images/logo-speed-boost.svg",
        "name": "SpeedBoost",
        "description": "Optimizes browser resource usage to accelerate page loading.",
        "isActive": false
    },
    {
        "id": 4,
        "logo": "./assets/images/logo-json-wizard.svg",
        "name": "JSONWizard",
        "description": "Formats, validates, and prettifies JSON responses in-browser.",
        "isActive": true
    },
    {
        "id": 5,
        "logo": "./assets/images/logo-tab-master-pro.svg",
        "name": "TabMaster Pro",
        "description": "Organizes browser tabs into groups and sessions.",
        "isActive": true
    },
    {
        "id": 6,
        "logo": "./assets/images/logo-viewport-buddy.svg",
        "name": "ViewportBuddy",
        "description": "Simulates various screen resolutions directly within the browser.",
        "isActive": false
    },
    {
        "id": 7,
        "logo": "./assets/images/logo-markup-notes.svg",
        "name": "Markup Notes",
        "description": "Enables annotation and notes directly onto webpages for collaborative debugging.",
        "isActive": true
    },
    {
        "id": 8,
        "logo": "./assets/images/logo-grid-guides.svg",
        "name": "GridGuides",
        "description": "Overlay customizable grids and alignment guides on any webpage.",
        "isActive": false
    },
    {
        "id": 9,
        "logo": "./assets/images/logo-palette-picker.svg",
        "name": "Palette Picker",
        "description": "Instantly extracts color palettes from any webpage.",
        "isActive": true
    },
    {
        "id": 10,
        "logo": "./assets/images/logo-link-checker.svg",
        "name": "LinkChecker",
        "description": "Scans and highlights broken links on any page.",
        "isActive": true
    },
    {
        "id": 11,
        "logo": "./assets/images/logo-dom-snapshot.svg",
        "name": "DOM Snapshot",
        "description": "Capture and export DOM structures quickly.",
        "isActive": false
    },
    {
        "id": 12,
        "logo": "./assets/images/logo-console-plus.svg",
        "name": "ConsolePlus",
        "description": "Enhanced developer console with advanced filtering and logging.",
        "isActive": true
    }
];

// Buscamos nuestro contenedor para insertar los datos
const container = document.getElementById("extensions-container");

// Buscamos nuestro template para clonarlo
const template = document.getElementById("extension-ui-template");

// Variable para almacenar las extensiones
let extensions = [];
let filter = "all";

// Obtenemos los datos del JSON
if (localStorage.getItem("extensions")) {
    // Obtenemos los datos
    extensions = JSON.parse(localStorage.getItem("extensions"));
} else {
    // Si no hay datos, usamos los predeterminados
    extensions = defaultExtensions

    // Guardamos los datos predeterminados
    localStorage.setItem("extensions", JSON.stringify(extensions));
}

// Renderizamos las extensiones
function renderExtensions(data) {
    // Limpiamos el contenedor
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p>No extensions found</p>`;
        return;
    };

    // Recorremos los datos
    data.forEach((extension) => {
        // Preparamos el template
        const clone = template.cloneNode(true);
        clone.removeAttribute("id");
        clone.classList.remove("hidden");

        // Insertamos los datos
        clone.dataset.id = extension.id;
        clone.querySelector(".extension-image").src = extension.logo;
        clone.querySelector(".extension-image").alt = extension.name;
        clone.querySelector(".extension-image").width = "60";
        clone.querySelector(".extension-image").height = "60";
        clone.querySelector(".extension-name").textContent = extension.name;
        clone.querySelector(".extension-description").textContent = extension.description;
        clone.querySelector(".remove-extension").addEventListener("click", () => removeExtension(extension.id));
        clone.querySelector("input[type='checkbox']").checked = extension.isActive;
        clone.querySelector("input[type='checkbox']").addEventListener("change", () => toggleExtension(extension.id));

        container.appendChild(clone);
    });
}

//Agregamos la funcion para filtrar las extensiones
function filterExtensions(filterBy) {
    // Si el filtro es igual al actual, no hacemos nada
    if (filterBy === filter) return;

    // Quitamos la clase active a todos los filtros
    document.getElementById("filters").querySelectorAll("button").forEach((button) => { button.classList.remove("active"); });

    // Variable para almacenar las extensiones a renderizar
    let extensionsToRender =
        filterBy === "active"
            ? extensions.filter(extension => extension.isActive)
            : filterBy === "inactive"
                ? extensions.filter(extension => !extension.isActive)
                : extensions;

    // Agregamos la clase active al filtro seleccionado
    document.getElementById("filter-" + filterBy).classList.add("active");

    // Renderizamos las extensiones
    renderExtensions(extensionsToRender);

    // Actualizamos el filtro
    filter = filterBy;
}

// Agregamos el evento para cambiar el tema
function toggleTheme() {
    const htmlTag = document.documentElement;
    const theme = htmlTag.dataset.theme;
    const newTheme = theme === "light" ? "dark" : "light";

    htmlTag.dataset.theme = newTheme;

    // Cambiamos el icono y el logo según el tema
    ["logo", "icon-theme"].forEach((id) => {
        const element = document.getElementById(id);
        element.src = `assets/images/${id}-${newTheme}.svg`;
    });

    localStorage.setItem("theme", htmlTag.dataset.theme);
}

localStorage.getItem("theme") === "dark" && toggleTheme();

// Agregamos la funcionalidad de remover extensiones
function removeExtension(extensionId) {
    const card = document.querySelector(`.card[data-id="${extensionId}"]`);

    // Le agregamos la clase "removing" a la card
    card.classList.add("removing");

    // Filtramos las extensiones
    extensions = extensions.filter((extension) => extension.id !== extensionId);

    // Actualizamos el estado de las extensiones
    localStorage.setItem("extensions", JSON.stringify(extensions));

    if (extensions.length === 0) {
        container.innerHTML = `<p>No extensions found</p>`;
        return;
    };

    setTimeout(() => {
        card.remove();
    }, 300);
}

// Agregamos la funcionalidad de activar/desactivar extensiones
function toggleExtension(extensionId) {
    // Buscamos la extension
    const extension = extensions.find(extension => extension.id === extensionId);

    // Si la extension no existe, no hacemos nada
    if (!extension) return;

    // Cambiamos el estado de la extension
    extension.isActive = !extension.isActive;

    // Actualizamos el estado de la extension
    localStorage.setItem("extensions", JSON.stringify(extensions));

    // Quitamos la card si está filtrada
    if (filter !== "all") {
        const card = document.querySelector(`.card[data-id="${extensionId}"]`);
        card.classList.add("removing");

        // Le damos tiempo para que la animación se complete
        setTimeout(() => {
            card.remove();
            card.classList.remove("removing");
        }, 500);
    }
}

// Renderizamos las extensiones
renderExtensions(extensions);