
    function toggleExpand(section) {
        const content = section.nextElementSibling;
        const icon = section.querySelector('.expand-icon');

        if (content.classList.contains('expanded')) {
            content.style.maxHeight = content.scrollHeight + 'px'; // Set to current height to trigger transition
            setTimeout(() => {
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
            }, 10); // Small delay to allow the browser to register the height change
            icon.textContent = '+';
            content.classList.remove('expanded');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.paddingTop = '10px';
            icon.textContent = '−';
            content.classList.add('expanded');
        }
    }

    function scrollToProduct(productId) {
        var productCard = document.getElementById(productId);
        if (productCard) {
            var offset = 110; // Adjust this value as needed
            var elementPosition = productCard.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        } else {
            console.error("Product cards with ID '" + productId + "' not found.");
        }
    }

    function isAdElement(element) {
        // Exclude elements with specific class names or their children
        const excludedClasses = ['summary-card', 'cta-container', 'top-row', 'asset-photo card', 'image', 'product-list', 'last-content', 'table-container', 'big-custom-btn'];
        if (excludedClasses.some(className => element.closest(`.${className}`))) {
            return false; // Skip elements with excluded classes or their children
        }

        // Check for common ad patterns in class names, IDs, or attributes
        const isAdClass = element.classList.contains('ad') || element.classList.contains('ads');
        const isAdId = element.id.includes('ad') || element.id.includes('ads');
        const isAdSrc = element.src && (element.src.includes('ad') || element.src.includes('ads'));
        const isAdIframe = element.tagName === 'IFRAME' && (element.src.includes('ad') || element.src.includes('ads'));

        return isAdClass || isAdId || isAdSrc || isAdIframe;
    }

    function removeAds() {
        // Target the main-body-container ID
        const mainBodyContainer = document.getElementById('main-body-container');
        if (!mainBodyContainer) return;

        // Remove any ads within .row elements inside the main-body-container
        mainBodyContainer.querySelectorAll('.row').forEach(row => {
            row.querySelectorAll('img, iframe, div').forEach(element => {
                if (isAdElement(element)) {
                    console.log("Removing ad element:", element); // Debugging
                    element.style.display = 'none'; // Hide the ad
                }
            });
        });
    }

    removeAds();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Check if the node is an element
                    // Target the main-body-container ID for dynamically added ads
                    const mainBodyContainer = document.getElementById('main-body-container');
                    if (mainBodyContainer && mainBodyContainer.contains(node)) {
                        // Check if the node is a .row element or inside a .row element
                        if (node.matches('.row') || node.closest('.row')) {
                            node.querySelectorAll('img, iframe, div').forEach(element => {
                                if (isAdElement(element)) {
                                    console.log("Removing dynamically added ad element:", element); // Debugging
                                    element.style.display = 'none'; // Hide dynamically added ads
                                }
                            });
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
