const fs = require('fs');
const path = require('path');

// Funzione per caricare i PDF dalla cartella principale
function caricaCandidatura() {
    const cartella = path.join(__dirname, 'docs');  // Percorso della cartella nel progetto
    const files = fs.readdirSync(cartella);

    const sezione = document.getElementById("documenti-candidatura");

    files.forEach(file => {
        const filePath = path.join(cartella, file);
        if (fs.statSync(filePath).isFile() && file.endsWith(".pdf")) {
            const link = document.createElement("a");
            link.href = filePath;  // Link al file locale
            link.target = "_blank";
            link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
            link.textContent = file;

            sezione.appendChild(link);
        }
    });
}

// Funzione per caricare i PDF esplorando anche le sotto-cartelle
function caricaPDF(cartella, accordionId) {
    const fullPath = path.join(__dirname, 'docs', cartella);
    const files = fs.readdirSync(fullPath);

    const accordion = document.getElementById(accordionId);

    files.forEach(file => {
        const filePath = path.join(fullPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            const collapseId = `${accordionId}-${file}`;

            // Creazione di un elemento accordion per ogni cartella
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            const header = document.createElement("h2");
            header.classList.add("accordion-header");
            header.id = `heading-${collapseId}`;

            const button = document.createElement("button");
            button.classList.add("accordion-button", "collapsed");
            button.type = "button";
            button.setAttribute("data-bs-toggle", "collapse");
            button.setAttribute("data-bs-target", `#collapse-${collapseId}`);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", `collapse-${collapseId}`);
            button.textContent = file;

            header.appendChild(button);
            accordionItem.appendChild(header);

            const collapse = document.createElement("div");
            collapse.id = `collapse-${collapseId}`;
            collapse.classList.add("accordion-collapse", "collapse");
            collapse.setAttribute("aria-labelledby", `heading-${collapseId}`);
            collapse.setAttribute("data-bs-parent", `#${accordionId}`);

            const body = document.createElement("div");
            body.classList.add("accordion-body");
            body.id = `body-${collapseId}`;

            collapse.appendChild(body);
            accordionItem.appendChild(collapse);
            accordion.appendChild(accordionItem);

            caricaPDF(path.join(cartella, file), body.id);  // Passa la sotto-cartella per esplorare i suoi contenuti
        } else if (file.endsWith(".pdf")) {
            const link = document.createElement("a");
            link.href = filePath;  // Link al file locale
            link.target = "_blank";
            link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
            link.textContent = file;

            document.getElementById(accordionId).appendChild(link);
        }
    });
}

module.exports = { caricaCandidatura, caricaPDF };

// Esegui le funzioni quando il file viene eseguito
(async () => {
    caricaCandidatura();  // Non è più necessario aspettare per la funzione, è sincrona ora
    caricaPDF("Documenti Esterni", "accordion-esterni");
    caricaPDF("Documenti Interni", "accordion-interni");
})();
