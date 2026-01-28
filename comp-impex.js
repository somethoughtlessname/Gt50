(function() {
    // Static injector ID
    const INJECTOR_ID = '0012';
    
    // ===== IMPORT/EXPORT WINDOW COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.ImpEx = {
        // ===== FORMAT ADAPTER REGISTRY =====
        formatAdapters: [],
        currentFormatIndex: 0,
        
        // ===== BUILT-IN JSON FORMAT =====
        builtInJSON: {
            getFormatName: function() { return 'JSON'; },
            getDescription: function() { return 'Standard JSON format'; },
            getVersion: function() { return '1.0.0'; },
            getFileExtension: function() { return 'json'; },
            serialize: function(jsonData) {
                return JSON.stringify(jsonData, null, 2);
            },
            deserialize: function(formatData) {
                return JSON.parse(formatData);
            },
            validate: function(formatData) {
                try {
                    const parsed = JSON.parse(formatData);
                    if (!parsed.version || !parsed.data || !parsed.data.tabs || !parsed.data.tabComponents) {
                        return { valid: false, error: 'Invalid JSON structure' };
                    }
                    return { valid: true };
                } catch (error) {
                    return { valid: false, error: error.message };
                }
            }
        },
        
        // ===== REGISTER FORMAT ADAPTER =====
        registerFormat: function(adapter) {
            // Validate adapter has required methods
            const requiredMethods = ['getFormatName', 'getDescription', 'getVersion', 'getFileExtension', 'serialize', 'deserialize', 'validate'];
            for (const method of requiredMethods) {
                if (typeof adapter[method] !== 'function') {
                    console.error(`Format adapter missing required method: ${method}`);
                    return false;
                }
            }
            
            this.formatAdapters.push(adapter);
            console.log(`Registered format: ${adapter.getFormatName()} v${adapter.getVersion()}`);
            return true;
        },
        
        // ===== GET CURRENT FORMAT =====
        getCurrentFormat: function() {
            // Should always have at least built-in JSON
            return this.formatAdapters[this.currentFormatIndex] || this.builtInJSON;
        },
        
        // ===== CYCLE FORMAT =====
        cycleFormat: function(state, onChange) {
            if (this.formatAdapters.length <= 1) return;
            
            this.currentFormatIndex = (this.currentFormatIndex + 1) % this.formatAdapters.length;
            onChange();
        },
        
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                isOpen: false,
                activeTab: 'export',
                exportOverrideData: null, // For exporting a single nest/component - stores RAW export package to be serialized in any format
                header: {
                    isMain: false,
                    title: 'DATA MANAGEMENT'
                }
            };
        },
        
        // ===== OPEN WINDOW =====
        open: function(state, onChange) {
            state.isOpen = true;
            state.activeTab = 'export'; // Always open to export tab
            onChange();
        },
        
        // ===== CLOSE WINDOW =====
        close: function(state, onChange) {
            state.isOpen = false;
            state.exportOverrideData = null; // Clear override data
            state.header.title = 'DATA MANAGEMENT'; // Reset title
            onChange();
        },
        
        // ===== CLEAN STATE FOR EXPORT =====
        cleanState: function(state) {
            const cleaned = JSON.parse(JSON.stringify(state));
            
            function cleanComponent(comp) {
                if (comp.state) {
                    delete comp.state.open;
                    delete comp.state.numpadOpen;
                    delete comp.state.viewOpen;
                    
                    // Recursively clean nested components
                    if (comp.type === 'nest' && comp.state.tabComponents) {
                        comp.state.tabComponents.forEach(componentArray => {
                            componentArray.forEach(cleanComponent);
                        });
                        
                        if (comp.state.tabs) {
                            delete comp.state.tabs.editingTab;
                        }
                    }
                    
                    if (comp.type === 'cycle' && comp.state.tabComponents) {
                        comp.state.tabComponents.forEach(componentArray => {
                            componentArray.forEach(cleanComponent);
                        });
                        
                        if (comp.state.tabs) {
                            delete comp.state.tabs.editingTab;
                        }
                    }
                }
            }
            
            // Clean all tabs
            cleaned.tabComponents.forEach(componentArray => {
                componentArray.forEach(cleanComponent);
            });
            
            // Clean root tabs
            if (cleaned.tabs) {
                delete cleaned.tabs.editingTab;
            }
            
            return cleaned;
        },
        
        // ===== EXPORT DATA (using current format) =====
        exportData: function(appState) {
            const cleaned = this.cleanState(appState);
            
            const exportPackage = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                app: "GT50 Tester",
                data: {
                    tabs: cleaned.tabs,
                    tabComponents: cleaned.tabComponents
                }
            };
            
            const adapter = this.getCurrentFormat();
            
            try {
                return adapter.serialize(exportPackage);
            } catch (error) {
                console.error('Export error:', error);
                // Fallback to built-in JSON
                return this.builtInJSON.serialize(exportPackage);
            }
        },
        
        // ===== EXPORT SINGLE NEST =====
        // Returns the raw export package (not serialized) so it can be serialized in any format
        exportNest: function(nestState, nestName) {
            // Clean the nest state (remove temporary UI state)
            const cleanedNest = JSON.parse(JSON.stringify(nestState));
            
            function cleanComponent(comp) {
                if (comp.state) {
                    delete comp.state.open;
                    delete comp.state.numpadOpen;
                    delete comp.state.viewOpen;
                    delete comp.state.actionState;
                    delete comp.state.editWindow;
                    delete comp.state.importWindow;
                    
                    // Recursively clean nested components
                    if ((comp.type === 'nest' || comp.type === 'cycle') && comp.state.tabComponents) {
                        comp.state.tabComponents.forEach(componentArray => {
                            componentArray.forEach(cleanComponent);
                        });
                        
                        if (comp.state.tabs) {
                            delete comp.state.tabs.editingTab;
                        }
                    }
                }
            }
            
            // Clean all tabs in the nest
            if (cleanedNest.tabComponents) {
                cleanedNest.tabComponents.forEach(componentArray => {
                    componentArray.forEach(cleanComponent);
                });
            }
            
            // Clean root tabs
            if (cleanedNest.tabs) {
                delete cleanedNest.tabs.editingTab;
            }
            
            // Remove action state and edit window from the nest itself
            delete cleanedNest.actionState;
            delete cleanedNest.editWindow;
            delete cleanedNest.autoSortDropdownOpen;
            delete cleanedNest.summaryDropdownOpen;
            delete cleanedNest.summaryShowChildNestProgressDropdownOpen;
            
            // Create export package in same format as full export
            // Return RAW package, not serialized, so it can be serialized in any format
            const showSummary = cleanedNest.showSummary !== undefined ? cleanedNest.showSummary : false;
            const summaryMode = cleanedNest.summaryChildNestProgressMode;
            const exportPackage = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                app: "GT50 Tester",
                type: "nest",
                name: nestName || cleanedNest.name || "Nest",
                data: {
                    tabs: cleanedNest.tabs,
                    tabComponents: cleanedNest.tabComponents,
                    // Include nest-level properties with defaults
                    color: cleanedNest.color || 'GRAY',
                    autoSortByLastUpdated: cleanedNest.autoSortByLastUpdated !== undefined ? cleanedNest.autoSortByLastUpdated : false,
                    showSummary: showSummary,
                    summaryShowChildNestProgress: cleanedNest.summaryShowChildNestProgress !== undefined ? cleanedNest.summaryShowChildNestProgress : false,
                    summaryChildNestProgressMode: showSummary ? (summaryMode || 'first-tab') : '0'
                }
            };
            
            return exportPackage;
        },
        
        // ===== AUTO-DETECT FORMAT AND IMPORT DATA =====
        importData: function(formatData) {
            console.log('=== AUTO-DETECT FORMAT START ===');
            console.log('Data length:', formatData.length, 'chars');
            console.log('First 100 chars:', formatData.substring(0, 100));
            
            let detectedAdapter = null;
            let detectedFormatName = null;
            
            // Try to auto-detect format by testing all adapters
            console.log('Testing', this.formatAdapters.length, 'format adapters...');
            
            for (let i = 0; i < this.formatAdapters.length; i++) {
                const adapter = this.formatAdapters[i];
                const formatName = adapter.getFormatName();
                
                console.log(`Testing ${formatName}...`);
                
                try {
                    const validation = adapter.validate(formatData);
                    
                    if (validation.valid) {
                        console.log(`✓ ${formatName} format detected!`);
                        detectedAdapter = adapter;
                        detectedFormatName = formatName;
                        break; // Found valid format, stop searching
                    } else {
                        console.log(`✗ ${formatName} validation failed:`, validation.error);
                    }
                } catch (error) {
                    console.log(`✗ ${formatName} validation error:`, error.message);
                }
            }
            
            // If no format detected, use current format as fallback
            if (!detectedAdapter) {
                console.log('⚠️ No format auto-detected, using current format as fallback');
                detectedAdapter = this.getCurrentFormat();
                detectedFormatName = detectedAdapter.getFormatName();
            }
            
            console.log('=== USING FORMAT:', detectedFormatName, '===');
            
            // Now import using the detected adapter
            try {
                // Validate first
                const validation = detectedAdapter.validate(formatData);
                if (!validation.valid) {
                    return { 
                        success: false, 
                        error: `${detectedFormatName} validation failed: ${validation.error}` 
                    };
                }
                
                console.log('✓ Validation passed');
                
                // Deserialize
                const parsed = detectedAdapter.deserialize(formatData);
                console.log('✓ Deserialization complete');
                
                // Validate structure
                if (!parsed.version) {
                    throw new Error('Invalid format: missing version');
                }
                
                if (!parsed.data) {
                    throw new Error('Invalid format: missing data');
                }
                
                if (!parsed.data.tabs || !parsed.data.tabComponents) {
                    throw new Error('Invalid format: missing tabs or tabComponents');
                }
                
                console.log('✓ Structure validation passed');
                console.log('=== IMPORT SUCCESS ===');
                
                return {
                    success: true,
                    data: parsed.data,
                    detectedFormat: detectedFormatName // Include detected format in result
                };
                
            } catch (error) {
                console.error('=== IMPORT ERROR ===');
                console.error('Error:', error.message);
                console.error('Stack:', error.stack);
                
                return {
                    success: false,
                    error: `${detectedFormatName} import failed: ${error.message}`
                };
            }
        },
        
        // ===== RENDER FORMAT SELECTOR =====
        renderFormatSelector: function(container, state, onChange) {
            const adapter = this.getCurrentFormat();
            const formatName = adapter.getFormatName();
            const formatDesc = adapter.getDescription();
            const currentIndex = this.currentFormatIndex + 1;
            const totalFormats = this.formatAdapters.length;
            const canCycle = this.formatAdapters.length > 1;
            
            container.innerHTML = `
                <div data-action="${canCycle ? 'cycle-format' : 'none'}" style="
                    height: var(--card-height);
                    background: var(--bg-4);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    display: flex;
                    cursor: ${canCycle ? 'pointer' : 'default'};
                    transition: filter 0.2s;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                ">
                    <!-- Left Half: Format Name and Description -->
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 0 12px;
                        border-right: var(--border-width) solid var(--border-color);
                    ">
                        <div style="
                            font-weight: 700;
                            color: var(--color-10);
                            font-size: 12px;
                            text-align: center;
                            margin-bottom: 2px;
                        ">${formatName.toUpperCase()}</div>
                        <div style="
                            font-size: 10px;
                            color: var(--color-10);
                            font-weight: 700;
                            opacity: 0.8;
                            text-align: center;
                        ">${formatDesc.toUpperCase()}</div>
                    </div>
                    
                    ${canCycle ? `
                    <!-- Right Half: Tap to Change + Counter -->
                    <div style="
                        flex: 1;
                        display: flex;
                    ">
                        <!-- Left: Tap to Change -->
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 0 8px;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="
                                font-size: 10px;
                                color: var(--color-10);
                                font-weight: 700;
                                opacity: 0.8;
                                text-align: center;
                                line-height: 1.2;
                            ">TAP TO<br>CHANGE FORMAT</div>
                        </div>
                        
                        <!-- Right: Counter -->
                        <div style="
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <div style="
                                font-size: 12px;
                                color: var(--color-10);
                                font-weight: 700;
                            ">${currentIndex}/${totalFormats}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            `;
            
            if (canCycle) {
                const selector = container.querySelector('[data-action="cycle-format"]');
                selector.onclick = () => {
                    this.cycleFormat(state, onChange);
                };
                selector.onmouseover = () => {
                    selector.style.filter = 'brightness(1.1)';
                };
                selector.onmouseout = () => {
                    selector.style.filter = 'brightness(1)';
                };
            }
        },
        
        // ===== RENDER =====
        render: function(container, state, onChange, onClose, appState) {
            if (!state.isOpen) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            
            // Check if this is export-only mode (single nest export)
            const isExportOnly = !!state.exportOverrideData;
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-1);
                z-index: 2000;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            `;
            
            container.innerHTML = `
                <div id="impex-header" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                ${!isExportOnly ? `
                <div id="impex-tabs" style="
                    position: fixed;
                    top: var(--card-height);
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                ` : ''}
                <div id="impex-content" style="
                    padding-top: calc(var(--card-height) * ${isExportOnly ? '1' : '2'} + var(--margin));
                    padding-left: var(--margin);
                    padding-right: var(--margin);
                    padding-bottom: calc(var(--card-height) + var(--margin));
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    box-sizing: border-box;
                "></div>
            `;
            
            // Render main header
            const headerContainer = container.querySelector('#impex-header');
            GT50Lib.Header.renderBuild(
                headerContainer, 
                state.header, 
                onChange,
                onClose,
                onClose,
                null,
                null
            );
            
            // Render tabs header (only if not export-only mode)
            if (!isExportOnly) {
                const tabsContainer = container.querySelector('#impex-tabs');
                this.renderTabs(tabsContainer, state, onChange, onClose);
            }
            
            // Render content area
            const contentContainer = container.querySelector('#impex-content');
            if (isExportOnly || state.activeTab === 'export') {
                this.renderExportTab(contentContainer, appState, state, onChange);
            } else if (state.activeTab === 'import') {
                this.renderImportTab(contentContainer, onClose, appState, state, onChange);
            }
        },
        
        // ===== RENDER TABS =====
        renderTabs: function(container, state, onChange, onClose) {
            container.innerHTML = `
                <div style="
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                ">
                    <div data-tab="export" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.activeTab === 'export' ? 'var(--color-4)' : 'var(--bg-4)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">EXPORT</div>
                    <div data-tab="import" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.activeTab === 'import' ? 'var(--color-4)' : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">IMPORT</div>
                </div>
            `;
            
            const exportTab = container.querySelector('[data-tab="export"]');
            const importTab = container.querySelector('[data-tab="import"]');
            
            exportTab.onclick = () => {
                state.activeTab = 'export';
                onChange();
            };
            exportTab.onmouseover = () => exportTab.style.filter = 'brightness(1.1)';
            exportTab.onmouseout = () => exportTab.style.filter = 'brightness(1)';
            
            importTab.onclick = () => {
                state.activeTab = 'import';
                onChange();
            };
            importTab.onmouseover = () => importTab.style.filter = 'brightness(1.1)';
            importTab.onmouseout = () => importTab.style.filter = 'brightness(1)';
        },
        
        // ===== RENDER EXPORT TAB =====
        renderExportTab: function(container, appState, state, onChange) {
            const adapter = this.getCurrentFormat();
            const formatName = adapter.getFormatName();
            
            // If we have override data (raw export package), serialize it now with current format
            // Otherwise, export the full appState
            let exportText;
            if (state.exportOverrideData) {
                try {
                    exportText = adapter.serialize(state.exportOverrideData);
                } catch (error) {
                    console.error('Export serialization error:', error);
                    exportText = this.builtInJSON.serialize(state.exportOverrideData);
                }
            } else {
                exportText = this.exportData(appState);
            }
            
            container.innerHTML = `
                <div id="format-selector-container"></div>
                <textarea 
                    id="export-textarea" 
                    readonly
                    style="
                        width: 100%;
                        flex: 1;
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        color: var(--color-10);
                        padding: 12px;
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        line-height: 1.4;
                        resize: none;
                        outline: none;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                    ">${exportText}</textarea>
                
                <div style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    display: flex;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    z-index: 1000;
                    flex-shrink: 0;
                ">
                    <button id="copy-btn" style="
                        flex: 1;
                        height: 100%;
                        background: var(--color-4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                        cursor: pointer;
                        transition: filter 0.2s;
                        border: none;
                        font-family: inherit;
                    ">COPY TO CLIPBOARD</button>
                </div>
            `;
            
            // Render format selector at top
            const formatContainer = container.querySelector('#format-selector-container');
            this.renderFormatSelector(formatContainer, state, onChange);
            
            // Auto-select text
            const textarea = document.getElementById('export-textarea');
            setTimeout(() => {
                textarea.focus();
                textarea.select();
            }, 100);
            
            // Copy button
            const copyBtn = document.getElementById('copy-btn');
            copyBtn.onclick = () => {
                textarea.select();
                document.execCommand('copy');
            };
            copyBtn.onmouseover = () => copyBtn.style.filter = 'brightness(1.2)';
            copyBtn.onmouseout = () => copyBtn.style.filter = 'brightness(1)';
        },
        
        // ===== RENDER IMPORT TAB =====
        renderImportTab: function(container, onClose, appState, state, onChange) {
            const adapter = this.getCurrentFormat();
            const formatName = adapter.getFormatName();
            const fileExt = adapter.getFileExtension();
            
            container.innerHTML = `
                <div style="
                    height: var(--card-height);
                    background: var(--color-10);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    padding: 0 12px;
                ">
                    <div style="
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-1);
                        text-align: center;
                    ">WARNING: IMPORTING WILL REPLACE ALL CURRENT DATA!</div>
                </div>
                
                <textarea 
                    id="import-textarea" 
                    placeholder="Paste your GT50 export here (any format will be auto-detected)..."
                    style="
                        width: 100%;
                        flex: 1;
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        color: var(--color-10);
                        padding: 12px;
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        line-height: 1.4;
                        resize: none;
                        outline: none;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                    "></textarea>
                
                <div style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    display: flex;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    z-index: 1000;
                    flex-shrink: 0;
                ">
                    <button id="import-btn" style="
                        flex: 1;
                        height: 100%;
                        background: var(--color-4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                        cursor: pointer;
                        transition: filter 0.2s;
                        border: none;
                        font-family: inherit;
                    ">IMPORT DATA</button>
                </div>
            `;
            
            const importBtn = document.getElementById('import-btn');
            const textarea = document.getElementById('import-textarea');
            
            // Import button
            importBtn.onclick = () => {
                const text = textarea.value;
                if (!text.trim()) {
                    return;
                }
                
                const result = this.importData(text);
                
                if (result.success) {
                    if (!appState) {
                        return;
                    }
                    
                    // Update app state
                    appState.tabs = result.data.tabs;
                    appState.tabComponents = result.data.tabComponents;
                    
                    // If importing nest data with nest-level properties, restore them with defaults
                    appState.color = result.data.color !== undefined ? result.data.color : 'GRAY';
                    appState.autoSortByLastUpdated = result.data.autoSortByLastUpdated !== undefined ? result.data.autoSortByLastUpdated : false;
                    const showSummary = result.data.showSummary !== undefined ? result.data.showSummary : false;
                    appState.showSummary = showSummary;
                    appState.summaryShowChildNestProgress = result.data.summaryShowChildNestProgress !== undefined ? result.data.summaryShowChildNestProgress : false;
                    // If summaryChildNestProgressMode is '0' or null, treat as null
                    const summaryMode = result.data.summaryChildNestProgressMode;
                    appState.summaryChildNestProgressMode = (summaryMode === '0' || summaryMode === null) ? null : (summaryMode || 'first-tab');
                    
                    // Update global state
                    if (typeof window !== 'undefined') {
                        window.nextId = Date.now();
                        window.navigationStack = [];
                        window.scrollStack = [];
                    }
                    
                    // Reset header
                    if (!appState.header) {
                        appState.header = GT50Lib.Header.defaultState();
                    }
                    appState.header.isMain = true;
                    appState.header.title = 'GT50 TESTER';
                    
                    // Close window
                    appState.impex.isOpen = false;
                    
                    // Render and save
                    if (typeof window !== 'undefined' && window.render) {
                        window.render(true);
                    }
                    if (typeof window !== 'undefined' && window.saveState) {
                        window.saveState();
                    }
                }
            };
            importBtn.onmouseover = () => importBtn.style.filter = 'brightness(1.2)';
            importBtn.onmouseout = () => importBtn.style.filter = 'brightness(1)';
        }
    };
    
    // ===== AUTO-REGISTER BUILT-IN JSON FORMAT =====
    window.GT50Lib.ImpEx.formatAdapters.push(window.GT50Lib.ImpEx.builtInJSON);
    console.log('Registered built-in format: JSON v1.0.0');
})();