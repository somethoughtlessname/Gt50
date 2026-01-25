(function() {
    // Static injector ID
    const INJECTOR_ID = '0022';
    
    // ===== CREATE NEW ENTRY COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    // ===== TEMPLATE REGISTRY =====
    window.GT50 = window.GT50 || {};
    window.GT50.Templates = {
        registry: [],
        
        register: function(template) {
            /*
            template = {
                id: 'basic',
                name: 'BASIC',
                description: 'Single tab with essential tracking components',
                generate: function() {
                    return {
                        tabs: { tabs: [{name: 'Main', label: 'Main', color: ''}] },
                        tabComponents: [[
                            { type: 'list', state: {...} },
                            { type: 'progress', state: {...} }
                        ]]
                    };
                }
            }
            */
            this.registry.push(template);
        },
        
        get: function(id) {
            return this.registry.find(t => t.id === id);
        },
        
        getAll: function() {
            return this.registry;
        }
    };
    
    // ===== IMPORT REGISTRY =====
    // Import registry is now defined in Import-registry.js (loaded before this file)
    // Import files will auto-register by calling window.GT50.Imports.register({...})
    
    // ===== CREATE NEW COMPONENT =====
    window.GT50Lib.CreateNew = {
        // ===== COLOR OPTIONS =====
        colors: [
            { name: 'GRAY', value: 'var(--color-9)' },    // Moved to index 0
    { name: 'RED', value: 'var(--color-1)' },
    { name: 'ORANGE', value: 'var(--color-2)' },
    { name: 'YELLOW', value: 'var(--color-3)' },
    { name: 'GREEN', value: 'var(--color-4)' },
    { name: 'BLUE', value: 'var(--color-5)' },
    { name: 'PURPLE', value: 'var(--color-6)' },
    { name: 'PINK', value: 'var(--color-7)' }
],
        
        // ===== STATE FACTORY =====
        defaultState: function() {
    return {
        isOpen: false,
        name: '',
        selectedTemplate: 'custom',
        selectedImport: null,
        currentColorIndex: 0, // Changed from 7 to 0 (GRAY is now first)
        cycleMode: false,
        autoSortByLastUpdated: false,
        autoSortDropdownOpen: false,
                tabs: {
                    tabs: [
                        { name: 'Templates', label: 'Templates', color: 'var(--color-5-2)' },
                        { name: 'Settings', label: 'Settings', color: 'var(--color-5-2)' },
                        { name: 'Import', label: 'Import', color: 'var(--color-5-2)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                summaryState: {
                    showSummary: false,
                    summaryDropdownOpen: false,
                    summaryIncludeChildren: false,
                    summaryIncludeChildrenDropdownOpen: false,
                    summaryDisplayMode: null,
                    summaryShowChildNestProgress: false,
                    summaryShowChildNestProgressDropdownOpen: false,
                    summaryChildNestProgressMode: 'first-tab' // 'first-tab' or 'all-tabs'
                }
            };
        },
        
       // ===== CREATE ENTRY HELPER =====
createEntry: function(state, nextId, currentComponents) {
    // SPECIAL CASE: Import selected - create import component
    if (state.selectedImport) {
        console.log('CreateNew.createEntry: Creating import component for', state.selectedImport);
        
        const importObj = window.GT50.Imports.get(state.selectedImport);
        if (!importObj) {
            console.error('Import not found:', state.selectedImport);
            return null;
        }
        
        // Create import-type entry
        const newEntry = {
            id: nextId,
            type: 'import',
            state: GT50Lib.Import.defaultState()
        };
        
        // Set the name and store the import ID for later parsing
        newEntry.state.name = importObj.name;
        newEntry.state.selectedImportId = state.selectedImport;
        
        return newEntry;
    }
    
    // NORMAL CASE: Creating nest/cycle
    if (!state.name || state.name.trim() === '') return null;
    
    // Safety check: ensure currentColorIndex is valid, default to 0 (GRAY) if not
    let colorIndex = state.currentColorIndex;
    if (typeof colorIndex !== 'number' || colorIndex < 0 || colorIndex >= this.colors.length) {
        console.log('CreateNew.createEntry: Invalid color index, defaulting to 0 (GRAY)');
        colorIndex = 0;
        state.currentColorIndex = 0; // Update state for consistency
    }
    
    const entryType = state.cycleMode ? 'cycle' : 'nest';
    const newEntry = {
        id: nextId,
        type: entryType,
        state: entryType === 'nest' 
            ? GT50Lib.Nest.defaultState() 
            : GT50Lib.Cycle.defaultState()
    };
    
    newEntry.state.name = state.name.trim();
    newEntry.state.color = this.colors[colorIndex].name; // Use validated colorIndex
    newEntry.state.autoSortByLastUpdated = state.autoSortByLastUpdated || false;
    
    // Apply summary settings
    if (state.summaryState) {
        newEntry.state.showSummary = state.summaryState.showSummary || false;
        newEntry.state.summaryIncludeChildren = state.summaryState.summaryIncludeChildren || false;
        newEntry.state.summaryDisplayMode = state.summaryState.summaryDisplayMode || null;
        newEntry.state.summaryShowChildNestProgress = state.summaryState.summaryShowChildNestProgress || false;
        newEntry.state.summaryChildNestProgressMode = state.summaryState.summaryChildNestProgressMode || 'first-tab';
    }
    
    // For custom template, ensure NO tabs are auto-created
    if (state.selectedTemplate === 'custom') {
        newEntry.state.tabs = {
            tabs: [],
            activeViewTab: 0,
            selectedBuildTab: 0
        };
        newEntry.state.tabComponents = [[]];
    }
    
    // Apply template if not custom
    if (state.selectedTemplate !== 'custom' && window.GT50 && window.GT50.Templates) {
        const template = window.GT50.Templates.get(state.selectedTemplate);
        if (template) {
            const generated = template.generate();
            if (generated.tabs) {
                newEntry.state.tabs = generated.tabs;
            }
            if (generated.tabComponents) {
                newEntry.state.tabComponents = generated.tabComponents;
            }
        }
    }
    
    return newEntry;
},
        
        // ===== WINDOW RENDERER =====
        render: function(container, state, onChange, onClose, onCreate) {
            console.log('CreateNew.render called, state.isOpen:', state.isOpen);
            
            if (!state.isOpen) {
                container.innerHTML = '';
                container.style.display = 'none';
                this._lastOpenState = false;
                return;
            }
            
            // ===== CRITICAL FIX: Reset to defaults when transitioning from closed->open =====
            // Index.html sets currentColorIndex to 4 (BLUE) on close, we need to override it
            const justOpened = (this._lastOpenState === false || this._lastOpenState === undefined);
            if (justOpened && !state.editMode) {
    console.log('CreateNew: Window just opened, resetting to defaults');
    state.name = '';
    state.selectedTemplate = 'custom';
    state.selectedImport = null;
    state.currentColorIndex = 0; // Changed from 7 to 0 (GRAY is now first)
    state.cycleMode = false;
    state.autoSortByLastUpdated = false;
                state.summaryState = {
                    showSummary: false,
                    summaryIncludeChildren: false,
                    summaryDisplayMode: null,
                    summaryShowChildNestProgress: false,
                    summaryChildNestProgressMode: 'first-tab'
                };
            }
            this._lastOpenState = true;
            
            // Double-check: Ensure currentColorIndex is valid
            if (typeof state.currentColorIndex !== 'number' || 
    state.currentColorIndex < 0 || 
    state.currentColorIndex >= this.colors.length) {
    state.currentColorIndex = 0; // Changed from 7 to 0
    console.log('CreateNew: Invalid currentColorIndex, defaulting to 0 (GRAY)');
}
            
            console.log('CreateNew: Rendering with currentColorIndex =', state.currentColorIndex, '(' + this.colors[state.currentColorIndex].name + ')');
            
            // Ensure tabs structure exists and reset to Templates tab when opening
            if (!state.tabs) {
                state.tabs = {
                    tabs: [
                        { name: 'Templates', label: 'Templates', color: 'var(--color-5-2)' },
                        { name: 'Settings', label: 'Settings', color: 'var(--color-5-2)' },
                        { name: 'Import', label: 'Import', color: 'var(--color-5-2)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                };
            }
            
            // Ensure Import tab exists if missing (migration)
            if (state.tabs.tabs.length === 2) {
                state.tabs.tabs.push({ name: 'Import', label: 'Import', color: 'var(--color-5-2)' });
            }
            
            // Ensure tab colors are set to nest color
            state.tabs.tabs.forEach(tab => {
                tab.color = 'var(--color-5-2)';
            });
            
            // Check if we're in edit mode
            const isEditMode = state.editMode === true;
            
            console.log('CreateNew window should be visible');
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-2);
                z-index: 2000;
                display: flex;
                flex-direction: column;
            `;
            
            // Get available templates
            const templates = (window.GT50 && window.GT50.Templates) ? window.GT50.Templates.getAll() : [];
            const hasTemplates = templates && templates.length > 0;
            
            // Determine summary color based on current card color
            const summaryColor = this.colors[state.currentColorIndex].value;
            
            // Determine active tab
            const activeTab = state.tabs.activeViewTab === 0 ? 'templates' : 
                            state.tabs.activeViewTab === 1 ? 'settings' : 'import';
            
            // Check if we should animate color selection
            const shouldAnimateColor = state._animateColorIndex !== undefined;
            
            // ===== NAME SECTION (FIRST IN BOTH TABS) =====
            const nameSection = `
                <!-- Name Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">ENTRY NAME</div>
                </div>
                
                <!-- Name Input Card -->
                <div style="
                    background: var(--bg-3);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    padding: 0 16px;
                    margin-bottom: var(--margin);
                ">
                    <input 
                        data-field="name" 
                        type="text" 
                        placeholder="Enter name..."
                        value="${state.name || ''}"
                        style="
                            flex: 1;
                            background: transparent;
                            border: none;
                            outline: none;
                            color: var(--color-10);
                            font-size: 14px;
                            font-weight: 600;
                            font-family: inherit;
                        "
                    />
                </div>
            `;
            
            // ===== COLOR SECTION (SHARED BETWEEN TABS) =====
            const colorSection = `
                <style>
                    /* ========================================
                       COLOR SELECTION ANIMATION - DO NOT REMOVE
                       This provides the pulse shrink-grow effect
                       when selecting colors in the edit window
                       ======================================== */
                    @keyframes color-select-animation {
                        0% { width: 16px; height: 16px; }
                        25% { width: 10px; height: 10px; }
                        35% { width: 4px; height: 4px; }
                        100% { width: 200px; height: 200px; }
                    }
                    
                    .color-circle-animated {
                        animation: color-select-animation 0.5s ease-out forwards;
                    }
                </style>
                
                <!-- Card Color Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">COLORS</div>
                </div>
                
                <!-- Color Selector with Circles -->
                <div style="
                    background: var(--color-10);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    ${this.colors.map((color, index) => `
                        <div data-action="select-color" data-color-index="${index}" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            position: relative;
                            overflow: hidden;
                            ${index < this.colors.length - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        ">
                            <div class="${shouldAnimateColor && state._animateColorIndex === index ? 'color-circle-animated' : ''}" style="
                                width: ${state.currentColorIndex === index ? '200px' : '16px'};
                                height: ${state.currentColorIndex === index ? '200px' : '16px'};
                                background: ${color.value};
                                border-radius: 50%;
                                position: absolute;
                            "></div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // ===== SETTINGS TAB CONTENT =====
            const settingsTabHTML = nameSection + colorSection + `
                <!-- Summary Settings Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">SUMMARY SETTINGS</div>
                </div>
                
                <!-- Activate Summary Card -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.summaryState.showSummary && state.summaryState.summaryDropdownOpen ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: ${state.summaryState.showSummary && state.summaryState.summaryDropdownOpen ? '0' : 'var(--margin)'};
                    overflow: hidden;
                ">
                    <div data-action="toggle-summary" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${state.summaryState.showSummary ? summaryColor : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.summaryState.showSummary ? 'var(--color-10)' : summaryColor};
                        cursor: pointer;
                    ">${state.summaryState.showSummary ? '✓' : ''}</div>
                    <div data-action="summary-card-click" style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        padding-right: 55px;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">Activate Summary Card</div>
                        <div style="
                            font-size: 7px;
                            font-weight: 700;
                            color: var(--color-10);
                            opacity: 0.7;
                            margin-top: 2px;
                            text-align: center;
                            line-height: 1.2;
                        ">Shows summary with counts & completion</div>
                    </div>
                    <div data-action="toggle-summary-dropdown" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: ${state.summaryState.showSummary ? 'pointer' : 'default'};
                        pointer-events: ${state.summaryState.showSummary ? 'auto' : 'none'};
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 8px solid var(--color-10);
                            transform: rotate(${state.summaryState.summaryDropdownOpen ? '180deg' : '0deg'});
                            opacity: ${state.summaryState.showSummary ? '1' : '0.3'};
                        "></div>
                    </div>
                </div>
                ${state.summaryState.showSummary && state.summaryState.summaryDropdownOpen ? `
                    <div style="
                        background: var(--bg-2);
                        border-radius: 0 0 8px 8px;
                        padding: var(--margin);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        margin-bottom: var(--margin);
                    ">
                        <!-- Track Child Nest Cards -->
                        <div data-action="toggle-children" style="
                            background: ${state.summaryState.summaryIncludeChildren ? summaryColor : 'var(--color-10)'};
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: var(--margin);
                            cursor: pointer;
                            transition: filter 0.2s;
                            padding: 4px;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: ${state.summaryState.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                text-align: center;
                            ">Track Child Nest Cards</div>
                            <div style="
                                font-size: 7px;
                                font-weight: 700;
                                color: ${state.summaryState.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Includes cards from child nests in the summary count</div>
                        </div>
                        
                        <!-- Display Mode Toggle (None / XX/YY / Percentage) -->
                        <div style="
                            background: var(--color-10);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                        ">
                            <div data-action="set-none-display" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryState.summaryDisplayMode === null ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                border-right: var(--border-width) solid var(--border-color);
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 14px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === null ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                ">None</div>
                                <div style="
                                    font-size: 7px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === null ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">No display format</div>
                            </div>
                            <div data-action="set-value-display" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryState.summaryDisplayMode === 'value' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                border-right: var(--border-width) solid var(--border-color);
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 14px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                ">XX/YY</div>
                                <div style="
                                    font-size: 7px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Completed/total format (e.g., 5/10)</div>
                            </div>
                            <div data-action="set-percentage-display" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryState.summaryDisplayMode === 'percentage' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 14px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                ">%</div>
                                <div style="
                                    font-size: 7px;
                                    font-weight: 700;
                                    color: ${state.summaryState.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Percentage format (e.g., 50%)</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Activate Child Nest Summaries -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.summaryState.summaryShowChildNestProgress && state.summaryState.summaryShowChildNestProgressDropdownOpen ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: ${state.summaryState.summaryShowChildNestProgress && state.summaryState.summaryShowChildNestProgressDropdownOpen ? '0' : 'var(--margin)'};
                    overflow: hidden;
                ">
                    <div data-action="toggle-child-nest-progress" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${state.summaryState.summaryShowChildNestProgress ? summaryColor : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.summaryState.summaryShowChildNestProgress ? 'var(--color-10)' : summaryColor};
                        cursor: pointer;
                    ">${state.summaryState.summaryShowChildNestProgress ? '✓' : ''}</div>
                    <div data-action="child-nest-progress-card-click" style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        padding-right: 55px;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">Activate Child Nest Summaries</div>
                        <div style="
                            font-size: 7px;
                            font-weight: 700;
                            color: var(--color-10);
                            opacity: 0.7;
                            margin-top: 2px;
                            text-align: center;
                            line-height: 1.2;
                        ">Show progress on child nest cards</div>
                    </div>
                    <div data-action="toggle-child-nest-progress-dropdown" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: ${state.summaryState.summaryShowChildNestProgress ? 'pointer' : 'default'};
                        pointer-events: ${state.summaryState.summaryShowChildNestProgress ? 'auto' : 'none'};
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 8px solid var(--color-10);
                            transform: rotate(${state.summaryState.summaryShowChildNestProgressDropdownOpen ? '180deg' : '0deg'});
                            opacity: ${state.summaryState.summaryShowChildNestProgress ? '1' : '0.3'};
                        "></div>
                    </div>
                </div>
                ${state.summaryState.summaryShowChildNestProgress && state.summaryState.summaryShowChildNestProgressDropdownOpen ? `
                    <div style="
                        background: var(--bg-2);
                        border-radius: 0 0 8px 8px;
                        padding: var(--margin);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        margin-bottom: var(--margin);
                    ">
                        <!-- First Tab -->
                        <div data-action="set-first-tab-mode" style="
                            background: ${state.summaryState.summaryChildNestProgressMode === 'first-tab' ? summaryColor : 'var(--color-10)'};
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: var(--margin);
                            cursor: pointer;
                            transition: filter 0.2s;
                            padding: 4px;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'first-tab' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                text-align: center;
                            ">First Tab</div>
                            <div style="
                                font-size: 7px;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'first-tab' ? 'var(--color-10)' : summaryColor};
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Fills child nest card background based on first tab's progress</div>
                        </div>
                        
                        <!-- All Tabs -->
                        <div data-action="set-all-tabs-mode" style="
                            background: ${state.summaryState.summaryChildNestProgressMode === 'all-tabs' ? summaryColor : 'var(--color-10)'};
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: var(--margin);
                            cursor: pointer;
                            transition: filter 0.2s;
                            padding: 4px;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                text-align: center;
                            ">All Tabs</div>
                            <div style="
                                font-size: 7px;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Fills child nest card background based on combined progress of all tabs</div>
                        </div>
                        
                        <!-- Tab Bars -->
                        <div data-action="set-tab-bars-mode" style="
                            background: ${state.summaryState.summaryChildNestProgressMode === 'tab-bars' ? summaryColor : 'var(--color-10)'};
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: filter 0.2s;
                            padding: 4px;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'tab-bars' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                text-align: center;
                            ">Tab Bars</div>
                            <div style="
                                font-size: 7px;
                                color: ${state.summaryState.summaryChildNestProgressMode === 'tab-bars' ? 'var(--color-10)' : summaryColor};
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Shows clickable progress bars for each tab - tap to navigate directly to that tab</div>
                        </div>
                    </div>
                ` : ''}
                
                
                <!-- Sorting Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">SORTING</div>
                </div>
                
                <!-- Auto Sort Settings -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? '0' : 'var(--margin)'};
                    overflow: hidden;
                ">
                    <div data-action="toggle-auto-sort" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${state.autoSortByLastUpdated ? 'var(--color-5)' : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.autoSortByLastUpdated ? 'var(--color-10)' : 'var(--color-5)'};
                        cursor: pointer;
                    ">${state.autoSortByLastUpdated ? '✓' : ''}</div>
                    <div data-action="auto-sort-card-click" style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        padding-right: 55px;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">Auto Sort by Last Updated</div>
                        <div style="
                            font-size: 7px;
                            font-weight: 700;
                            color: var(--color-10);
                            opacity: 0.7;
                            margin-top: 2px;
                            text-align: center;
                            line-height: 1.2;
                        ">Sorts cards by most recently changed</div>
                    </div>
                    <div data-action="toggle-auto-sort-dropdown" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: ${state.autoSortByLastUpdated ? 'pointer' : 'default'};
                        pointer-events: ${state.autoSortByLastUpdated ? 'auto' : 'none'};
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 8px solid var(--color-10);
                            transform: rotate(${state.autoSortDropdownOpen ? '180deg' : '0deg'});
                            opacity: ${state.autoSortByLastUpdated ? '1' : '0.3'};
                        "></div>
                    </div>
                </div>
                ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? `
                    <div style="
                        background: var(--bg-2);
                        border-radius: 0 0 8px 8px;
                        padding: var(--margin);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        margin-bottom: var(--margin);
                    ">
                        <!-- Placeholder for future sub-settings -->
                        <div style="
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--color-10);
                            font-size: 10px;
                            font-weight: 600;
                            opacity: 0.5;
                        ">No additional settings</div>
                    </div>
                ` : ''}
                
                <!-- Card Type Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">CARD TYPE</div>
                </div>
                
                <!-- Card Type Toggle -->
                <div style="
                    background: var(--color-10);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    <div data-action="toggle-nest" style="
                        flex: 1;
                        height: 100%;
                        background: ${!state.cycleMode ? 'var(--color-5-2)' : 'var(--color-10)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${!state.cycleMode ? 'var(--color-10)' : 'var(--color-5)'};
                        cursor: pointer;
                        text-transform: uppercase;
                        border-right: var(--border-width) solid var(--border-color);
                        transition: filter 0.2s;
                    ">Nest</div>
                    <div data-action="toggle-cycle" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.cycleMode ? 'var(--color-5-2)' : 'var(--color-10)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.cycleMode ? 'var(--color-10)' : 'var(--color-5)'};
                        cursor: pointer;
                        text-transform: uppercase;
                        transition: filter 0.2s;
                    ">Cycle</div>
                </div>
            `;
            
            // ===== TEMPLATES TAB CONTENT =====
            const templatesTabHTML = nameSection + colorSection + (hasTemplates ? `
                <!-- Templates Section -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">SELECT TEMPLATE</div>
                </div>
                
                <!-- Custom Template -->
                <div data-template="custom" style="
                    background: ${state.selectedTemplate === 'custom' ? 'var(--color-4-2)' : 'var(--bg-3)'};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    transition: filter 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 12px;
                ">
                    <div style="
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                        text-transform: uppercase;
                    ">CUSTOM</div>
                    <div style="
                        font-size: 10px;
                        color: var(--color-10);
                        text-align: center;
                        margin-top: 2px;
                    ">Start with an empty structure</div>
                </div>
                
                ${templates.map(template => `
                    <div data-template="${template.id}" style="
                        background: ${state.selectedTemplate === template.id ? 'var(--color-4-2)' : 'var(--bg-3)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        margin-bottom: var(--margin);
                        cursor: pointer;
                        transition: filter 0.2s;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 0 12px;
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">${template.name}</div>
                        <div style="
                            font-size: 10px;
                            color: var(--color-10);
                            text-align: center;
                            margin-top: 2px;
                        ">${template.description || 'No description available'}</div>
                    </div>
                `).join('')}
            ` : `
                <div style="
                    padding: 20px;
                    text-align: center;
                    color: var(--font-color-3);
                    font-size: 12px;
                ">No templates available</div>
            `);
            
            // ===== IMPORT TAB CONTENT =====
            const imports = (window.GT50 && window.GT50.Imports) ? window.GT50.Imports.getAll().sort((a, b) => a.name.localeCompare(b.name)) : [];
            const hasImports = imports && imports.length > 0;
            const importsLoading = window.GT50ImportsLoading === true;
            
            const importTabHTML = nameSection + colorSection + (hasImports ? `
                <!-- Import Section -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">SELECT IMPORT</div>
                </div>
                
                ${imports.map(imp => `
                    <div data-import="${imp.id}" style="
                        background: ${state.selectedImport === imp.id ? 'var(--color-4-2)' : 'var(--bg-3)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        margin-bottom: var(--margin);
                        cursor: pointer;
                        transition: filter 0.2s;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 0 12px;
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">${imp.name}</div>
                        <div style="
                            font-size: 10px;
                            color: var(--color-10);
                            text-align: center;
                            margin-top: 2px;
                        ">${imp.description || 'Imported structure'}</div>
                    </div>
                `).join('')}
            ` : `
                <div style="
                    padding: 20px;
                    text-align: center;
                    color: var(--font-color-3);
                    font-size: 12px;
                ">${importsLoading ? 'Loading imports...' : 'No imports available'}</div>
            `);
            
            // ===== MAIN LAYOUT =====
            console.log('CreateNew: About to set container.innerHTML...');
            container.innerHTML = `
                <!-- Header -->
                <div style="
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                        text-transform: uppercase;
                    ">${isEditMode ? 'EDIT NEST' : 'NEW ENTRY'}</div>
                </div>
                
                <!-- Tabs (using GT50Lib.Tabs) -->
                <div id="create-new-tabs"></div>
                
                <div id="create-new-content" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--margin);
                    padding-top: 4px;
                    padding-bottom: calc(var(--card-height) + var(--margin));
                "></div>
                
                <div id="create-new-footer" style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    z-index: 1000;
                ">
                    <button data-action="cancel" style="
                        flex: 1;
                        height: 100%;
                        background: var(--bg-4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                        border: none;
                        border-right: var(--border-width) solid var(--border-color);
                        font-family: inherit;
                    ">CANCEL</button>
                    <button data-action="create" ${!(state.name && state.name.trim() !== '') ? 'disabled' : ''} style="
                        flex: 1;
                        height: 100%;
                        background: ${(state.name && state.name.trim() !== '') ? 'var(--accent)' : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${(state.name && state.name.trim() !== '') ? 'var(--color-10)' : 'var(--color-9)'};
                        cursor: ${(state.name && state.name.trim() !== '') ? 'pointer' : 'not-allowed'};
                        transition: filter 0.2s;
                        border: none;
                        font-family: inherit;
                    ">${isEditMode ? 'SAVE CHANGES' : 'CREATE ENTRY'}</button>
                </div>
            `;
            
            console.log('CreateNew: container.innerHTML has been set');
            
            // Render tabs using GT50Lib.Tabs (pass actual state.tabs object)
            const tabsContainer = container.querySelector('#create-new-tabs');
            if (GT50Lib && GT50Lib.Tabs && GT50Lib.Tabs.renderView) {
                GT50Lib.Tabs.renderView(tabsContainer, state.tabs, onChange);
            } else {
                console.error('GT50Lib.Tabs.renderView not available');
                tabsContainer.innerHTML = '<div style="padding: 20px; color: red;">Error: Tabs component not loaded</div>';
            }
            
            // Render appropriate tab content
            const contentContainer = container.querySelector('#create-new-content');
            contentContainer.innerHTML = activeTab === 'templates' ? templatesTabHTML : 
                                       activeTab === 'settings' ? settingsTabHTML : importTabHTML;
            
            console.log('CreateNew: Content has been rendered, activeTab =', activeTab);
            
            // ===== EVENT LISTENERS =====
            
            // Name input (always present in both tabs)
            const nameInput = contentContainer.querySelector('[data-field="name"]');
            if (nameInput) {
                // DO NOT call onChange during input - this prevents keyboard from closing
                nameInput.oninput = (e) => {
                    state.name = e.target.value;
                    // Update button state without full re-render
                    const createBtn = container.querySelector('[data-action="create"]');
                    const hasName = e.target.value && e.target.value.trim() !== '';
                    if (createBtn) {
                        if (hasName) {
                            createBtn.disabled = false;
                            createBtn.style.background = 'var(--accent)';
                            createBtn.style.color = 'var(--color-10)';
                            createBtn.style.cursor = 'pointer';
                        } else {
                            createBtn.disabled = true;
                            createBtn.style.background = 'var(--bg-4)';
                            createBtn.style.color = 'var(--color-9)';
                            createBtn.style.cursor = 'not-allowed';
                        }
                    }
                };
            }
            
            // Color selector with animation (SHARED - works in both tabs)
            const colorButtons = contentContainer.querySelectorAll('[data-action="select-color"]');
            colorButtons.forEach(btn => {
                const colorIndex = parseInt(btn.dataset.colorIndex);
                btn.onclick = () => {
                    // Only animate if changing to a different color
                    if (state.currentColorIndex !== colorIndex) {
                        state._animateColorIndex = colorIndex;
                        state.currentColorIndex = colorIndex;
                        onChange();
                        
                        // Clear animation flag after animation completes
                        setTimeout(() => {
                            delete state._animateColorIndex;
                        }, 500);
                    }
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Settings tab listeners
            if (activeTab === 'settings') {
                const nestBtn = contentContainer.querySelector('[data-action="toggle-nest"]');
                if (nestBtn) {
                    nestBtn.onclick = () => {
                        state.cycleMode = false;
                        onChange();
                    };
                    nestBtn.onmouseover = () => nestBtn.style.filter = 'brightness(1.2)';
                    nestBtn.onmouseout = () => nestBtn.style.filter = 'brightness(1)';
                }
                
                const cycleBtn = contentContainer.querySelector('[data-action="toggle-cycle"]');
                if (cycleBtn) {
                    cycleBtn.onclick = () => {
                        state.cycleMode = true;
                        onChange();
                    };
                    cycleBtn.onmouseover = () => cycleBtn.style.filter = 'brightness(1.2)';
                    cycleBtn.onmouseout = () => cycleBtn.style.filter = 'brightness(1)';
                }
                
                // Auto sort toggle
                const autoSortBtn = contentContainer.querySelector('[data-action="toggle-auto-sort"]');
                if (autoSortBtn) {
                    autoSortBtn.onclick = () => {
                        state.autoSortByLastUpdated = !state.autoSortByLastUpdated;
                        onChange();
                    };
                    autoSortBtn.onmouseover = () => autoSortBtn.style.filter = 'brightness(1.2)';
                    autoSortBtn.onmouseout = () => autoSortBtn.style.filter = 'brightness(1)';
                }
                
                // Auto sort card click - toggles feature or dropdown based on state
                const autoSortCardClick = contentContainer.querySelector('[data-action="auto-sort-card-click"]');
                if (autoSortCardClick) {
                    autoSortCardClick.onclick = () => {
                        if (!state.autoSortByLastUpdated) {
                            state.autoSortByLastUpdated = true;
                        } else {
                            state.autoSortDropdownOpen = !state.autoSortDropdownOpen;
                        }
                        onChange();
                    };
                }
                
                // Auto sort dropdown toggle
                const autoSortDropdownBtn = contentContainer.querySelector('[data-action="toggle-auto-sort-dropdown"]');
                if (autoSortDropdownBtn) {
                    autoSortDropdownBtn.onclick = (e) => {
                        e.stopPropagation(); // Prevent triggering the card-click handler
                        state.autoSortDropdownOpen = !state.autoSortDropdownOpen;
                        onChange();
                    };
                }
                
                // Summary controls
                const summaryBtn = contentContainer.querySelector('[data-action="toggle-summary"]');
                if (summaryBtn) {
                    summaryBtn.onclick = () => {
                        state.summaryState.showSummary = !state.summaryState.showSummary;
                        onChange();
                    };
                    summaryBtn.onmouseover = () => summaryBtn.style.filter = 'brightness(1.1)';
                    summaryBtn.onmouseout = () => summaryBtn.style.filter = 'brightness(1)';
                }
                
                // Summary card click - toggles feature or dropdown based on state
                const summaryCardClick = contentContainer.querySelector('[data-action="summary-card-click"]');
                if (summaryCardClick) {
                    summaryCardClick.onclick = () => {
                        if (!state.summaryState.showSummary) {
                            state.summaryState.showSummary = true;
                        } else {
                            state.summaryState.summaryDropdownOpen = !state.summaryState.summaryDropdownOpen;
                        }
                        onChange();
                    };
                }
                
                const childrenBtn = contentContainer.querySelector('[data-action="toggle-children"]');
                if (childrenBtn) {
                    childrenBtn.onclick = () => {
                        state.summaryState.summaryIncludeChildren = !state.summaryState.summaryIncludeChildren;
                        onChange();
                    };
                    childrenBtn.onmouseover = () => childrenBtn.style.filter = 'brightness(1.1)';
                    childrenBtn.onmouseout = () => childrenBtn.style.filter = 'brightness(1)';
                }
                
                const noneBtn = contentContainer.querySelector('[data-action="set-none-display"]');
                if (noneBtn) {
                    noneBtn.onclick = () => {
                        state.summaryState.summaryDisplayMode = null;
                        onChange();
                    };
                    noneBtn.onmouseover = () => noneBtn.style.filter = 'brightness(1.1)';
                    noneBtn.onmouseout = () => noneBtn.style.filter = 'brightness(1)';
                }
                
                const valueBtn = contentContainer.querySelector('[data-action="set-value-display"]');
                if (valueBtn) {
                    valueBtn.onclick = () => {
                        state.summaryState.summaryDisplayMode = 'value';
                        onChange();
                    };
                    valueBtn.onmouseover = () => valueBtn.style.filter = 'brightness(1.1)';
                    valueBtn.onmouseout = () => valueBtn.style.filter = 'brightness(1)';
                }
                
                const percentageBtn = contentContainer.querySelector('[data-action="set-percentage-display"]');
                if (percentageBtn) {
                    percentageBtn.onclick = () => {
                        state.summaryState.summaryDisplayMode = 'percentage';
                        onChange();
                    };
                    percentageBtn.onmouseover = () => percentageBtn.style.filter = 'brightness(1.1)';
                    percentageBtn.onmouseout = () => percentageBtn.style.filter = 'brightness(1)';
                }
                
                const childNestProgressBtn = contentContainer.querySelector('[data-action="toggle-child-nest-progress"]');
                if (childNestProgressBtn) {
                    childNestProgressBtn.onclick = () => {
                        state.summaryState.summaryShowChildNestProgress = !state.summaryState.summaryShowChildNestProgress;
                        onChange();
                    };
                    childNestProgressBtn.onmouseover = () => childNestProgressBtn.style.filter = 'brightness(1.1)';
                    childNestProgressBtn.onmouseout = () => childNestProgressBtn.style.filter = 'brightness(1)';
                }
                
                // Child nest progress card click - toggles feature or dropdown based on state
                const childNestProgressCardClick = contentContainer.querySelector('[data-action="child-nest-progress-card-click"]');
                if (childNestProgressCardClick) {
                    childNestProgressCardClick.onclick = () => {
                        if (!state.summaryState.summaryShowChildNestProgress) {
                            state.summaryState.summaryShowChildNestProgress = true;
                        } else {
                            state.summaryState.summaryShowChildNestProgressDropdownOpen = !state.summaryState.summaryShowChildNestProgressDropdownOpen;
                        }
                        onChange();
                    };
                }
                
                // Summary dropdown toggles
                const summaryDropdownBtn = contentContainer.querySelector('[data-action="toggle-summary-dropdown"]');
                if (summaryDropdownBtn) {
                    summaryDropdownBtn.onclick = (e) => {
                        e.stopPropagation();
                        state.summaryState.summaryDropdownOpen = !state.summaryState.summaryDropdownOpen;
                        onChange();
                    };
                }
                
                const childNestProgressDropdownBtn = contentContainer.querySelector('[data-action="toggle-child-nest-progress-dropdown"]');
                if (childNestProgressDropdownBtn) {
                    childNestProgressDropdownBtn.onclick = (e) => {
                        e.stopPropagation();
                        state.summaryState.summaryShowChildNestProgressDropdownOpen = !state.summaryState.summaryShowChildNestProgressDropdownOpen;
                        onChange();
                    };
                }
                
                const firstTabModeBtn = contentContainer.querySelector('[data-action="set-first-tab-mode"]');
                if (firstTabModeBtn) {
                    firstTabModeBtn.onclick = () => {
                        state.summaryState.summaryChildNestProgressMode = 'first-tab';
                        onChange();
                    };
                    firstTabModeBtn.onmouseover = () => firstTabModeBtn.style.filter = 'brightness(1.1)';
                    firstTabModeBtn.onmouseout = () => firstTabModeBtn.style.filter = 'brightness(1)';
                }
                
                const allTabsModeBtn = contentContainer.querySelector('[data-action="set-all-tabs-mode"]');
                if (allTabsModeBtn) {
                    allTabsModeBtn.onclick = () => {
                        state.summaryState.summaryChildNestProgressMode = 'all-tabs';
                        onChange();
                    };
                    allTabsModeBtn.onmouseover = () => allTabsModeBtn.style.filter = 'brightness(1.1)';
                    allTabsModeBtn.onmouseout = () => allTabsModeBtn.style.filter = 'brightness(1)';
                }
                
                const tabBarsModeBtn = contentContainer.querySelector('[data-action="set-tab-bars-mode"]');
                if (tabBarsModeBtn) {
                    tabBarsModeBtn.onclick = () => {
                        state.summaryState.summaryChildNestProgressMode = 'tab-bars';
                        onChange();
                    };
                    tabBarsModeBtn.onmouseover = () => tabBarsModeBtn.style.filter = 'brightness(1.1)';
                    tabBarsModeBtn.onmouseout = () => tabBarsModeBtn.style.filter = 'brightness(1)';
                }
            }
            
            // Templates tab listeners
            if (activeTab === 'templates') {
                const templateCards = contentContainer.querySelectorAll('[data-template]');
                templateCards.forEach(card => {
                    const templateId = card.getAttribute('data-template');
                    card.onclick = () => {
                        state.selectedTemplate = templateId;
                        onChange();
                    };
                    card.onmouseover = () => card.style.filter = 'brightness(1.1)';
                    card.onmouseout = () => card.style.filter = 'brightness(1)';
                });
            }
            
            // Import tab listeners
            if (activeTab === 'import') {
                const importCards = contentContainer.querySelectorAll('[data-import]');
                importCards.forEach(card => {
                    const importId = card.getAttribute('data-import');
                    card.onclick = () => {
                        state.selectedImport = importId;
                        // Call onCreate to create the import component
                        onCreate();
                    };
                    card.onmouseover = () => card.style.filter = 'brightness(1.1)';
                    card.onmouseout = () => card.style.filter = 'brightness(1)';
                });
            }
            
            // Footer cancel button - closes window and returns to view
            // If editingEntryId is set (navigated back from Build mode), the entry will be deleted (handled in onClose)
            const cancelBtn = container.querySelector('[data-action="cancel"]');
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    // Reset tab to Templates before closing
                    state.tabs.activeViewTab = 0;
                    onClose(); // This triggers deletion if editingEntryId is set
                };
                cancelBtn.onmouseover = () => cancelBtn.style.filter = 'brightness(1.2)';
                cancelBtn.onmouseout = () => cancelBtn.style.filter = 'brightness(1)';
            }
            
            // Footer create button - ALWAYS attach handlers, not just when name exists
            // editingEntryId is cleared in onCreate callback (Index.html) after successful creation
const createBtn = container.querySelector('[data-action="create"]');
if (createBtn) {
    createBtn.onclick = () => {
        // Only proceed if there's a valid name
        if (state.name && state.name.trim() !== '') {
            // Reset tab to Templates before creating
            state.tabs.activeViewTab = 0;
            onCreate();
        }
    };
    createBtn.onmouseover = () => {
        if (!createBtn.disabled) {
            createBtn.style.filter = 'brightness(1.2)';
        }
    };
    createBtn.onmouseout = () => createBtn.style.filter = 'brightness(1)';
}
            console.log('CreateNew: Render complete!');
        }
    };
    
    console.log('✓ CreateNew injector loaded');
})();
