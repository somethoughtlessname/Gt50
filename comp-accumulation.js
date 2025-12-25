(function() {
    // ===== ACCUMULATION COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Accumulation = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { value: 0, open: false, numpadOpen: false, title: '', dropdownText: '' };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
    const cardColor = 'var(--color-2)';
    
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
                color: var(--color-9);
                cursor: pointer;
            ">${state.open ? '−' : '+'}</div>
                    <div style="
                        flex: 1;
                        background: var(--color-2);
                        height: 100%;
                    ">
                        <input type="text" 
                            data-field="title"
                            value="${state.title || ''}"
                            placeholder="Accumulation" 
                            style="
                                width: 100%;
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
                    </div>
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
                                background: var(--bg-4);
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
                                background: var(--bg-4);
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
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-4); filter: brightness(0.75); z-index: -1;"></div>'}×
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
                        background: var(--color-2);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
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
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) {
                toggle.onclick = () => {
                    state.open = !state.open;
                    onChange();
                };
            }
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) {
                titleInput.oninput = (e) => {
                    state.title = e.target.value;
                };
            }
            
            const dropdownTextInput = container.querySelector('[data-field="dropdownText"]');
            if (dropdownTextInput) {
                dropdownTextInput.oninput = (e) => {
                    state.dropdownText = e.target.value;
                };
            }
            
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
        renderView: function(container, state, onChange) {
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            const showDropdown = hasDropdownText;
            
            // ===== NUMPAD HTML =====
            let numpadCard = '';
            if (state.numpadOpen) {
                numpadCard = `
                    <div style="
                        background: var(--primary);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        overflow: hidden;
                        margin-bottom: var(--margin);
                    ">
                        ${['◄', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '×'].map(key => `
                            <button data-numpad="${key}" style="flex: 1; background: #7a6cb8; border: none; ${key !== '×' ? 'border-right: var(--border-width) solid var(--border-color);' : ''} color: var(--color-10); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">${key}</button>
                        `).join('')}
                    </div>
                `;
            }
            
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
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: ${showDropdown ? 'pointer' : 'default'};
                    ">
                        <div style="
                            font-size: 8px;
                            font-weight: 600;
                            color: var(--color-10);
                            line-height: 1;
                        ">${state.title || 'Total Count'}</div>
                        <div style="
                            font-size: 18px;
                            font-weight: 700;
                            color: var(--color-10);
                            line-height: 1;
                            margin-top: 2px;
                        ">${state.value}</div>
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
                    </div>
                    <div style="
                        background: var(--primary);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        overflow: hidden;
                        margin-bottom: var(--margin);
                    ">
                        <button data-action="adjust" data-amount="10" style="flex: 1; background: #7a6cb8; border: none; border-right: var(--border-width) solid var(--border-color); color: var(--color-10); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">+10</button>
                        <button data-action="adjust" data-amount="100" style="flex: 1; background: #7a6cb8; border: none; border-right: var(--border-width) solid var(--border-color); color: var(--color-10); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">+100</button>
                        <button data-action="adjust" data-amount="-100" style="flex: 1; background: #7a6cb8; border: none; border-right: var(--border-width) solid var(--border-color); color: var(--color-10); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">-100</button>
                        <button data-action="adjust" data-amount="-10" style="flex: 1; background: #7a6cb8; border: none; color: var(--color-10); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">-10</button>
                    </div>
                    ${numpadCard}
                    <button data-action="toggle-numpad" style="background: var(--color-10); border: var(--border-width) solid var(--border-color); border-radius: 8px; height: 32px; width: 100%; font-weight: 600; color: var(--color-9); font-size: 12px; cursor: pointer; font-family: inherit;">${state.numpadOpen ? '×' : 'Input Exact Number'}</button>
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const dec = container.querySelector('[data-action="decrement"]');
            if (dec) dec.onclick = () => { state.value = Math.max(0, state.value - 1); onChange(); };
            
            const inc = container.querySelector('[data-action="increment"]');
            if (inc) inc.onclick = () => { state.value++; onChange(); };
            
            if (showDropdown) {
                const toggle = container.querySelector('[data-action="toggle-dropdown"]');
                if (toggle) toggle.onclick = () => { state.open = !state.open; onChange(); };
            }
            
            container.querySelectorAll('[data-action="adjust"]').forEach(btn => {
                const amount = parseInt(btn.dataset.amount);
                btn.onclick = () => {
                    state.value = Math.max(0, state.value + amount);
                    onChange();
                };
            });
            
            const numpadToggle = container.querySelector('[data-action="toggle-numpad"]');
            if (numpadToggle) numpadToggle.onclick = () => { state.numpadOpen = !state.numpadOpen; onChange(); };
            
            container.querySelectorAll('[data-numpad]').forEach(btn => {
                const key = btn.dataset.numpad;
                btn.onclick = () => {
                    if (key === '×') {
                        state.numpadOpen = false;
                    } else if (key === 'C') {
                        state.value = 0;
                    } else if (key === '◄') {
                        let str = state.value.toString();
                        state.value = str.length > 1 ? parseInt(str.slice(0, -1)) : 0;
                    } else {
                        state.value = state.value === 0 ? parseInt(key) : parseInt(state.value.toString() + key);
                    }
                    onChange();
                };
            });
        }
    };
})();