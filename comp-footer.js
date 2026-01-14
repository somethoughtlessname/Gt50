(function() {
    // Static injector ID
    const INJECTOR_ID = '0013';
    
    // ===== FOOTER COMPONENT - REWRITTEN =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Footer = {
        // ===== CONFIGURABLE DIMENSIONS =====
        config: {
            // Heights - change these to adjust footer layout
            FOOTER_HEIGHT: 67.5,      // Total footer height
            TOP_ROW_HEIGHT: 45,       // Height of dropdown toggle area
            BOTTOM_ROW_HEIGHT: 22.5,  // Height of component buttons
            DROPDOWN_HEIGHT: 22.5     // Height of variants dropdown
        },
        
        // ===== CARD COLOR MAPPING =====
        // Maps card types to their color variables
        // When card colors change in styles.js, these update automatically
        getCardColor: function(type) {
            const colorMap = {
                'list': '--color-1',
                'checklist': '--color-1-2',
                'radio': '--color-1-3',
                'threshold': '--color-1-4',
                'accumulation': '--color-2',
                'history': '--color-2-2',
                'progress': '--color-3',
                'tier': '--color-4',
                'divider': '--color-6',
                'text': '--color-6-2',
                'scale': '--color-6-3',
                'nest': '--color-5',
                'cycle': '--color-5-2',
                'import': '--color-5-3'
            };
            
            const varName = colorMap[type];
            if (!varName) return '#6b7280'; // Fallback gray
            
            // Get actual computed color from CSS variable
            const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            return computed || `var(${varName})`;
        },
        
        // ===== CANONICAL SLOT ORDER =====
        // This defines the REQUIRED order - any loaded state will be corrected to match
        getCanonicalOrder: function() {
            return ['list', 'accumulation', 'progress', 'tier', 'nest', 'divider'];
        },
        
        // ===== DEFAULT STATE =====
        defaultState: function() {
            return {
                activeDropdown: null,
                slots: [
                    {
                        baseType: 'list',
                        type: 'list',
                        currentVariant: 'list',
                        variants: [
                            { type: 'list', label: 'LIST' },
                            { type: 'checklist', label: 'CHECKLIST' },
                            { type: 'radio', label: 'RADIO' },
                            { type: 'threshold', label: 'THRESHOLD' }
                        ]
                    },
                    {
                        baseType: 'accumulation',
                        type: 'accumulation',
                        currentVariant: 'accumulation',
                        variants: [
                            { type: 'accumulation', label: 'ACCUMULATION' },
                            { type: 'history', label: 'HISTORY' }
                        ]
                    },
                    {
                        baseType: 'progress',
                        type: 'progress',
                        currentVariant: 'progress',
                        variants: []
                    },
                    {
                        baseType: 'tier',
                        type: 'tier',
                        currentVariant: 'tier',
                        variants: []
                    },
                    {
                        baseType: 'nest',
                        type: 'nest',
                        currentVariant: 'nest',
                        variants: [
                            { type: 'nest', label: 'NEST' },
                            { type: 'cycle', label: 'CYCLE' },
                            { type: 'import', label: 'IMPORT' }
                        ]
                    },
                    {
                        baseType: 'divider',
                        type: 'divider',
                        currentVariant: 'divider',
                        variants: [
                            { type: 'divider', label: 'DIVIDER' },
                            { type: 'text', label: 'TEXT' },
                            { type: 'scale', label: 'SCALE' }
                        ]
                    }
                ]
            };
        },
        
        // ===== ENFORCE CANONICAL ORDER =====
        // Call this on loaded state to ensure slots are in correct order
        enforceOrder: function(state) {
            if (!state || !state.slots) return state;
            
            const canonical = this.getCanonicalOrder();
            const defaultSlots = this.defaultState().slots;
            
            // Create a map of existing slots by baseType
            const slotMap = {};
            state.slots.forEach(slot => {
                // Add baseType if missing (migration from old format)
                if (!slot.baseType) {
                    slot.baseType = slot.currentVariant || slot.type;
                }
                slotMap[slot.baseType] = slot;
            });
            
            // Rebuild slots array in canonical order
            state.slots = canonical.map(baseType => {
                // If we have this slot saved, use it
                if (slotMap[baseType]) {
                    const slot = slotMap[baseType];
                    
                    // MIGRATION: Ensure divider slot has scale variant
                    if (baseType === 'divider') {
                        const hasScale = slot.variants && slot.variants.some(v => v.type === 'scale');
                        if (!hasScale) {
                            // Add scale variant to divider slot
                            if (!slot.variants) slot.variants = [];
                            slot.variants = [
                                { type: 'divider', label: 'DIVIDER' },
                                { type: 'text', label: 'TEXT' },
                                { type: 'scale', label: 'SCALE' }
                            ];
                        }
                    }
                    
                    return slot;
                }
                // Otherwise use default
                return defaultSlots.find(s => s.baseType === baseType);
            });
            
            return state;
        },
        
        // ===== RENDER FUNCTION =====
        render: function(container, state, visible, onAddComponent) {
            const cfg = this.config;
            
            // ALWAYS enforce canonical order before rendering
            this.enforceOrder(state);
            
            if (!visible) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1000;
            `;
            
            // Build HTML
            const dropdownHTML = this.buildDropdown(state);
            const topRowHTML = this.buildTopRow(state);
            const bottomRowHTML = this.buildBottomRow(state);
            
            container.innerHTML = `
                ${dropdownHTML}
                <div style="
                    height: ${cfg.FOOTER_HEIGHT}px;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                ">
                    <div style="
                        height: ${cfg.TOP_ROW_HEIGHT}px;
                        display: flex;
                        border-bottom: var(--border-width) solid var(--border-color);
                    ">
                        ${topRowHTML}
                    </div>
                    <div style="
                        height: ${cfg.BOTTOM_ROW_HEIGHT}px;
                        display: flex;
                    ">
                        ${bottomRowHTML}
                    </div>
                </div>
            `;
            
            this.attachEventListeners(container, state, visible, onAddComponent);
        },
        
        // ===== BUILD DROPDOWN =====
        buildDropdown: function(state) {
            if (state.activeDropdown === null) return '';
            
            const cfg = this.config;
            const slot = state.slots[state.activeDropdown];
            
            if (!slot.variants || slot.variants.length === 0) {
                const color = this.getCardColor(slot.type);
                const textColor = (slot.type === 'divider' || slot.type === 'text' || slot.type === 'scale') ? 'var(--color-8)' : 'var(--color-10)';
                
                return `
                    <div style="
                        position: fixed;
                        bottom: ${cfg.FOOTER_HEIGHT}px;
                        left: 0;
                        right: 0;
                        height: ${cfg.DROPDOWN_HEIGHT}px;
                        background: ${color};
                        border-top: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 999;
                        color: ${textColor};
                        font-size: 8px;
                        font-weight: 700;
                    ">
                        MORE VARIATIONS COMING SOON
                    </div>
                `;
            }
            
            const variantsHTML = slot.variants.map((variant, idx) => {
                const color = this.getCardColor(variant.type);
                const textColor = 'var(--color-10)';
                const borderRight = idx < slot.variants.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                
                return `
                    <div data-variant="${variant.type}" data-slot="${state.activeDropdown}" 
                         style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 8px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: filter 0.2s;
                            background: ${color};
                            color: ${textColor};
                            ${borderRight}
                        ">
                        ${variant.label}
                    </div>
                `;
            }).join('');
            
            return `
                <div style="
                    position: fixed;
                    bottom: ${cfg.FOOTER_HEIGHT}px;
                    left: 0;
                    right: 0;
                    height: ${cfg.DROPDOWN_HEIGHT}px;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    z-index: 999;
                ">
                    ${variantsHTML}
                </div>
            `;
        },
        
        // ===== BUILD TOP ROW (DROPDOWN TOGGLES) =====
        buildTopRow: function(state) {
            return state.slots.map((slot, index) => {
                const borderRight = index < state.slots.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                
                return `
                    <div data-top-slot="${index}" style="
                        flex: 1;
                        height: 100%;
                        background: var(--bg-4);
                        ${borderRight}
                        cursor: pointer;
                        transition: filter 0.2s;
                    "></div>
                `;
            }).join('');
        },
        
        // ===== BUILD BOTTOM ROW (COMPONENT BUTTONS) =====
        buildBottomRow: function(state) {
            const labels = {
                'list': 'LIST',
                'checklist': 'CHECKLIST',
                'radio': 'RADIO',
                'threshold': 'THRESHOLD',
                'accumulation': 'COUNT',
                'history': 'HISTORY',
                'progress': 'PROGRESS',
                'tier': 'TIER',
                'divider': 'DIVIDER',
                'text': 'TEXT',
                'scale': 'SCALE',
                'nest': 'NEST',
                'cycle': 'CYCLE',
                'import': 'IMPORT'
            };
            
            return state.slots.map((slot, index) => {
                const color = this.getCardColor(slot.currentVariant || slot.type);
                const textColor = (slot.currentVariant === 'divider' || slot.currentVariant === 'text' || slot.currentVariant === 'scale') ? 'var(--color-8)' : 'var(--color-10)';
                const borderRight = index < state.slots.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                const label = labels[slot.currentVariant || slot.type] || '+';
                
                return `
                    <div data-bottom-slot="${index}" style="
                        flex: 1;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: filter 0.2s;
                        background: ${color};
                        color: ${textColor};
                        ${borderRight}
                    ">${label}</div>
                `;
            }).join('');
        },
        
        // ===== ATTACH EVENT LISTENERS =====
        attachEventListeners: function(container, state, visible, onAddComponent) {
            // Top row - toggle dropdown
            container.querySelectorAll('[data-top-slot]').forEach(div => {
                div.onclick = () => {
                    const index = parseInt(div.dataset.topSlot);
                    state.activeDropdown = state.activeDropdown === index ? null : index;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.1)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
            
            // Bottom row - add component (current variant)
            container.querySelectorAll('[data-bottom-slot]').forEach(div => {
                div.onclick = () => {
                    const index = parseInt(div.dataset.bottomSlot);
                    const slot = state.slots[index];
                    onAddComponent(slot.currentVariant);
                    state.activeDropdown = null;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.15)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
            
            // Variant selection in dropdown
            container.querySelectorAll('[data-variant]').forEach(div => {
                div.onclick = () => {
                    const variant = div.dataset.variant;
                    const slotIndex = parseInt(div.dataset.slot);
                    const slot = state.slots[slotIndex];
                    
                    slot.currentVariant = variant;
                    slot.type = variant;
                    
                    state.activeDropdown = null;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.15)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
        }
    };
})();