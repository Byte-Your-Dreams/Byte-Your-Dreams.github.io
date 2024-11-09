(function() {
    emailjs.init("kM5vIpRBf2pVqsYJ-");  
})();

document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");
    const notification = document.getElementById("notification");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Previeni il comportamento predefinito del form

        emailjs.sendForm("service_oy1iwls", "template_2tl4kub", contactForm)
            .then(function(response) {
                // Mostra la notifica di successo
                notification.textContent = "Messaggio inviato con successo!";
                notification.classList.remove("d-none");
                notification.classList.add("alert-success"); // Successo (verde)

                // Nascondi la notifica dopo 3 secondi
                setTimeout(function() {
                    notification.classList.add("d-none");
                }, 3000);

                // Resetta il form
                contactForm.reset(); 
            }, function(error) {
                // Mostra la notifica di errore
                notification.textContent = "Errore nell'invio del messaggio!";
                notification.classList.remove("d-none");
                notification.classList.add("alert-danger"); // Errore (rosso)

                // Nascondi la notifica dopo 3 secondi
                setTimeout(function() {
                    notification.classList.add("d-none");
                }, 3000);
            });
    });
});