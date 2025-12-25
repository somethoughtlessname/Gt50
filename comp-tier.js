(function() {
    // ===== TIER COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Tier = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                current: 0, 
                total: 0, 
                tiers: [], 
                title: '', 
                dropdownText: '',
                autofillEnabled: false,
                autofillCollect: '',
                autofillObjects: '',
                autofillObjectsSingular: ''
            };
        },
        
        // ===== AUTO-FILL GENERATOR =====
        generateAutoFillText: function(collectText, objectsText, objectsSingular, amount) {
            const collect = (collectText || '').trim();
            const objects = (objectsText || '').trim();
            const singular = (objectsSingular || '').trim();
            
            if (!collect && !objects && !singular) return '';
            
            const parts = [];
            if (collect) {
                parts.push(collect);
            }
            parts.push(amount);
            
            // Use singular if amount is 1 and singular is provided, otherwise use plural
            if (amount === '1' && singular) {
                parts.push(singular);
            } else if (objects) {
                parts.push(objects);
            }
            
            return parts.join(' ');
        },
        
        // ===== DETECT AUTO-FILL PATTERN =====
        detectAutoFillPattern: function(state) {
            // Need at least 2 tiers to detect a pattern
            if (state.tiers.length < 2) return false;
            
            const patterns = [];
            let singularForm = null;
            
            // Parse each tier name
            for (const tier of state.tiers) {
                if (!tier.name || !tier.name.trim()) return false; // If any tier is empty, no pattern
                
                // Find the number in the tier name
                const match = tier.name.match(/^(.*?)\s*(\d+)\s*(.*)$/);
                if (!match) return false; // No number found, no pattern
                
                const beforeText = match[1].trim();
                const nameNum = parseInt(match[2]);
                const afterText = match[3].trim();
                
                // Determine which number to use
                let effectiveNum = nameNum;
                
                if (!tier.amount || tier.amount === '') {
                    // No amount set - populate it from the name
                    tier.amount = nameNum.toString();
                    effectiveNum = nameNum;
                } else {
                    // Amount is set - use that instead of name's number
                    effectiveNum = parseInt(tier.amount);
                }
                
                // If this tier has amount of 1, save the singular form
                if (effectiveNum === 1) {
                    singularForm = afterText;
                }
                
                patterns.push({ beforeText, afterText, effectiveNum });
            }
            
            // Find the most common afterText (plural form)
            const afterTexts = patterns.map(p => p.afterText);
            const pluralForm = afterTexts.find(text => 
                afterTexts.filter(t => t === text).length > 1
            ) || afterTexts[0];
            
            // Check if all beforeText patterns match
            const firstPattern = patterns[0];
            const allBeforeMatch = patterns.every(p => p.beforeText === firstPattern.beforeText);
            
            if (allBeforeMatch && (firstPattern.beforeText || pluralForm)) {
                // Pattern detected! Populate the autofill fields
                state.autofillCollect = firstPattern.beforeText;
                state.autofillObjects = pluralForm;
                if (singularForm && singularForm !== pluralForm) {
                    state.autofillObjectsSingular = singularForm;
                }
                return true;
            }
            
            return false;
        },
        
        // ===== UPDATE AUTO-FILL FOR ALL TIERS =====
        updateAutoFillTiers: function(state, container) {
            if (!state.autofillEnabled) return;
            
            state.tiers.forEach((tier, idx) => {
                const amount = tier.amount || '0';
                const newText = this.generateAutoFillText(
                    state.autofillCollect,
                    state.autofillObjects,
                    state.autofillObjectsSingular,
                    amount
                );
                tier.name = newText;
                
                // Update the DOM directly without re-rendering
                const input = container.querySelector(`input[data-field="name"][data-idx="${idx}"]`);
                if (input) {
                    input.value = newText;
                }
            });
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.tiers.length;

// Define card color once
const cardColor = 'var(--color-4)';
const itemDropdownColor = cardColor;
            
            // ===== TIERS HTML =====
            let tiersHTML = state.tiers.map((tier, idx) => `
                <div style="
                    background: ${cardColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: 32px;
                    display: flex;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 102px;
                        height: 32px;
                        display: flex;
                    ">
                        <input type="text" 
                            data-field="name"
                            data-idx="${idx}"
                            value="${tier.name || ''}" 
                            placeholder="Tier Name"
                            ${state.autofillEnabled ? 'disabled' : ''}
                            style="
                                width: 66.67%;
                                background: ${cardColor};
                                filter: brightness(0.8);
                                border: none;
                                border-right: var(--border-width) solid var(--border-color);
                                color: var(--color-10);
                                padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                                font-size: 12px;
                                font-weight: 600;
                                outline: none;
                                font-family: inherit;
                                ${state.autofillEnabled ? 'opacity: 0.7; cursor: not-allowed;' : ''}
                            ">
                        <input type="number" 
                            data-field="amount"
                            data-idx="${idx}"
                            value="${tier.amount || ''}" 
                            placeholder="0"
                            style="
                                width: 33.33%;
                                background: ${cardColor};
                                filter: brightness(0.8);
                                border: none;
                                color: var(--color-10);
                                padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                                font-size: var(--dropdown-text-size);
                                font-weight: var(--dropdown-text-weight);
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    <div style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        display: flex;
                        height: 32px;
                        border-left: var(--border-width) solid var(--border-color);
                    ">
                        <button data-action="move-up" data-idx="${idx}" style="
                            width: 34px;
                            height: 100%;
                            background: transparent;
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--color-10);
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${cardColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>▲
                        </button>
                        <button data-action="move-down" data-idx="${idx}" style="
                            width: 34px;
                            height: 100%;
                            background: transparent;
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--color-10);
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${cardColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>▼
                        </button>
                        <button data-action="delete" data-idx="${idx}" style="
                            width: 34px;
                            height: 100%;
                            background: transparent;
                            border: none;
                            color: var(--color-10);
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${cardColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>×
                        </button>
                    </div>
                </div>
            `).join('');
            
            // ===== MAIN CARD HTML =====
            container.innerHTML = `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.open ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${state.open ? '0' : 'var(--margin)'};
                ">
                    <div data-action="toggle" style="
    width: var(--square-section);
    min-width: var(--square-section);
    max-width: var(--square-section);
    flex-shrink: 0;
    height: 100%;
    background: var(--color-10);
    border-right: var(--border-width) solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${state.open ? '20px' : '16px'};
    font-weight: 700;
    color: ${state.open ? 'var(--color-9)' : (count > 0 ? cardColor : 'var(--color-9)')};
    cursor: pointer;
">${state.open ? '−' : (count > 0 ? count : '+')}</div>
                    <div style="
                        flex: 1;
                        background: ${cardColor};
                        height: 100%;
                        display: flex;
                    ">
                        <input type="text" 
                            data-field="title"
                            value="${state.title || ''}"
                            placeholder="Tier" 
                            style="
                                flex: 1;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                padding: 0 0 0 var(--text-padding-left);
                                font-size: 16px;
                                font-weight: 600;
                                height: var(--card-height);
                                outline: none;
                                font-family: inherit;
                            ">
                        <div style="
                            display: flex;
                            height: var(--card-height);
                            border-left: var(--border-width) solid var(--border-color);
                        ">
                            <button data-action="move-up-card" style="
                                width: var(--square-section);
                                height: 100%;
                                background: transparent;
                                border: none;
                                border-right: var(--border-width) solid var(--border-color);
                                color: var(--color-10);
                                cursor: pointer;
                                font-family: inherit;
                                position: relative;
                                font-size: var(--up-sub-size);
                                font-weight: var(--up-sub-weight);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: ${cardColor};
                                    filter: brightness(0.75);
                                    z-index: -1;
                                "></div>▲
                            </button>
                            <button data-action="move-down-card" style="
                                width: var(--square-section);
                                height: 100%;
                                background: transparent;
                                border: none;
                                border-right: var(--border-width) solid var(--border-color);
                                color: var(--color-10);
                                cursor: pointer;
                                font-family: inherit;
                                position: relative;
                                font-size: var(--down-sub-size);
                                font-weight: var(--down-sub-weight);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: ${cardColor};
                                    filter: brightness(0.75);
                                    z-index: -1;
                                "></div>▼
                            </button>
                            <button data-action="delete-card" style="
                                width: var(--square-section);
                                height: 100%;
                                background: ${isDeletePending ? 'var(--color-10)' : 'transparent'};
                                border: none;
                                color: ${isDeletePending ? 'var(--color-1)' : 'var(--color-10)'};
                                cursor: pointer;
                                font-family: inherit;
                                position: relative;
                                font-size: var(--delete-sub-size);
                                font-weight: var(--delete-sub-weight);
                            ">
                                ${isDeletePending ? '' : `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${cardColor}; filter: brightness(0.75); z-index: -1;"></div>`}×
                            </button>
                        </div>
                    </div>
                </div>
                ${state.open ? `<div style="
                    background: var(--bg-2);
                    border-radius: 0 0 8px 8px;
                    display: block;
                    padding: var(--margin);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    margin-bottom: var(--margin);
                ">
                    <div style="
                        background: ${cardColor};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                    ">
                        <input type="text" 
                            data-field="dropdownText"
                            value="${state.dropdownText || ''}"
                            placeholder="Dropdown Text"
                            style="
                                flex: 1;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                                font-size: 12px;
                                font-weight: 600;
                                height: 32px;
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    
                    <!-- AUTO-FILL SECTION -->
                    <div style="
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <div data-action="toggle-autofill" style="
                            width: 32px;
                            min-width: 32px;
                            height: 32px;
                            background: ${state.autofillEnabled ? 'var(--accent)' : 'var(--color-10)'};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: var(--check-size);
                            font-weight: var(--check-weight);
                            color: ${state.autofillEnabled ? 'var(--color-10)' : 'var(--accent)'};
                            cursor: pointer;
                            line-height: 1;
                        ">${state.autofillEnabled ? '✓' : ''}</div>
                        <div style="
                            flex: 1;
                            display: flex;
                            height: 32px;
                            background: ${cardColor};
                            ${state.autofillEnabled ? '' : 'opacity: 0.4; pointer-events: none;'}
                        ">
                            <input type="text" 
                                data-field="autofillCollect"
                                value="${state.autofillCollect || ''}"
                                placeholder="COLLECT"
                                style="
                                    width: 25%;
                                    flex-shrink: 0;
                                    background: transparent;
                                    border: none;
                                    border-right: var(--border-width) solid var(--border-color);
                                    color: var(--font-color-3);
                                    padding: 0 2px;
                                    font-size: 9px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                ">
                            <input type="text" 
                                value="[number]"
                                readonly
                                style="
                                    width: 25%;
                                    flex-shrink: 0;
                                    background: rgba(0, 0, 0, 0.15);
                                    border: none;
                                    border-right: var(--border-width) solid var(--border-color);
                                    color: rgba(255, 255, 255, 0.7);
                                    padding: 0 2px;
                                    font-size: 9px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                    cursor: not-allowed;
                                ">
                            <input type="text" 
                                data-field="autofillObjects"
                                value="${state.autofillObjects || ''}"
                                placeholder="OBJECTS"
                                style="
                                    width: 25%;
                                    flex-shrink: 0;
                                    background: transparent;
                                    border: none;
                                    border-right: var(--border-width) solid var(--border-color);
                                    color: var(--font-color-3);
                                    padding: 0 2px;
                                    font-size: 9px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                ">
                            <input type="text" 
                                data-field="autofillObjectsSingular"
                                value="${state.autofillObjectsSingular || ''}"
                                placeholder="SINGULAR"
                                style="
                                    width: 25%;
                                    flex-shrink: 0;
                                    background: transparent;
                                    border: none;
                                    color: var(--font-color-3);
                                    padding: 0 2px;
                                    font-size: 9px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                ">
                        </div>
                    </div>
                    
                    ${tiersHTML}
                    <button data-action="add" style="
                        background: var(--color-10);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        width: 100%;
                        font-weight: 600;
                        color: var(--color-9);
                        font-size: 12px;
                        cursor: pointer;
                        font-family: inherit;
                    ">+ Add Tier</button>
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) toggle.onclick = () => { state.open = !state.open; onChange(); };
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) titleInput.oninput = (e) => { state.title = e.target.value; };
            
            const addBtn = container.querySelector('[data-action="add"]');
            if (addBtn) addBtn.onclick = () => { 
                const newTier = { name: '', amount: '' };
                state.tiers.push(newTier);
                
                // Auto-fill the new tier if enabled
                if (state.autofillEnabled) {
                    this.updateAutoFillTiers(state, container);
                }
                
                onChange(); 
            };
            
            const dropdownTextInput = container.querySelector('[data-field="dropdownText"]');
            if (dropdownTextInput) {
                dropdownTextInput.oninput = (e) => {
                    state.dropdownText = e.target.value;
                };
            }
            
            // Auto-fill toggle
            const autofillToggle = container.querySelector('[data-action="toggle-autofill"]');
            if (autofillToggle) {
                autofillToggle.onclick = () => {
                    const wasEnabled = state.autofillEnabled;
                    state.autofillEnabled = !state.autofillEnabled;
                    
                    if (state.autofillEnabled && !wasEnabled) {
                        // Turning ON - detect pattern first
                        this.detectAutoFillPattern(state);
                        
                        // Then apply autofill if we have content
                        if (state.autofillCollect || state.autofillObjects) {
                            this.updateAutoFillTiers(state, container);
                        }
                    }
                    
                    onChange();
                };
            }
            
            // Auto-fill collect input - Update DOM directly without closing keyboard
            const collectInput = container.querySelector('[data-field="autofillCollect"]');
            if (collectInput) {
                collectInput.oninput = (e) => {
                    state.autofillCollect = e.target.value;
                    this.updateAutoFillTiers(state, container);
                };
            }
            
            // Auto-fill objects input - Update DOM directly without closing keyboard
            const objectsInput = container.querySelector('[data-field="autofillObjects"]');
            if (objectsInput) {
                objectsInput.oninput = (e) => {
                    state.autofillObjects = e.target.value;
                    this.updateAutoFillTiers(state, container);
                };
            }
            
            // Auto-fill objects singular input - Update DOM directly without closing keyboard
            const objectsSingularInput = container.querySelector('[data-field="autofillObjectsSingular"]');
            if (objectsSingularInput) {
                objectsSingularInput.oninput = (e) => {
                    state.autofillObjectsSingular = e.target.value;
                    this.updateAutoFillTiers(state, container);
                };
            }
            
            // Tier name inputs (only editable when autofill is disabled)
            container.querySelectorAll('input[data-field="name"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    state.tiers[idx].name = e.target.value;
                };
            });
            
            // Tier amount inputs
            container.querySelectorAll('input[data-field="amount"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    state.tiers[idx].amount = e.target.value;
                    
                    // Recalculate total
                    state.total = state.tiers.reduce((sum, t) => sum + (parseInt(t.amount) || 0), 0);
                    
                    // Update auto-fill for this tier if enabled (update DOM directly)
                    if (state.autofillEnabled) {
                        this.updateAutoFillTiers(state, container);
                    }
                };
            });
            
            // Move tier up/down
            container.querySelectorAll('[data-action="move-up"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (idx > 0) {
                        [state.tiers[idx], state.tiers[idx - 1]] = [state.tiers[idx - 1], state.tiers[idx]];
                        onChange();
                    }
                };
            });
            
            container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (idx < state.tiers.length - 1) {
                        [state.tiers[idx], state.tiers[idx + 1]] = [state.tiers[idx + 1], state.tiers[idx]];
                        onChange();
                    }
                };
            });
            
            // Delete tier
            container.querySelectorAll('[data-action="delete"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    state.tiers.splice(idx, 1);
                    state.total = state.tiers.reduce((sum, t) => sum + (parseInt(t.amount) || 0), 0);
                    onChange();
                };
            });
            
            // Card-level controls
            const moveUpBtn = container.querySelector('[data-action="move-up-card"]');
            if (moveUpBtn && onMove) {
                moveUpBtn.onclick = () => onMove(-1);
            }
            
            const moveDownBtn = container.querySelector('[data-action="move-down-card"]');
            if (moveDownBtn && onMove) {
                moveDownBtn.onclick = () => onMove(1);
            }
            
            const deleteBtn = container.querySelector('[data-action="delete-card"]');
            if (deleteBtn && onDelete) {
                deleteBtn.onclick = onDelete;
            }
        },
        
        // ===== VIEW MODE RENDERER =====
        renderView: function(container, state, onChange, tabColor) {
            const tierCount = state.tiers.length;
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            const showDropdown = hasDropdownText;
            
            // ===== TIER CALCULATION =====
            // Calculate which tier we're currently in
            let currentTierIndex = 0;
            let cumulativeAmount = 0;
            
            for (let i = 0; i < state.tiers.length; i++) {
                const tierAmount = parseInt(state.tiers[i].amount) || 0;
                if (state.current >= cumulativeAmount + tierAmount) {
                    cumulativeAmount += tierAmount;
                    currentTierIndex = i + 1; // We've completed this tier
                } else {
                    break; // We're in this tier
                }
            }
            
            // Calculate progress within current tier
            const currentTier = state.tiers[currentTierIndex] || state.tiers[state.tiers.length - 1];
            const tierAmount = parseInt(currentTier?.amount) || 0;
            const progressInCurrentTier = state.current - cumulativeAmount;
            const percent = tierAmount > 0 ? (progressInCurrentTier / tierAmount) * 100 : 0;
            
            // Check if fully completed
            const isCompleted = state.current >= state.total && state.total > 0;
            
            // Display values
            const displayCurrent = isCompleted ? state.total : Math.floor(progressInCurrentTier);
            const displayTotal = isCompleted ? state.total : Math.floor(tierAmount);
            
            // ===== TIER CIRCLES =====
            let circles = '';
            for (let i = 0; i < tierCount; i++) {
                circles += `<span style="color: ${i < currentTierIndex ? 'var(--color-10)' : 'var(--color-9)'}">●</span>`;
            }
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.open && showDropdown ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    overflow: hidden;
                    margin-bottom: ${state.open && showDropdown ? '0' : 'var(--margin)'};
                    position: relative;
                ">
                    <div data-action="decrement" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--color-10);
                        cursor: pointer;
                    ">−</div>
                    <div ${showDropdown ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        position: relative;
                        overflow: hidden;
                        ${showDropdown ? 'cursor: pointer;' : 'cursor: default'};
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: ${isCompleted ? 100 : Math.min(100, percent)}%;
                            background: ${isCompleted ? '#d4af37' : (tabColor || 'var(--accent)')};
                            transition: width 0.3s ease;
                        "></div>
                        <div style="
                            position: relative;
                            z-index: 2;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 2px;
                        ">
                            <div style="
                                font-size: 8px;
                                line-height: 0.6;
                                letter-spacing: 1px;
                            ">${circles}</div>
                            <div style="
                                font-size: 9px;
                                font-weight: 600;
                                color: var(--color-10);
                                line-height: 0.8;
                            ">${isCompleted ? (state.title || 'Tier') : (currentTier?.name || state.title || 'Tier')}</div>
                            <div style="
                                font-size: 8px;
                                font-weight: 700;
                                color: #d1d5db;
                                line-height: 1;
                            ">${displayCurrent}/${displayTotal}</div>
                        </div>
                    </div>
                    <div data-action="increment" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--color-10);
                        cursor: pointer;
                    ">+</div>
                </div>
                ${state.open && showDropdown ? `<div style="
                    background: var(--bg-2);
                    border-radius: 0 0 8px 8px;
                    display: block;
                    padding: var(--margin);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    margin-bottom: var(--margin);
                ">
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    ">
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 var(--text-padding-small);
                            font-size: 10px;
                            font-weight: 600;
                            color: var(--color-10);
                            overflow: hidden;
                        ">
                            <div style="
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                line-height: 1.2;
                                word-break: break-word;
                                text-align: center;
                            ">${state.dropdownText}</div>
                        </div>
                    </div>
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const dec = container.querySelector('[data-action="decrement"]');
            if (dec) dec.onclick = () => {
                state.current = Math.max(0, state.current - 1);
                onChange();
            };
            
            const inc = container.querySelector('[data-action="increment"]');
            if (inc) inc.onclick = () => {
                state.current = Math.min(state.total, state.current + 1);
                onChange();
            };
            
            if (showDropdown) {
                const toggleDropdown = container.querySelector('[data-action="toggle-dropdown"]');
                if (toggleDropdown) {
                    toggleDropdown.onclick = () => {
                        state.open = !state.open;
                        onChange();
                    };
                }
            }
        }
    };
})();