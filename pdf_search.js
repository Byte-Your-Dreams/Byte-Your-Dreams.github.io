// Funzione per ottenere i PDF dalla cartella principale
async function caricaCandidatura() {
    const url = "https://api.github.com/repos/Byte-Your-Dreams/Documents/contents";
    const response = await fetch(url);
    const files = await response.json();

    const sezione = document.getElementById("documenti-candidatura");

    for (const file of files) {
        if (file.type === "file" && file.name.endsWith(".pdf")) {
            const link = document.createElement("a");
            link.href = file.download_url;
            link.target = "_blank";
            link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
            link.textContent = file.name;

            sezione.appendChild(link);
        }
    }
}

// Funzione per ottenere i PDF esplorando anche le sotto-cartelle
async function caricaPDF(cartella, accordionId) {
    const url = `https://api.github.com/repos/Byte-Your-Dreams/Documents/contents/${cartella}`;
    const response = await fetch(url);
    const files = await response.json();

    const accordion = document.getElementById(accordionId);

    for (const file of files) {
        if (file.type === "dir") {
            const collapseId = `${accordionId}-${file.name}`;

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
            button.textContent = file.name;

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

            await caricaPDF(`${cartella}/${file.name}`, body.id);
        } else if (file.name.endsWith(".pdf")) {
            const link = document.createElement("a");
            link.href = file.download_url;
            link.target = "_blank";
            link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
            link.textContent = file.name;

            document.getElementById(accordionId).appendChild(link);
        }
    }
}

// Carica i PDF dalla cartella principale per la sezione Candidatura
caricaCandidatura();
// Carica i PDF per le sezioni con fisarmoniche (Documenti Esterni e Interni)
caricaPDF("Documenti%20Esterni", "accordion-esterni");
caricaPDF("Documenti%20Interni", "accordion-interni");
