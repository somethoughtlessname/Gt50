(function() {
    // ===== HISTORY COMPONENT - COMPLETE REWRITE =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.History = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                title: '', 
                entries: [],
                dropdownText: '',
                displayMode: 'timeSince', // 'none', 'date', or 'timeSince'
                locked: false
            };
        },
        
        // ===== TIMESTAMP FORMATTER =====
        formatTimestamp: function(timestamp) {
            const date = new Date(timestamp);
            const now = Date.now();
            const diff = now - timestamp;
            
            // FUTURE DATE SUPPORT: Detect if timestamp is in the future
            const isFuture = diff < 0;
            const absDiff = Math.abs(diff);
            
            const minutes = Math.floor(absDiff / 60000);
            const hours = Math.floor(absDiff / 3600000);
            const days = Math.floor(absDiff / 86400000);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30.44);
            const years = Math.floor(days / 365.25);
            
            let timeAgo = '';
            
            // FUTURE DATE SUPPORT: Dynamic suffix based on past/future
            const suffix = isFuture ? ' from now' : ' ago';
            
            if (years >= 1000000000) {
                const billions = (years / 1000000000).toFixed(1);
                timeAgo = billions + ' billion years' + suffix;
            } else if (years >= 1000000) {
                const millions = (years / 1000000).toFixed(1);
                timeAgo = millions + ' million years' + suffix;
            } else if (years >= 100) {
                timeAgo = years + ' years' + suffix;
            } else if (years >= 1) {
                const remainingMonths = Math.floor((days % 365.25) / 30.44);
                timeAgo = years + (years === 1 ? ' year' : ' years');
                if (remainingMonths > 0) {
                    timeAgo += ', ' + remainingMonths + (remainingMonths === 1 ? ' month' : ' months');
                }
                timeAgo += suffix;
            } else if (weeks >= 1) {
                const remainingDays = days % 30;
                if (months > 0) {
                    timeAgo = months + (months === 1 ? ' month' : ' months');
                    if (remainingDays > 0) {
                        timeAgo += ', ' + remainingDays + (remainingDays === 1 ? ' day' : ' days');
                    }
                } else {
                    timeAgo = days + (days === 1 ? ' day' : ' days');
                }
                timeAgo += suffix;
            } else {
                const remainingHours = hours % 24;
                const remainingMinutes = minutes % 60;
                
                if (days > 0) {
                    timeAgo = days + (days === 1 ? ' day' : ' days');
                    if (remainingHours > 0) {
                        timeAgo += ', ' + remainingHours + (remainingHours === 1 ? ' hour' : ' hours');
                    }
                    if (remainingMinutes > 0 && remainingHours === 0) {
                        timeAgo += ', ' + remainingMinutes + (remainingMinutes === 1 ? ' minute' : ' minutes');
                    }
                } else if (hours > 0) {
                    timeAgo = hours + (hours === 1 ? ' hour' : ' hours');
                    if (remainingMinutes > 0) {
                        timeAgo += ', ' + remainingMinutes + (remainingMinutes === 1 ? ' minute' : ' minutes');
                    }
                } else if (minutes > 0) {
                    timeAgo = minutes + (minutes === 1 ? ' minute' : ' minutes');
                } else {
                    timeAgo = 'Just now';
                }
                
                if (timeAgo !== 'Just now') {
                    timeAgo += suffix;
                }
            }
            
            // Check if date is BCE (before year 1)
            const year = date.getFullYear();
            let fullDisplay;
            
            if (year <= 0) {
                const bceYear = Math.abs(year - 1);
                fullDisplay = `${bceYear} BCE`;
            } else {
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
                fullDisplay = `${dateStr} - ${timeStr}`;
            }
            
            return { full: fullDisplay, relative: timeAgo };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const count = state.entries.length;
            
            // Sort entries newest first
            state.entries.sort((a, b) => b.timestamp - a.timestamp);
            
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
                        align-items: stretch;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">YR</div>
                            <input type="text" 
                                data-field="year"
                                data-idx="${idx}"
                                value="${year}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">MO</div>
                            <input type="text" 
                                data-field="month"
                                data-idx="${idx}"
                                value="${month}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">DAY</div>
                            <input type="text" 
                                data-field="day"
                                data-idx="${idx}"
                                value="${day}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">HR</div>
                            <input type="text" 
                                data-field="hour"
                                data-idx="${idx}"
                                value="${hour}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">MIN</div>
                            <input type="text" 
                                data-field="minute"
                                data-idx="${idx}"
                                value="${minute}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0px;
                        ">
                            <div style="
                                font-size: 6px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">SEC</div>
                            <input type="text" 
                                data-field="second"
                                data-idx="${idx}"
                                value="${second}"
                                style="
                                    width: 100%;
                                    background: transparent;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 11px;
                                    font-weight: 700;
                                    outline: none;
                                    text-align: center;
                                    font-family: inherit;
                                    padding: 0;
                                    margin: 0;
                                ">
                        </div>
                        <button data-action="delete-entry" data-idx="${idx}" style="
                            width: var(--square-section);
                            flex-shrink: 0;
                            height: 100%;
                            background: transparent;
                            border: none;
                            color: var(--color-10);
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                            font-size: 18px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0;
                            margin: 0;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: var(--color-2-2);
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>×
                        </button>
                    </div>
                `;
            }).join('');
            
            // ===== MAIN CARD =====
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
                    position: relative;
                ">
                    <div data-action="toggle" style="
                        width: var(--square-section);
                        height: var(--card-height);
                        background: ${count > 0 ? 'var(--color-2-2)' : 'var(--bg-3)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${state.open ? '20px' : '16px'};
                        font-weight: 700;
                        color: ${count > 0 ? 'var(--color-2-2)' : 'var(--color-9)'};
                        cursor: pointer;
                    ">${state.open ? '−' : (count > 0 ? count : '+')}</div>
                    <input type="text" 
                        data-field="title"
                        value="${state.title || ''}"
                        placeholder="History" 
                        style="
                            flex: 1;
                            background: var(--color-2-2);
                            border: none;
                            color: var(--font-color-3);
                            padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
                            padding-right: 117px;
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
                            font-size: 16px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0;
                            margin: 0;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: var(--color-2-2);
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>↑
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
                            font-size: 16px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0;
                            margin: 0;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: var(--color-2-2);
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>↓
                        </button>
                        <button data-action="delete-card" style="
                            width: var(--square-section);
                            height: 100%;
                            background: transparent;
                            border: none;
                            color: var(--color-10);
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                            font-size: 18px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0;
                            margin: 0;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: ${isDeletePending ? 'var(--delete-pending-bg)' : 'var(--color-2-2)'};
                                filter: brightness(0.75);
                                z-index: -1;
                            "></div>×
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
                        background: var(--color-2-2);
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
                    <div data-action="add-entry" style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        cursor: pointer;
                    ">
                        <div style="
                            flex: 1;
                            height: 100%;
                            background: var(--color-2-2);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-align: center;
                        ">+ Add Entry</div>
                    </div>
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
            
            // Add entry from dropdown card
            const addEntryBtn = container.querySelector('[data-action="add-entry"]');
            if (addEntryBtn) {
                addEntryBtn.onclick = () => {
                    state.entries.unshift({ timestamp: Date.now() });
                    state.open = true;
                    onChange();
                };
            }
            
            // Update timestamp fields
            const updateTimestamp = (idx, field, value) => {
                const entry = state.entries[idx];
                const date = new Date(entry.timestamp);
                
                if (field === 'year') date.setFullYear(parseInt(value) || 0);
                if (field === 'month') date.setMonth((parseInt(value) || 1) - 1);
                if (field === 'day') date.setDate(parseInt(value) || 1);
                if (field === 'hour') date.setHours(parseInt(value) || 0);
                if (field === 'minute') date.setMinutes(parseInt(value) || 0);
                if (field === 'second') date.setSeconds(parseInt(value) || 0);
                
                entry.timestamp = date.getTime();
            };
            
            // Year inputs
            container.querySelectorAll('[data-field="year"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9-]/g, '');
                    e.target.value = val;
                    updateTimestamp(idx, 'year', val);
                };
            });
            
            // Month inputs
            container.querySelectorAll('[data-field="month"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 12) val = '12';
                    e.target.value = val;
                    updateTimestamp(idx, 'month', val);
                };
                input.onblur = (e) => {
                    if (e.target.value && e.target.value.length === 1) {
                        e.target.value = '0' + e.target.value;
                        updateTimestamp(idx, 'month', e.target.value);
                    }
                };
            });
            
            // Day inputs
            container.querySelectorAll('[data-field="day"]').forEach(input => {
                const idx = parseInt(input.dataset.idx);
                input.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    const numVal = parseInt(val) || 0;
                    if (numVal > 31) val = '31';
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
            container.querySelectorAll('[data-field="hour"]').forEach(input => {
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
            container.querySelectorAll('[data-field="minute"]').forEach(input => {
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
            container.querySelectorAll('[data-field="second"]').forEach(input => {
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
        renderView: function(container, state, onChange, currentTabColor) {
            const count = state.entries.length;
            const hasDropdownText = state.dropdownText && state.dropdownText.trim() !== '';
            const showDropdown = count > 0 || state.locked;
            
            // Sort entries newest first
            state.entries.sort((a, b) => b.timestamp - a.timestamp);
            
            // Calculate display for main card
            let displayLines = [state.title || 'History'];
            if (count > 0 && state.displayMode !== 'none') {
                const latest = state.entries[0];
                const { full, relative } = this.formatTimestamp(latest.timestamp);
                
                if (state.displayMode === 'date') {
                    const date = new Date(latest.timestamp);
                    const dateStr = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    });
                    displayLines.push(dateStr);
                } else if (state.displayMode === 'timeSince') {
                    displayLines.push(relative);
                }
            }
            
            // Calculate font size based on line count
            let fontSize = '14px';
            let lineHeight = '1.2';
            if (displayLines.length === 2) {
                fontSize = '11px';
            }
            
            // Settings card HTML
            const settingsHTML = `
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
                    <div data-action="set-mode-date" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.displayMode === 'date' ? '#FFFFFF' : 'var(--bg-4)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <div style="
                            font-size: 10px;
                            font-weight: 600;
                            color: ${state.displayMode === 'date' ? currentTabColor || 'var(--accent)' : 'var(--color-10)'};
                            text-align: center;
                        ">Show Date</div>
                    </div>
                    <div data-action="set-mode-time" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.displayMode === 'timeSince' ? '#FFFFFF' : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <div style="
                            font-size: 10px;
                            font-weight: 600;
                            color: ${state.displayMode === 'timeSince' ? currentTabColor || 'var(--accent)' : 'var(--color-10)'};
                            text-align: center;
                        ">Time Calculations</div>
                    </div>
                </div>
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
                    <div data-action="toggle-lock" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.locked ? '#FFFFFF' : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <div style="
                            font-size: 10px;
                            font-weight: 600;
                            color: ${state.locked ? currentTabColor || 'var(--accent)' : 'var(--color-10)'};
                            text-align: center;
                        ">Lock This Card</div>
                    </div>
                </div>
            `;
            
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
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-align: center;
                            padding: 0 4px;
                        ">${full}</div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 600;
                            color: var(--color-10);
                            text-align: center;
                            padding: 0 4px;
                        ">${relative}</div>
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
                    ${!state.locked ? `<div data-action="log-entry" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${currentTabColor || 'var(--accent)'};
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
                    ">+</div>` : ''}
                    <div ${showDropdown || state.locked ? 'data-action="toggle-dropdown"' : ''} style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        ${showDropdown || state.locked ? 'cursor: pointer;' : ''}
                    "></div>
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: ${showDropdown && !state.locked ? 'var(--square-section)' : '0'};
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                    ">
                        <div style="
                            font-size: ${fontSize};
                            font-weight: 600;
                            color: var(--color-10);
                            line-height: ${lineHeight};
                            text-align: center;
                        ">${displayLines.join('<br>')}</div>
                    </div>
                    ${showDropdown && !state.locked ? `<div data-action="toggle-dropdown" style="
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
                    background: ${currentTabColor || 'var(--accent)'};
                    border-radius: 0 0 8px 8px;
                    display: block;
                    padding: var(--margin);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    margin-bottom: var(--margin);
                ">
                    ${settingsHTML}
                    ${!state.locked && hasDropdownText ? `<div style="
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
                    ${!state.locked ? entriesHTML : ''}
                </div>` : ''}
            `;
            
            // ===== EVENT LISTENERS =====
            const logBtn = container.querySelector('[data-action="log-entry"]');
            if (logBtn && !state.locked) {
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
            
            // Settings buttons
            const setModeDate = container.querySelector('[data-action="set-mode-date"]');
            if (setModeDate) {
                setModeDate.onclick = () => {
                    state.displayMode = state.displayMode === 'date' ? 'none' : 'date';
                    onChange();
                };
            }
            
            const setModeTime = container.querySelector('[data-action="set-mode-time"]');
            if (setModeTime) {
                setModeTime.onclick = () => {
                    state.displayMode = state.displayMode === 'timeSince' ? 'none' : 'timeSince';
                    onChange();
                };
            }
            
            const toggleLock = container.querySelector('[data-action="toggle-lock"]');
            if (toggleLock) {
                toggleLock.onclick = () => {
                    state.locked = !state.locked;
                    onChange();
                };
            }
        }
    };
})();