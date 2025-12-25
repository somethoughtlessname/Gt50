(function() {
    // ===== SCALE COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Scale = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                dropdownText: '', 
                items: [], 
                multiplier: 1,
                open: false
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.items.length;
            const cardColor = 'var(--color-6-3)';
            const itemDropdownColor = cardColor;
            
            // ===== ITEMS HTML =====
            let itemsHTML = state.items.map((item, idx) => `
                <div style="
                    background: ${itemDropdownColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                ">
                    <div style="
                        width: 80px;
                        flex-shrink: 0;
                        height: 100%;
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <input type="text" 
                            data-idx="${idx}"
                            data-field="number"
                            value="${item.number || ''}" 
                            placeholder="Qty"
                            style="
                                width: 100%;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                text-align: center;
                                font-size: 12px;
                                font-weight: 700;
                                height: 100%;
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    <div style="
                        width: 80px;
                        flex-shrink: 0;
                        height: 100%;
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <input type="text" 
                            data-idx="${idx}"
                            data-field="unit"
                            value="${item.unit || ''}" 
                            placeholder="unit"
                            style="
                                width: 100%;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                text-align: center;
                                font-size: 11px;
                                font-weight: 600;
                                height: 100%;
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    <div style="
                        flex: 1;
                        min-width: 0;
                        height: 100%;
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        padding: 0 8px;
                    ">
                        <input type="text" 
                            data-idx="${idx}"
                            data-field="title"
                            value="${item.title || ''}" 
                            placeholder="Item"
                            style="
                                width: 100%;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                font-size: 12px;
                                font-weight: 600;
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    <div style="display: flex; height: 100%;">
                        <button data-action="move-up" data-idx="${idx}" style="
                            width: 28px;
                            height: 32px;
                            background: transparent;
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--color-10);
                            cursor: pointer;
                            font-weight: var(--move-item-weight);
                            font-size: var(--move-item-size);
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${itemDropdownColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>▲
                        </button>
                        <button data-action="move-down" data-idx="${idx}" style="
                            width: 28px;
                            height: 32px;
                            background: transparent;
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--color-10);
                            cursor: pointer;
                            font-weight: var(--move-item-weight);
                            font-size: var(--move-item-size);
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${itemDropdownColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>▼
                        </button>
                        <button data-action="delete" data-idx="${idx}" style="
                            width: 32px;
                            height: 32px;
                            background: transparent;
                            border: none;
                            color: var(--color-10);
                            cursor: pointer;
                            font-weight: var(--delete-item-weight);
                            font-size: var(--delete-item-size);
                            font-family: inherit;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${itemDropdownColor};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>×
                        </button>
                    </div>
                </div>
            `).join('');
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: ${cardColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.open ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${state.open ? '0' : 'var(--margin)'};
                    position: relative;
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
                    ">${state.open ? '−' : (count > 0 ? count : '')}</div>
                    <div data-action="toggle" style="
                        flex: 1;
                        background: transparent;
                        color: var(--font-color-3);
                        padding: 0 var(--text-padding-small);
                        padding-left: var(--margin);
                        font-size: 16px;
                        font-weight: 700;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        user-select: none;
                    ">Scale Card</div>
                    <div style="
                        display: flex;
                        height: 100%;
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
                                background: var(--color-10);
                                filter: brightness(0.9);
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
                                background: var(--color-10);
                                filter: brightness(0.9);
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
                            font-weight: var(--delete-sub-weight);
                            font-size: var(--delete-sub-size);
                            font-family: inherit;
                            position: relative;
                        ">
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--color-1); z-index: -1;"></div>'}×
                        </button>
                    </div>
                </div>
                
                ${state.open ? `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    padding: var(--margin);
                    margin-bottom: var(--margin);
                ">
                    <input type="text" 
                        data-action="dropdown-text"
                        value="${state.dropdownText || ''}"
                        placeholder="Recipe or scale description (optional)"
                        style="
                            width: 100%;
                            background: ${cardColor};
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: 32px;
                            color: var(--font-color-3);
                            padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                            font-size: 12px;
                            font-weight: 600;
                            outline: none;
                            font-family: inherit;
                            margin-bottom: var(--margin);
                        ">
                    ${itemsHTML}
                    <button data-action="add-item" style="
                        width: 100%;
                        background: ${cardColor};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        color: var(--font-color-3);
                        font-size: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        font-family: inherit;
                    ">+ Add Item</button>
                </div>
                ` : ''}
            `;
            
            // ===== EVENT HANDLERS =====
            
            // Toggle dropdown
            container.querySelectorAll('[data-action="toggle"]').forEach(el => {
                el.onclick = () => {
                    state.open = !state.open;
                    onChange();
                };
            });
            
            // Dropdown text input
            const dropdownTextInput = container.querySelector('[data-action="dropdown-text"]');
            if (dropdownTextInput) {
                dropdownTextInput.oninput = (e) => {
                    state.dropdownText = e.target.value;
                };
            }
            
            // Item inputs
            container.querySelectorAll('input[data-idx]').forEach(input => {
                input.oninput = (e) => {
                    const idx = parseInt(e.target.dataset.idx);
                    const field = e.target.dataset.field;
                    if (state.items[idx]) {
                        state.items[idx][field] = e.target.value;
                    }
                };
            });
            
            // Add item button
            const addBtn = container.querySelector('[data-action="add-item"]');
            if (addBtn) {
                addBtn.onclick = () => {
                    state.items.push({ number: '', title: '', unit: '' });
                    onChange();
                };
            }
            
            // Move up
            container.querySelectorAll('[data-action="move-up"]').forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.idx);
                    if (idx > 0) {
                        [state.items[idx], state.items[idx - 1]] = [state.items[idx - 1], state.items[idx]];
                        onChange();
                    }
                };
            });
            
            // Move down
            container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.idx);
                    if (idx < state.items.length - 1) {
                        [state.items[idx], state.items[idx + 1]] = [state.items[idx + 1], state.items[idx]];
                        onChange();
                    }
                };
            });
            
            // Delete
            container.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.idx);
                    state.items.splice(idx, 1);
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
            const hasItems = state.items.length > 0;
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            const cardColor = tabColor || 'var(--color-6-3)';
            
            if (!hasItems) {
                container.innerHTML = '';
                return;
            }
            
            // Parse fraction helper
            const parseFraction = (str) => {
                str = str.trim();
                
                const unicodeFractions = {
                    '½': 0.5, '⅓': 0.333, '⅔': 0.667, '¼': 0.25, '¾': 0.75,
                    '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
                    '⅙': 0.167, '⅚': 0.833, '⅐': 0.143, '⅛': 0.125,
                    '⅜': 0.375, '⅝': 0.625, '⅞': 0.875, '⅑': 0.111, '⅒': 0.1
                };
                
                let total = 0;
                let parts = str.split(/\s+/);
                
                for (let part of parts) {
                    if (unicodeFractions[part]) {
                        total += unicodeFractions[part];
                    } else if (part.includes('/')) {
                        let [num, den] = part.split('/').map(Number);
                        total += num / den;
                    } else {
                        let num = parseFloat(part);
                        if (!isNaN(num)) total += num;
                    }
                }
                
                return total;
            };
            
            // Format number helper
            const formatNumber = (num) => {
                let rounded = Math.round(num * 100) / 100;
                let str = rounded.toString();
                // Only remove trailing zeros if there's a decimal point
                if (str.includes('.')) {
                    return str.replace(/\.?0+$/, '');
                }
                return str;
            };
            
            // Smart pluralization helper
            const formatUnit = (value, unit) => {
                if (!unit || unit.trim() === '') return '';
                
                const numValue = parseFloat(value);
                
                // Abbreviations that don't pluralize
                const noPlural = ['oz', 'tbsp', 'tsp', 'ml', 'l', 'g', 'kg', 'lb', 'fl oz'];
                if (noPlural.includes(unit.toLowerCase())) {
                    return unit;
                }
                
                // Exactly 1.0 = singular
                if (Math.abs(numValue - 1.0) < 0.001) {
                    return unit;
                }
                
                // Already plural (ends with 's') - return as-is
                if (unit.toLowerCase().endsWith('s')) {
                    return unit;
                }
                
                // Irregular plurals
                const irregulars = {
                    'knife': 'knives',
                    'loaf': 'loaves',
                    'half': 'halves',
                    'box': 'boxes'
                };
                
                const lowerUnit = unit.toLowerCase();
                if (irregulars[lowerUnit]) {
                    return irregulars[lowerUnit];
                }
                
                // Otherwise add 's'
                return unit + 's';
            };
            
            // ===== ITEMS HTML =====
            let itemsHTML = state.items.map((item, idx) => {
                const baseValue = parseFraction(item.number || '0');
                const multipliedValue = baseValue * (state.multiplier || 1);
                const displayValue = formatNumber(multipliedValue);
                const displayUnit = formatUnit(displayValue, item.unit || '');
                
                return `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                ">
                    <div style="
                        min-width: 160px;
                        flex-shrink: 0;
                        padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                        font-weight: 700;
                        font-size: 16px;
                        color: ${tabColor || 'var(--color-6-3)'};
                        background: var(--color-10);
                        border-right: var(--border-width) solid var(--border-color);
                        height: 100%;
                        display: flex;
                        align-items: center;
                    ">
                        ${displayValue}${displayUnit ? ' ' + displayUnit : ''}
                    </div>
                    <div style="
                        flex: 1;
                        padding: 0 var(--text-padding-small);
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--font-color-3);
                    ">${item.title || ''}</div>
                </div>
                `;
            }).join('');
            
            // ===== MAIN VIEW HTML =====
            container.innerHTML = `
                ${hasDropdownText ? `
                <div style="
                    background: ${cardColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                    margin-bottom: var(--margin);
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--font-color-3);
                ">${state.dropdownText}</div>
                ` : ''}
                ${itemsHTML}
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: stretch;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                ">
                    <div data-multiplier="1" style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-right: var(--border-width) solid var(--border-color);
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 16px;
                        background: ${state.multiplier === 1 ? (tabColor || 'var(--color-6-3)') : 'var(--color-10)'};
                        color: ${state.multiplier === 1 ? 'var(--color-10)' : 'var(--color-9)'};
                    ">x1</div>
                    <div data-multiplier="2" style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-right: var(--border-width) solid var(--border-color);
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 16px;
                        background: ${state.multiplier === 2 ? (tabColor || 'var(--color-6-3)') : 'var(--color-10)'};
                        color: ${state.multiplier === 2 ? 'var(--color-10)' : 'var(--color-9)'};
                    ">x2</div>
                    <div data-multiplier="3" style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-right: var(--border-width) solid var(--border-color);
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 16px;
                        background: ${state.multiplier === 3 ? (tabColor || 'var(--color-6-3)') : 'var(--color-10)'};
                        color: ${state.multiplier === 3 ? 'var(--color-10)' : 'var(--color-9)'};
                    ">x3</div>
                    <div data-multiplier="4" style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 16px;
                        background: ${state.multiplier === 4 ? (tabColor || 'var(--color-6-3)') : 'var(--color-10)'};
                        color: ${state.multiplier === 4 ? 'var(--color-10)' : 'var(--color-9)'};
                    ">x4</div>
                </div>
            `;
            
            // ===== EVENT HANDLERS =====
            container.querySelectorAll('[data-multiplier]').forEach(div => {
                div.onclick = () => {
                    state.multiplier = parseInt(div.dataset.multiplier);
                    onChange();
                };
            });
        }
    };
})();