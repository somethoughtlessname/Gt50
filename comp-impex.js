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
                header: {
                    isMain: false,
                    title: 'DATA MANAGEMENT'
                }
            };
        },
        
        // ===== OPEN WINDOW =====
        open: function(state, onChange) {
            state.isOpen = true;
            onChange();
        },
        
        // ===== CLOSE WINDOW =====
        close: function(state, onChange) {
            state.isOpen = false;
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
                    align-items: center;
                    cursor: ${canCycle ? 'pointer' : 'default'};
                    padding: 0 16px;
                    transition: filter 0.2s;
                    margin-bottom: var(--margin);
                ">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--color-10); font-size: 14px; margin-bottom: 2px;">
                            ${formatName}
                        </div>
                        <div style="font-size: 11px; color: var(--color-7); opacity: 0.8;">
                            ${formatDesc}
                        </div>
                    </div>
                    ${canCycle ? `
                        <div style="
                            font-size: 12px; 
                            color: var(--color-8); 
                            opacity: 0.6;
                            padding: 4px 8px;
                            background: var(--bg-3);
                            border-radius: 4px;
                        ">${currentIndex}/${totalFormats}</div>
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
                <div id="impex-tabs" style="
                    position: fixed;
                    top: var(--card-height);
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                <div id="impex-content" style="
                    padding-top: calc(var(--card-height) * 2 + var(--margin));
                    padding-left: var(--margin);
                    padding-right: var(--margin);
                    padding-bottom: var(--margin);
                    display: flex;
                    flex-direction: column;
                    min-height: calc(100vh - var(--card-height) * 2 - var(--margin));
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
            
            // Render tabs header
            const tabsContainer = container.querySelector('#impex-tabs');
            this.renderTabs(tabsContainer, state, onChange, onClose);
            
            // Render content area
            const contentContainer = container.querySelector('#impex-content');
            if (state.activeTab === 'export') {
                this.renderExportTab(contentContainer, appState, state, onChange);
            } else {
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
                        background: ${state.activeTab === 'export' ? 'var(--accent)' : 'var(--bg-4)'};
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
                        background: ${state.activeTab === 'import' ? 'var(--accent)' : 'var(--bg-4)'};
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
            const exportText = this.exportData(appState);
            
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
                        margin-bottom: var(--margin);
                        outline: none;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                    ">${exportText}</textarea>
                
                <div style="display: flex; gap: var(--margin); margin-bottom: var(--margin); flex-shrink: 0;">
                    <button id="copy-btn" style="
                        flex: 1;
                        background: var(--accent);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 45px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        font-family: inherit;
                        transition: filter 0.2s;
                    ">COPY TO CLIPBOARD</button>
                    <button id="download-btn" style="
                        flex: 1;
                        background: var(--primary);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 45px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        font-family: inherit;
                        transition: filter 0.2s;
                    ">DOWNLOAD FILE</button>
                </div>
                
                <div id="export-status" style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    padding: 12px;
                    text-align: center;
                    font-size: 12px;
                    color: var(--color-10);
                    opacity: 0.7;
                    flex-shrink: 0;
                ">Ready to export - ${formatName} format</div>
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
                document.getElementById('export-status').textContent = '✓ Copied to clipboard!';
                setTimeout(() => {
                    document.getElementById('export-status').textContent = `Ready to export - ${formatName} format`;
                }, 2000);
            };
            copyBtn.onmouseover = () => copyBtn.style.filter = 'brightness(1.2)';
            copyBtn.onmouseout = () => copyBtn.style.filter = 'brightness(1)';
            
            // Download button
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.onclick = () => {
                const ext = adapter.getFileExtension();
                const blob = new Blob([exportText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GT50_Export_${new Date().toISOString().slice(0, 10)}.${ext}`;
                a.click();
                URL.revokeObjectURL(url);
                document.getElementById('export-status').textContent = '✓ File downloaded!';
                setTimeout(() => {
                    document.getElementById('export-status').textContent = `Ready to export - ${formatName} format`;
                }, 2000);
            };
            downloadBtn.onmouseover = () => downloadBtn.style.filter = 'brightness(1.2)';
            downloadBtn.onmouseout = () => downloadBtn.style.filter = 'brightness(1)';
        },
        
        // ===== RENDER IMPORT TAB =====
        renderImportTab: function(container, onClose, appState, state, onChange) {
            const adapter = this.getCurrentFormat();
            const formatName = adapter.getFormatName();
            const fileExt = adapter.getFileExtension();
            
            container.innerHTML = `
                <div id="format-selector-container"></div>
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
                        margin-bottom: var(--margin);
                        outline: none;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                    "></textarea>
                
                <div style="display: flex; gap: var(--margin); margin-bottom: var(--margin); flex-shrink: 0;">
                    <button id="import-btn" style="
                        flex: 1;
                        background: var(--accent);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 45px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        font-family: inherit;
                        transition: filter 0.2s;
                    ">IMPORT DATA</button>
                    <button id="upload-btn" style="
                        flex: 1;
                        background: var(--primary);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 45px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        font-family: inherit;
                        transition: filter 0.2s;
                    ">UPLOAD FILE</button>
                </div>
                
                <div id="import-status" style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    padding: 12px;
                    text-align: center;
                    font-size: 12px;
                    color: var(--color-10);
                    opacity: 0.7;
                    flex-shrink: 0;
                ">⚠️ Warning: Importing will replace all current data!</div>
                
                <input type="file" id="file-input" accept=".${fileExt},.json,.gt50,.gt50c,.gt50u,.gt50uc,.gt50m" style="display: none;">
            `;
            
            // Render format selector at top
            const formatContainer = container.querySelector('#format-selector-container');
            this.renderFormatSelector(formatContainer, state, onChange);
            
            const importBtn = document.getElementById('import-btn');
            const uploadBtn = document.getElementById('upload-btn');
            const fileInput = document.getElementById('file-input');
            const textarea = document.getElementById('import-textarea');
            const status = document.getElementById('import-status');
            
            // Import button
            importBtn.onclick = () => {
                const text = textarea.value;
                if (!text.trim()) {
                    status.textContent = '❌ Error: No data to import';
                    status.style.color = 'var(--color-1)';
                    return;
                }
                
                const result = this.importData(text);
                
                if (result.success) {
                    if (!appState) {
                        status.textContent = '❌ Error: Cannot access app state';
                        status.style.color = 'var(--color-1)';
                        return;
                    }
                    
                    // Update app state
                    appState.tabs = result.data.tabs;
                    appState.tabComponents = result.data.tabComponents;
                    
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
                    
                    // Show success with detected format
                    const formatMsg = result.detectedFormat ? ` (${result.detectedFormat} format)` : '';
                    status.textContent = `✓ Import successful${formatMsg}!`;
                    status.style.color = 'var(--accent)';
                    
                } else {
                    status.textContent = `❌ Import failed: ${result.error}`;
                    status.style.color = 'var(--color-1)';
                }
            };
            importBtn.onmouseover = () => importBtn.style.filter = 'brightness(1.2)';
            importBtn.onmouseout = () => importBtn.style.filter = 'brightness(1)';
            
            // Upload button
            uploadBtn.onclick = () => {
                fileInput.click();
            };
            uploadBtn.onmouseover = () => uploadBtn.style.filter = 'brightness(1.2)';
            uploadBtn.onmouseout = () => uploadBtn.style.filter = 'brightness(1)';
            
            // File input handler
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    textarea.value = event.target.result;
                    status.textContent = `📄 File loaded: ${file.name}`;
                    status.style.color = 'var(--primary)';
                };
                reader.readAsText(file);
            };
        }
    };
    
    // ===== AUTO-REGISTER BUILT-IN JSON FORMAT =====
    window.GT50Lib.ImpEx.formatAdapters.push(window.GT50Lib.ImpEx.builtInJSON);
    console.log('Registered built-in format: JSON v1.0.0');
})();