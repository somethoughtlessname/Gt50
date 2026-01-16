
// ===== IMPORT LOADER =====
// Dynamically loads all import files listed in imports-list.js
// No need to manually add script tags to Index.html!

(function() {
    console.log('=== Import Loader Starting ===');
    
    // Create debug overlay
    let debugDiv = document.getElementById('import-loader-debug');
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.id = 'import-loader-debug';
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,128,0.9);
            color: yellow;
            padding: 10px;
            font-family: monospace;
            font-size: 10px;
            z-index: 9998;
            max-width: 300px;
            border: 2px solid yellow;
        `;
        document.body.appendChild(debugDiv);
    }
    
    function addDebug(msg) {
        debugDiv.innerHTML += msg + '<br>';
        console.log(msg);
    }
    
    addDebug('Import Loader: Starting...');
    
    // Track loading state
    window.GT50ImportsReady = false;
    window.GT50ImportsLoading = true;
    
    // Wait for the imports list to be available
    function waitForList() {
        addDebug('Waiting for imports list...');
        return new Promise((resolve) => {
            if (window.GT50ImportsList) {
                addDebug('Imports list found!');
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.GT50ImportsList) {
                        clearInterval(checkInterval);
                        addDebug('Imports list found!');
                        resolve();
                    }
                }, 50);
            }
        });
    }
    
    // Dynamically load a script
    function loadScript(src) {
        addDebug('Loading: ' + src);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                addDebug('✓ Loaded: ' + src);
                console.log(`✓ Loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                addDebug('✗ FAILED: ' + src);
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
            addDebug(`Found ${window.GT50ImportsList.length} import files`);
            console.log(`Found ${window.GT50ImportsList.length} import files to load`);
            
            if (window.GT50ImportsList.length === 0) {
                addDebug('⚠ No imports to load');
                console.log('No imports to load');
                window.GT50ImportsReady = true;
                window.GT50ImportsLoading = false;
                return;
            }
            
            // Show which files we're about to load
            window.GT50ImportsList.forEach(filename => {
                addDebug('Will load: ' + filename);
            });
            
            // Load all scripts in parallel
            const loadPromises = window.GT50ImportsList.map(filename => {
                const path = `import/${filename}`;
                return loadScript(path);
            });
            
            // Wait for all to load
            await Promise.all(loadPromises);
            
            addDebug('All files loaded!');
            addDebug(`Registered: ${window.GT50.Imports.getAll().length} imports`);
            console.log('=== All Imports Loaded Successfully ===');
            console.log(`Total imports registered: ${window.GT50.Imports.getAll().length}`);
            
            // Show registered imports
            window.GT50.Imports.getAll().forEach(imp => {
                addDebug('  - ' + imp.name);
            });
            
            // Mark as ready
            window.GT50ImportsReady = true;
            window.GT50ImportsLoading = false;
            
            addDebug('✓ IMPORT SYSTEM READY');
            
            // Trigger re-render if Create New is open
            if (window.render && typeof window.render === 'function') {
                window.render();
            }
            
        } catch (error) {
            addDebug('❌ ERROR: ' + error.message);
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

