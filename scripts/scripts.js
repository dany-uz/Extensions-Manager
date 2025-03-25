// Buscamos nuestro contenedor para insertar los datos
const container = document.getElementById("extensions-container");

// Buscamos nuestro template para clonarlo
const template = document.getElementById("extension-ui-template");

// Variable para almacenar las extensiones
let extensions = [];
let filter = "all";

// Obtenemos los datos del JSON
if (localStorage.getItem("extensions")) {
    extensions = JSON.parse(localStorage.getItem("extensions"));
    renderExtensions(extensions);
} else {
    const dataJSON = fetch("../data.json").then((response) => response.json());

    dataJSON.then(data => {
        extensions = data
        renderExtensions(data);
    });
}

// Renderizamos las extensiones
function renderExtensions(data) {
    // Limpiamos el contenedor
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p>No extensions found</p>`;
        return;
    };

    // Actualizamos el estado de las extensiones
    localStorage.setItem("extensions", JSON.stringify(data));

    // Recorremos los datos
    data.forEach((extension) => {
        // Preparamos el template
        const clone = template.cloneNode(true);
        clone.removeAttribute("id");
        clone.classList.remove("hidden");

        // Insertamos los datos
        clone.dataset.id = extension.id;
        clone.querySelector(".extension-image").src = extension.logo;
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
        element.src = `../assets/images/${id}-${newTheme}.svg`;
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