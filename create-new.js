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
        currentColorIndex: 0, // Changed from 7 to 0 (GRAY is now first)
        cycleMode: false,
                tabs: {
                    tabs: [
                        { name: 'Templates', label: 'Templates', color: 'var(--color-5-2)' },
                        { name: 'Settings', label: 'Settings', color: 'var(--color-5-2)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                summaryState: {
                    showSummary: false,
                    summaryIncludeChildren: false,
                    summaryDisplayMode: null,
                    summaryShowChildNestProgress: false,
                    summaryChildNestSubdivision: 'first-tab' // 'first-tab' or 'all-tabs'
                }
            };
        },
        
       // ===== CREATE ENTRY HELPER =====
createEntry: function(state, nextId, currentComponents) {
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
    
    // Apply summary settings
    if (state.summaryState) {
        newEntry.state.showSummary = state.summaryState.showSummary || false;
        newEntry.state.summaryIncludeChildren = state.summaryState.summaryIncludeChildren || false;
        newEntry.state.summaryDisplayMode = state.summaryState.summaryDisplayMode || null;
        newEntry.state.summaryShowChildNestProgress = state.summaryState.summaryShowChildNestProgress || false;
        newEntry.state.summaryChildNestSubdivision = state.summaryState.summaryChildNestSubdivision || 'first-tab';
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
    if (state.selectedTemplate !== 'custom') {
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
                // Track that window is now closed
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
    state.currentColorIndex = 0; // Changed from 7 to 0 (GRAY is now first)
    state.cycleMode = false;
                state.summaryState = {
                    showSummary: false,
                    summaryIncludeChildren: false,
                    summaryDisplayMode: null,
                    summaryShowChildNestProgress: false,
                    summaryChildNestSubdivision: 'first-tab'
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
                        { name: 'Settings', label: 'Settings', color: 'var(--color-5-2)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                };
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
            const templates = window.GT50.Templates.getAll();
            const hasTemplates = templates && templates.length > 0;
            
            // Determine summary color based on current card color
            const summaryColor = this.colors[state.currentColorIndex].value;
            
            // Determine active tab
            const activeTab = state.tabs.activeViewTab === 0 ? 'templates' : 'settings';
            
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
                    ">NAME</div>
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
                    ">COLOR</div>
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
                <!-- Summary Divider -->
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
                    ">SUMMARY</div>
                </div>
                
                <!-- Summary Activation Card -->
                <div data-action="toggle-summary" style="
                    background: ${state.summaryState.showSummary ? summaryColor : 'var(--color-10)'};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${state.summaryState.showSummary ? 'var(--color-10)' : summaryColor};
                    text-transform: uppercase;
                    transition: filter 0.2s;
                ">Activate Summary Card</div>
                
                ${state.summaryState.showSummary ? `
                    <!-- Summary Options Card -->
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
                        <!-- Track Child Nest Cards -->
                        <div data-action="toggle-children" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.summaryState.summaryIncludeChildren ? summaryColor : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: ${state.summaryState.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                            text-transform: uppercase;
                            cursor: pointer;
                            border-right: var(--border-width) solid var(--border-color);
                            transition: filter 0.2s;
                        ">Track Child Nest Cards</div>
                        
                        <!-- XX/YY Display -->
                        <div data-action="set-value-display" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.summaryState.summaryDisplayMode === 'value' ? summaryColor : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: ${state.summaryState.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                            text-transform: uppercase;
                            cursor: pointer;
                            border-right: var(--border-width) solid var(--border-color);
                            transition: filter 0.2s;
                        ">XX/YY</div>
                        
                        <!-- Percentage Display -->
                        <div data-action="set-percentage-display" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.summaryState.summaryDisplayMode === 'percentage' ? summaryColor : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: ${state.summaryState.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                            text-transform: uppercase;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">Percentage</div>
                    </div>
                ` : ''}
                
                <!-- Activate Child Nest Summaries Card (Independent) -->
                <div data-action="toggle-child-nest-progress" style="
                    background: ${state.summaryState.summaryShowChildNestProgress ? summaryColor : 'var(--color-10)'};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${state.summaryState.summaryShowChildNestProgress ? 'var(--color-10)' : summaryColor};
                    text-transform: uppercase;
                    transition: filter 0.2s;
                ">Activate Child Nest Summaries</div>
                
                ${state.summaryState.summaryShowChildNestProgress ? `
                    <!-- Subdivision Mode Radio (only when child nest progress is active) -->
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
                        <div data-action="set-first-tab-subdivision" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.summaryState.summaryChildNestSubdivision === 'first-tab' ? summaryColor : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: ${state.summaryState.summaryChildNestSubdivision === 'first-tab' ? 'var(--color-10)' : summaryColor};
                            text-transform: uppercase;
                            cursor: pointer;
                            border-right: var(--border-width) solid var(--border-color);
                            transition: filter 0.2s;
                        ">First Tab</div>
                        <div data-action="set-all-tabs-subdivision" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.summaryState.summaryChildNestSubdivision === 'all-tabs' ? summaryColor : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: ${state.summaryState.summaryChildNestSubdivision === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                            text-transform: uppercase;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">All Tabs</div>
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
            
            // ===== MAIN LAYOUT =====
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
            
            // Render tabs using GT50Lib.Tabs (pass actual state.tabs object)
            const tabsContainer = container.querySelector('#create-new-tabs');
            GT50Lib.Tabs.renderView(tabsContainer, state.tabs, onChange);
            
            // Render appropriate tab content
            const contentContainer = container.querySelector('#create-new-content');
            contentContainer.innerHTML = activeTab === 'templates' ? templatesTabHTML : settingsTabHTML;
            
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
                
                const childrenBtn = contentContainer.querySelector('[data-action="toggle-children"]');
                if (childrenBtn) {
                    childrenBtn.onclick = () => {
                        state.summaryState.summaryIncludeChildren = !state.summaryState.summaryIncludeChildren;
                        onChange();
                    };
                    childrenBtn.onmouseover = () => childrenBtn.style.filter = 'brightness(1.1)';
                    childrenBtn.onmouseout = () => childrenBtn.style.filter = 'brightness(1)';
                }
                
                const valueBtn = contentContainer.querySelector('[data-action="set-value-display"]');
                if (valueBtn) {
                    valueBtn.onclick = () => {
                        state.summaryState.summaryDisplayMode = state.summaryState.summaryDisplayMode === 'value' ? null : 'value';
                        onChange();
                    };
                    valueBtn.onmouseover = () => valueBtn.style.filter = 'brightness(1.1)';
                    valueBtn.onmouseout = () => valueBtn.style.filter = 'brightness(1)';
                }
                
                const percentageBtn = contentContainer.querySelector('[data-action="set-percentage-display"]');
                if (percentageBtn) {
                    percentageBtn.onclick = () => {
                        state.summaryState.summaryDisplayMode = state.summaryState.summaryDisplayMode === 'percentage' ? null : 'percentage';
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
                
                // Subdivision mode buttons
                const firstTabBtn = contentContainer.querySelector('[data-action="set-first-tab-subdivision"]');
                if (firstTabBtn) {
                    firstTabBtn.onclick = () => {
                        state.summaryState.summaryChildNestSubdivision = 'first-tab';
                        onChange();
                    };
                    firstTabBtn.onmouseover = () => firstTabBtn.style.filter = 'brightness(1.1)';
                    firstTabBtn.onmouseout = () => firstTabBtn.style.filter = 'brightness(1)';
                }
                
                const allTabsBtn = contentContainer.querySelector('[data-action="set-all-tabs-subdivision"]');
                if (allTabsBtn) {
                    allTabsBtn.onclick = () => {
                        state.summaryState.summaryChildNestSubdivision = 'all-tabs';
                        onChange();
                    };
                    allTabsBtn.onmouseover = () => allTabsBtn.style.filter = 'brightness(1.1)';
                    allTabsBtn.onmouseout = () => allTabsBtn.style.filter = 'brightness(1)';
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
        }
    };
    
    console.log('✓ CreateNew injector loaded');
})();
