console.log('JS Test Load - projects.html');

// Currently no active JavaScript needed for animations.
// Leaving file for potential future use. 

// --- Image Cluster Hover Animation ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired. Starting script setup...'); // DEBUG: Top level

    // Ensure body starts without fade-out class (handles back/forward cache)
    document.body.classList.remove('fade-out');

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

    // --- Initial Execution of setup functions based on current page ---
    const initialPath = window.location.pathname.replace(/\/?$/, ''); // Normalize current path
    console.log('Current path on initial load:', initialPath); // DEBUG
    if (initialPath === '' || initialPath === '/index.html') {
        console.log('Initial load on Home page. Running Cluster and Modal setup.'); // DEBUG
        setupImageClusterLogic();
        setupModalLogic();
    } else if (initialPath === '/projects' || initialPath === '/projects.html') {
        console.log('Initial load on Projects page. Running Project List setup.'); // DEBUG
        setupProjectListLogic();
    }
    // Add other page initializations here if needed

    // --- Page Transition Logic (SPA-like) --- 
    console.log('Setting up SPA-like page transition logic...'); // DEBUG
    const navLinks = document.querySelectorAll('.top-nav a');
    const contentContainer = document.querySelector('.container');
    const fadeOutDuration = 400; // ms (match CSS)
    const fadeInDuration = 500; // ms (match CSS)

    function updateActiveLink(targetUrlPath) {
        navLinks.forEach(navLink => {
            const linkPath = new URL(navLink.href, window.location.origin).pathname.replace(/\/$/, '');
            const targetPath = targetUrlPath.replace(/\/$/, '');
            
            if (linkPath === targetPath) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }

    async function loadContent(targetUrl, isPopState = false) {
        if (!contentContainer) return;

        // 1. Add fade-out class to current content
        contentContainer.classList.remove('fade-in'); // Remove fade-in if it exists
        contentContainer.classList.add('fade-out');

        // Wait for fade-out animation
        await new Promise(resolve => setTimeout(resolve, fadeOutDuration));

        try {
            // 2. Fetch new page content
            const response = await fetch(targetUrl);
            if (!response.ok) {
                console.error('Failed to fetch page:', response.statusText);
                 window.location.href = targetUrl; // Fallback to full navigation on error
                return;
            }
            const htmlText = await response.text();

            // 3. Parse HTML and extract new container content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const newContainer = doc.querySelector('.container');

            if (!newContainer) {
                console.error('Could not find .container in fetched HTML');
                 window.location.href = targetUrl; // Fallback
                return;
            }

            // 4. Replace current content and add fade-in class
            contentContainer.innerHTML = newContainer.innerHTML;
            contentContainer.classList.remove('fade-out');
            // Force reflow before adding fade-in might be needed in some browsers, but try without first
             contentContainer.offsetHeight; // Optional reflow trigger
            contentContainer.classList.add('fade-in'); 
            
             // Re-run scripts or specific initializations if needed for the new content
             const targetPath = new URL(targetUrl, window.location.origin).pathname.replace(/\/?$/, ''); // Normalize path
             console.log('Target path for logic setup:', targetPath); // DEBUG
             if (targetPath === '' || targetPath === '/index.html') { // Check path for Home (root or index.html)
                 console.log('Setting up Home page logic (Cluster, Modal)'); // DEBUG
                 setupImageClusterLogic();
                 setupModalLogic();
             } else if (targetPath === '/projects' || targetPath === '/projects.html') { // Check path for Projects
                 console.log('Setting up Projects page logic (Project List)'); // DEBUG
                 setupProjectListLogic();
             }

            // 5. Update URL and Nav link (only if not triggered by popstate)
            if (!isPopState) {
                history.pushState({ path: targetUrl }, '', targetUrl);
                 updateActiveLink(new URL(targetUrl, window.location.origin).pathname);
            } else {
                 // For popstate, just update active link based on current location
                 updateActiveLink(window.location.pathname);
            }

             // Remove the fade-in class after animation completes (optional cleanup)
             setTimeout(() => {
                 contentContainer.classList.remove('fade-in');
             }, fadeInDuration);

        } catch (error) {
            console.error('Error loading page content:', error);
             window.location.href = targetUrl; // Fallback to full navigation on error
        }
    }

    // Add click listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.href;
            const currentUrl = window.location.href;

            // Don't do anything if clicking the link for the current page
            if (targetUrl === currentUrl || link.classList.contains('active')) {
                e.preventDefault();
                return;
            }

            // Only handle internal navigation
            if (targetUrl.startsWith(window.location.origin) && !link.target) { // Check origin and avoid target="_blank"
                e.preventDefault();
                loadContent(targetUrl);
            }
            // Let external links or links with target="_blank" behave normally
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        console.log('Popstate event fired:', window.location.pathname); // DEBUG
         // Use location.href which includes the filename for simple server setup
        const targetUrl = window.location.href; 
        loadContent(targetUrl, true); // Pass true to indicate it's from popstate
         updateActiveLink(window.location.pathname); // Update active link based on new path
    });

    // Initial setup: Update active link
    updateActiveLink(window.location.pathname);
    
    // ---- Refactor existing logic into functions ----
    function setupImageClusterLogic() {
        const cluster = document.querySelector('.image-cluster');
        if (cluster) { 
            // ... (Existing cluster mouseenter/mouseleave logic) ...
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
             console.log('Cluster element NOT found for setup.');
        }
    }
    
    function setupModalLogic() {
         const modal = document.getElementById('imageModal');
         if (modal) {
             // ... (Existing modal logic: selectors, functions, listeners) ...
             const modalImage = document.getElementById('modalImage');
             const modalDescription = document.getElementById('modalDescription');
             const closeModal = document.querySelector('.modal-close');
             const modalOverlay = document.querySelector('.modal-overlay');
             const prevButton = document.getElementById('modalPrev');
             const nextButton = document.getElementById('modalNext');
             const galleryLinks = document.querySelectorAll('.cluster-link');
             let currentImageIndex = 0;
             let galleryImages = [];
             galleryLinks.forEach(link => {
                 if (link.querySelector('img')) { // Check if img exists before accessing src
                     galleryImages.push({
                         src: link.querySelector('img').src,
                         description: link.dataset.description,
                         alt: link.querySelector('img').alt
                     });
                 }
             });
             // ... (rest of modal functions: openModal, closeModalFunction, updateModalContent, etc.) ...
             function openModal(index) { /* ... */ }
             function closeModalFunction() { /* ... */ }
             function updateModalContent() { /* ... */ }
             function showPrevImage() { /* ... */ }
             function showNextImage() { /* ... */ }
             // Add listeners only if they aren't already attached (tricky without removal)
             // Consider adding flags or removing previous listeners if re-running this often
             galleryLinks.forEach(link => { /* ... click listener ... */ });
             if (closeModal) closeModal.addEventListener('click', closeModalFunction);
             if (modalOverlay) modalOverlay.addEventListener('click', closeModalFunction);
             if (prevButton) prevButton.addEventListener('click', showPrevImage);
             if (nextButton) nextButton.addEventListener('click', showNextImage);
             // Keyboard listener likely okay to re-add or keep global
         } else {
             console.log('Modal element NOT found for setup.');
         }
    }

    function setupProjectListLogic() {
        console.log('---> Entering setupProjectListLogic'); // DEBUG: Entry log
        const projectList = document.querySelector('.project-list');
        if (projectList) {
            console.log('  Project list found (.project-list). Adding listeners...'); // DEBUG
            const projectHeaders = projectList.querySelectorAll('.project-header');
            projectHeaders.forEach(header => {
                 // Simple approach: Re-add listener. For robustness, consider removing old listeners first or using event delegation.
                 header.addEventListener('click', () => {
                    console.log('    Project header clicked:', header); // DEBUG: Click log
                    const currentItem = header.closest('.project-item');
                    if (!currentItem) {
                        console.error('    Could not find parent .project-item for clicked header.'); // DEBUG
                        return;
                    }
                    const isActive = currentItem.classList.contains('active');
                    console.log(`    Item ${currentItem.dataset.projectId || 'unknown'} was active: ${isActive}`); // DEBUG

                    // Find any other item that is currently active
                    const currentlyActiveItem = projectList.querySelector('.project-item.active');
                    
                    // If there is an active item, and it's not the one we just clicked, deactivate it
                    if (currentlyActiveItem && currentlyActiveItem !== currentItem) {
                        console.log(`    Deactivating other active item: ${currentlyActiveItem.dataset.projectId || 'unknown'}`); // DEBUG
                        currentlyActiveItem.classList.remove('active');
                    }

                    // Toggle the active state of the clicked item
                    // If it wasn't active, it becomes active. If it was active, it becomes inactive.
                    currentItem.classList.toggle('active');
                    console.log(`    Toggled active class. Item ${currentItem.dataset.projectId || 'unknown'} is now active: ${currentItem.classList.contains('active')}`); // DEBUG
                });
            });
        } else {
            console.warn('  Project list element (.project-list) NOT found during setup.'); // DEBUG: Warn if not found
        }
        console.log('<--- Exiting setupProjectListLogic'); // DEBUG: Exit log
    }

    console.log('Script setup finished.'); // DEBUG: End of listener
}); 