(function() {
    // ===== IMPORT REGISTRY SYSTEM =====
    // Manages import presets for the Create New → Import tab
    // Each import is a pre-configured nest structure with complete data
    
    window.GT50 = window.GT50 || {};
    window.GT50.Imports = {
        registry: [],
        
        // ===== REGISTER AN IMPORT =====
        register: function(importData) {
            /*
            importData format:
            {
                id: 'game-tracker-rpg',
                name: 'RPG Game Tracker',
                description: 'Track quests, progress, and dailies for RPG games',
                data: <GT50 export data in any format - will be auto-detected>
            }
            
            The 'data' field accepts:
            - Complete GT50 export package (as exported from GT50)
            - Nest export data (any format)
            - JSON string, GT50 string, compressed string
            - JavaScript object (will be stringified)
            
            GT50Lib.ImpEx.importData() will auto-detect and parse the format
            */
            
            // Validate required fields
            if (!importData.id || !importData.name || !importData.data) {
                console.error('Import registration failed: missing required fields (id, name, data)');
                return false;
            }
            
            // Check for duplicate IDs
            if (this.registry.find(imp => imp.id === importData.id)) {
                console.error(`Import registration failed: duplicate ID "${importData.id}"`);
                return false;
            }
            
            // Store data as-is - will be converted to string when needed
            // This allows both objects and strings to work
            this.registry.push({
                id: importData.id,
                name: importData.name,
                description: importData.description || '',
                data: importData.data // Keep original format
            });
            
            console.log(`✓ Import registered: ${importData.name} (${importData.id})`);
            return true;
        },
        
        // ===== GET IMPORT BY ID =====
        get: function(id) {
            return this.registry.find(imp => imp.id === id);
        },
        
        // ===== GET ALL IMPORTS =====
        getAll: function() {
            return this.registry;
        },
        
        // ===== PARSE IMPORT DATA =====
        // Uses GT50Lib.ImpEx to parse the data (auto-detects format)
        parseImportData: function(importId) {
            const importObj = this.get(importId);
            if (!importObj) {
                return { success: false, error: 'Import not found' };
            }
            
            // Check if ImpEx is available
            if (!window.GT50Lib || !window.GT50Lib.ImpEx) {
                return { success: false, error: 'ImpEx system not loaded' };
            }
            
            // Convert data to string if it's an object
            let dataStr = importObj.data;
            if (typeof dataStr === 'object') {
                try {
                    dataStr = JSON.stringify(dataStr);
                } catch (e) {
                    return { success: false, error: 'Failed to stringify import data: ' + e.message };
                }
            }
            
            // Parse using ImpEx (auto-detects format)
            const result = window.GT50Lib.ImpEx.importData(dataStr);
            
            if (result.success) {
                return {
                    success: true,
                    name: importObj.name,
                    data: result.data, // Contains {tabs, tabComponents}
                    detectedFormat: result.detectedFormat
                };
            } else {
                return {
                    success: false,
                    error: result.error
                };
            }
        }
    };
    
    console.log('✓ Import Registry System loaded');
})();


