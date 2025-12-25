(function() {
    // ===== THRESHOLD COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Threshold = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                title: '', 
                number1: null,
                threshold: null,
                items: [],
                dropdownText: '',
                manuallyChecked: false
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.items.length;

// Define card color once
const cardColor = 'var(--color-1-4)';
const itemDropdownColor = cardColor;

            
            // Clear any pending timeouts from previous render
            if (state._thresholdInputTimeout) {
                clearTimeout(state._thresholdInputTimeout);
                state._thresholdInputTimeout = null;
            }
            if (state._thresholdUpdateTimeout) {
                clearTimeout(state._thresholdUpdateTimeout);
                state._thresholdUpdateTimeout = null;
            }
            
            // ===== ITEMS HTML =====
            let itemsHTML = state.items.map((item, idx) => `
                <div style="
                    background: var(--color-1-4);
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
                        placeholder="Item"
                        style="
                            flex: 1;
                            background: var(--color-1-4);
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
                        <button data-action="move-up" data-idx="${idx}" style="width: 32px; height: 32px; background: var(--color-1-4); border: none; border-right: var(--border-width) solid var(--border-color); color: var(--color-10); cursor: pointer; font-family: inherit;">▲</button>
                        <button data-action="move-down" data-idx="${idx}" style="width: 32px; height: 32px; background: var(--color-1-4); border: none; border-right: var(--border-width) solid var(--border-color); color: var(--color-10); cursor: pointer; font-family: inherit;">▼</button>
                        <button data-action="delete" data-idx="${idx}" style="width: 32px; height: 32px; background: var(--color-1-4); border: none; color: var(--color-10); cursor: pointer; font-weight: 700; font-size: 16px; font-family: inherit;">×</button>
                    </div>
                </div>
            `).join('');
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: var(--color-1-4);
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
">${state.open ? '−' : (count > 0 ? count : '+')}</div>
                    
                    <input type="text" 
                        data-field="title"
                        value="${state.title || ''}"
                        placeholder="Threshold" 
                        style="
                            flex: 1;
                            min-width: 0;
                            background: var(--color-1-4);
                            border: none;
                            color: var(--font-color-3);
                            padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
                            padding-right: 193px;
                            font-size: 16px;
                            font-weight: 600;
                            height: var(--card-height);
                            outline: none;
                            font-family: inherit;
                        ">
                    
                    <div style="
    position: absolute;
    top: 0;
    right: 84px;
    width: 86px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--color-1-4);
    border-right: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
">
                        <div style="
                            width: 100%;
                            height: 50%;
                            background: transparent;
                            border-bottom: var(--border-width) solid var(--border-color);
                            color: var(--font-color-3);
                            font-size: 8px;
                            font-weight: 600;
                            font-family: inherit;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">XX of YY</div>
                        <div style="
                            height: 50%;
                            display: flex;
                            width: 100%;
                        ">
                            <input type="tel" 
                                data-field="number1"
                                value="${state.number1 || ''}"
                                placeholder="0"
                                pattern="[0-9]*"
                                inputmode="numeric"
                                style="
                                    flex: 1;
                                    min-width: 0;
                                    background: transparent;
                                    border: none;
                                    border-right: var(--border-width) solid var(--border-color);
                                    color: var(--font-color-3);
                                    padding: 0;
                                    font-size: 12px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                ">
                            <input type="tel" 
                                data-field="threshold"
                                value="${state.threshold || ''}"
                                placeholder="0"
                                pattern="[0-9]*"
                                inputmode="numeric"
                                style="
                                    flex: 1;
                                    min-width: 0;
                                    background: transparent;
                                    border: none;
                                    color: var(--font-color-3);
                                    padding: 0;
                                    font-size: 12px;
                                    font-weight: 600;
                                    outline: none;
                                    font-family: inherit;
                                    text-align: center;
                                ">
                        </div>
                    </div>
                    
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
                                background: var(--color-1-4);
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
                                background: var(--color-1-4);
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
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--color-1-4); filter: brightness(0.75); z-index: -1;"></div>'}×
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
                        background: var(--color-1-4);
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
                    ">+ Add Item</button>
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) toggle.onclick = () => { state.open = !state.open; onChange(); };
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) titleInput.oninput = (e) => { state.title = e.target.value; };
            
            const number1Input = container.querySelector('[data-field="number1"]');
            if (number1Input) {
                number1Input.oninput = (e) => {
                    let val = e.target.value;
                    if (val.length > 2) {
                        val = val.slice(0, 2);
                        e.target.value = val;
                    }
                    
                    const numVal = parseInt(val);
                    let newNumber1 = numVal && numVal > 0 ? Math.min(99, numVal) : null;
                    
                    if (newNumber1 && state.threshold && newNumber1 > state.threshold) {
                        newNumber1 = state.threshold;
                        e.target.value = newNumber1;
                    }
                    
                    state.number1 = newNumber1;
                };
            }
            
            const thresholdInput = container.querySelector('[data-field="threshold"]');
            if (thresholdInput) {
                thresholdInput.oninput = (e) => {
                    if (state._thresholdUpdateTimeout) {
                        clearTimeout(state._thresholdUpdateTimeout);
                    }
                    
                    let val = e.target.value;
                    if (val.length > 2) {
                        val = val.slice(0, 2);
                        e.target.value = val;
                    }
                    
                    const numVal = parseInt(val);
                    const newThreshold = numVal && numVal > 0 ? Math.min(99, numVal) : null;
                    
                    state.threshold = newThreshold;
                    
                    const performUpdate = () => {
                        if (state.number1 && state.threshold && state.number1 > state.threshold) {
                            state.number1 = state.threshold;
                        }
                        
                        const currentCount = state.items.length;
                        if (state.threshold && currentCount < state.threshold) {
                            const itemsToAdd = state.threshold - currentCount;
                            for (let i = 0; i < itemsToAdd; i++) {
                                state.items.push({ text: '', completed: false });
                            }
                        } else if (state.threshold && currentCount > state.threshold) {
                            state.items = state.items.slice(0, state.threshold);
                        } else if (!state.threshold) {
                            state.items = [];
                        }
                        
                        // Update the toggle button count display without full re-render
                        const toggleBtn = container.querySelector('[data-action="toggle"]');
                        if (toggleBtn) {
                            const count = state.items.length;
                            toggleBtn.textContent = state.open ? '−' : (count > 0 ? count : '+');
                            toggleBtn.style.color = count > 0 ? cardColor : 'var(--color-9)';
                        }
                    };
                    
                    // 2 digits = update immediately, 1 digit = wait 1 second
                    if (val.length === 2) {
                        performUpdate();
                    } else if (val.length === 1) {
                        state._thresholdUpdateTimeout = setTimeout(performUpdate, 1000);
                    }
                };
                
                thresholdInput.onblur = () => {
                    if (state._thresholdUpdateTimeout) {
                        clearTimeout(state._thresholdUpdateTimeout);
                        state._thresholdUpdateTimeout = null;
                    }
                    onChange();
                };
            }
            
            const addBtn = container.querySelector('[data-action="add"]');
            if (addBtn) {
                addBtn.onclick = () => {
                    state.items.push({ text: '', completed: false });
                    state.threshold = state.items.length;
                    onChange();
                };
            }
            
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
                        onChange();
                    }
                };
            });
            
            container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    if (idx < state.items.length - 1) {
                        [state.items[idx], state.items[idx + 1]] = [state.items[idx + 1], state.items[idx]];
                        onChange();
                    }
                };
            });
            
            container.querySelectorAll('[data-action="delete"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    state.items.splice(idx, 1);
                    state.threshold = state.items.length;
                    onChange();
                };
            });
            
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
            
            const completed = state.items.filter(i => i.completed).length;
            const total = state.items.length;
            const requiredComplete = state.number1 || 0;
            
            const thresholdMet = completed >= requiredComplete;
            const allCompleted = completed === total && total > 0;
            
            let checkboxBg, checkboxSymbol, checkboxFontSize, checkboxPadding, checkboxColor;
            
            if (allCompleted) {
                checkboxBg = '#d4af37';
                checkboxSymbol = '✓';
                checkboxFontSize = 'var(--check-size)';
                checkboxPadding = 'var(--check-position)';
                checkboxColor = 'var(--color-10)';
                state.manuallyChecked = false;
            } else if (thresholdMet) {
    checkboxBg = tabColor || 'var(--accent)';
                checkboxSymbol = '✓';
                checkboxFontSize = 'var(--check-size)';
                checkboxPadding = 'var(--check-position)';
                checkboxColor = 'var(--color-10)';
                state.manuallyChecked = false;
            } else if (state.manuallyChecked) {
                checkboxBg = 'var(--color-10)';
                checkboxSymbol = '✓';
                checkboxFontSize = 'var(--check-size)';
                checkboxPadding = 'var(--check-position)';
                checkboxColor = tabColor || 'var(--accent)';
            } else if (completed > 0) {
                checkboxBg = 'var(--color-10)';
                checkboxSymbol = '*';
                checkboxFontSize = 'var(--asterisk-size)';
                checkboxPadding = 'var(--asterisk-position)';
                checkboxColor = tabColor || 'var(--accent)';
            } else {
                checkboxBg = 'var(--color-10)';
                checkboxSymbol = '';
                checkboxFontSize = 'var(--check-size)';
                checkboxPadding = 'var(--check-position)';
                checkboxColor = 'var(--color-10)';
            }
            
            const totalBarSegments = Math.max(requiredComplete, completed);
            let progressBarHTML = '';
            if (totalBarSegments > 0) {
                progressBarHTML = `
                    <div style="
                        height: 8px;
                        display: flex;
                        gap: 2px;
                        margin-bottom: 6px;
                    ">
                        ${Array.from({ length: totalBarSegments }, (_, idx) => {
    let segmentColor;
    if (allCompleted) {
        segmentColor = '#d4af37';  // ← ALL segments gold when everything complete
    } else if (idx < requiredComplete) {
        segmentColor = idx < completed ? (tabColor || 'var(--accent)') : 'var(--color-9)';
    } else {
        segmentColor = idx < completed ? '#d4af37' : 'var(--color-9)';  // ← GOLD for bonus completions beyond threshold
    }
    return `<div style="flex: 1; background: ${segmentColor}; border-radius: 2px;"></div>`;
}).join('')}
                    </div>
                `;
            }
            
            let itemsHTML = state.items.map((item, idx) => `
                <div data-action="toggle-item" data-idx="${idx}" style="
                    background: var(--bg-3);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    overflow: hidden;
                    cursor: pointer;
                ">
                    <div style="
                        width: 32px;
                        height: 100%;
                        background: ${item.completed ? (tabColor || 'var(--accent)') : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${item.completed ? '14px' : 'var(--asterisk-size)'};
                        font-weight: var(--asterisk-weight);
                        color: ${item.completed ? 'var(--color-10)' : (tabColor || 'var(--accent)')};
                        padding-top: ${item.completed ? '0px' : 'var(--asterisk-position)'};
                    ">${item.completed ? '✓' : '*'}</div>
                    <div style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                        font-size: var(--dropdown-text-size);
                        font-weight: var(--dropdown-text-weight);
                        color: var(--color-10);
                    ">${item.text || 'Item'}</div>
                </div>
            `).join('');
            
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
                    <div data-action="toggle-all" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${checkboxBg};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${checkboxFontSize};
                        font-weight: ${checkboxSymbol === '*' ? 'var(--asterisk-weight)' : 'var(--check-weight)'};
                        color: ${checkboxColor};
                        cursor: pointer;
                        padding-top: ${checkboxPadding};
                    ">${checkboxSymbol}</div>
                    <div ${showDropdown ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        cursor: ${showDropdown ? 'pointer' : 'default'};
                        padding: 0 4px;
                    ">
                        <div style="
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: 600;
                            color: var(--color-10);
                        ">${state.title || 'Threshold'}</div>
                        ${progressBarHTML}
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
            
            const toggleAll = container.querySelector('[data-action="toggle-all"]');
            if (toggleAll) {
                toggleAll.onclick = () => {
                    state.manuallyChecked = !state.manuallyChecked;
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
                
                container.querySelectorAll('[data-action="toggle-item"]').forEach(item => {
                    const idx = parseInt(item.dataset.idx);
                    item.onclick = () => {
                        state.items[idx].completed = !state.items[idx].completed;
                        state.manuallyChecked = false;
                        onChange();
                    };
                });
            }
        }
    };
})();