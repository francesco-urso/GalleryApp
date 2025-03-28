document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const gallerySection = document.getElementById('gallery-section');
    const imageList = document.getElementById('image-list');
    const uploadModal = document.getElementById('upload-modal');
    const uploadBtn = document.getElementById('upload-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const submitUploadBtn = document.getElementById('submit-upload');
    const closeModalBtn = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const registerForm = document.getElementById('register-form');
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');
    const registerError = document.getElementById('register-error');
    const imageTitleInput = document.getElementById('image-title');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    let jwtToken = localStorage.getItem('jwtToken'); // Recupera il token salvato all'avvio

    // Funzione per la registrazione
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = newUsernameInput.value;
        const password = newPasswordInput.value;
        const email = document.getElementById('new-email').value;  // Aggiungi questa riga per prendere l'email

        // Verifica che i campi non siano vuoti
        if (!username || !password || !email) {
            registerError.textContent = 'Tutti i campi sono obbligatori!';
            return;
        }

        // Verifica che l'email non sia vuota
        if (!email) {
            registerError.textContent = 'L\'email è obbligatoria!';
            return;
        }

        fetch('http://localhost:3003/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),  // Aggiungi l'email al corpo della richiesta
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((errorText) => {
                        throw new Error(errorText); // Stampa l'errore
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Utente registrato:', data);
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
            })
            .catch((error) => {
                console.error('Errore nel server:', error);
                registerError.textContent = 'Errore nella registrazione. Riprova.';
            });
    });

    // Funzione per il login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Verifica che i campi non siano vuoti
        if (!username || !password) {
            loginError.textContent = 'Tutti i campi sono obbligatori!';
            return;
        }

        fetch('http://localhost:3003/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    jwtToken = data.token;
                    localStorage.setItem('jwtToken', jwtToken);  // Salva il token nel localStorage
                    console.log('Token login: ')
                    console.log(jwtToken)
                    loginSection.style.display = 'none';
                    gallerySection.style.display = 'block';
                    loadImages();
                } else {
                    loginError.textContent = 'Credenziali errate';
                }
            })
            .catch((error) => {
                loginError.textContent = 'Errore nel login. Riprova.';
                console.error(error);
            });
    });

    // Funzione per passare alla schermata di registrazione
    document.getElementById('go-to-register').addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    // Funzione per passare alla schermata di login
    document.getElementById('go-to-login').addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Funzione per caricare le immagini
    function loadImages() {
        if (!jwtToken) {
            console.log('Token mancante. Devi fare login.');
            return;
        }

        fetch('http://localhost:3003/api/images', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (response.status === 401) {
                    alert('Sessione scaduta, effettua nuovamente il login.');
                    loginSection.style.display = 'block';  // Mostra la sezione di login
                    gallerySection.style.display = 'none'; // Nascondi la galleria
                    return;
                }

                return response.json(); // Restituisce i dati in formato JSON
            })
            .then(data => {
                if (data && Array.isArray(data)) {
                    imageList.innerHTML = ''; // Pulisce l'area delle immagini

                    data.forEach(image => {
                        console.log('Rendering immagine: ', image);

                        const imageUrl = `http://localhost:3003${image.url}`; // Assicurati che l'URL sia corretto
                        console.log('URL immagine:', imageUrl);

                        const card = document.createElement('div');
                        card.classList.add('card');

                        // Crea la struttura HTML per ogni immagine
                        card.innerHTML = `
                    <img src="${imageUrl}" alt="${image.title}" class="image-thumbnail">
                    <h3>${image.title}</h3>
                    <p>${new Date(image.created_at).toLocaleDateString()}</p>
                    <button class="info-btn">Info</button>
                `;

                        // Aggiungi la card all'elemento di lista
                        imageList.appendChild(card);
                    });
                } else {
                    console.error('La risposta del server non è un array. Risposta:', data);
                }
            })
            .catch(error => {
                console.error('Errore nel recupero delle immagini:', error);
            });
    }


    // Funzione per caricare l'immagine e mostrarne l'anteprima
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';  // Mostra l'immagine di anteprima
            };
            reader.readAsDataURL(file);  // Converte il file immagine in un URL base64
        }
    });

    // Funzione per caricare l'immagine
    submitUploadBtn.addEventListener('click', () => {
        const imageTitle = imageTitleInput.value;
        const imageFile = imageInput.files[0];

        if (!imageTitle || !imageFile) {
            alert("Titolo o immagine mancanti!");
            return;
        }

        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('Token mancante. Effettua nuovamente il login.');
            return;
        }

        const formData = new FormData();
        formData.append('title', imageTitle);
        formData.append('image', imageFile);

        fetch('http://localhost:3003/api/images/upload', { // Endpoint corretto
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Immagine caricata con successo!");
                    loadImages();
                    uploadModal.style.display = 'none'; // Chiudi il modal
                } else {
                    alert("Errore durante il caricamento dell'immagine.");
                }
            })
            .catch((error) => {
                console.error('Errore nel caricamento dell\'immagine:', error);
            });
    });

    // Funzione per logout
    logoutBtn.addEventListener('click', () => {
        const jwtToken = localStorage.getItem('jwtToken');

        if (jwtToken) {
            fetch('http://localhost:3003/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        // Rimuovi il token dal localStorage
                        console.log('Token bruciato: ')
                        console.log(jwtToken)
                        localStorage.removeItem('jwtToken');
                        // Nascondi la sezione galleria e mostra il login
                        loginSection.style.display = 'block';
                        gallerySection.style.display = 'none';
                        console.log('Logout effettuato con successo');
                    } else {
                        console.error('Errore nel logout');
                    }
                })
                .catch((error) => {
                    console.error('Errore nel logout:', error);
                });
        } else {
            console.log('Token non trovato, impossibile fare il logout');
        }
    });

    // Funzione per mostrare la modale di upload
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'flex';
    });

    // Funzione per chiudere la modale
    closeModalBtn.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // Verifica se l'utente è già loggato
    if (jwtToken) {
        loginSection.style.display = 'none';
        gallerySection.style.display = 'block';
        loadImages();
    } else {
        loginSection.style.display = 'block';
        gallerySection.style.display = 'none';
    }
});
