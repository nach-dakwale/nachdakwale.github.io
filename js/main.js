console.log('JS Test Load - projects.html');

// Currently no active JavaScript needed for animations.
// Leaving file for potential future use. 

// --- Image Cluster Hover Animation ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired. Starting script setup...'); // DEBUG: Top level

    // --- Cluster Logic --- 
    const cluster = document.querySelector('.image-cluster');
    if (cluster) { 
        console.log('Cluster element found. Setting up cluster logic...'); // DEBUG
        const images = cluster.querySelectorAll('.cluster-img');
        const baseDelay = 0.08; 

        cluster.addEventListener('mouseenter', () => {
            cluster.classList.add('expanded');
            images.forEach((img, index) => {
                img.style.transitionDelay = `${index * baseDelay}s`;
            });
        });

        cluster.addEventListener('mouseleave', () => {
            images.forEach((img, index) => {
                img.style.transitionDelay = `${index * baseDelay}s`;
            });
            cluster.classList.remove('expanded');
        });
    } else {
        console.log('Cluster element NOT found.'); // DEBUG
    }

    // --- Modal Gallery Logic --- 
    const modal = document.getElementById('imageModal');
    if (modal) {
        console.log('Modal element found. Setting up modal logic...'); // DEBUG
        const modalImage = document.getElementById('modalImage');
        const modalDescription = document.getElementById('modalDescription');
        const closeModal = document.querySelector('.modal-close'); // Note: Currently hidden by CSS
        const modalOverlay = document.querySelector('.modal-overlay');
        const prevButton = document.getElementById('modalPrev');
        const nextButton = document.getElementById('modalNext');
        const galleryLinks = document.querySelectorAll('.cluster-link');

        let currentImageIndex = 0;
        let galleryImages = []; 

        galleryLinks.forEach(link => {
            galleryImages.push({
                src: link.dataset.fullSrc,
                description: link.dataset.description,
                alt: link.querySelector('img').alt
            });
        });

        function openModal(index) {
            if (!modal || galleryImages.length === 0) return;
            currentImageIndex = index;
            updateModalContent();
            modal.classList.add('modal-active');
        }

        function closeModalFunction() {
             if (!modal) return;
            modal.classList.remove('modal-active');
        }

        function updateModalContent() {
            if (!modalImage || !modalDescription || galleryImages.length === 0) return;
            modalImage.src = galleryImages[currentImageIndex].src;
            modalImage.alt = galleryImages[currentImageIndex].alt;
            modalDescription.textContent = galleryImages[currentImageIndex].description;
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateModalContent();
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateModalContent();
        }

        // Event Listeners
        galleryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(link.dataset.index, 10);
                openModal(index);
            });
        });

        if (closeModal) closeModal.addEventListener('click', closeModalFunction); // Listener remains even if hidden
        if (modalOverlay) modalOverlay.addEventListener('click', closeModalFunction);
        if (prevButton) prevButton.addEventListener('click', showPrevImage);
        if (nextButton) nextButton.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('modal-active')) {
                if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                } else if (e.key === 'Escape') {
                    closeModalFunction();
                }
            }
        });
    } else {
        console.log('Modal element NOT found.'); // DEBUG
    }

    // --- Project List Accordion Logic ---
    console.log('Checking for project list element...'); // DEBUG: Before project list query
    const projectList = document.querySelector('.project-list');
    if (projectList) {
        console.log('Project list found. Adding listeners...'); // DEBUG
        const projectHeaders = projectList.querySelectorAll('.project-header');

        projectHeaders.forEach(header => {
            header.addEventListener('click', () => {
                console.log('Project header clicked:', header); // DEBUG
                const currentItem = header.closest('.project-item');
                if (!currentItem) {
                    console.error('Could not find parent .project-item for', header); // DEBUG
                    return;
                }
                console.log('Clicked item:', currentItem); // DEBUG
                
                const isActive = currentItem.classList.contains('active');
                console.log('Is active before toggle:', isActive); // DEBUG

                // First, close any currently active item
                const activeItem = projectList.querySelector('.project-item.active');
                if (activeItem && activeItem !== currentItem) {
                    console.log('Closing other active item:', activeItem); // DEBUG
                    activeItem.classList.remove('active');
                }

                // Then, toggle the clicked item
                if (!isActive) {
                    console.log('Adding active class'); // DEBUG
                    currentItem.classList.add('active');
                } else {
                    console.log('Removing active class'); // DEBUG
                    currentItem.classList.remove('active'); 
                }
                console.log('Active class list after toggle:', currentItem.classList); // DEBUG
            });
        });
    } else {
        console.warn('Project list element not found on this page.'); // DEBUG: Changed wording slightly
    }

    // --- Page Transition Logic --- 
    console.log('Setting up page transition logic...'); // DEBUG
    const internalLinks = document.querySelectorAll('.top-nav a'); 
    const animationDuration = 400; 

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.href;
            
            if (link.classList.contains('active') || !targetUrl) {
                return; 
            }

            if (!targetUrl.startsWith('http') || targetUrl.includes(window.location.hostname)) {
                 e.preventDefault(); 
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, animationDuration);
            }
        });
    });

    console.log('Script setup finished.'); // DEBUG: End of listener
}); 