(function() {
    // Static injector ID
    const INJECTOR_ID = '0020';
    
    // ===== GT50 READABLE FORMAT ADAPTER =====
    // Human-readable structured format for GT50 data export/import
    
    const GT50Format = {
        // ===== FORMAT INFO =====
        getFormatName: function() {
            return 'GT50';
        },
        
        getDescription: function() {
            return 'Human-readable structured format';
        },
        
        getVersion: function() {
            return '2.0.0';
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
            output.push(`APP|${jsonData.app || 'GT50 Tester'}`);
            output.push('');
            
            // Check if this is a nest export
            if (jsonData.type === 'nest' && jsonData.name) {
                // Single nest export
                this.serializeNest(jsonData.name, jsonData.data, output, '1');
            } else if (tabs && tabs.tabs && tabs.tabs.length > 0) {
                // Multiple tabs at root level
                tabs.tabs.forEach((tab, index) => {
                    const tabLabel = tab.label || tab.name || `Tab ${index + 1}`;
                    const componentArray = tabComponents[index] || [];
                    const tabNum = `${index + 1}`;
                    
                    output.push(`--- TAB ${tabNum} START: ${tabLabel} ---`);
                    
                    // Tab color if present
                    if (tab.color) {
                        const colorMatch = tab.color.match(/--color-(\d+)/);
                        if (colorMatch) {
                            output.push(`tab-color|${colorMatch[1]}`);
                        }
                    }
                    
                    output.push('');
                    
                    if (componentArray.length > 0) {
                        this.serializeComponents(componentArray, output, tabNum);
                    }
                    
                    output.push(`--- TAB ${tabNum} END ---`);
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
        
        // ===== SERIALIZE NEST =====
        serializeNest: function(nestName, nestData, output, nestNumber) {
            const nestNum = nestNumber || '1';
            output.push(`--- NEST ${nestNum} START: ${this.escape(nestName)} ---`);
            
            // Always output nest properties (use defaults if not set)
            const color = nestData.color || 'GRAY';
            output.push(`nest-color|${color}`);
            
            const autoSort = nestData.autoSortByLastUpdated !== undefined ? nestData.autoSortByLastUpdated : false;
            output.push(`nest-auto-sort|${autoSort ? '1' : '0'}`);
            
            const showSummary = nestData.showSummary !== undefined ? nestData.showSummary : false;
            output.push(`nest-show-summary|${showSummary ? '1' : '0'}`);
            
            const summaryChildProgress = nestData.summaryShowChildNestProgress !== undefined ? nestData.summaryShowChildNestProgress : false;
            output.push(`nest-summary-child-progress|${summaryChildProgress ? '1' : '0'}`);
            
            // If child nest progress is off, mode should be 0
            const summaryMode = summaryChildProgress ? (nestData.summaryChildNestProgressMode || 'first-tab') : '0';
            output.push(`nest-summary-mode|${summaryMode}`);
            
            output.push('');
            
            // Serialize tabs
            if (nestData.tabs && nestData.tabs.tabs && nestData.tabs.tabs.length > 0) {
                nestData.tabs.tabs.forEach((tab, index) => {
                    const tabLabel = tab.label || tab.name || `Tab ${index + 1}`;
                    const componentArray = nestData.tabComponents[index] || [];
                    const tabNum = `${nestNum}.${index + 1}`;
                    
                    output.push(`--- TAB ${tabNum} START: ${tabLabel} ---`);
                    
                    // Tab color if present
                    if (tab.color) {
                        const colorMatch = tab.color.match(/--color-(\d+)/);
                        if (colorMatch) {
                            output.push(`tab-color|${colorMatch[1]}`);
                        }
                    }
                    
                    output.push('');
                    
                    if (componentArray.length > 0) {
                        this.serializeComponents(componentArray, output, tabNum);
                    }
                    
                    output.push(`--- TAB ${tabNum} END ---`);
                    output.push('');
                });
            }
            
            output.push(`--- NEST ${nestNum} END ---`);
            output.push('');
        },
        
        // ===== SERIALIZE COMPONENTS ARRAY =====
        serializeComponents: function(componentArray, output, nestPath) {
            let nestCounter = 0;
            
            componentArray.forEach(comp => {
                if (comp.type === 'nest' || comp.type === 'cycle') {
                    nestCounter++;
                    const currentNestNumber = nestPath ? `${nestPath}.${nestCounter}` : `${nestCounter}`;
                    this.serializeComponent(comp, output, currentNestNumber);
                } else {
                    this.serializeComponent(comp, output, null);
                }
            });
        },
        
        // ===== SERIALIZE COMPONENT =====
        serializeComponent: function(comp, output, nestNumber) {
            const state = comp.state || {};
            const title = this.escape(state.title || state.name || 'Untitled');
            const type = comp.type;
            
            // Handle nest/cycle types
            if (type === 'nest' || type === 'cycle') {
                const componentType = type === 'nest' ? 'NEST' : 'CYCLE';
                
                output.push(`--- ${componentType} ${nestNumber} START: ${title} ---`);
                
                // Always output nest properties (use defaults if not set)
                const color = state.color || 'GRAY';
                output.push(`nest-color|${color}`);
                
                const autoSort = state.autoSortByLastUpdated !== undefined ? state.autoSortByLastUpdated : false;
                output.push(`nest-auto-sort|${autoSort ? '1' : '0'}`);
                
                const showSummary = state.showSummary !== undefined ? state.showSummary : false;
                output.push(`nest-show-summary|${showSummary ? '1' : '0'}`);
                
                const summaryChildProgress = state.summaryShowChildNestProgress !== undefined ? state.summaryShowChildNestProgress : false;
                output.push(`nest-summary-child-progress|${summaryChildProgress ? '1' : '0'}`);
                
                // If child nest progress is off, mode should be 0
                const summaryMode = summaryChildProgress ? (state.summaryChildNestProgressMode || 'first-tab') : '0';
                output.push(`nest-summary-mode|${summaryMode}`);
                
                // Cycle-specific metadata
                if (type === 'cycle') {
                    if (state.resetInterval) output.push(`cycle-interval|${state.resetInterval}`);
                    if (state.resetInterval === 'custom') {
                        output.push(`cycle-custom|${state.customMonths||0}|${state.customDays||0}|${state.customHours||0}|${state.customMinutes||0}`);
                    }
                    if (state.lastReset) output.push(`cycle-last-reset|${state.lastReset}`);
                    if (state.resetTime) output.push(`cycle-reset-time|${state.resetTime}`);
                    if (state.resetDay !== undefined) output.push(`cycle-reset-day|${state.resetDay}`);
                    if (state.resetHour !== undefined) output.push(`cycle-reset-hour|${state.resetHour}`);
                    if (state.showCountdown !== undefined) output.push(`show-countdown|${state.showCountdown ? 'true' : 'false'}`);
                    if (state.countdownColor) output.push(`countdown-color|${state.countdownColor}`);
                }
                
                output.push('');
                
                // Serialize tabs if present
                if (state.tabs && state.tabs.tabs && state.tabs.tabs.length > 0) {
                    state.tabs.tabs.forEach((tab, tabIdx) => {
                        const tabLabel = tab.label || tab.name || `Tab ${tabIdx + 1}`;
                        const nestedArray = state.tabComponents[tabIdx] || [];
                        const tabNum = `${nestNumber}.${tabIdx + 1}`;
                        
                        output.push(`--- TAB ${tabNum} START: ${tabLabel} ---`);
                        
                        // Tab color if present
                        if (tab.color) {
                            const colorMatch = tab.color.match(/--color-(\d+)/);
                            if (colorMatch) {
                                output.push(`tab-color|${colorMatch[1]}`);
                            }
                        }
                        
                        output.push('');
                        
                        // Output components inside this tab
                        this.serializeComponents(nestedArray, output, tabNum);
                        
                        output.push(`--- TAB ${tabNum} END ---`);
                        output.push('');
                    });
                } else {
                    // No tabs - output components directly
                    if (state.tabComponents && state.tabComponents[0] && state.tabComponents[0].length > 0) {
                        this.serializeComponents(state.tabComponents[0], output, nestNumber);
                    }
                }
                
                output.push(`--- ${componentType} ${nestNumber} END ---`);
                output.push('');
                return;
            }
            
            // Regular component types
            if (type === 'scale' || (type === 'divider' && state.variant === 'scale')) {
                output.push('SCALE');
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
                        let selectedIndex = state.selectedIndex !== undefined ? state.selectedIndex : state.value;
                        // Export as 1-based: 0 = nothing selected, 1 = first option, 2 = second, etc
                        const exportIndex = (selectedIndex === null || selectedIndex === undefined) ? 0 : selectedIndex + 1;
                        output.push(`RADIO|${exportIndex}|${title}`);
                        break;
                    
                    case 'history':
                        output.push(`HISTORY|${title}`);
                        break;
                    
                    case 'text':
                        output.push(`TEXT|${title}`);
                        break;
                    
                    case 'divider':
                        output.push(`DIVIDER|${title}`);
                        break;
                }
            }
            
            // Dropdown text (all components)
            if (state.dropdownText) {
                output.push(`dropdown|${this.escape(state.dropdownText)}`);
            }
            
            // Component-specific content
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
                    const tierCurrent = state.current || 0;
                    const tierTotal = state.total || (state.tiers ? state.tiers.reduce((sum, t) => sum + t.amount, 0) : 0);
                    output.push(`tier-progress|${tierCurrent}/${tierTotal}`);
                    if (state.tiers && state.tiers.length > 0) {
                        state.tiers.forEach((tier, idx) => {
                            const tierName = this.escape(tier.name);
                            output.push(`tier-level|${idx+1}|${tier.amount}|${tierName}`);
                        });
                    }
                    break;
                
                case 'radio':
                    if (state.items && state.items.length > 0) {
                        state.items.forEach((item, idx) => {
                            const text = this.escape(item.text);
                            output.push(`radio-option|${idx+1}|${text}`);
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
                    if (state.entries && state.entries.length > 0) {
                        state.entries.forEach(entry => {
                            const timestamp = entry.timestamp || entry;
                            const date = new Date(timestamp);
                            const isoDate = date.toISOString();
                            const dropdownText = entry.dropdownText || '';
                            const displayMode = entry.displayMode || 'relative';
                            const locked = entry.locked ? 'true' : 'false';
                            output.push(`history-entry|${isoDate}|${this.escape(dropdownText)}|${displayMode}|${locked}`);
                        });
                    }
                    break;
                
                case 'scale':
                    if (state.items && state.items.length > 0) {
                        state.items.forEach(item => {
                            output.push(`scale-item|${this.escape(item.number)}|${this.escape(item.unit)}|${this.escape(item.title)}`);
                        });
                    }
                    break;
            }
            
            output.push('');
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
            let currentTabInContainer = -1;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                if (line.startsWith('=====')) continue;
                
                const parts = line.split('|');
                const type = parts[0];
                
                // Parse header
                if (type === 'TIMESTAMP') {
                    result.timestamp = parts[1];
                    continue;
                }
                if (type === 'APP') {
                    result.app = parts[1];
                    continue;
                }
                
                // Root-level NEST components are now always preserved as nest components
                // No special flattening logic needed
                
                // Nest properties (only for nested containers now)
                if (type === 'nest-color') {
                    if (currentContainer) {
                        currentContainer.card.state.color = parts[1];
                    }
                    continue;
                }
                if (type === 'nest-auto-sort') {
                    if (currentContainer) {
                        currentContainer.card.state.autoSortByLastUpdated = parts[1] === '1';
                    }
                    continue;
                }
                if (type === 'nest-show-summary') {
                    if (currentContainer) {
                        currentContainer.card.state.showSummary = parts[1] === '1';
                    }
                    continue;
                }
                if (type === 'nest-summary-child-progress') {
                    if (currentContainer) {
                        currentContainer.card.state.summaryShowChildNestProgress = parts[1] === '1';
                    }
                    continue;
                }
                if (type === 'nest-summary-mode') {
                    const modeValue = parts[1] === '0' ? null : parts[1];
                    if (currentContainer) {
                        currentContainer.card.state.summaryChildNestProgressMode = modeValue;
                    }
                    continue;
                }
                
                // Tab color (root level or in container)
                if (type === 'tab-color') {
                    const colorNum = parts[1];
                    if (currentContainer && currentContainer.hasTabStructure) {
                        const lastTabIdx = currentContainer.card.state.tabs.tabs.length - 1;
                        if (lastTabIdx >= 0) {
                            currentContainer.card.state.tabs.tabs[lastTabIdx].color = `var(--color-${colorNum})`;
                        }
                    } else if (hasMainWindowTabs) {
                        result.data.tabs.tabs[currentTabIndex].color = `var(--color-${colorNum})`;
                    }
                    continue;
                }
                
                // Main window tabs or nested tabs
                if (line.match(/^--- TAB [\d.]+ START:/)) {
                    const match = line.match(/^--- TAB [\d.]+ START: (.+) ---$/);
                    const tabLabel = match[1];
                    
                    if (currentContainer) {
                        // Tab inside a nest/cycle
                        if (!currentContainer.card.state.tabs) {
                            currentContainer.card.state.tabs = { tabs: [], activeViewTab: 0, selectedBuildTab: 0 };
                        }
                        if (!currentContainer.card.state.tabComponents) {
                            currentContainer.card.state.tabComponents = [];
                        }
                        
                        currentContainer.card.state.tabs.tabs.push({ label: tabLabel, name: tabLabel });
                        currentContainer.hasTabStructure = true;
                        currentTabInContainer = currentContainer.card.state.tabs.tabs.length - 1;
                        
                        while (currentContainer.card.state.tabComponents.length <= currentTabInContainer) {
                            currentContainer.card.state.tabComponents.push([]);
                        }
                    } else {
                        // Root-level tab
                        if (!hasMainWindowTabs) {
                            result.data.tabComponents = [];
                            hasMainWindowTabs = true;
                        }
                        result.data.tabs.tabs.push({ label: tabLabel, name: tabLabel });
                        currentTabIndex = result.data.tabs.tabs.length - 1;
                        if (!result.data.tabComponents[currentTabIndex]) {
                            result.data.tabComponents[currentTabIndex] = [];
                        }
                    }
                    continue;
                }
                
                if (line.match(/^--- TAB [\d.]+ END ---$/)) {
                    continue;
                }
                
                // Nested structures (NEST/CYCLE as components)
                if (line.match(/^--- (NEST|CYCLE) [\d.]+ START:/)) {
                    const match = line.match(/^--- (NEST|CYCLE) [\d.]+ START: (.+) ---$/);
                    const isNest = match[1] === 'NEST';
                    const nestName = match[2];
                    
                    const nestCard = {
                        id: Date.now() + Math.random(),
                        type: isNest ? 'nest' : 'cycle',
                        state: {
                            name: nestName,
                            title: nestName,
                            color: 'GRAY',
                            autoSortByLastUpdated: false,
                            showSummary: false,
                            summaryShowChildNestProgress: false,
                            summaryChildNestProgressMode: 'first-tab',
                            tabs: { tabs: [], activeViewTab: 0, selectedBuildTab: 0 },
                            tabComponents: [[]]
                        }
                    };
                    
                    if (!isNest) {
                        nestCard.state.resetInterval = 'daily';
                        nestCard.state.lastReset = 0;
                        nestCard.state.resetTime = '00:00';
                        nestCard.state.resetDay = 1;
                        nestCard.state.resetHour = 0;
                        nestCard.state.customMonths = 0;
                        nestCard.state.customDays = 0;
                        nestCard.state.customHours = 0;
                        nestCard.state.customMinutes = 0;
                    }
                    
                    // Add to current location
                    if (currentContainer) {
                        if (currentContainer.hasTabStructure) {
                            if (!currentContainer.card.state.tabComponents[currentTabInContainer]) {
                                currentContainer.card.state.tabComponents[currentTabInContainer] = [];
                            }
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(nestCard);
                        } else {
                            if (!currentContainer.card.state.tabComponents[0]) {
                                currentContainer.card.state.tabComponents[0] = [];
                            }
                            currentContainer.card.state.tabComponents[0].push(nestCard);
                        }
                    } else {
                        // Not in a container - adding to root level
                        // Add to tabComponents[0] (implicit first tab) without creating explicit tab entry
                        // unless we've already seen TAB markers (hasMainWindowTabs)
                        const targetIndex = hasMainWindowTabs ? currentTabIndex : 0;
                        if (!result.data.tabComponents[targetIndex]) {
                            result.data.tabComponents[targetIndex] = [];
                        }
                        result.data.tabComponents[targetIndex].push(nestCard);
                    }
                    
                    // Push to stack and set as current
                    containerStack.push(currentContainer);
                    currentContainer = { card: nestCard, hasTabStructure: false };
                    currentTabInContainer = 0;
                    continue;
                }
                
                if (line.match(/^--- (NEST|CYCLE) [\d.]+ END ---$/)) {
                    // Pop from stack
                    currentContainer = containerStack.pop();
                    if (currentContainer) {
                        // Restore the correct tab index for the parent container
                        if (currentContainer.hasTabStructure) {
                            // We should be in the last tab that was being processed
                            currentTabInContainer = currentContainer.card.state.tabs.tabs.length - 1;
                        } else {
                            currentTabInContainer = 0;
                        }
                    } else {
                        currentTabInContainer = -1;
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
                    if (type === 'show-countdown') {
                        currentContainer.card.state.showCountdown = parts[1] === 'true';
                        continue;
                    }
                    if (type === 'countdown-color') {
                        currentContainer.card.state.countdownColor = parts[1];
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
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(card);
                        } else {
                            currentContainer.card.state.tabComponents[0].push(card);
                        }
                    } else {
                        // Make sure we have a valid location to add this card
                        // Add to tabComponents[0] (implicit first tab) without creating explicit tab entry
                        // unless we've already seen TAB markers (hasMainWindowTabs)
                        const targetIndex = hasMainWindowTabs ? currentTabIndex : 0;
                        if (!result.data.tabComponents[targetIndex]) {
                            result.data.tabComponents[targetIndex] = [];
                        }
                        result.data.tabComponents[targetIndex].push(card);
                    }
                    
                    const currentCard = card;
                    
                    for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j].trim();
                        if (!nextLine) continue;
                        
                        const nextParts = nextLine.split('|');
                        const nextType = nextParts[0];
                        
                        const subItemTypes = ['dropdown', 'list-item', 'checklist-item', 'tier-level', 
                                            'radio-option', 'threshold-item', 'text-content', 'text-alignment',
                                            'text-weight', 'text-font', 'history-entry', 'scale-item', 'tier-progress'];
                        
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
                state: {}
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
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'CHECKLIST':
                    card.state.title = this.unescape(parts[1]);
                    card.state.items = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'PROGRESS':
                    const progressParts = parts[1].split('/');
                    card.state.current = parseInt(progressParts[0]) || 0;
                    card.state.total = parseInt(progressParts[1]) || 100;
                    card.state.target = card.state.total;
                    card.state.title = this.unescape(parts[2]);
                    card.state.viewOpen = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'ACCUMULATION':
                    card.state.value = parseInt(parts[1]) || 0;
                    card.state.total = card.state.value;
                    card.state.title = this.unescape(parts[2]);
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'THRESHOLD':
                    card.state.number1 = parseInt(parts[1]) || 1;
                    card.state.threshold = card.state.number1;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.manuallyChecked = false;
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'TIER':
                    card.state.title = this.unescape(parts[1]);
                    card.state.current = 0;
                    card.state.total = 0;
                    card.state.tiers = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'RADIO':
                    const selectedIdx = parseInt(parts[1]);
                    // Import uses 1-based: 0 = nothing selected, 1 = first option (index 0), etc
                    card.state.selectedIndex = selectedIdx === 0 ? null : selectedIdx - 1;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'HISTORY':
                    card.state.title = this.unescape(parts[1]);
                    card.state.entries = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'TEXT':
                    card.state.title = this.unescape(parts[1]);
                    card.state.text = '';
                    card.state.alignment = 'left';
                    card.state.fontWeight = 'normal';
                    card.state.fontStyle = 'normal';
                    card.state.open = false;
                    card.state.dropdownText = '';
                    break;
                
                case 'DIVIDER':
                    card.state.title = this.unescape(parts[1]);
                    card.state.variant = 'divider';
                    break;
                
                case 'SCALE':
                    card.type = 'scale';
                    card.state.items = [];
                    card.state.open = false;
                    card.state.dropdownText = '';
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
                        text: this.unescape(parts[2]),
                        completed: parts[1] === '1'
                    });
                    break;
                
                case 'checklist-item':
                    if (!state.items) state.items = [];
                    state.items.push({
                        text: this.unescape(parts[2]),
                        completed: parts[1] === '1'
                    });
                    break;
                
                case 'tier-progress':
                    const progressParts = parts[1].split('/');
                    state.current = parseInt(progressParts[0]) || 0;
                    state.total = parseInt(progressParts[1]) || 0;
                    break;
                
                case 'tier-level':
                    if (!state.tiers) state.tiers = [];
                    state.tiers.push({
                        name: this.unescape(parts[3]),
                        amount: parseInt(parts[2])
                    });
                    break;
                
                case 'radio-option':
                    if (!state.items) state.items = [];
                    state.items.push({
                        text: this.unescape(parts[2])
                    });
                    break;
                
                case 'threshold-item':
                    if (!state.items) state.items = [];
                    state.items.push({
                        text: this.unescape(parts[2]),
                        completed: parts[1] === '1'
                    });
                    break;
                
                case 'text-content':
                    state.text = this.unescape(parts[1]);
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
                    const timestamp = new Date(parts[1]).getTime();
                    const dropdownText = parts[2] ? this.unescape(parts[2]) : '';
                    const displayMode = parts[3] || 'relative';
                    const locked = parts[4] === 'true';
                    state.entries.push({
                        timestamp: timestamp,
                        dropdownText: dropdownText,
                        displayMode: displayMode,
                        locked: locked
                    });
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
        console.log('✓ GT50 format adapter registered (v2.0.0)');
    } else {
        console.error('Cannot register GT50 format: ImpEx not available');
    }
    
    // ===== INJECT RIGHT SECTION (for plugin UI) =====
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'format-gt50.js') {
                    const rightSection = document.createElement('div');
                    rightSection.style.cssText = `
                        width: 60px;
                        height: 100%;
                        background: var(--primary);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-10);
                    `;
                    rightSection.textContent = INJECTOR_ID;
                    card.appendChild(rightSection);
                    break;
                }
            }
        }
    }, 100);
})();
