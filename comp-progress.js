(function() {
    // ===== PROGRESS COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Progress = {
        // ===== STATE FACTORY =====
        defaultState: function() {
    return { current: 0, total: '', title: '', dropdownText: '' };
},
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
    // Initialize open state if not present
    if (typeof state.open === 'undefined') {
        state.open = false;
    }
    
    const cardColor = 'var(--color-3)';
    
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
                        background: var(--color-3);
                        height: 100%;
                        display: flex;
                        padding-right: 135px;
                    ">
                       <input type="text" 
    data-field="title"
    value="${state.title || ''}"
    placeholder="Progress" 
    style="
        width: 66.67%;
        background: transparent;
        border: none;
        border-right: var(--border-width) solid var(--border-color);
        color: var(--font-color-3);
        padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
        font-size: 16px;
        font-weight: 600;
        height: 100%;
        outline: none;
        font-family: inherit;
    ">
                        <input type="number" 
    data-field="total"
    value="${state.total || ''}"
    placeholder="Number"
                            style="
                                width: 33.33%;
                                background: transparent;
                                border: none;
                                color: var(--font-color-3);
                                padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
                                font-size: 16px;
                                font-weight: 600;
                                outline: none;
                                font-family: inherit;
                            ">
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
                        background: var(--color-3);
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
            
            const totalInput = container.querySelector('[data-field="total"]');
            if (totalInput) {
                totalInput.oninput = (e) => {
                    state.total = parseInt(e.target.value) || 0;
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
        renderView: function(container, state, onChange, tabColor) {
    console.log('Progress renderView - tabColor:', tabColor); // ADD THIS LINE
    const percent = state.total > 0 ? (state.current / state.total * 100) : 0;
            const isCompleted = state.current === state.total && state.total > 0;
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            
            // Initialize viewOpen state if not present
            if (typeof state.viewOpen === 'undefined') {
                state.viewOpen = false;
            }
            
            container.innerHTML = `
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.viewOpen && hasDropdownText ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${state.viewOpen && hasDropdownText ? '0' : 'var(--margin)'};
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
                    <div ${hasDropdownText ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        position: relative;
                        height: 100%;
                        overflow: hidden;
                        ${hasDropdownText ? 'cursor: pointer;' : ''}
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: ${percent}%;
                            background: ${isCompleted ? '#d4af37' : (tabColor || 'var(--primary)')};
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
                        ">
                            <div style="
                                font-size: 8px;
                                font-weight: 600;
                                color: var(--color-10);
                                line-height: 1;
                            ">${state.title || 'Progress'}</div>
                            <div style="
                                font-size: 18px;
                                font-weight: 700;
                                color: var(--color-10);
                                line-height: 1;
                                margin-top: 2px;
                            ">${state.current} / ${state.total}</div>
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
                ${state.viewOpen && hasDropdownText ? `<div style="
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
            
            const toggleDropdown = container.querySelector('[data-action="toggle-dropdown"]');
            if (toggleDropdown) {
                toggleDropdown.onclick = () => {
                    state.viewOpen = !state.viewOpen;
                    onChange();
                };
            }
        }
    };
})();