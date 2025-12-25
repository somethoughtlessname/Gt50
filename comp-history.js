(function() {
    // ===== HISTORY COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.History = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                title: '', 
                entries: [],
                dropdownText: ''
            };
        },
        
        // ===== TIMESTAMP FORMATTER =====
        formatTimestamp: function(timestamp) {
            const date = new Date(timestamp);
            const now = Date.now();
            const diff = now - timestamp;
            
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            let timeAgo = '';
            if (minutes < 1) timeAgo = 'Just now';
            else if (minutes < 60) timeAgo = `${minutes}m ago`;
            else if (hours < 24) timeAgo = `${hours}h ago`;
            else timeAgo = `${days}d ago`;
            
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            return { full: `${dateStr} - ${timeStr}`, relative: timeAgo };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.entries.length;
            
            // ===== ENTRIES HTML =====
            let entriesHTML = state.entries.map((entry, idx) => {
                const date = new Date(entry.timestamp);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                const second = String(date.getSeconds()).padStart(2, '0');
                
                return `
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">YEAR</div>
                            <input type="tel" data-field="year" data-idx="${idx}" value="${year}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="4"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">MON</div>
                            <input type="tel" data-field="month" data-idx="${idx}" value="${month}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="2"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">DAY</div>
                            <input type="tel" data-field="day" data-idx="${idx}" value="${day}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="2"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">HOUR</div>
                            <input type="tel" data-field="hour" data-idx="${idx}" value="${hour}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="2"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">MIN</div>
                            <input type="tel" data-field="minute" data-idx="${idx}" value="${minute}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="2"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                        ">
                            <div style="font-size: 6px; font-weight: 600; color: var(--color-10); line-height: 1;">SEC</div>
                            <input type="tel" data-field="second" data-idx="${idx}" value="${second}" 
                                pattern="[0-9]*" inputmode="numeric" maxlength="2"
                                style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 10px; font-weight: 700; outline: none; font-family: inherit; padding: 0;">
                        </div>
                        <button data-action="delete-entry" data-idx="${idx}" style="
                            width: 32px;
                            background: #6a5c82;
                            border: none;
                            color: var(--color-10);
                            cursor: pointer;
                            font-weight: 700;
                            font-size: 16px;
                            font-family: inherit;
                        ">×</button>
                    </div>
                `;
            }).join('');
            
            // ===== MAIN CARD =====
            container.innerHTML = `
                <div style="
                    background: #b88a5c;
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
                        color: ${count > 0 ? '#b88a5c' : 'var(--color-9)'};
                        cursor: pointer;
                    ">${state.open ? '−' : (count > 0 ? count : '+')}</div>
                    <input type="text" 
                        data-field="title"
                        value="${state.title || ''}"
                        placeholder="History" 
                        style="
                            flex: 1;
                            background: #b88a5c;
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
                                background: #b88a5c;
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
                                background: #b88a5c;
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
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #b88a5c; filter: brightness(0.75); z-index: -1;"></div>'}×
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
                        background: #b88a5c;
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
                    ${entriesHTML}
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) toggle.onclick = () => { state.open = !state.open; onChange(); };
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) titleInput.oninput = (e) => { state.title = e.target.value; };
            
            const dropdownTextInput = container.querySelector('[data-field="dropdownText"]');
            if (dropdownTextInput) {
                dropdownTextInput.oninput = (e) => {
                    state.dropdownText = e.target.value;
                };
            }
            
            // Update timestamp component fields
            const isLeapYear = (year) => {
                return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            };
            
            const getMaxDaysInMonth = (month, year) => {
                if (month === 2) {
                    return isLeapYear(year) ? 29 : 28;
                }
                if ([4, 6, 9, 11].includes(month)) {
                    return 30;
                }
                return 31;
            };
            
            const updateTimestamp = (idx, field, value) => {
                const date = new Date(state.entries[idx].timestamp);
                let numValue = parseInt(value) || 0;
                
                if (field === 'year') {
                    // Year: 4 digits, range 1000-9999
                    if (value.length === 4) {
                        numValue = Math.max(1000, Math.min(9999, numValue));
                        date.setFullYear(numValue);
                        
                        // Re-validate day in case we switched from leap to non-leap year
                        const currentMonth = date.getMonth() + 1;
                        const currentDay = date.getDate();
                        const maxDays = getMaxDaysInMonth(currentMonth, numValue);
                        if (currentDay > maxDays) {
                            date.setDate(maxDays);
                        }
                    }
                } else if (field === 'month') {
                    // Month: 1-12
                    numValue = Math.max(1, Math.min(12, numValue));
                    const currentYear = date.getFullYear();
                    const currentDay = date.getDate();
                    
                    date.setMonth(numValue - 1); // JS months are 0-indexed
                    
                    // Validate day for new month
                    const maxDays = getMaxDaysInMonth(numValue, currentYear);
                    if (currentDay > maxDays) {
                        date.setDate(maxDays);
                    }
                } else if (field === 'day') {
                    // Day: 1-31, but limited by month and year
                    const currentYear = date.getFullYear();
                    const currentMonth = date.getMonth() + 1;
                    const maxDays = getMaxDaysInMonth(currentMonth, currentYear);
                    numValue = Math.max(1, Math.min(maxDays, numValue));
                    date.setDate(numValue);
                } else if (field === 'hour') {
                    // Hour: 0-23
                    numValue = Math.max(0, Math.min(23, numValue));
                    date.setHours(numValue);
                } else if (field === 'minute') {
                    // Minute: 0-59
                    numValue = Math.max(0, Math.min(59, numValue));
                    date.setMinutes(numValue);
                } else if (field === 'second') {
                    // Second: 0-59
                    numValue = Math.max(0, Math.min(59, numValue));
                    date.setSeconds(numValue);
                }
                
                state.entries[idx].timestamp = date.getTime();
            };
            
            // Year inputs
            container.querySelectorAll('input[data-field="year"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 4) val = val.slice(0, 4);
                    e.target.value = val;
                    if (val.length === 4) {
                        updateTimestamp(idx, 'year', val);
                    }
                };
                input.onblur = (e) => {
                    if (e.target.value.length === 4) {
                        // Re-validate the entire date when year is changed
                        const date = new Date(state.entries[idx].timestamp);
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        const maxDays = getMaxDaysInMonth(month, year);
                        if (day > maxDays) {
                            date.setDate(maxDays);
                            state.entries[idx].timestamp = date.getTime();
                            onChange();
                        }
                    }
                };
            });
            
            // Month inputs
            container.querySelectorAll('input[data-field="month"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 12) val = '12';
                    if (numVal < 1 && val.length === 2) val = '01';
                    e.target.value = val;
                    updateTimestamp(idx, 'month', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'month', e.target.value);
                    }
                    // Re-validate day when month changes
                    const date = new Date(state.entries[idx].timestamp);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const maxDays = getMaxDaysInMonth(month, year);
                    if (day > maxDays) {
                        date.setDate(maxDays);
                        state.entries[idx].timestamp = date.getTime();
                        onChange();
                    }
                };
            });
            
            // Day inputs
            container.querySelectorAll('input[data-field="day"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    const date = new Date(state.entries[idx].timestamp);
                    const currentYear = date.getFullYear();
                    const currentMonth = date.getMonth() + 1;
                    const maxDays = getMaxDaysInMonth(currentMonth, currentYear);
                    
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > maxDays) val = String(maxDays);
                    if (numVal < 1 && val.length === 2) val = '01';
                    e.target.value = val;
                    updateTimestamp(idx, 'day', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'day', e.target.value);
                    }
                };
            });
            
            // Hour inputs
            container.querySelectorAll('input[data-field="hour"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 23) val = '23';
                    e.target.value = val;
                    updateTimestamp(idx, 'hour', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'hour', e.target.value);
                    }
                };
            });
            
            // Minute inputs
            container.querySelectorAll('input[data-field="minute"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 59) val = '59';
                    e.target.value = val;
                    updateTimestamp(idx, 'minute', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'minute', e.target.value);
                    }
                };
            });
            
            // Second inputs
            container.querySelectorAll('input[data-field="second"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 59) val = '59';
                    e.target.value = val;
                    updateTimestamp(idx, 'second', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'second', e.target.value);
                    }
                };
            });
            
            // Delete individual entries
            container.querySelectorAll('[data-action="delete-entry"]').forEach(btn => {
                const idx = parseInt(btn.dataset.idx);
                btn.onclick = () => {
                    state.entries.splice(idx, 1);
                    onChange();
                };
            });
            
            // Clear all history
            const clearBtn = container.querySelector('[data-action="clear-history"]');
            
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
            const count = state.entries.length;
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            const showDropdown = count > 0;
            
            // ===== ENTRIES HTML =====
            let entriesHTML = state.entries.map((entry, idx) => {
                const { full, relative } = this.formatTimestamp(entry.timestamp);
                return `
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <div style="
                            width: 60px;
                            height: 100%;
                            background: ${tabColor || 'var(--accent)'};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: var(--color-10);
                        ">${relative}</div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                            font-size: 10px;
                            font-weight: 600;
                            color: var(--color-10);
                        ">${full}</div>
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
                    position: relative;
                ">
                    <div data-action="log-entry" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${tabColor || 'var(--accent)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--color-10);
                        cursor: pointer;
                        z-index: 2;
                        position: relative;
                    ">+</div>
                    <div ${showDropdown ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        ${showDropdown ? 'cursor: pointer;' : ''}
                    "></div>
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: ${showDropdown ? 'var(--square-section)' : '0'};
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--color-10);
                        ">${state.title || 'History'}</div>
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
                        z-index: 2;
                        position: relative;
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
                        ">${state.dropdownText}</div>
                    </div>` : ''}
                    ${entriesHTML}
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const logBtn = container.querySelector('[data-action="log-entry"]');
            if (logBtn) {
                logBtn.onclick = () => {
                    state.entries.unshift({ timestamp: Date.now() });
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
            }
        }
    };
})();