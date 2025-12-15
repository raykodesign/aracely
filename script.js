document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const menuItems = document.querySelectorAll('.menu-item'); 
    const contentTitle = document.getElementById('content-title');
    const contentDisplay = document.getElementById('content-display');
    
    // NUEVOS ELEMENTOS DEL PERFIL PARA LA ANIMACIÓN DE ESCRITURA
    const profileName = document.getElementById('profile-name');
    const profileSlogan = document.getElementById('profile-slogan');

    // --- FUNCIÓN DE ANIMACIÓN DE ESCRITURA ---
    function animateTypewriter() {
        if (profileName) {
            // Reinicia la animación eliminando y agregando la clase
            profileName.classList.remove('animate');
            // Usamos setTimeout(0) para forzar un reflow y reiniciar la animación
            setTimeout(() => {
                profileName.classList.add('animate');
            }, 10);
        }
        if (profileSlogan) {
            profileSlogan.classList.remove('animate');
            setTimeout(() => {
                profileSlogan.classList.add('animate');
            }, 10);
        }
    }


    // --- 1. LÓGICA DE CARGA ---
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        const initialItem = document.querySelector('.menu-item[data-section="perfil"]');
        if (initialItem) {
            updateContent('perfil', initialItem, false); // Carga inicial sin fade-out
            animateTypewriter(); // Inicia la animación de escritura en la carga inicial
        }
    }, 1500); // 1.5 segundos

    // --- 2. DATOS (IMÁGENES DE GALERÍA) ---
    const photoUrls = [
        "https://xatimg.com/image/4N9feBQOFgHs.jpg",
        "https://xatimg.com/image/gwzCTCG2PsZq.jpg",
        "https://xatimg.com/image/q6PRnShlnrsM.jpg",
    ];
    const cardWidth = 380; // 350px (ancho) + 30px (márgenes 15px*2)
    let currentPhotoIndex = 0;


    // --- 3. CONTENIDO DE SECCIONES (MODIFICADO: HTML de Perfil) ---
    const sectionContent = {
        perfil: {
            title: `Mi Perfil`,
            html: `
                <div class="profile-content-layout">
                    <div class="profile-image-side">
                        <img src="https://xatimg.com/image/q6PRnShlnrsM.jpg" alt="Foto de Perfil en Contenido">
                    </div>
                    <div class="profile-text-side">
                        <h3 style="color: var(--sunflower-dark); margin-top: 0; font-weight: 600; font-size: 1.8em;">Hola, soy Aracely</h3>
                        <p style="font-style: italic; color: #777;">"Fluyendo con la luz. Siempre positiva y en constante crecimiento, como un girasol."</p>
                        <p><strong>Nacionalidad:</strong> México </p>
                        <p><strong>Estado:</strong> En línea.</p>
                    </div>
                </div>
            `
        },
        amigos: {
            title: "Amigos",
            html: `
                <p><strong>Amigos Cercanos:</strong> 5 personas iluminan mi camino.</p>
                <p><strong>Actividad Reciente:</strong> Publicó un nuevo estado hace 2 horas.</p>
                <p>Esta sección es el listado de las personas que hacen florecer mi día.</p>
            `
        },
        galeria: {
            title: "Galería",
            html: `
                <div class="gallery-container">
                    <div class="photo-carousel">
                        </div>
                    <button id="prev-btn" class="nav-arrow" aria-label="Anterior">‹</button>
                    <button id="next-btn" class="nav-arrow" aria-label="Siguiente">›</button>
                </div>
            `
        },
        musica: { 
            title: "Música",
            html: `
                <div class="music-player-container">
                    <p class="music-info">Disfruta de mi canción favorita</p>
                    <iframe class="youtube-iframe" 
                        src="https://www.youtube.com/embed/ER9i8WGFgS8?autoplay=0&controls=1&showinfo=0&rel=0" 
                        title="Reproductor de YouTube" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `
        }
    };

    // --- 4. LÓGICA DE LA GALERÍA (NUEVA LÓGICA DE CARRUSEL 3D) ---
    function renderGalleryListeners() {
        const carousel = contentDisplay.querySelector('.photo-carousel');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!carousel || !prevBtn || !nextBtn) return;
        
        const updateCarousel = () => {
            carousel.innerHTML = '';
            photoUrls.forEach((url, index) => {
                const card = document.createElement('div');
                card.classList.add('gallery-card');
                
                const img = document.createElement('img');
                img.src = url;
                img.alt = `Galería Foto ${index + 1}`;
                
                card.appendChild(img);
                
                if (index === currentPhotoIndex) {
                    card.classList.add('active');
                }

                if (index !== currentPhotoIndex) {
                    card.addEventListener('click', () => {
                        currentPhotoIndex = index;
                        updateCarousel();
                    });
                }

                carousel.appendChild(card);
            });
            
            const offset = (currentPhotoIndex * cardWidth);
            carousel.style.transform = `translateX(calc(50% - ${offset}px - ${cardWidth/2}px))`;
            
            prevBtn.disabled = currentPhotoIndex === 0;
            nextBtn.disabled = currentPhotoIndex === photoUrls.length - 1;
        };

        prevBtn.addEventListener('click', () => {
            if (currentPhotoIndex > 0) {
                currentPhotoIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPhotoIndex < photoUrls.length - 1) {
                currentPhotoIndex++;
                updateCarousel();
            }
        });

        updateCarousel();
    }

    // --- 5. LÓGICA DE NAVEGACIÓN PRINCIPAL (CON TRANSICIÓN) ---
    function updateContent(sectionKey, activeElement, useTransition = true) {
        menuItems.forEach(item => item.classList.remove('active'));
        activeElement.classList.add('active');

        const data = sectionContent[sectionKey];

        if (useTransition) {
            // 1. Iniciar fade-out (opacidad y pequeño movimiento hacia abajo)
            contentDisplay.style.opacity = '0';
            contentDisplay.style.transform = 'translateY(10px)';
            
            // Espera el tiempo de la transición (0.3s definido en CSS)
            setTimeout(() => {
                // 2. Actualizar contenido después del fade-out
                contentTitle.innerHTML = data.title;
                contentDisplay.innerHTML = data.html;

                if (sectionKey === 'galeria') {
                    currentPhotoIndex = 0; 
                    renderGalleryListeners();
                }
                
                // 3. Iniciar fade-in (establecer la opacidad y transformación a valores finales)
                contentDisplay.style.opacity = '1';
                contentDisplay.style.transform = 'translateY(0)';
            }, 300); // 300ms es el tiempo de la transición en style.css
            
        } else {
             // Carga inicial o sin transición
            contentTitle.innerHTML = data.title;
            contentDisplay.innerHTML = data.html;
            
            // Asegura que el contenido sea visible si no hay transición (para la carga inicial)
            contentDisplay.style.opacity = '1'; 
            contentDisplay.style.transform = 'translateY(0)';
            
            if (sectionKey === 'galeria') {
                currentPhotoIndex = 0; 
                renderGalleryListeners();
            }
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const section = item.getAttribute('data-section');
            updateContent(section, item, true); // Usa transición en el click
            
            // Opcional: Reiniciar la animación de máquina de escribir cada vez que se hace clic en 'Perfil'
            if (section === 'perfil') {
                animateTypewriter();
            }
        });
    });

});
