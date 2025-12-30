(function() {
    // ===== CYCLE COMPONENT (EXTENDS NEST WITH AUTO-RESET) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Cycle = {
        // ===== STATE FACTORY =====
        // Extends nest state with cycle-specific properties
        defaultState: function() {
            const nestState = GT50Lib.Nest.defaultState();
            return {
                ...nestState,
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
            state.components = state.components || [];
            
            state.components.forEach(comp => {
                if (comp.type === 'list') {
                    comp.state.isChecked = false;
                } else if (comp.type === 'checklist') {
                    comp.state.checks.forEach(check => check.checked = false);
                } else if (comp.type === 'radio') {
                    comp.state.selectedIndex = -1;
                } else if (comp.type === 'threshold') {
                    comp.state.currentAmount = 0;
                } else if (comp.type === 'accumulation') {
                    comp.state.currentAmount = 0;
                } else if (comp.type === 'progress') {
                    comp.state.currentProgress = 0;
                } else if (comp.type === 'tier') {
                    comp.state.currentTier = 0;
                } else if (comp.type === 'nest') {
                    if (state.isCycle) {
                        this.resetAllComponents(comp.state);
                    }
                }
            });
            
            if (state.tabComponents && Array.isArray(state.tabComponents)) {
                state.tabComponents.forEach(tab => {
                    tab.forEach(comp => {
                        if (comp.type === 'list') {
                            comp.state.isChecked = false;
                        } else if (comp.type === 'checklist') {
                            comp.state.checks.forEach(check => check.checked = false);
                        } else if (comp.type === 'radio') {
                            comp.state.selectedIndex = -1;
                        } else if (comp.type === 'threshold') {
                            comp.state.currentAmount = 0;
                        } else if (comp.type === 'accumulation') {
                            comp.state.currentAmount = 0;
                        } else if (comp.type === 'progress') {
                            comp.state.currentProgress = 0;
                        } else if (comp.type === 'tier') {
                            comp.state.currentTier = 0;
                        } else if (comp.type === 'nest' || comp.type === 'cycle') {
                            if (comp.state.isCycle) {
                                this.resetAllComponents(comp.state);
                            }
                        }
                    });
                });
            }
        },
        
        getNextResetText: function(state) {
            const now = new Date();
            let nextReset = new Date();
            
            if (state.resetInterval === 'custom') {
                const totalMs = 
                    (state.customMonths || 0) * 30 * 24 * 60 * 60 * 1000 +
                    (state.customDays || 0) * 24 * 60 * 60 * 1000 +
                    (state.customHours || 0) * 60 * 60 * 1000 +
                    (state.customMinutes || 0) * 60 * 1000;
                
                const lastReset = new Date(state.lastReset);
                nextReset = new Date(lastReset.getTime() + totalMs);
            } else if (state.resetInterval === 'hourly') {
                const lastReset = new Date(state.lastReset);
                nextReset = new Date(lastReset.getTime() + (60 * 60 * 1000));
            } else if (state.resetInterval === 'daily') {
                const [hours, minutes] = state.resetTime.split(':').map(Number);
                nextReset.setHours(hours, minutes, 0, 0);
                if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);
            } else if (state.resetInterval === 'weekly') {
                const daysUntil = (state.resetDay - now.getDay() + 7) % 7;
                nextReset.setDate(now.getDate() + (daysUntil === 0 ? 7 : daysUntil));
                nextReset.setHours(0, 0, 0, 0);
            } else if (state.resetInterval === 'monthly') {
                nextReset.setDate(state.resetDay);
                nextReset.setHours(0, 0, 0, 0);
                if (nextReset <= now) nextReset.setMonth(nextReset.getMonth() + 1);
            }
            
            const diff = nextReset - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
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
        // Delegates to Nest but with cycle icon
        renderBuild: function(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending) {
            this.checkAndReset(state);
            
            // Use nest's build renderer
            GT50Lib.Nest.renderBuild(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending);
            
            // Replace the icon with cycle icon
            const iconSection = container.querySelector('div > div[data-action="open"]');
            if (iconSection) {
                iconSection.textContent = '⟳';
            }
        },
        
        // ===== VIEW MODE RENDERER =====
        // Completely identical to Nest - NO modifications at all
        renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions) {
            this.checkAndReset(state);
            
            // Just delegate to Nest - do NOT modify anything
            // Cycles look EXACTLY like Nests in view mode
            GT50Lib.Nest.renderView(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions);
        },
        
        // ===== EDIT WINDOW RENDERER =====
        // Delegates to Nest but ensures tempType is set to 'cycle'
        renderEditWindow: function(container, state, onChange, onClose, onSave) {
            // Initialize editWindow if it doesn't exist
            if (!state.editWindow) {
                state.editWindow = { isOpen: false };
            }
            
            // Set tempType to 'cycle' if this is a cycle card
            // This ensures the cycle toggle shows as active in the edit window
            if (state.resetInterval !== undefined) {
                // This state has cycle properties, so it's a cycle
                if (state.editWindow.tempType === undefined) {
                    state.editWindow.tempType = 'cycle';
                }
            }
            
            // Just call nest's edit window - it handles everything
            GT50Lib.Nest.renderEditWindow(container, state, onChange, onClose, onSave);
        },
        
        // ===== BUILD MODE CONTROL CARD =====
        // Cycle-specific: Shows interval controls and configuration
        renderBuildControlCard: function(container, state, onChange) {
            this.checkAndReset(state);
            
            const bgColor = 'var(--color-5-2)';
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'margin-bottom: var(--margin);';
            
            const mainCard = document.createElement('div');
            mainCard.style.cssText = `
                background: ${bgColor};
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
                        background: ${state.resetInterval === 'hourly' ? 'var(--color-10)' : bgColor};
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
                        background: ${state.resetInterval === 'daily' ? 'var(--color-10)' : bgColor};
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
                        background: ${state.resetInterval === 'weekly' ? 'var(--color-10)' : bgColor};
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
                        background: ${state.resetInterval === 'monthly' ? 'var(--color-10)' : bgColor};
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
                        background: ${state.resetInterval === 'custom' ? 'var(--color-10)' : bgColor};
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
                const dropdown = wrapper.querySelector('div:last-child');
                dropdown.querySelectorAll('[data-custom]').forEach(input => {
                    const field = input.dataset.custom;
                    input.oninput = (e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (field === 'months') state.customMonths = value;
                        else if (field === 'days') state.customDays = value;
                        else if (field === 'hours') state.customHours = value;
                        else if (field === 'minutes') state.customMinutes = value;
                        onChange();
                    };
                });
            }
            
            container.appendChild(wrapper);
            
            // Add time/day/month specific controls based on interval
            if (state.resetInterval === 'daily') {
                const timeCard = document.createElement('div');
                timeCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                timeCard.innerHTML = `
                    <div style="
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
                        font-size: 10px;
                        font-weight: 700;
                        color: #000000;
                    ">TIME</div>
                    <input type="time" value="${state.resetTime}" style="
                        flex: 1;
                        background: transparent;
                        border: none;
                        color: var(--color-10);
                        font-size: 14px;
                        font-weight: 600;
                        padding: 0 16px;
                        outline: none;
                        font-family: inherit;
                    ">
                `;
                
                container.appendChild(timeCard);
                
                const timeInput = timeCard.querySelector('input[type="time"]');
                timeInput.oninput = (e) => {
                    state.resetTime = e.target.value;
                    onChange();
                };
            }
            
            if (state.resetInterval === 'weekly') {
                const dayCard = document.createElement('div');
                dayCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                
                dayCard.innerHTML = `
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
                    ">DAY</div>
                    <div style="flex: 1; display: flex;">
                        ${days.map((day, i) => `
                            <div data-day="${i}" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.resetDay === i ? 'var(--color-10)' : bgColor};
                                ${i < 6 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: ${state.resetDay === i ? '#000000' : 'var(--color-10)'};
                                cursor: pointer;
                                transition: filter 0.2s;
                            ">${day}</div>
                        `).join('')}
                    </div>
                `;
                
                container.appendChild(dayCard);
                
                dayCard.querySelectorAll('[data-day]').forEach(btn => {
                    btn.onclick = () => {
                        state.resetDay = parseInt(btn.dataset.day);
                        onChange();
                    };
                    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
                });
            }
            
            if (state.resetInterval === 'monthly') {
                const monthCard = document.createElement('div');
                monthCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                monthCard.innerHTML = `
                    <div style="
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
                        font-size: 10px;
                        font-weight: 700;
                        color: #000000;
                    ">DAY</div>
                    <input type="number" min="1" max="31" value="${state.resetDay}" style="
                        flex: 1;
                        background: transparent;
                        border: none;
                        color: var(--color-10);
                        font-size: 14px;
                        font-weight: 600;
                        padding: 0 16px;
                        outline: none;
                        font-family: inherit;
                    ">
                `;
                
                container.appendChild(monthCard);
                
                const dayInput = monthCard.querySelector('input[type="number"]');
                dayInput.oninput = (e) => {
                    let value = parseInt(e.target.value) || 1;
                    value = Math.max(1, Math.min(31, value));
                    state.resetDay = value;
                    onChange();
                };
            }
        },
        
        // ===== BUILD MODE COUNTDOWN CARD =====
        // Shows countdown with toggle and color picker in build mode
        renderCountdownCard: function(container, state, onRender) {
            this.checkAndReset(state);
            
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
                
                cycleCard._updateInterval = updateInterval;
            }
        },
        
        // ===== VIEW MODE COUNTDOWN CARD =====
        // Simple countdown display in view mode (no toggle or color picker)
        renderViewCountdown: function(container, state, onRender) {
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
        }
    };
})();