(function() {
    // ===== RADIO COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Radio = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                title: '', 
                items: [
                    { text: '' },
                    { text: '' }
                ],
                selectedIndex: null,
                dropdownText: ''
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.items.length;

// Define card color once - all dropdowns reference this
const cardColor = 'var(--color-1-3)';
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
        position: relative;
    ">
        <input type="text" 
            data-idx="${idx}"
            value="${item.text || ''}" 
            placeholder="Option ${idx + 1}"
            style="
                flex: 1;
                background: ${itemDropdownColor};
                border: none;
                color: var(--color-10);
                padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                padding-right: 102px;
                font-size: 12px;
                font-weight: 600;
                height: 32px;
                outline: none;
                font-family: inherit;
            ">
        <div style="
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            height: 32px;
            border-left: var(--border-width) solid var(--border-color);
        ">
            <button data-action="move-up" data-idx="${idx}" style="
                width: 32px;
                height: 32px;
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
                    background: ${itemDropdownColor};
                    filter: brightness(0.75);
                    z-index: -1;
                "></div>▲
            </button>
            <button data-action="move-down" data-idx="${idx}" style="
                width: 32px;
                height: 32px;
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
                    background: ${itemDropdownColor};
                    filter: brightness(0.75);
                    z-index: -1;
                "></div>▼
            </button>
            <button data-action="delete" data-idx="${idx}" ${state.items.length <= 2 ? 'disabled' : ''} style="
                width: 32px;
                height: 32px;
                background: transparent;
                border: none;
                color: var(--color-10);
                cursor: ${state.items.length <= 2 ? 'not-allowed' : 'pointer'};
                font-weight: 700;
                font-size: 16px;
                font-family: inherit;
                opacity: ${state.items.length <= 2 ? '0.5' : '1'};
                position: relative;
            ">
                ${state.items.length > 2 ? `<div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${itemDropdownColor};
                    filter: brightness(0.75);
                    z-index: -1;
                "></div>` : ''}×
            </button>
        </div>
    </div>
`).join('');
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: var(--color-1-3);
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
                        color: ${count > 0 ? 'var(--color-1-3)' : 'var(--color-9)'};
                        cursor: pointer;
                    ">${state.open ? '−' : (count > 0 ? count : '+')}</div>
                    <input type="text" 
                        data-field="title"
                        value="${state.title || ''}"
                        placeholder="Radio" 
                        style="
                            flex: 1;
                            background: var(--color-1-3);
                            border: none;
                            color: var(--font-color-3);
                            padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
                            padding-right: 145px;
                            font-size: 16px;
                            font-weight: 600;
                            height: var(--card-height);
                            outline: none;
                            font-family: inherit;
                        ">
                    <div style="
                        position: absolute;
                        top: 0;
                        right: 0;
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
                                background: var(--color-1-3);
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
                                background: var(--color-1-3);
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
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--color-1-3); filter: brightness(0.75); z-index: -1;"></div>'}×
                        </button>
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
                        background: var(--color-1-3);
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
                    ${itemsHTML}
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
                    ">+ Add Option</button>
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) toggle.onclick = () => { state.open = !state.open; onChange(); };
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) titleInput.oninput = (e) => { state.title = e.target.value; };
            
            const addBtn = container.querySelector('[data-action="add"]');
            if (addBtn) addBtn.onclick = () => { state.items.push({ text: '' }); onChange(); };
            
            const dropdownTextInput = container.querySelector('[data-field="dropdownText"]');
            if (dropdownTextInput) {
                dropdownTextInput.oninput = (e) => {
                    state.dropdownText = e.target.value;
                };
            }
            
            container.querySelectorAll('input[data-idx]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    state.items[idx].text = e.target.value;
                };
            });
            
            container.querySelectorAll('[data-action="move-up"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (idx > 0) {
                        [state.items[idx], state.items[idx - 1]] = [state.items[idx - 1], state.items[idx]];
                        if (state.selectedIndex === idx) {
                            state.selectedIndex = idx - 1;
                        } else if (state.selectedIndex === idx - 1) {
                            state.selectedIndex = idx;
                        }
                        onChange();
                    }
                };
            });
            
            container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (idx < state.items.length - 1) {
                        [state.items[idx], state.items[idx + 1]] = [state.items[idx + 1], state.items[idx]];
                        if (state.selectedIndex === idx) {
                            state.selectedIndex = idx + 1;
                        } else if (state.selectedIndex === idx + 1) {
                            state.selectedIndex = idx;
                        }
                        onChange();
                    }
                };
            });
            
            container.querySelectorAll('[data-action="delete"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (state.items.length > 2) {
                        state.items.splice(idx, 1);
                        if (state.selectedIndex === idx) {
                            state.selectedIndex = null;
                        } else if (state.selectedIndex > idx) {
                            state.selectedIndex--;
                        }
                        onChange();
                    }
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
            const showDropdown = hasItems || hasDropdownText;
            const hasSelection = state.selectedIndex !== null;
            
            // ===== CHECKBOX CALCULATION =====
            const checkboxBg = hasSelection ? (tabColor || 'var(--accent)') : 'var(--color-10)';
            const checkboxSymbol = hasSelection ? '✓' : '';
            const checkboxColor = 'var(--color-10)';
            
            // ===== ITEMS HTML =====
            let itemsHTML = state.items.map((item, idx) => {
                const isSelected = state.selectedIndex === idx;
                const isUnselected = hasSelection && !isSelected;
                return `
                    <div data-action="select-item" data-idx="${idx}" style="
                        background: ${isUnselected ? 'var(--bg-5)' : 'var(--bg-3)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                        cursor: pointer;
                        opacity: ${isUnselected ? '0.6' : '1'};
                    ">
                        <div style="
                            width: 32px;
                            height: 100%;
                            background: ${isSelected ? (tabColor || 'var(--accent)') : (isUnselected ? '#4a4a4a' : 'var(--color-10)')};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: ${isUnselected ? '16px' : '20px'};
                            font-weight: 900;
                            color: ${isUnselected ? '#7a7a7a' : 'var(--color-10)'};
                        ">${isSelected ? '●' : (isUnselected ? '×' : '○')}</div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                            font-size: var(--dropdown-text-size);
                            font-weight: var(--dropdown-text-weight);
                            color: ${isUnselected ? '#9a9a9a' : 'var(--color-10)'};
                        ">${item.text || 'Option ' + (idx + 1)}</div>
                    </div>
                `;
            }).join('');
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.open && showDropdown ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${state.open && showDropdown ? '0' : 'var(--margin)'};
                ">
                    <div data-action="clear-selection" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${checkboxBg};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: var(--check-size);
                        font-weight: var(--check-weight);
                        color: ${checkboxColor};
                        cursor: pointer;
                        padding-top: var(--check-position);
                    ">${checkboxSymbol}</div>
                    <div ${showDropdown ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        cursor: ${showDropdown ? 'pointer' : 'default'};
                        padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                    ">
                        <div style="
                            font-size: 14px;
font-weight: 600;
color: var(--color-10);
                        ">${state.title || 'Radio'}</div>
                        ${hasSelection ? `
                            <div style="
                                font-size: 9px;
                                font-weight: 500;
                                color: var(--color-10);
                                opacity: 0.8;
                                margin-top: 2px;
                            ">${state.items[state.selectedIndex].text || 'Option ' + (state.selectedIndex + 1)}</div>
                        ` : ''}
                    </div>
                    ${showDropdown ? `<div data-action="toggle-dropdown" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 8px solid var(--color-10);
                            transform: rotate(${state.open ? '180deg' : '0deg'});
                        "></div>
                    </div>` : ''}
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
                    ${hasDropdownText ? `<div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        margin-bottom: var(--margin);
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
                    </div>` : ''}
                    ${itemsHTML}
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const clearSelection = container.querySelector('[data-action="clear-selection"]');
if (clearSelection) {
    clearSelection.onclick = () => {
        if (hasSelection) {
            // If there's a selection, clear it
            state.selectedIndex = null;
        } else {
            // If no selection, toggle dropdown
            state.open = !state.open;
        }
        onChange();
    };
}
            
            if (showDropdown) {
                container.querySelectorAll('[data-action="toggle-dropdown"]').forEach(el => {
                    el.onclick = () => {
                        state.open = !state.open;
                        onChange();
                    };
                });
                
                container.querySelectorAll('[data-action="select-item"]').forEach(item => {
                    const idx = parseInt(item.dataset.idx);
                    item.onclick = () => {
                        state.selectedIndex = idx;
                        onChange();
                    };
                });
            }
        }
    };
})();

