// Funzione per ottenere i PDF dalla cartella principale
async function caricaCandidatura() {
    const url = "https://api.github.com/repos/Byte-Your-Dreams/Documents/contents";
    const response = await fetch(url);
    const files = await response.json();

    // Filtra solo i file PDF
    const pdfFiles = files.filter(file => file.type === "file" && file.name.endsWith(".pdf"));

    // Ordina i file in base all'ordine personalizzato
    const ordinePersonalizzato = ["PB", "RTB", "Candidatura"];
    pdfFiles.sort((a, b) => {
        const indexA = ordinePersonalizzato.findIndex(keyword => a.name.includes(keyword));
        const indexB = ordinePersonalizzato.findIndex(keyword => b.name.includes(keyword));
        return indexA - indexB;
    });

    const sezione = document.getElementById("documenti-candidatura");

    for (const file of pdfFiles) {
        const link = document.createElement("a");
        link.href = file.html_url; // Cambiato da download_url a html_url
        link.target = "_blank";
        link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
        link.textContent = file.name;

        sezione.appendChild(link);
    }
}

// Funzione per ottenere i PDF esplorando anche le sotto-cartelle
async function caricaPDF(cartella, accordionId) {
    const url = `https://api.github.com/repos/Byte-Your-Dreams/Documents/contents/${cartella}`;
    const response = await fetch(url);
    const files = await response.json();
    console.log('ok sto guarnendo la cartella', cartella);
    console.log('files:', files);
    const accordion = document.getElementById(accordionId);
    if (cartella === "Documenti%20Esterni/Verbali" || cartella === "Documenti%20Interni/Verbali") {
        // Se la cartella è "Verbali", ordina i file in ordine crescente
        console.log('sto ordinando i file in ordine crescente');
        files.sort((a, b) => b.name.localeCompare(a.name));
        console.log('files ordinati:', files);
    }
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

            // Chiamata ricorsiva per esplorare la sottocartella
            await caricaPDF(`${cartella}/${file.name}`, body.id);
        } else if (file.name.endsWith(".pdf")) {
            const link = document.createElement("a");
            link.href = file.html_url; // Cambiato da download_url a html_url
            link.target = "_blank";
            link.classList.add("btn", "btn-link", "text-decoration-none", "d-block", "mb-2");
            link.textContent = file.name;

            accordion.appendChild(link);
        }
    }
}

// Carica i PDF dalla cartella principale per la sezione Candidatura
caricaCandidatura();
// Carica i PDF per le sezioni con fisarmoniche (Documenti Esterni e Interni)
caricaPDF("Documenti%20Esterni", "accordion-esterni");
caricaPDF("Documenti%20Interni", "accordion-interni");
