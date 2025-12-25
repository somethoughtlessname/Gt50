(function() {
    // ===== CYCLE COMPONENT (WITH AUTO-RESET) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Cycle = {
        // ===== STATE FACTORY =====
        defaultState: function() {
    return { 
        name: '', 
        components: [],
        resetInterval: 'daily',
        lastReset: Date.now(),
        resetTime: '00:00',
        resetDay: 1,
        resetHour: 0,
        customMonths: 0,
        customDays: 0,
        customHours: 0,
        customMinutes: 0,
        customDropdownOpen: false,
        showCountdown: true,           
        countdownColor: 'var(--color-5)'  
    };
},
        
        rainbowColors: [
    'var(--color-4)', 'var(--color-5)', 'var(--color-6)', 'var(--color-7)',
    'var(--color-1)', 'var(--color-2)', 'var(--color-3)'
],
        
        // ===== CYCLE RESET LOGIC =====
        checkAndReset: function(state) {
            const now = new Date();
            const lastReset = new Date(state.lastReset);
            let shouldReset = false;
            
            if (state.resetInterval === 'custom') {
                const totalMs = 
                    (state.customMonths || 0) * 30 * 24 * 60 * 60 * 1000 +
                    (state.customDays || 0) * 24 * 60 * 60 * 1000 +
                    (state.customHours || 0) * 60 * 60 * 1000 +
                    (state.customMinutes || 0) * 60 * 1000;
                
                if (totalMs > 0 && (now - lastReset) >= totalMs) {
                    shouldReset = true;
                }
            } else if (state.resetInterval === 'hourly') {
                const hoursSince = Math.floor((now - lastReset) / (1000 * 60 * 60));
                if (hoursSince >= 1) shouldReset = true;
            } else if (state.resetInterval === 'daily') {
                const [hours, minutes] = state.resetTime.split(':').map(Number);
                const todayReset = new Date(now);
                todayReset.setHours(hours, minutes, 0, 0);
                if (lastReset < todayReset && now >= todayReset) shouldReset = true;
            } else if (state.resetInterval === 'weekly') {
                const currentDay = now.getDay();
                const lastResetDay = lastReset.getDay();
                if (currentDay === state.resetDay && lastResetDay !== state.resetDay) shouldReset = true;
                const daysSince = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
                if (daysSince >= 7) shouldReset = true;
            } else if (state.resetInterval === 'monthly') {
                const currentDate = now.getDate();
                const currentMonth = now.getMonth();
                const lastResetMonth = lastReset.getMonth();
                if (currentMonth !== lastResetMonth && currentDate >= state.resetDay) shouldReset = true;
            }
            
            if (shouldReset) {
                this.resetAllComponents(state);
                state.lastReset = Date.now();
                return true;
            }
            return false;
        },
        
        resetAllComponents: function(state) {
            if (!state.tabComponents) return;
            state.tabComponents.forEach(components => {
                components.forEach(comp => {
                    if (comp.type === 'list') {
                        comp.state.items.forEach(i => i.completed = false);
                        comp.state.completed = false;
                        comp.state.open = false;
                    } else if (comp.type === 'accumulation') {
                        comp.state.value = 0;
                        comp.state.open = false;
                        comp.state.numpadOpen = false;
                    } else if (comp.type === 'progress') {
                        comp.state.current = 0;
                        comp.state.open = false;
                    } else if (comp.type === 'tier') {
                        comp.state.current = 0;
                        comp.state.open = false;
                    } else if (comp.type === 'checklist') {
                        comp.state.items.forEach(i => i.completed = false);
                        comp.state.open = false;
                    } else if (comp.type === 'radio') {
                        comp.state.selectedIndex = null;
                        comp.state.open = false;
                    } else if (comp.type === 'threshold') {
                        comp.state.items.forEach(i => i.completed = false);
                        comp.state.manuallyChecked = false;
                        comp.state.open = false;
                    } else if (comp.type === 'cycle' && comp.state.isCycle) {
                        this.resetAllComponents(comp.state);
                    }
                });
            });
        },
        
       getNextResetText: function(state) {
    const now = new Date();
    let nextReset = new Date();
    
    if (state.resetInterval === 'custom') {
        // Calculate total custom interval in milliseconds
        const totalMs = 
            (state.customMonths || 0) * 30 * 24 * 60 * 60 * 1000 +
            (state.customDays || 0) * 24 * 60 * 60 * 1000 +
            (state.customHours || 0) * 60 * 60 * 1000 +
            (state.customMinutes || 0) * 60 * 1000;
        
        // Calculate next reset based on last reset time
        const lastReset = new Date(state.lastReset);
        nextReset = new Date(lastReset.getTime() + totalMs);
    } else if (state.resetInterval === 'hourly') {
        // Next reset is 1 hour from last reset
        const lastReset = new Date(state.lastReset);
        nextReset = new Date(lastReset.getTime() + (60 * 60 * 1000));
    } else if (state.resetInterval === 'daily') {
        // Next reset at specified time
        const [hours, minutes] = state.resetTime.split(':').map(Number);
        nextReset.setHours(hours, minutes, 0, 0);
        if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);
    } else if (state.resetInterval === 'weekly') {
        // Next reset on specified day of week
        const daysUntil = (state.resetDay - now.getDay() + 7) % 7;
        nextReset.setDate(now.getDate() + (daysUntil === 0 ? 7 : daysUntil));
        nextReset.setHours(0, 0, 0, 0);
    } else if (state.resetInterval === 'monthly') {
        // Next reset on specified day of month
        nextReset.setDate(state.resetDay);
        nextReset.setHours(0, 0, 0, 0);
        if (nextReset <= now) nextReset.setMonth(nextReset.getMonth() + 1);
    }
    
    // Calculate time difference
    const diff = nextReset - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format with seconds only when less than 1 day remaining
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
},
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending) {
            this.checkAndReset(state);
            const bgColor = 'var(--color-5-2)';
            const iconBg = 'var(--color-5-2)';
            const placeholder = 'Cycle';
            
            container.innerHTML = `
                <div style="
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    <div data-action="open" style="
                        width: var(--square-section);
                        min-width: var(--square-section);
                        height: 100%;
                        background: ${iconBg};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">
                        <div style="
                            position: relative;
                            width: 20px;
                            height: 20px;
                            border: var(--border-width) solid var(--font-color-3);
                            border-radius: 50%;
                        ">
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                width: 1.5px;
                                height: 5px;
                                background: var(--font-color-3);
                                transform-origin: bottom center;
                                transform: translate(-50%, -100%);
                            "></div>
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                width: 1.5px;
                                height: 7px;
                                background: var(--font-color-3);
                                transform-origin: bottom center;
                                transform: translate(-50%, -100%) rotate(90deg);
                            "></div>
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                width: 2px;
                                height: 2px;
                                background: var(--font-color-3);
                                border-radius: 50%;
                                transform: translate(-50%, -50%);
                            "></div>
                        </div>
                    </div>
                    <div style="
                        flex: 1;
                        background: ${bgColor};
                        height: 100%;
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                    ">
                        <input 
                            data-field="name"
                            type="text" 
                            value="${state.name || ''}" 
                            placeholder="${placeholder}"
                            style="
                                width: 100%;
                                background: transparent;
                                border: none;
                                padding: 0 var(--text-padding-right) 0 var(--text-padding-left);
                                font-size: 16px;
                                font-weight: 600;
                                color: var(--font-color-3);
                                outline: none;
                                font-family: inherit;
                            ">
                    </div>
                    <div style="
                        display: flex;
                        height: 100%;
                        border-left: var(--border-width) solid var(--border-color);
                    ">
                        <button data-action="move-up" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${bgColor};
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--font-color-3);
                            cursor: pointer;
                            font-family: inherit;
                            font-size: var(--up-sub-size);
                            font-weight: var(--up-sub-weight);
                            transition: filter 0.2s;
                        ">▲</button>
                        <button data-action="move-down" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${bgColor};
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--font-color-3);
                            cursor: pointer;
                            font-family: inherit;
                            font-size: var(--down-sub-size);
                            font-weight: var(--down-sub-weight);
                            transition: filter 0.2s;
                        ">▼</button>
                        <button data-action="delete" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${isDeletePending ? 'var(--color-10)' : bgColor};
                            border: none;
                            color: ${isDeletePending ? 'var(--color-1)' : 'var(--font-color-3)'};
                            cursor: pointer;
                            font-family: inherit;
                            font-size: var(--delete-sub-size);
                            font-weight: var(--delete-sub-weight);
                            transition: filter 0.2s;
                        ">×</button>
                    </div>
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            const nameInput = container.querySelector('[data-field="name"]');
            if (nameInput) {
                nameInput.oninput = (e) => {
                    state.name = e.target.value;
                    // Don't call onChange - just update state
                };
            }
            
            const openBtn = container.querySelector('[data-action="open"]');
            if (openBtn && onNavigate) {
                openBtn.onclick = onNavigate;
                openBtn.onmouseover = () => openBtn.style.filter = 'brightness(1.2)';
                openBtn.onmouseout = () => openBtn.style.filter = 'brightness(1)';
            }
            
            const moveUpBtn = container.querySelector('[data-action="move-up"]');
            if (moveUpBtn && onMove) {
                moveUpBtn.onclick = () => onMove(-1);
                moveUpBtn.onmouseover = () => moveUpBtn.style.filter = 'brightness(1.2)';
                moveUpBtn.onmouseout = () => moveUpBtn.style.filter = 'brightness(1)';
            }
            
            const moveDownBtn = container.querySelector('[data-action="move-down"]');
            if (moveDownBtn && onMove) {
                moveDownBtn.onclick = () => onMove(1);
                moveDownBtn.onmouseover = () => moveDownBtn.style.filter = 'brightness(1.2)';
                moveDownBtn.onmouseout = () => moveDownBtn.style.filter = 'brightness(1)';
            }
            
            const deleteBtn = container.querySelector('[data-action="delete"]');
            if (deleteBtn && onDelete) {
                deleteBtn.onclick = onDelete;
                if (!isDeletePending) {
                    deleteBtn.onmouseover = () => deleteBtn.style.filter = 'brightness(1.2)';
                    deleteBtn.onmouseout = () => deleteBtn.style.filter = 'brightness(1)';
                }
            }
        },
        
        // ===== BUILD MODE CONTROL CARD =====
        renderBuildControlCard: function(container, state, onChange) {
            this.checkAndReset(state);
            
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'margin-bottom: var(--margin);';
            
            const mainCard = document.createElement('div');
            mainCard.style.cssText = `
                background: var(--color-5-2);
                border: var(--border-width) solid var(--border-color);
                border-radius: ${state.customDropdownOpen ? '8px 8px 0 0' : '8px'};
                height: var(--card-height);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin-bottom: ${state.customDropdownOpen ? '0' : '0'};
            `;
            
            mainCard.innerHTML = `
                <div style="
                    flex: 1;
                    background: var(--color-10);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                    color: #000000;
                ">INTERVAL</div>
                <div style="
                    flex: 1;
                    display: flex;
                ">
                    <div data-interval="hourly" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetInterval === 'hourly' ? 'var(--color-10)' : '${bgColor}'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetInterval === 'hourly' ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">HOURLY</div>
                    <div data-interval="daily" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetInterval === 'daily' ? 'var(--color-10)' : '${bgColor}'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetInterval === 'daily' ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">DAILY</div>
                    <div data-interval="weekly" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetInterval === 'weekly' ? 'var(--color-10)' : '${bgColor}'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetInterval === 'weekly' ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">WEEKLY</div>
                    <div data-interval="monthly" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetInterval === 'monthly' ? 'var(--color-10)' : '${bgColor}'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetInterval === 'monthly' ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">MONTHLY</div>
                    <div data-interval="custom" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetInterval === 'custom' ? 'var(--color-10)' : '${bgColor}'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetInterval === 'custom' ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">CUSTOM</div>
                </div>
            `;
            
            wrapper.appendChild(mainCard);
            
            // Add custom dropdown if open
            if (state.customDropdownOpen) {
                const dropdown = document.createElement('div');
                dropdown.style.cssText = `
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    height: var(--card-height);
                    display: flex;
                    overflow: hidden;
                `;
                
                dropdown.innerHTML = `
                    <div style="
                        flex: 1;
                        background: var(--bg-4);
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="font-size: 7px; font-weight: 600; color: var(--color-10);">MONTHS</div>
                        <input type="tel" data-custom="months" value="${state.customMonths || 0}" 
                            pattern="[0-9]*" inputmode="numeric"
                            style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                    </div>
                    <div style="
                        flex: 1;
                        background: var(--bg-4);
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="font-size: 7px; font-weight: 600; color: var(--color-10);">DAYS</div>
                        <input type="tel" data-custom="days" value="${state.customDays || 0}" 
                            pattern="[0-9]*" inputmode="numeric"
                            style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                    </div>
                    <div style="
                        flex: 1;
                        background: var(--bg-4);
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="font-size: 7px; font-weight: 600; color: var(--color-10);">HOURS</div>
                        <input type="tel" data-custom="hours" value="${state.customHours || 0}" 
                            pattern="[0-9]*" inputmode="numeric"
                            style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                    </div>
                    <div style="
                        flex: 1;
                        background: var(--bg-4);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="font-size: 7px; font-weight: 600; color: var(--color-10);">MINUTES</div>
                        <input type="tel" data-custom="minutes" value="${state.customMinutes || 0}" 
                            pattern="[0-9]*" inputmode="numeric"
                            style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                    </div>
                `;
                
                wrapper.appendChild(dropdown);
            }
            
            // Add interval button event listeners
            mainCard.querySelectorAll('[data-interval]').forEach(btn => {
                const interval = btn.dataset.interval;
                btn.onclick = () => {
                    state.resetInterval = interval;
                    if (interval === 'custom') {
                        state.customDropdownOpen = !state.customDropdownOpen;
                    } else {
                        state.customDropdownOpen = false;
                    }
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Add custom input event listeners if dropdown exists
            if (state.customDropdownOpen) {
                const dropdown = wrapper.children[1];
                dropdown.querySelectorAll('[data-custom]').forEach(input => {
                    const field = input.dataset.custom;
                    input.oninput = (e) => {
                        const val = parseInt(e.target.value) || 0;
                        if (field === 'months') state.customMonths = val;
                        else if (field === 'days') state.customDays = val;
                        else if (field === 'hours') state.customHours = val;
                        else if (field === 'minutes') state.customMinutes = val;
                    };
                });
            }
            
            container.appendChild(wrapper);
        },
        
        // ===== VIEW MODE COUNTDOWN CARD =====
        renderCountdownCard: function(container, state, onRender) {
    this.checkAndReset(state);
    
    // Get the color to use
    const cardColor = state.countdownColor || 'var(--color-5)';
    
    const cycleCard = document.createElement('div');
    cycleCard.innerHTML = `
        <div style="
            background: var(--bg-2);
            border: var(--border-width) solid var(--border-color);
            border-radius: 8px;
            height: var(--card-height);
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-bottom: var(--margin);
        ">
            <div data-action="toggle-countdown" style="
                width: var(--square-section);
                min-width: var(--square-section);
                max-width: var(--square-section);
                flex-shrink: 0;
                height: 100%;
                background: ${state.showCountdown ? cardColor : 'var(--color-10)'};
                border-right: var(--border-width) solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--check-size);
                font-weight: var(--check-weight);
                color: ${state.showCountdown ? 'var(--color-10)' : cardColor};
                cursor: pointer;
                line-height: 1;
                padding-top: var(--check-position);
            ">${state.showCountdown ? '✓' : ''}</div>
            <div style="
                flex: 1;
                background: var(--bg-4);
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
            ">
                <div style="
                    font-size: 8px;
                    font-weight: 600;
                    color: var(--color-10);
                    line-height: 1;
                ">RESETS IN</div>
                <div data-countdown-display style="
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--color-10);
                    line-height: 1;
                ">${this.getNextResetText(state)}</div>
            </div>
            <div data-action="cycle-color" style="
                width: var(--square-section);
                min-width: var(--square-section);
                max-width: var(--square-section);
                flex-shrink: 0;
                height: 100%;
                background: var(--color-10);
                border-left: var(--border-width) solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: filter 0.2s;
            ">
                <div style="
                    width: 14px;
                    height: 14px;
                    background: ${cardColor};
                    border-radius: 50%;
                "></div>
            </div>
        </div>
    `;
    container.appendChild(cycleCard);
    
    // ===== EVENT LISTENERS =====
    
    // Checkbox toggle
    const toggleBtn = cycleCard.querySelector('[data-action="toggle-countdown"]');
    if (toggleBtn && onRender) {
        toggleBtn.onclick = () => {
            state.showCountdown = !state.showCountdown;
            onRender();
        };
    }
    
    // Color cycle
    const colorBtn = cycleCard.querySelector('[data-action="cycle-color"]');
    if (colorBtn && onRender) {
        colorBtn.onclick = () => {
            const currentColor = state.countdownColor || 'var(--color-5)';
            const currentIndex = this.rainbowColors.indexOf(currentColor);
            const nextIndex = (currentIndex + 1) % this.rainbowColors.length;
            state.countdownColor = this.rainbowColors[nextIndex];
            onRender();
        };
        colorBtn.onmouseover = () => colorBtn.style.filter = 'brightness(1.2)';
        colorBtn.onmouseout = () => colorBtn.style.filter = 'brightness(1)';
    }
    
    // Set up real-time countdown updates with reset detection
    const displayElement = cycleCard.querySelector('[data-countdown-display]');
    if (displayElement) {
        const updateInterval = setInterval(() => {
            // Check if element still exists in DOM
            if (!document.contains(displayElement)) {
                clearInterval(updateInterval);
                return;
            }
            
            // Store the old lastReset value
            const oldLastReset = state.lastReset;
            
            // Check if reset should happen
            this.checkAndReset(state);
            
            // If lastReset changed, a reset occurred - trigger full re-render
            if (state.lastReset !== oldLastReset && onRender) {
                clearInterval(updateInterval);
                onRender();
                return;
            }
            
            // Otherwise just update the countdown text
            displayElement.textContent = this.getNextResetText(state);
        }, 1000); // Update every second
        
        // Store interval ID for cleanup if needed
        cycleCard._updateInterval = updateInterval;
    }
},
        
        // ===== VIEW MODE COUNTDOWN CARD =====
renderViewCountdown: function(container, state, onRender) {
    // Only render if showCountdown is enabled
    if (!state.showCountdown) return;
    
    this.checkAndReset(state);
    
    const cardColor = state.countdownColor || 'var(--color-5)';
    const viewCountdownCard = document.createElement('div');
    
    viewCountdownCard.innerHTML = `
        <div style="
            background: var(--bg-2);
            border: var(--border-width) solid var(--border-color);
            border-radius: 8px;
            height: var(--card-height);
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-bottom: var(--margin);
        ">
            <div style="
                flex: 1;
                background: ${cardColor};
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
            ">
                <div style="
                    font-size: 8px;
                    font-weight: 600;
                    color: var(--color-10);
                    line-height: 1;
                ">RESETS IN</div>
                <div data-countdown-display style="
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--color-10);
                    line-height: 1;
                ">${this.getNextResetText(state)}</div>
            </div>
        </div>
    `;
    container.appendChild(viewCountdownCard);
    
    // Set up real-time countdown with reset detection
    const displayElement = viewCountdownCard.querySelector('[data-countdown-display]');
    if (displayElement) {
        const updateInterval = setInterval(() => {
            if (!document.contains(displayElement)) {
                clearInterval(updateInterval);
                return;
            }
            
            const oldLastReset = state.lastReset;
            this.checkAndReset(state);
            
            if (state.lastReset !== oldLastReset && onRender) {
                clearInterval(updateInterval);
                onRender();
                return;
            }
            
            displayElement.textContent = this.getNextResetText(state);
        }, 1000);
        
        viewCountdownCard._updateInterval = updateInterval;
    }
},

        
// ===== VIEW MODE RENDERER =====
renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions) {
    this.checkAndReset(state);
    const displayName = state.name || 'Cycle';
    
    // Initialize actionState if it doesn't exist
    if (!state.actionState) {
        state.actionState = {
            isOpen: false,
            deletePending: false
        };
    }
    
    const isOpen = state.actionState.isOpen;
    const isDeletePending = state.actionState.deletePending;
    
    container.innerHTML = `
        <div class="cycle-view-card" style="
            background: var(--bg-2);
            border: var(--border-width) solid var(--border-color);
            border-radius: 8px;
            height: var(--card-height);
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-bottom: var(--margin);
            position: relative;
        ">
            <!-- Action Sections Overlay -->
            <div class="action-sections" style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
                display: ${isOpen ? 'flex' : 'none'};
                z-index: 2;
            ">
                <!-- Edit Section -->
                <div data-action="edit" style="
                    width: var(--square-section);
                    height: 100%;
                    background: var(--color-10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: var(--border-width) solid var(--border-color);
                    cursor: pointer;
                ">
                    <div style="display: flex; flex-direction: column; gap: 3px;">
                        <div style="width: 16px; height: 2px; background: var(--color-4);"></div>
                        <div style="width: 16px; height: 2px; background: var(--color-4);"></div>
                        <div style="width: 16px; height: 2px; background: var(--color-4);"></div>
                    </div>
                </div>
                
                <!-- Move Up Section -->
                <div data-action="move-up" style="
                    width: var(--square-section);
                    height: 100%;
                    background: var(--color-10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: var(--border-width) solid var(--border-color);
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--color-4);
                ">▲</div>
                
                <!-- Card Body (closes actions) -->
                <div data-action="close" style="
                    flex: 1;
                    height: 100%;
                    cursor: pointer;
                "></div>
                
                <!-- Move Down Section -->
                <div data-action="move-down" style="
                    width: var(--square-section);
                    height: 100%;
                    background: var(--color-10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-left: var(--border-width) solid var(--border-color);
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--color-4);
                ">▼</div>
                
                <!-- Delete Section -->
                <div data-action="delete" style="
                    width: var(--square-section);
                    height: 100%;
                    background: ${isDeletePending ? 'var(--color-1)' : 'var(--color-10)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-left: var(--border-width) solid var(--border-color);
                    cursor: pointer;
                    font-size: 20px;
                    font-weight: 700;
                    color: ${isDeletePending ? 'var(--color-10)' : 'var(--color-1)'};
                ">×</div>
            </div>
            
            <!-- Main Content -->
            <div data-action="navigate" style="
                flex: 1;
                background: var(--bg-4);
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                color: var(--font-color-3);
                transition: opacity 0.2s, filter 0.2s;
                position: relative;
                z-index: 1;
                opacity: ${isOpen ? '0.3' : '1'};
            ">${displayName}</div>
        </div>
    `;
    
    // ===== EVENT LISTENERS =====
    const card = container.querySelector('.cycle-view-card');
    const navigateBtn = container.querySelector('[data-action="navigate"]');
    const editBtn = container.querySelector('[data-action="edit"]');
    const moveUpBtn = container.querySelector('[data-action="move-up"]');
    const moveDownBtn = container.querySelector('[data-action="move-down"]');
    const deleteBtn = container.querySelector('[data-action="delete"]');
    const closeBtn = container.querySelector('[data-action="close"]');
    
    let longPressTimer = null;
    
    // Long press detection
const startPress = (e) => {
    if (state.actionState.isOpen) return; // Don't start timer if already open
    
    longPressTimer = setTimeout(() => {
        if (closeAllActions) closeAllActions(); // Close all other panels first
        state.actionState.isOpen = true;
        if (render) render();
    }, 500);
};
    
    const endPress = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };
    
    // Attach long press to the card
    card.addEventListener('mousedown', startPress);
    card.addEventListener('mouseup', endPress);
    card.addEventListener('mouseleave', endPress);
    card.addEventListener('touchstart', startPress);
    card.addEventListener('touchend', endPress);
    card.addEventListener('touchcancel', endPress);
    card.addEventListener('touchmove', endPress);
    
    // Edit action (currently just closes - you can expand this later)
    if (editBtn) {
        editBtn.onclick = (e) => {
            e.stopPropagation();
            state.actionState.isOpen = false;
            state.actionState.deletePending = false;
            if (render) render();
        };
    }
    
    // Move up action - DON'T CLOSE
    if (moveUpBtn && onMove) {
        moveUpBtn.onclick = (e) => {
            e.stopPropagation();
            onMove(-1);
            // State stays open, render happens automatically
        };
    }
    
    // Move down action - DON'T CLOSE
    if (moveDownBtn && onMove) {
        moveDownBtn.onclick = (e) => {
            e.stopPropagation();
            onMove(1);
            // State stays open, render happens automatically
        };
    }
    
    // Delete action with confirmation
if (deleteBtn && onDelete) {
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (!state.actionState.deletePending) {
            state.actionState.deletePending = true;
            if (render) render();
        }
        onDelete();
    };
}
    
    // Close actions
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            state.actionState.isOpen = false;
            state.actionState.deletePending = false;
            if (render) render();
        };
    }
    
    // Navigate or close on main content click
    if (navigateBtn && onNavigate) {
        navigateBtn.onclick = (e) => {
            e.stopPropagation();
            if (state.actionState.isOpen) {
                // If actions are open, close them
                state.actionState.isOpen = false;
                state.actionState.deletePending = false;
                if (render) render();
            } else {
                // If actions are closed, navigate
                onNavigate();
            }
        };
        
        if (!isOpen) {
            navigateBtn.onmouseover = () => navigateBtn.style.filter = 'brightness(1.1)';
            navigateBtn.onmouseout = () => navigateBtn.style.filter = 'brightness(1)';
        }
    }
}
    };
})();