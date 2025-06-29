
        // --- Script pour la Table des Matières (inchangé) ---
        document.addEventListener('DOMContentLoaded', function () {
            const toggles = document.querySelectorAll('.toc-toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', function () {
                    const content = this.nextElementSibling;
                    const isOpen = content.classList.contains('open');
                    if (isOpen) {
                        content.classList.remove('open');
                        this.classList.remove('open');
                    } else {
                        content.classList.add('open');
                        this.classList.add('open');
                    }
                });
            });

            // --- Script pour le Modal d'Achat (mis à jour) ---
            const modal = document.getElementById('purchaseModal');
            const openModalButtons = document.querySelectorAll('.open-modal-button');
            const closeModalButton = document.getElementById('closeModalButton');
            const purchaseForm = document.getElementById('purchaseForm');
            const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
            const ribDetails = document.getElementById('ribDetails');
            const submitButton = document.getElementById('submitButton');
            const buttonText = document.getElementById('buttonText');
            const buttonSpinner = document.getElementById('buttonSpinner');
            const formStatus = document.getElementById('formStatus');

             // --- IMPORTANT : Remplacez ceci par l'URL de votre Web App Google Apps Script ---
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCwKx0Iv6DKpRLH8pyuM9KHykhU_B1qUVKVldOxE6fNYj_GnvrOPV0RjUV0vqxF0ex_g/exec"; // <--- METTRE VOTRE URL ICI

            // Fonction pour ouvrir le modal
            const openModal = (event) => {
                event.preventDefault();
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                formStatus.classList.add('hidden'); // Cacher les anciens messages
                formStatus.textContent = '';
                purchaseForm.reset(); // Réinitialiser le formulaire à l'ouverture
                ribDetails.style.display = 'none'; // Cacher RIB
            };

            // Fonction pour fermer le modal
            const closeModal = () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            };

            // Attacher les écouteurs pour ouvrir/fermer le modal
            openModalButtons.forEach(button => button.addEventListener('click', openModal));
            closeModalButton.addEventListener('click', closeModal);
            modal.addEventListener('click', (event) => {
                if (event.target === modal) closeModal();
            });

            // Gérer l'affichage des détails RIB
            paymentMethodRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    ribDetails.style.display = (this.id === 'bankTransfer' && this.checked) ? 'block' : 'none';
                });
            });

            // Gérer la soumission du formulaire (Envoi vers Google Apps Script)
            purchaseForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Empêche l'envoi HTML standard

                // Afficher le spinner et désactiver le bouton
                buttonText.textContent = "Envoi en cours...";
                buttonSpinner.classList.remove('hidden');
                submitButton.disabled = true;
                formStatus.classList.add('hidden'); // Cacher le message précédent

                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // Ajouter la date et l'heure de la soumission
                data.timestamp = new Date().toLocaleString('fr-FR'); // Format de date localisé

                // Envoyer les données au Google Apps Script
                fetch(SCRIPT_URL, {
                    method: 'POST',
                  mode: 'no-cors', // Important pour les requêtes simples vers Apps Script sans configurer CORS avancé
                    cache: 'no-cache',
                    headers: {
                        // 'Content-Type': 'application/json' // Peut causer des problèmes avec 'no-cors' et Apps Script simple
                        'Content-Type': 'application/x-www-form-urlencoded', // Souvent plus simple pour Apps Script
                    },
                    // body: JSON.stringify(data) // Si vous utilisez application/json
                    body: new URLSearchParams(data).toString() // Si vous utilisez x-www-form-urlencoded
                })
                .then(response => {
                    // NOTE: Avec 'no-cors', la réponse est opaque, on ne peut pas lire son contenu.
                    // On suppose que si la requête ne lève pas d'erreur réseau, c'est un succès.
                    console.log('Success (assumed due to no-cors):', response);
                    formStatus.textContent = "Merci ! Votre commande a été enregistrée.";
                    formStatus.className = 'success'; // Applique la classe CSS pour le succès
                    formStatus.classList.remove('hidden');
                    purchaseForm.reset(); // Réinitialiser le formulaire
                    ribDetails.style.display = 'none'; // Cacher RIB

                    // Optionnel: Fermer le modal après un délai
                    setTimeout(closeModal, 3000); // Ferme après 3 secondes
                })
                .catch(error => {
                    console.error('Error sending data:', error);
                    formStatus.textContent = "Erreur lors de l'enregistrement. Veuillez réessayer.";
                    formStatus.className = 'error'; // Applique la classe CSS pour l'erreur
                    formStatus.classList.remove('hidden');
                })
                .finally(() => {
                    // Rétablir l'état initial du bouton
                    buttonText.textContent = "Confirmer la commande (10 $)";
                    buttonSpinner.classList.add('hidden');
                    submitButton.disabled = false;
                });
            });
        });
    