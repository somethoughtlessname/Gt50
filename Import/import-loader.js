
// ===== IMPORT LOADER =====
// Dynamically loads all import files listed in imports-list.js
// No need to manually add script tags to Index.html!

(function() {
    console.log('=== Import Loader Starting ===');
    
    // Track loading state
    window.GT50ImportsReady = false;
    window.GT50ImportsLoading = true;
    
    // Wait for the imports list to be available
    function waitForList() {
        return new Promise((resolve) => {
            if (window.GT50ImportsList) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.GT50ImportsList) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
            }
        });
    }
    
    // Dynamically load a script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`✓ Loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`✗ Failed to load: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            document.head.appendChild(script);
        });
    }
    
    // Load all imports
    async function loadAllImports() {
        try {
            // Wait for imports list to be available
            await waitForList();
            console.log(`Found ${window.GT50ImportsList.length} import files to load`);
            
            if (window.GT50ImportsList.length === 0) {
                console.log('No imports to load');
                window.GT50ImportsReady = true;
                window.GT50ImportsLoading = false;
                return;
            }
            
            // Load all scripts in parallel
            const loadPromises = window.GT50ImportsList.map(filename => {
                const path = `import/${filename}`;  // Relative to Index.html, not this file
                return loadScript(path);
            });
            
            // Wait for all to load
            await Promise.all(loadPromises);
            
            console.log('=== All Imports Loaded Successfully ===');
            console.log(`Total imports registered: ${window.GT50.Imports.getAll().length}`);
            
            // Mark as ready
            window.GT50ImportsReady = true;
            window.GT50ImportsLoading = false;
            
            // Trigger re-render if Create New is open
            if (window.render && typeof window.render === 'function') {
                window.render();
            }
            
        } catch (error) {
            console.error('=== Import Loading Error ===');
            console.error(error);
            window.GT50ImportsLoading = false;
            // Still mark as ready so app doesn't hang
            window.GT50ImportsReady = true;
        }
    }
    
    // Start loading
    loadAllImports();
})();

