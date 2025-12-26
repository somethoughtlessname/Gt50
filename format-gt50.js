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
    // NEST:         Uses --- NEST X START/END --- with internal tabs or direct components
    // CYCLE:        Uses --- CYCLE X START/END --- with scheduling info
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
        // Calculate which tier we're in and distribute current progress
        let cumulativeAmount = 0;
        let remainingCurrent = state.current || 0;
        
        state.tiers.forEach((tier, idx) => {
            const level = idx + 1;
            const name = this.escape(tier.name || '');
            const amount = parseInt(tier.amount) || 0;
            
            // Calculate current for this tier
            let tierCurrent = 0;
            if (remainingCurrent > 0) {
                tierCurrent = Math.min(remainingCurrent, amount);
                remainingCurrent -= tierCurrent;
            }
            
            output.push(`tier-level|${level}|${tierCurrent}/${amount}|${name}`);
            cumulativeAmount += amount;
        });
    }
    break;
                    
                case 'radio':
                    if (state.items && state.items.length > 0) {
                        state.items.forEach((item, idx) => {
                            const order = idx + 1;
                            const text = this.escape(item.text || item);
                            output.push(`radio-option|${order}|${text}`);
                        });
                    } else if (state.options && state.options.length > 0) {
                        state.options.forEach((opt, idx) => {
                            const order = idx + 1;
                            const text = this.escape(opt);
                            output.push(`radio-option|${order}|${text}`);
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
                            output.push(`history-entry|${entry}`);
                        });
                    }
                    break;
                }
            }
            
            // Handle nest/cycle
            if (type === 'nest' || type === 'cycle') {
                const componentType = type === 'nest' ? 'NEST' : 'CYCLE';
                const currentNestNumber = nestPath ? `${nestPath}.${nestNumber}` : `${nestNumber}`;
                
                output.push(`--- ${componentType} ${currentNestNumber} START: ${title} ---`);
                
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
                }
                
                // Tabs if present
                if (state.tabs && state.tabs.tabs && state.tabs.tabs.length > 0) {
                    state.tabs.tabs.forEach((tab, tabIdx) => {
                        const tabLabel = tab.label || tab.name || `Tab ${tabIdx + 1}`;
                        const tabNumber = `${currentNestNumber}.${tabIdx + 1}`;
                        const nestedArray = state.tabComponents[tabIdx] || [];
                        
                        output.push(`--- TAB ${tabNumber} START: ${tabLabel} ---`);
                        
                        // Tab color if present
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
                
                // Main window tabs
                if (line.startsWith('--- TAB START:')) {
                    if (!hasMainWindowTabs) {
                        result.data.tabComponents = [];
                        hasMainWindowTabs = true;
                    }
                    const tabLabel = line.match(/--- TAB START: (.+) ---/)[1];
                    result.data.tabs.tabs.push({ label: tabLabel, name: tabLabel });
                    currentTabIndex = result.data.tabs.tabs.length - 1;
                    if (!result.data.tabComponents[currentTabIndex]) {
                        result.data.tabComponents[currentTabIndex] = [];
                    }
                    continue;
                }
                if (line.startsWith('--- TAB END:')) continue;
                
                // Nested structures (NEST/CYCLE)
                if (line.match(/^--- (NEST|CYCLE) .+ START:/)) {
                    const isNest = line.includes('NEST');
                    const match = line.match(/^--- (NEST|CYCLE) ([^ ]+) START: (.+) ---$/);
                    const nestName = match[3];
                    
                    const nestCard = {
                        id: Date.now() + Math.random(),
                        type: isNest ? 'nest' : 'cycle',
                        state: {
                            name: nestName,
                            title: nestName,
                            components: [],
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
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(nestCard);
                        } else {
                            currentContainer.card.state.tabComponents[0].push(nestCard);
                        }
                    } else {
                        result.data.tabComponents[currentTabIndex].push(nestCard);
                    }
                    
                    // Push current container to stack and set new container
                    containerStack.push(currentContainer);
                    currentContainer = { card: nestCard, hasTabStructure: false };
                    currentTabInContainer = 0;
                    continue;
                }
                
                if (line.match(/^--- (NEST|CYCLE) .+ END/)) {
                    // Pop from stack
                    currentContainer = containerStack.pop();
                    if (currentContainer) {
                        currentTabInContainer = currentContainer.hasTabStructure ?
                            currentContainer.card.state.tabComponents.length - 1 : 0;
                    } else {
                        currentTabInContainer = -1;
                    }
                    continue;
                }
                
                // Nest/cycle internal tabs (format: --- TAB 1 START: or --- TAB 1.1 START:)
                if (line.match(/^--- TAB [\d.]+ START:/)) {
                    if (currentContainer) {
                        const match = line.match(/^--- TAB [\d.]+ START: (.+) ---$/);
                        const tabName = match[1];
                        
                        // Initialize tabs structure if needed
                        if (!currentContainer.card.state.tabs) {
                            currentContainer.card.state.tabs = { tabs: [], activeViewTab: 0, selectedBuildTab: 0 };
                        }
                        if (!currentContainer.card.state.tabComponents) {
                            currentContainer.card.state.tabComponents = [];
                        }
                        
                        currentContainer.card.state.tabs.tabs.push({ label: tabName, name: tabName });
                        currentContainer.hasTabStructure = true;
                        currentTabInContainer = currentContainer.card.state.tabs.tabs.length - 1;
                        
                        while (currentContainer.card.state.tabComponents.length <= currentTabInContainer) {
                            currentContainer.card.state.tabComponents.push([]);
                        }
                    }
                    continue;
                }
                
                if (line.match(/^--- TAB [\d.]+ END ---$/)) {
                    if (currentContainer) {
                        currentTabInContainer = currentContainer.hasTabStructure ? 
                            currentContainer.card.state.tabComponents.length - 1 : 0;
                    }
                    continue;
                }
                
                // Tab color
                if (type === 'tab-color' && currentContainer && currentContainer.hasTabStructure) {
                    const colorNum = parts[1];
                    const lastTabIdx = currentContainer.card.state.tabs.tabs.length - 1;
                    if (lastTabIdx >= 0) {
                        currentContainer.card.state.tabs.tabs[lastTabIdx].color = `var(--color-${colorNum})`;
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
                            currentContainer.card.state.tabComponents[currentTabInContainer].push(card);
                        } else {
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
                                            'text-weight', 'text-font', 'history-entry', 'scale-item'];
                        
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
                    const radioIndex = parseInt(parts[1]) - 1;
                    card.state.selectedIndex = radioIndex;
                    card.state.value = radioIndex;
                    card.state.title = this.unescape(parts[2]);
                    card.state.items = [];
                    card.state.options = [];
                    break;
                    
                case 'SCALE':
                    // Scale cards are type: 'scale' (not divider variant)
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
                    state.entries.push(parseInt(parts[1]));
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