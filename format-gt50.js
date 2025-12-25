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
    // NEST:         Uses --- NEST X START/END --- with internal tabs or direct components
    // CYCLE:        Uses --- CYCLE X START/END --- with scheduling info
    //
    // ALL COMPONENTS: Can have optional dropdownText field
    // 
    // SUB-ITEMS:
    // tier-level:   tier-level|[level #]|xx/yy|title (1-based)
    // radio-option: radio-option|[order #]|name (1-based)
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
            
            // Check if we have multiple tabs
            const hasMultipleTabs = tabs && tabs.tabs && tabs.tabs.length > 1;
            const hasContent = tabComponents && tabComponents.some(arr => arr.length > 0);
            
            // Workspace header
            output.push('===== WORKSPACE START =====');
            
            // If completely empty (single default tab with no cards), just workspace markers
            if (!hasMultipleTabs && !hasContent) {
                output.push('');
                output.push('===== WORKSPACE END =====');
                return output.join('\n');
            }
            
            output.push('');
            
            // Only include metadata if there are multiple tabs
            if (hasMultipleTabs) {
                output.push(`WORKSPACE|${this.escape(jsonData.app || 'GT50 Tester')}`);
                output.push(`TIMESTAMP|${jsonData.timestamp || new Date().toISOString()}`);
                output.push(`TAB_STRUCTURE|${tabs.tabs.length}`);
                output.push(`TAB_CURRENT|${tabs.activeViewTab !== undefined ? tabs.activeViewTab : 0}`);
                
                const tabNames = tabs.tabs.map(t => {
                    const label = t.label || t.name || 'Untitled';
                    return this.escape(label);
                }).join(',');
                output.push(`TAB_LIST|${tabNames}`);
                output.push('');
                
                // Full tab structure for multiple tabs
                tabComponents.forEach((componentArray, tabIndex) => {
                    let tab = { label: 'Untitled', color: '' };
                    if (tabs && tabs.tabs && tabs.tabs[tabIndex]) {
                        const tabData = tabs.tabs[tabIndex];
                        tab = {
                            label: tabData.name || tabData.label || tabData.title || 'Untitled',
                            color: tabData.color || ''
                        };
                    }
                    
                    const tabLabel = this.escape(tab.label);
                    
                    output.push(`--- TAB START: ${tabLabel} ---`);
                    output.push(`CARD_COUNT|${componentArray.length}`);
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
            
            // Type-specific content
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
                        let cumulativeAmount = 0;
                        const currentProgress = state.current || 0;
                        
                        state.tiers.forEach((tier, index) => {
                            const tierAmount = parseInt(tier.amount) || 0;
                            const tierName = this.escape(tier.name || tier.title || '');
                            
                            // Calculate how much progress is in this specific tier
                            let tierCurrent = 0;
                            if (currentProgress > cumulativeAmount) {
                                tierCurrent = Math.min(currentProgress - cumulativeAmount, tierAmount);
                            }
                            
                            // Tier levels are 1-based (1 = first tier)
                            output.push(`tier-level|${index + 1}|${tierCurrent}/${tierAmount}|${tierName}`);
                            
                            cumulativeAmount += tierAmount;
                        });
                    }
                    break;
                    
                case 'radio':
                    // Radio uses state.items (with text property)
                    // Radio options are 1-based (1 = first option)
                    if (state.items && state.items.length > 0) {
                        state.items.forEach((item, index) => {
                            const label = this.escape(item.text || item.label || item.name || '');
                            output.push(`radio-option|${index + 1}|${label}`);
                        });
                    } else if (state.options && state.options.length > 0) {
                        // Fallback for old format
                        state.options.forEach((option, index) => {
                            const label = this.escape(option.label || option.text || option.name || '');
                            output.push(`radio-option|${index + 1}|${label}`);
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
                        const textContent = state.text || state.value || '';
                        output.push(`text-content|${this.escape(textContent)}`);
                    }
                    // Text formatting properties
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
                    if (state.entries && state.entries.length > 0) {
                        state.entries.forEach(entry => {
                            output.push(`history-entry|${entry.timestamp}`);
                        });
                    }
                    break;
                    
                case 'nest':
                case 'cycle':
                    // Nests and Cycles contain their own internal tabs or direct components
                    const nestName = state.name || state.title || 'Untitled';
                    const componentType = type === 'cycle' ? 'CYCLE' : 'NEST';
                    
                    // Generate nest/cycle number based on position
                    const currentNestNumber = nestPath ? `${nestPath}.${nestNumber}` : `${nestNumber}`;
                    
                    output.push(`--- ${componentType} ${currentNestNumber} START ---`);
                    output.push(`${type}-name|${this.escape(nestName)}`);
                    
                    // For cycles, add the cycle scheduling info
                    if (type === 'cycle') {
                        const resetInterval = state.resetInterval || 'daily';
                        output.push(`cycle-interval|${resetInterval}`);
                        
                        // If custom interval, output the custom values and last reset
                        if (resetInterval === 'custom') {
                            const months = state.customMonths || 0;
                            const days = state.customDays || 0;
                            const hours = state.customHours || 0;
                            const minutes = state.customMinutes || 0;
                            output.push(`cycle-custom|${months}|${days}|${hours}|${minutes}`);
                            
                            // Last reset timestamp (when custom, app calculates from here)
                            if (state.lastReset) {
                                output.push(`cycle-last-reset|${state.lastReset}`);
                            }
                        } else {
                            // For daily/weekly/monthly, output reset time
                            if (state.resetTime) {
                                output.push(`cycle-reset-time|${state.resetTime}`);
                            }
                            
                            // Reset day only for weekly
                            if (resetInterval === 'weekly' && state.resetDay !== undefined) {
                                output.push(`cycle-reset-day|${state.resetDay}`);
                            }
                        }
                    }
                    
                    output.push('');
                    
                    // Check if tabs are explicitly defined
                    const hasExplicitTabs = state.tabs && state.tabs.tabs && state.tabs.tabs.length > 0;
                    
                    if (hasExplicitTabs) {
                        // Output the tabs structure
                        if (state.tabComponents && state.tabComponents.length > 0) {
                            state.tabComponents.forEach((nestedArray, tabIndex) => {
                                // Skip empty tab arrays
                                if (!nestedArray || nestedArray.length === 0) {
                                    return;
                                }
                                
                                // Get tab name from tabs array
                                let tabName = 'Untitled';
                                let tabColor = '';
                                
                                if (state.tabs.tabs[tabIndex]) {
                                    const tab = state.tabs.tabs[tabIndex];
                                    tabName = tab.label || tab.name || tab.title || 'Untitled';
                                    tabColor = tab.color || '';
                                }
                                
                                // Tabs inside nests/cycles use hierarchical numbering
                                const tabNumber = `${currentNestNumber}.${tabIndex + 1}`;
                                
                                output.push(`--- TAB ${tabNumber} START ---`);
                                output.push(`tab-name|${this.escape(tabName)}`);
                                if (tabColor) {
                                    const colorMatch = tabColor.match(/var\(--color-(\d+)\)/);
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
                        }
                    } else {
                        // No tabs defined - output components directly (like single-tab at root)
                        if (state.tabComponents && state.tabComponents[0] && state.tabComponents[0].length > 0) {
                            this.serializeComponents(state.tabComponents[0], output, currentNestNumber);
                        }
                    }
                    
                    output.push(`--- ${componentType} ${currentNestNumber} END ---`);
                    output.push('');
                    break;
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
                    tabComponents: [[]] // Initialize with empty first tab for single-tab mode
                }
            };
            
            let currentSection = 'header';
            let currentTabIndex = 0; // Start at 0 for single-tab mode
            let hasMainWindowTabs = false;
            
            // Stack to track nested containers
            let containerStack = []; // Each entry: { card, hasTabStructure }
            let currentContainer = null;
            let currentTabInContainer = -1;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Section markers
                if (line.startsWith('=====')) continue;
                
                // Main window tabs
                if (line.startsWith('--- TAB START:')) {
                    if (!hasMainWindowTabs) {
                        // First main window tab found - clear the default empty array
                        result.data.tabComponents = [];
                        hasMainWindowTabs = true;
                        currentTabIndex = -1; // Will be incremented to 0
                    }
                    
                    currentSection = 'tab';
                    currentTabIndex++;
                    result.data.tabComponents[currentTabIndex] = [];
                    
                    // Extract tab name from marker
                    const match = line.match(/--- TAB START: (.+) ---/);
                    if (match) {
                        result.data.tabs.tabs.push({
                            name: this.unescape(match[1]),
                            label: this.unescape(match[1]),
                            color: ''
                        });
                    }
                    continue;
                }
                
                if (line.startsWith('--- TAB END:')) {
                    currentSection = 'header';
                    continue;
                }
                
                if (line === '--- CARDS ---') {
                    currentSection = 'cards';
                    continue;
                }
                
                // NEST/CYCLE START - create the container
                if ((line.startsWith('--- NEST ') || line.startsWith('--- CYCLE ')) && line.includes('START ---')) {
                    const isNest = line.startsWith('--- NEST ');
                    const componentType = isNest ? 'NEST' : 'CYCLE';
                    const nestCard = this.parseCardHeader(componentType, [componentType, 'Untitled']);
                    
                    // Add to appropriate location
                    if (currentContainer) {
                        // Inside another container
                        if (currentContainer.hasTabStructure) {
                            // Inside a tab
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(nestCard);
                        } else {
                            // No tab structure
                            currentContainer.card.state.tabComponents[0].push(nestCard);
                        }
                    } else {
                        // Root level
                        result.data.tabComponents[currentTabIndex].push(nestCard);
                    }
                    
                    // Push to stack and set as current
                    containerStack.push(currentContainer);
                    currentContainer = { card: nestCard, hasTabStructure: false };
                    currentTabInContainer = -1;
                    continue;
                }
                
                // TAB inside NEST/CYCLE - numbered tabs like "--- TAB 1.1 START ---"
                if (line.startsWith('--- TAB ') && line.includes('START ---') && !line.includes('TAB START:')) {
                    if (currentContainer) {
                        currentContainer.hasTabStructure = true;
                        currentTabInContainer++;
                        
                        // Ensure arrays exist
                        while (currentContainer.card.state.tabComponents.length <= currentTabInContainer) {
                            currentContainer.card.state.tabComponents.push([]);
                        }
                        while (currentContainer.card.state.tabs.tabs.length <= currentTabInContainer) {
                            currentContainer.card.state.tabs.tabs.push({ name: '', label: '', color: '' });
                        }
                    }
                    continue;
                }
                
                if (line.startsWith('--- TAB ') && line.includes('END ---') && !line.includes('TAB END:')) {
                    continue;
                }
                
                // NEST/CYCLE END - pop from stack
                if ((line.startsWith('--- NEST') || line.startsWith('--- CYCLE')) && line.includes('END ---')) {
                    currentContainer = containerStack.pop();
                    if (currentContainer) {
                        currentTabInContainer = currentContainer.hasTabStructure ? 
                            currentContainer.card.state.tabComponents.length - 1 : -1;
                    } else {
                        currentTabInContainer = -1;
                    }
                    continue;
                }
                
                // Parse line content
                const parts = line.split('|');
                const type = parts[0];
                
                // Header metadata
                if (currentSection === 'header') {
                    if (type === 'WORKSPACE') {
                        result.app = this.unescape(parts[1]);
                        continue;
                    } else if (type === 'TIMESTAMP') {
                        result.timestamp = parts[1];
                        continue;
                    } else if (type === 'TAB_CURRENT') {
                        const current = parseInt(parts[1]);
                        result.data.tabs.activeViewTab = current;
                        result.data.tabs.selectedBuildTab = current;
                        continue;
                    } else if (type === 'TAB_STRUCTURE' || type === 'TAB_LIST' || type === 'CARD_COUNT') {
                        continue;
                    }
                }
                
                // Container metadata
                if (currentContainer) {
                    if (type === 'nest-name' || type === 'cycle-name') {
                        currentContainer.card.state.name = this.unescape(parts[1]);
                        currentContainer.card.state.title = this.unescape(parts[1]);
                        continue;
                    }
                    
                    if (type === 'tab-name' && currentContainer.hasTabStructure) {
                        currentContainer.card.state.tabs.tabs[currentTabInContainer].name = this.unescape(parts[1]);
                        currentContainer.card.state.tabs.tabs[currentTabInContainer].label = this.unescape(parts[1]);
                        continue;
                    }
                    
                    if (type === 'tab-color' && currentContainer.hasTabStructure) {
                        const colorNum = parts[1];
                        currentContainer.card.state.tabs.tabs[currentTabInContainer].color = `var(--color-${colorNum})`;
                        continue;
                    }
                    
                    // Cycle-specific metadata
                    if (currentContainer.card.type === 'cycle') {
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
                }
                
                // Component types
                const componentTypes = ['LIST', 'ACCUMULATION', 'PROGRESS', 'TIER', 'HISTORY', 
                                      'CHECKLIST', 'DIVIDER', 'RADIO', 'THRESHOLD', 'TEXT'];
                
                if (componentTypes.includes(type)) {
                    const card = this.parseCardHeader(type, parts);
                    
                    // Add to appropriate location
                    if (currentContainer) {
                        if (currentContainer.hasTabStructure) {
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(card);
                        } else {
                            currentContainer.card.state.tabComponents[0].push(card);
                        }
                    } else {
                        result.data.tabComponents[currentTabIndex].push(card);
                    }
                    
                    // Set as current for sub-item parsing
                    const currentCard = card;
                    
                    // Parse any sub-items on following lines
                    for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j].trim();
                        if (!nextLine) continue;
                        
                        const nextParts = nextLine.split('|');
                        const nextType = nextParts[0];
                        
                        // Check if this is a sub-item for current card
                        const subItemTypes = ['dropdown', 'list-item', 'checklist-item', 'tier-level', 
                                            'radio-option', 'threshold-item', 'text-content', 'text-alignment',
                                            'text-weight', 'text-font', 'history-entry'];
                        
                        if (subItemTypes.includes(nextType)) {
                            this.parseCardContent(nextType, nextParts, currentCard.state);
                            i = j; // Skip this line in main loop
                        } else {
                            // Not a sub-item, break and let main loop handle it
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
                state: { title: '' }
            };
            
            switch(type) {
                case 'LIST':
                    if (parts.length === 2) {
                        card.state.title = this.unescape(parts[1]);
                        card.state.items = [];
                        card.state.completed = false;
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
                    const [current, target] = parts[1].split('/').map(Number);
                    card.state.current = current;
                    card.state.total = target;
                    card.state.target = target;
                    card.state.title = this.unescape(parts[2]);
                    break;
                    
                case 'ACCUMULATION':
                    card.state.value = parseFloat(parts[1]);
                    card.state.total = parseFloat(parts[1]);
                    card.state.title = this.unescape(parts[2]);
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
                    const radioIndex = parseInt(parts[1]) - 1; // Convert from 1-based to 0-based
                    card.state.selectedIndex = radioIndex;
                    card.state.value = radioIndex;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.options = [];
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
                    break;
                    
                case 'NEST':
                case 'CYCLE':
                    card.state.name = this.unescape(parts[1]);
                    card.state.title = this.unescape(parts[1]);
                    card.state.components = [];
                    card.state.tabs = { tabs: [], activeViewTab: 0, selectedBuildTab: 0 };
                    card.state.tabComponents = [[]]; // Initialize with one empty array
                    if (type === 'CYCLE') {
                        card.state.resetInterval = 'daily';
                        card.state.lastReset = Date.now();
                        card.state.resetTime = '00:00';
                        card.state.resetDay = 1;
                        card.state.resetHour = 0;
                        card.state.customMonths = 0;
                        card.state.customDays = 0;
                        card.state.customHours = 0;
                        card.state.customMinutes = 0;
                        card.state.customDropdownOpen = false;
                    }
                    break;
            }
            
            return card;
        },
        
        // ===== PARSE CARD CONTENT =====
        parseCardContent: function(type, parts, state) {
            if (type === 'dropdown') {
                state.dropdownText = this.unescape(parts[1]);
            } else if (type === 'list-item') {
                if (!state.items) state.items = [];
                state.items.push({
                    text: this.unescape(parts[2]),
                    completed: parts[1] === '1',
                    timestamp: Date.now()
                });
            } else if (type === 'checklist-item') {
                if (!state.items) state.items = [];
                state.items.push({
                    text: this.unescape(parts[2]),
                    completed: parts[1] === '1',
                    timestamp: Date.now()
                });
            } else if (type === 'tier-level') {
                if (!state.tiers) state.tiers = [];
                const [tierCurrent, tierAmount] = parts[2].split('/').map(Number);
                const tierName = this.unescape(parts[3]);
                
                state.tiers.push({
                    name: tierName,
                    amount: tierAmount.toString()
                });
                
                state.total = (state.total || 0) + tierAmount;
                state.current = (state.current || 0) + tierCurrent;
            } else if (type === 'history-entry') {
                if (!state.entries) state.entries = [];
                state.entries.push({
                    timestamp: parseInt(parts[1]) || Date.now()
                });
            } else if (type === 'radio-option') {
                if (!state.items) state.items = [];
                if (!state.options) state.options = [];
                
                const optionText = this.unescape(parts[2]);
                state.items.push({
                    text: optionText
                });
                state.options.push({
                    label: optionText,
                    text: optionText
                });
            } else if (type === 'threshold-item') {
                if (!state.items) state.items = [];
                state.items.push({
                    text: this.unescape(parts[2]),
                    completed: parts[1] === '1',
                    timestamp: Date.now()
                });
                state.threshold = state.items.length;
            } else if (type === 'text-content') {
                state.text = this.unescape(parts[1]);
                state.value = this.unescape(parts[1]);
            } else if (type === 'text-alignment') {
                state.alignment = parts[1];
            } else if (type === 'text-weight') {
                state.fontWeight = parts[1];
            } else if (type === 'text-font') {
                state.fontStyle = parts[1];
            }
        },
        
        // ===== VALIDATE =====
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
        
        // ===== HELPER: ESCAPE SPECIAL CHARACTERS =====
        escape: function(str) {
            if (typeof str !== 'string') return str;
            return str.replace(/\|/g, '\\|').replace(/\n/g, '\\n').replace(/,/g, '\\,');
        },
        
        // ===== HELPER: UNESCAPE SPECIAL CHARACTERS =====
        unescape: function(str) {
            if (typeof str !== 'string') return str;
            return str.replace(/\\\|/g, '|').replace(/\\n/g, '\n').replace(/\\,/g, ',');
        }
    };
    
    // ===== AUTO-REGISTER FORMAT =====
    if (window.GT50Lib && window.GT50Lib.ImpEx) {
        window.GT50Lib.ImpEx.registerFormat(GT50Format);
    } else {
        console.warn('GT50 Format: ImpEx not yet loaded, format not registered');
    }
})();