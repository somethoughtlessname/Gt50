(function() {
    // Static injector ID
    const INJECTOR_ID = '0020';
    
    // ===== GT50 READABLE FORMAT ADAPTER =====
    // Human-readable structured format for GT50 data export/import
    //
    // ============================================================
    // CRITICAL: COMPONENT FORMAT REFERENCE
    // ============================================================
    // LIST:         LIST|0|Title or LIST|1|Title (if no items) or LIST|Title (if has items)
    // CHECKLIST:    CHECKLIST|Title (NO numbers, requires items with 0/1)
    // PROGRESS:     PROGRESS|50/100|Title (state.current/state.total)
    // ACCUMULATION: ACCUMULATION|7543|Title (state.value, not state.total)
    // THRESHOLD:    THRESHOLD|3|Title (state.number1 is threshold, state.threshold is item count)
    // TIER:         TIER|Title (state.current/state.total, tiers use name/amount)
    // RADIO:        RADIO|2|Title (state.selectedIndex, state.items with text)
    // DIVIDER:      DIVIDER|Title (no progress indicator)
    // TEXT:         TEXT|Title (state.text, alignment, fontWeight, fontStyle)
    // HISTORY:      HISTORY|Title (no progress indicator)
    // SCALE:        SCALE (no title, uses dropdown text, items with number/unit/title)
    // NEST:         Uses --- NEST X START: Name --- with internal tabs or direct components
    // CYCLE:        Uses --- CYCLE X START: Name --- with scheduling info
    //
    // ALL COMPONENTS: Can have optional dropdownText field
    // 
    // SUB-ITEMS:
    // tier-level:   tier-level|[level #]|xx/yy|title (1-based)
    // radio-option: radio-option|[order #]|name (1-based)
    // scale-item:   scale-item|number|unit|ingredient (e.g. scale-item|2|cups|flour)
    // ============================================================
    
    const GT50Format = {
        // ===== FORMAT INFO =====
        getFormatName: function() {
            return 'GT50';
        },
        
        getDescription: function() {
            return 'Human-readable structured format';
        },
        
        getVersion: function() {
            return '1.0.0';
        },
        
        getFileExtension: function() {
            return 'gt50';
        },
        
        // ===== SERIALIZE (JSON → GT50 format) =====
        serialize: function(jsonData) {
            const output = [];
            const tabs = jsonData.data && jsonData.data.tabs;
            const tabComponents = jsonData.data && jsonData.data.tabComponents;
            
            // Header
            output.push('===== WORKSPACE START =====');
            output.push(`TIMESTAMP|${jsonData.timestamp || new Date().toISOString()}`);
            output.push(`APP|${jsonData.app || 'GT50'}`);
            output.push('');
            
            // Check if we have tabs
            if (tabs && tabs.tabs && tabs.tabs.length > 0) {
                // Multiple tabs - output each one
                tabs.tabs.forEach((tab, index) => {
                    const tabLabel = tab.label || tab.name || `Tab ${index + 1}`;
                    const componentArray = tabComponents[index] || [];
                    
                    output.push(`--- TAB START: ${tabLabel} ---`);
                    output.push(`COUNT|${componentArray.length}`);
                    output.push('');
                    
                    if (componentArray.length > 0) {
                        output.push('--- CARDS ---');
                        output.push('');
                        
                        this.serializeComponents(componentArray, output, '');
                    }
                    
                    output.push(`--- TAB END: ${tabLabel} ---`);
                    output.push('');
                });
            } else {
                // Single tab with content - just output cards directly
                if (tabComponents && tabComponents[0] && tabComponents[0].length > 0) {
                    this.serializeComponents(tabComponents[0], output, '');
                }
            }
            
            // Footer
            output.push('===== WORKSPACE END =====');
            
            return output.join('\n');
        },
        
        // ===== SERIALIZE COMPONENTS ARRAY =====
        serializeComponents: function(componentArray, output, nestPath) {
            let nestCounter = 0;
            
            componentArray.forEach(comp => {
                if (comp.type === 'nest' || comp.type === 'cycle') {
                    nestCounter++;
                    this.serializeComponent(comp, output, nestPath, nestCounter);
                } else {
                    this.serializeComponent(comp, output, nestPath, 0);
                }
            });
        },
        
        // ===== SERIALIZE COMPONENT =====
        serializeComponent: function(comp, output, nestPath, nestNumber) {
            const state = comp.state || {};
            const title = this.escape(state.title || state.name || 'Untitled');
            const type = comp.type;
            
            // Component header based on type (skip for nest/cycle)
            if (type !== 'nest' && type !== 'cycle') {
                // Check for divider variants (scale) OR type === 'scale'
                if ((type === 'divider' && state.variant === 'scale') || type === 'scale') {
                    output.push(`SCALE`);
                } else {
                    switch(type) {
                        case 'list':
                            if (state.items && state.items.length > 0) {
                                output.push(`LIST|${title}`);
                            } else {
                                const completed = state.completed ? 1 : 0;
                                output.push(`LIST|${completed}|${title}`);
                            }
                            break;
                        
                        case 'checklist':
                            output.push(`CHECKLIST|${title}`);
                            break;
                        
                        case 'progress':
                            const current = state.current || 0;
                            const target = state.total !== undefined ? state.total : state.target || 100;
                            output.push(`PROGRESS|${current}/${target}|${title}`);
                            break;
                        
                        case 'accumulation':
                            const total = state.value !== undefined ? state.value : state.total || 0;
                            output.push(`ACCUMULATION|${total}|${title}`);
                            break;
                        
                        case 'threshold':
                            const threshold = state.number1 || state.threshold || 1;
                            output.push(`THRESHOLD|${threshold}|${title}`);
                            break;
                        
                        case 'tier':
                            output.push(`TIER|${title}`);
                            break;
                        
                        case 'radio':
                            const selectedIndex = state.selectedIndex !== undefined ? state.selectedIndex : 
                                                state.value !== undefined ? state.value : 0;
                            output.push(`RADIO|${selectedIndex + 1}|${title}`);
                            break;
                        
                        case 'divider':
                            output.push(`DIVIDER|${title}`);
                            break;
                        
                        case 'text':
                            output.push(`TEXT|${title}`);
                            break;
                        
                        case 'history':
                            output.push(`HISTORY|${title}`);
                            break;
                    }
                    
                    // Dropdown text (optional for all components)
                    if (state.dropdownText) {
                        output.push(`dropdown|${this.escape(state.dropdownText)}`);
                    }
                }
            }
            
            // Type-specific content
            // Handle scale cards (both divider variant: scale AND type: scale)
            if ((type === 'divider' && state.variant === 'scale') || type === 'scale') {
                if (state.items && state.items.length > 0) {
                    state.items.forEach(item => {
                        const number = this.escape(item.number || '');
                        const unit = this.escape(item.unit || '');
                        const itemTitle = this.escape(item.title || '');
                        output.push(`scale-item|${number}|${unit}|${itemTitle}`);
                    });
                }
            } else {
                // Regular component content
                switch(type) {
                    case 'list':
                        if (state.items && state.items.length > 0) {
                            state.items.forEach(item => {
                                const completed = item.completed ? 1 : 0;
                                const text = this.escape(item.text);
                                output.push(`list-item|${completed}|${text}`);
                            });
                        }
                        break;
                    
                    case 'checklist':
                        if (state.items && state.items.length > 0) {
                            state.items.forEach(item => {
                                const completed = item.completed ? 1 : 0;
                                const text = this.escape(item.text);
                                output.push(`checklist-item|${completed}|${text}`);
                            });
                        }
                        break;
                    
                    case 'tier':
                        if (state.tiers && state.tiers.length > 0) {
                            state.tiers.forEach((tier, idx) => {
                                const tierNum = idx + 1;
                                const tierName = this.escape(tier.name || `Tier ${tierNum}`);
                                const tierCurrent = tier.current || 0;
                                const tierAmount = tier.amount || 0;
                                output.push(`tier-level|${tierNum}|${tierCurrent}/${tierAmount}|${tierName}`);
                            });
                        }
                        break;
                    
                    case 'radio':
                        if (state.items && state.items.length > 0) {
                            state.items.forEach((item, idx) => {
                                const optionNum = idx + 1;
                                const optionText = this.escape(item.text || item);
                                output.push(`radio-option|${optionNum}|${optionText}`);
                            });
                        }
                        break;
                    
                    case 'threshold':
                        if (state.items && state.items.length > 0) {
                            state.items.forEach(item => {
                                const completed = item.completed ? 1 : 0;
                                const text = this.escape(item.text);
                                output.push(`threshold-item|${completed}|${text}`);
                            });
                        }
                        break;
                    
                    case 'text':
                        if (state.text || state.value) {
                            const content = this.escape(state.text || state.value || '');
                            output.push(`text-content|${content}`);
                        }
                        if (state.alignment) {
                            output.push(`text-alignment|${state.alignment}`);
                        }
                        if (state.fontWeight) {
                            output.push(`text-weight|${state.fontWeight}`);
                        }
                        if (state.fontStyle) {
                            output.push(`text-font|${state.fontStyle}`);
                        }
                        break;
                    
                    case 'history':
                        // Export timestamp entries
                        if (state.entries && state.entries.length > 0) {
                            state.entries.forEach(entry => {
                                // Handle both object format {timestamp: X} and raw timestamp format
                                const timestamp = typeof entry === 'object' ? entry.timestamp : entry;
                                const date = new Date(timestamp);
                                const formattedDate = date.toISOString();
                                output.push(`history-entry|${timestamp}|${formattedDate}`);
                            });
                        }
                        // Export display mode
                        if (state.displayMode) {
                            output.push(`history-displayMode|${state.displayMode}`);
                        }
                        // Export locked status
                        if (state.locked !== undefined) {
                            output.push(`history-locked|${state.locked ? '1' : '0'}`);
                        }
                        break;
                }
            }
            
            // Handle nest/cycle
            if (type === 'nest' || type === 'cycle') {
                const componentType = type === 'nest' ? 'NEST' : 'CYCLE';
                const currentNestNumber = nestPath ? 
                    `${nestPath}.${nestNumber}` : 
                    nestNumber.toString();
                
                const containerName = this.escape(state.name || state.title || 'Container');
                output.push(`--- ${componentType} ${currentNestNumber} START: ${containerName} ---`);
                
                // Cycle-specific metadata
                if (type === 'cycle') {
                    if (state.resetInterval) {
                        output.push(`cycle-interval|${state.resetInterval}`);
                    }
                    if (state.resetInterval === 'custom') {
                        const months = state.customMonths || 0;
                        const days = state.customDays || 0;
                        const hours = state.customHours || 0;
                        const minutes = state.customMinutes || 0;
                        output.push(`cycle-custom|${months}|${days}|${hours}|${minutes}`);
                    }
                    if (state.lastReset) {
                        output.push(`cycle-last-reset|${state.lastReset}`);
                    }
                    if (state.resetTime) {
                        output.push(`cycle-reset-time|${state.resetTime}`);
                    }
                    if (state.resetDay !== undefined) {
                        output.push(`cycle-reset-day|${state.resetDay}`);
                    }
                    if (state.resetHour !== undefined) {
                        output.push(`cycle-reset-hour|${state.resetHour}`);
                    }
                }
                
                // Handle tabs within nest/cycle
                if (state.tabs && state.tabs.tabs && state.tabs.tabs.length > 0) {
                    state.tabs.tabs.forEach((tab, tabIdx) => {
                        const tabNumber = `${currentNestNumber}.${tabIdx + 1}`;
                        const tabName = this.escape(tab.name || tab.label || `Tab ${tabIdx + 1}`);
                        const nestedArray = state.tabComponents[tabIdx] || [];
                        
                        output.push(`--- TAB ${tabNumber} START: ${tabName} ---`);
                        
                        if (tab.color) {
                            const colorMatch = tab.color.match(/--color-(\d+)/);
                            if (colorMatch) {
                                output.push(`tab-color|${colorMatch[1]}`);
                            }
                        }
                        
                        output.push('');
                        
                        // Output components inside this tab
                        this.serializeComponents(nestedArray, output, tabNumber);
                        
                        output.push(`--- TAB ${tabNumber} END ---`);
                        output.push('');
                    });
                } else {
                    // No tabs defined - output components directly
                    if (state.tabComponents && state.tabComponents[0] && state.tabComponents[0].length > 0) {
                        this.serializeComponents(state.tabComponents[0], output, currentNestNumber);
                    }
                }
                
                output.push(`--- ${componentType} ${currentNestNumber} END ---`);
                output.push('');
            }
            
            // Add blank line after non-nest components
            if (type !== 'nest' && type !== 'cycle') {
                output.push('');
            }
        },
        
        // ===== DESERIALIZE (GT50 format → JSON) =====
        deserialize: function(formatData) {
            const lines = formatData.split('\n');
            const result = {
                version: '1.0',
                timestamp: null,
                app: null,
                data: {
                    tabs: { tabs: [], activeViewTab: 0, selectedBuildTab: 0 },
                    tabComponents: [[]]
                }
            };
            
            let currentTabIndex = 0;
            let hasMainWindowTabs = false;
            
            // Stack to track nested containers
            let containerStack = [];
            let currentContainer = null;
            let currentTabInContainer = 0;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const parts = line.split('|');
                const type = parts[0];
                
                // Header metadata
                if (type === 'TIMESTAMP') {
                    result.timestamp = parts[1];
                    continue;
                }
                if (type === 'APP') {
                    result.app = parts[1];
                    continue;
                }
                
                // Main window tabs
                if (line.match(/^--- TAB START:/)) {
                    hasMainWindowTabs = true;
                    const tabName = line.split(':')[1].trim().replace(' ---', '');
                    result.data.tabs.tabs.push({
                        name: tabName,
                        label: tabName,
                        color: 'var(--accent)'
                    });
                    result.data.tabComponents.push([]);
                    currentTabIndex = result.data.tabs.tabs.length - 1;
                    continue;
                }
                
                // Nest/Cycle start (format: --- NEST 1 START: Name ---)
                if (line.match(/^--- (NEST|CYCLE) .+ START:/)) {
                    const containerType = line.includes('NEST') ? 'nest' : 'cycle';
                    
                    // Extract name from line: "--- NEST 1 START: Name ---"
                    const nameMatch = line.match(/START:\s*(.+?)\s*---$/);
                    const containerName = nameMatch ? this.unescape(nameMatch[1]) : '';
                    
                    // Get default state from component library if available
                    let defaultState;
                    if (containerType === 'nest' && window.GT50Lib && window.GT50Lib.Nest) {
                        defaultState = window.GT50Lib.Nest.defaultState();
                    } else if (containerType === 'cycle' && window.GT50Lib && window.GT50Lib.Cycle) {
                        defaultState = window.GT50Lib.Cycle.defaultState();
                    } else {
                        // Fallback default state
                        defaultState = {
                            name: '',
                            title: '',
                            open: false,
                            tabs: { tabs: [], activeViewTab: 0, selectedBuildTab: 0 },
                            tabComponents: [[]]
                        };
                        if (containerType === 'cycle') {
                            defaultState.resetInterval = 'daily';
                            defaultState.lastReset = 0;
                            defaultState.resetTime = '00:00';
                            defaultState.resetDay = 1;
                            defaultState.resetHour = 0;
                            defaultState.customMonths = 0;
                            defaultState.customDays = 0;
                            defaultState.customHours = 0;
                            defaultState.customMinutes = 0;
                        }
                    }
                    
                    // Set the name
                    defaultState.name = containerName;
                    defaultState.title = containerName;
                    
                    // CRITICAL: Ensure tabComponents is initialized
                    if (!defaultState.tabComponents) {
                        defaultState.tabComponents = [[]];
                    }
                    
                    const newContainer = {
                        id: Date.now() + Math.random(),
                        type: containerType,
                        state: defaultState
                    };
                    
                    // Add to current location
                    if (currentContainer) {
                        if (currentContainer.hasTabStructure) {
                            // Ensure the tab exists
                            if (!currentContainer.card.state.tabComponents[currentTabInContainer]) {
                                currentContainer.card.state.tabComponents[currentTabInContainer] = [];
                            }
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(newContainer);
                        } else {
                            // Ensure tabComponents[0] exists
                            if (!currentContainer.card.state.tabComponents[0]) {
                                currentContainer.card.state.tabComponents[0] = [];
                            }
                            currentContainer.card.state.tabComponents[0].push(newContainer);
                        }
                    } else {
                        result.data.tabComponents[currentTabIndex].push(newContainer);
                    }
                    
                    containerStack.push(currentContainer);
                    currentContainer = {
                        card: newContainer,
                        hasTabStructure: false
                    };
                    currentTabInContainer = 0;
                    continue;
                }
                
                // Tab start inside nest/cycle (format: --- TAB 1.1 START: Name ---)
                if (line.match(/^--- TAB .+ START:/)) {
                    if (currentContainer) {
                        // Extract name from line
                        const nameMatch = line.match(/START:\s*(.+?)\s*---$/);
                        const tabName = nameMatch ? this.unescape(nameMatch[1]) : '';
                        
                        if (!currentContainer.hasTabStructure) {
                            currentContainer.hasTabStructure = true;
                            // Ensure tabs object exists before setting tabs.tabs
                            if (!currentContainer.card.state.tabs) {
                                currentContainer.card.state.tabs = { tabs: [], activeViewTab: 0, selectedBuildTab: 0 };
                            } else {
                                currentContainer.card.state.tabs.tabs = [];
                            }
                            currentContainer.card.state.tabComponents = [];
                        }
                        
                        currentContainer.card.state.tabs.tabs.push({
                            name: tabName,
                            label: tabName,
                            color: 'var(--accent)'
                        });
                        currentContainer.card.state.tabComponents.push([]);
                        currentTabInContainer = currentContainer.card.state.tabs.tabs.length - 1;
                    }
                    continue;
                }
                
                // Nest/Cycle end
                if (line.match(/^--- (NEST|CYCLE) .+ END ---$/)) {
                    // Pop and restore the previous container
                    const poppedContainer = containerStack.pop();
                    currentContainer = poppedContainer !== undefined ? poppedContainer : null;
                    
                    if (currentContainer) {
                        if (currentContainer.hasTabStructure && currentContainer.card.state.tabComponents) {
                            currentTabInContainer = currentContainer.card.state.tabComponents.length - 1;
                        } else {
                            currentTabInContainer = 0;
                        }
                    }
                    continue;
                }
                
                // Tab end
                if (line.match(/^--- TAB .+ END ---$/)) {
                    if (currentContainer && currentContainer.hasTabStructure) {
                        // Ensure tabComponents exists before accessing length
                        if (currentContainer.card.state.tabComponents) {
                            currentTabInContainer = currentContainer.card.state.tabComponents.length - 1;
                        }
                    }
                    continue;
                }
                
                // Tab color
                if (type === 'tab-color' && currentContainer && currentContainer.hasTabStructure) {
                    const colorNum = parts[1];
                    // Ensure tabs object exists
                    if (currentContainer.card.state.tabs && currentContainer.card.state.tabs.tabs) {
                        const lastTabIdx = currentContainer.card.state.tabs.tabs.length - 1;
                        if (lastTabIdx >= 0) {
                            currentContainer.card.state.tabs.tabs[lastTabIdx].color = `var(--color-${colorNum})`;
                        }
                    }
                    continue;
                }
                
                // Cycle metadata
                if (currentContainer && currentContainer.card.type === 'cycle') {
                    if (type === 'cycle-interval') {
                        currentContainer.card.state.resetInterval = parts[1];
                        continue;
                    }
                    if (type === 'cycle-custom') {
                        currentContainer.card.state.customMonths = parseInt(parts[1]) || 0;
                        currentContainer.card.state.customDays = parseInt(parts[2]) || 0;
                        currentContainer.card.state.customHours = parseInt(parts[3]) || 0;
                        currentContainer.card.state.customMinutes = parseInt(parts[4]) || 0;
                        continue;
                    }
                    if (type === 'cycle-last-reset') {
                        currentContainer.card.state.lastReset = parseInt(parts[1]);
                        continue;
                    }
                    if (type === 'cycle-reset-time') {
                        currentContainer.card.state.resetTime = parts[1];
                        continue;
                    }
                    if (type === 'cycle-reset-day') {
                        currentContainer.card.state.resetDay = parseInt(parts[1]);
                        continue;
                    }
                    if (type === 'cycle-reset-hour') {
                        currentContainer.card.state.resetHour = parseInt(parts[1]);
                        continue;
                    }
                }
                
                // Component types
                const componentTypes = ['LIST', 'ACCUMULATION', 'PROGRESS', 'TIER', 'HISTORY', 
                                      'CHECKLIST', 'DIVIDER', 'RADIO', 'THRESHOLD', 'TEXT', 'SCALE'];
        
                if (componentTypes.includes(type)) {
                    const card = this.parseCardHeader(type, parts);
                    
                    if (currentContainer) {
                        if (currentContainer.hasTabStructure) {
                            // Ensure the tab exists
                            if (!currentContainer.card.state.tabComponents[currentTabInContainer]) {
                                currentContainer.card.state.tabComponents[currentTabInContainer] = [];
                            }
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(card);
                        } else {
                            // Ensure tabComponents[0] exists
                            if (!currentContainer.card.state.tabComponents[0]) {
                                currentContainer.card.state.tabComponents[0] = [];
                            }
                            currentContainer.card.state.tabComponents[0].push(card);
                        }
                    } else {
                        result.data.tabComponents[currentTabIndex].push(card);
                    }
                    
                    const currentCard = card;
                    
                    for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j].trim();
                        if (!nextLine) continue;
                        
                        const nextParts = nextLine.split('|');
                        const nextType = nextParts[0];
                        
                        const subItemTypes = ['dropdown', 'list-item', 'checklist-item', 'tier-level', 
                                            'radio-option', 'threshold-item', 'text-content', 'text-alignment',
                                            'text-weight', 'text-font', 'history-entry', 'history-displayMode',
                                            'history-locked', 'scale-item'];
                        
                        if (subItemTypes.includes(nextType)) {
                            this.parseCardContent(nextType, nextParts, currentCard.state);
                            i = j;
                        } else {
                            break;
                        }
                    }
                }
            }
            
            return result;
        },
        
        // ===== PARSE CARD HEADER =====
        parseCardHeader: function(type, parts) {
            const card = {
                id: Date.now() + Math.random(),
                type: type.toLowerCase(),
                state: { open: false }
            };
            
            switch(type) {
                case 'LIST':
                    if (parts.length === 2) {
                        card.state.title = this.unescape(parts[1]);
                        card.state.items = [];
                    } else {
                        card.state.completed = parts[1] === '1';
                        card.state.title = this.unescape(parts[2]);
                        card.state.items = [];
                    }
                    break;
                    
                case 'CHECKLIST':
                    card.state.title = this.unescape(parts[1]);
                    card.state.items = [];
                    break;
                    
                case 'PROGRESS':
                    const [current, total] = parts[1].split('/').map(Number);
                    card.state.current = current;
                    card.state.total = total;
                    card.state.target = total;
                    card.state.title = this.unescape(parts[2]);
                    break;
                    
                case 'ACCUMULATION':
                    card.state.value = parseInt(parts[1]);
                    card.state.total = parseInt(parts[1]);
                    card.state.title = this.unescape(parts[2]);
                    card.state.numpadOpen = false;
                    break;
                    
                case 'THRESHOLD':
                    card.state.number1 = parseInt(parts[1]);
                    card.state.threshold = 0;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.manuallyChecked = false;
                    break;
                    
                case 'TIER':
                    card.state.title = this.unescape(parts[1]);
                    card.state.tiers = [];
                    card.state.current = 0;
                    card.state.total = 0;
                    break;
                    
                case 'RADIO':
                    const selectedIndex = parseInt(parts[1]) - 1;
                    card.state.selectedIndex = selectedIndex;
                    card.state.value = selectedIndex;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.options = [];
                    break;
                    
                case 'SCALE':
                    card.type = 'scale';
                    card.state.multiplier = 1;
                    card.state.items = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
                    delete card.state.title;
                    break;
                    
                case 'DIVIDER':
                    card.state.title = this.unescape(parts[1]);
                    break;
                    
                case 'TEXT':
                    card.state.title = this.unescape(parts[1]);
                    card.state.text = '';
                    card.state.value = '';
                    card.state.alignment = 'left';
                    card.state.fontWeight = '400';
                    card.state.fontStyle = 'system';
                    break;
                    
                case 'HISTORY':
                    card.state.title = this.unescape(parts[1]);
                    card.state.entries = [];
                    card.state.dropdownText = '';
                    card.state.displayMode = 'timeSince';
                    card.state.locked = false;
                    break;
            }
            
            return card;
        },
        
        // ===== PARSE CARD CONTENT =====
        parseCardContent: function(type, parts, state) {
            switch(type) {
                case 'dropdown':
                    state.dropdownText = this.unescape(parts[1]);
                    break;
                    
                case 'list-item':
                    if (!state.items) state.items = [];
                    state.items.push({
                        completed: parts[1] === '1',
                        text: this.unescape(parts[2])
                    });
                    break;
                    
                case 'checklist-item':
                    if (!state.items) state.items = [];
                    state.items.push({
                        completed: parts[1] === '1',
                        text: this.unescape(parts[2])
                    });
                    break;
                    
                case 'tier-level':
                    if (!state.tiers) state.tiers = [];
                    const [tierCurrent, tierAmount] = parts[2].split('/').map(Number);
                    state.tiers.push({
                        name: this.unescape(parts[3]),
                        amount: tierAmount,
                        current: tierCurrent
                    });
                    state.total = state.tiers.reduce((sum, t) => sum + t.amount, 0);
                    state.current = state.tiers.reduce((sum, t) => sum + t.current, 0);
                    break;
                    
                case 'radio-option':
                    if (!state.items) state.items = [];
                    if (!state.options) state.options = [];
                    const optionText = this.unescape(parts[2]);
                    state.items.push({ text: optionText });
                    state.options.push(optionText);
                    break;
                    
                case 'threshold-item':
                    if (!state.items) state.items = [];
                    const item = {
                        completed: parts[1] === '1',
                        text: this.unescape(parts[2])
                    };
                    state.items.push(item);
                    if (item.completed) {
                        state.threshold = (state.threshold || 0) + 1;
                    }
                    break;
                    
                case 'text-content':
                    state.text = this.unescape(parts[1]);
                    state.value = this.unescape(parts[1]);
                    break;
                    
                case 'text-alignment':
                    state.alignment = parts[1];
                    break;
                    
                case 'text-weight':
                    state.fontWeight = parts[1];
                    break;
                    
                case 'text-font':
                    state.fontStyle = parts[1];
                    break;
                    
                case 'history-entry':
                    if (!state.entries) state.entries = [];
                    // Parse timestamp (parts[1]) and ignore formatted date (parts[2] if exists)
                    const timestamp = parseInt(parts[1]);
                    state.entries.push({ timestamp: timestamp });
                    break;
                    
                case 'history-displayMode':
                    state.displayMode = parts[1];
                    break;
                    
                case 'history-locked':
                    state.locked = parts[1] === '1';
                    break;
                    
                case 'scale-item':
                    if (!state.items) state.items = [];
                    state.items.push({
                        number: this.unescape(parts[1]),
                        unit: this.unescape(parts[2]),
                        title: this.unescape(parts[3])
                    });
                    break;
            }
        },
        
        // ===== VALIDATION =====
        validate: function(formatData) {
            try {
                if (!formatData.includes('===== WORKSPACE START =====')) {
                    return { valid: false, error: 'Missing workspace header' };
                }
                if (!formatData.includes('===== WORKSPACE END =====')) {
                    return { valid: false, error: 'Missing workspace footer' };
                }
                
                const result = this.deserialize(formatData);
                
                if (!result.data || !result.data.tabs || !result.data.tabComponents) {
                    return { valid: false, error: 'Invalid data structure' };
                }
                
                return { 
                    valid: true,
                    tabCount: result.data.tabs.tabs.length,
                    componentCount: result.data.tabComponents.reduce((sum, arr) => sum + arr.length, 0)
                };
            } catch (error) {
                return { valid: false, error: error.message };
            }
        },
        
        // ===== ESCAPE/UNESCAPE =====
        escape: function(str) {
            if (typeof str !== 'string') return str;
            return str
                .replace(/\\/g, '\\\\')
                .replace(/\|/g, '\\|')
                .replace(/\n/g, '\\n');
        },
        
        unescape: function(str) {
            if (typeof str !== 'string') return str;
            return str
                .replace(/\\n/g, '\n')
                .replace(/\\\|/g, '|')
                .replace(/\\\\/g, '\\');
        }
    };
    
    // ===== REGISTER FORMAT =====
    if (window.GT50Lib && window.GT50Lib.ImpEx) {
        window.GT50Lib.ImpEx.registerFormat(GT50Format);
    }
})();