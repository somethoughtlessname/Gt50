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
                isCycle: true,  // Mark this as a cycle for reset detection
                resetInterval: 'daily',
                lastReset: Date.now(),
                resetTime: '00:00',
                resetDay: 0,  // 0 = Sunday for weekly, will be adjusted to 1 for monthly
                resetHour: 0,
                resetHourDisplay: 12,  // 1-12 for display
                resetPeriod: 'AM',     // AM or PM
                hourlyMode: 'topOfHour', // 'topOfHour', 'setToNow', 'topOfNextMinute'
                hourlyMinute: 0,       // Stores the minute for setToNow/topOfNextMinute modes
                customMonths: 0,
                customDays: 0,
                customHours: 0,
                customMinutes: 0,
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
                if (state.hourlyMode === 'topOfHour') {
                    // Reset at XX:00:00 each hour
                    // Calculate next top-of-hour after lastReset
                    const nextReset = new Date(lastReset);
                    nextReset.setMinutes(0, 0, 0);
                    nextReset.setHours(nextReset.getHours() + 1);
                    
                    if (now >= nextReset) shouldReset = true;
                } else if (state.hourlyMode === 'setToNow') {
                    // Reset exactly 1 hour after lastReset (preserves seconds)
                    const nextReset = new Date(lastReset.getTime() + (60 * 60 * 1000));
                    if (now >= nextReset) shouldReset = true;
                } else if (state.hourlyMode === 'topOfNextMinute') {
                    // Reset at XX:MM:00 each hour
                    const nextReset = new Date(lastReset);
                    nextReset.setMinutes(state.hourlyMinute, 0, 0);
                    nextReset.setHours(nextReset.getHours() + 1);
                    
                    if (now >= nextReset) shouldReset = true;
                }
            } else if (state.resetInterval === 'daily') {
                const [hours, minutes] = state.resetTime.split(':').map(Number);
                const todayReset = new Date(now);
                todayReset.setHours(hours, minutes, 0, 0);
                if (lastReset < todayReset && now >= todayReset) shouldReset = true;
            } else if (state.resetInterval === 'weekly') {
                // Reset on specific day of week
                const nextReset = new Date(lastReset);
                nextReset.setHours(0, 0, 0, 0);
                
                // Find next occurrence of the target day
                const currentDay = nextReset.getDay();
                let daysUntilReset = (state.resetDay - currentDay + 7) % 7;
                if (daysUntilReset === 0) daysUntilReset = 7; // If same day, next week
                
                nextReset.setDate(nextReset.getDate() + daysUntilReset);
                
                if (now >= nextReset) shouldReset = true;
            } else if (state.resetInterval === 'monthly') {
                const currentDate = now.getDate();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const lastResetMonth = lastReset.getMonth();
                
                // Get the last day of current month
                const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                
                // Adjust reset day if it doesn't exist in this month
                // E.g., if resetDay is 31 but current month is Feb (28/29 days), use last day of Feb
                const adjustedResetDay = Math.min(state.resetDay, lastDayOfMonth);
                
                if (currentMonth !== lastResetMonth && currentDate >= adjustedResetDay) shouldReset = true;
            }
            
            if (shouldReset) {
                console.log('🔔 RESET DETECTED! Interval:', state.resetInterval);
                this.resetAllComponents(state);
                state.lastReset = Date.now();
                console.log('✓ RESET COMPLETE - lastReset updated to:', new Date(state.lastReset).toLocaleString());
                return true;
            }
            return false;
        },
        
        resetAllComponents: function(state) {
            console.log('🔄 RESET: Starting resetAllComponents');
            state.components = state.components || [];
            
            state.components.forEach(comp => {
                console.log(`🔄 RESET: Processing ${comp.type} component`);
                if (comp.type === 'list') {
                    // Reset main completed state
                    comp.state.completed = false;
                    // Reset each item's completed state
                    if (comp.state.items && Array.isArray(comp.state.items)) {
                        comp.state.items.forEach(item => item.completed = false);
                    }
                    console.log('✓ RESET: List reset complete');
                } else if (comp.type === 'checklist') {
                    // Reset each item's completed state
                    if (comp.state.items && Array.isArray(comp.state.items)) {
                        comp.state.items.forEach(item => item.completed = false);
                    }
                    console.log('✓ RESET: Checklist reset complete');
                } else if (comp.type === 'radio') {
                    console.log(`  Before: selectedIndex = ${comp.state.selectedIndex}`);
                    comp.state.selectedIndex = null;
                    console.log(`  After: selectedIndex = ${comp.state.selectedIndex}`);
                    console.log('✓ RESET: Radio reset complete');
                } else if (comp.type === 'threshold') {
                    console.log(`  Before: number1 = ${comp.state.number1}, manuallyChecked = ${comp.state.manuallyChecked}`);
                    // DON'T clear number1 - preserve the current progress value
                    // Only reset the completion tracking
                    comp.state.manuallyChecked = false;
                    // Reset each item's completed state
                    if (comp.state.items && Array.isArray(comp.state.items)) {
                        comp.state.items.forEach(item => item.completed = false);
                    }
                    console.log(`  After: number1 = ${comp.state.number1}, manuallyChecked = ${comp.state.manuallyChecked}`);
                    console.log('✓ RESET: Threshold reset complete');
                } else if (comp.type === 'accumulation') {
                    console.log(`  Before: value = ${comp.state.value}`);
                    comp.state.value = 0;
                    console.log(`  After: value = ${comp.state.value}`);
                    console.log('✓ RESET: Accumulation reset complete');
                } else if (comp.type === 'progress') {
                    console.log(`  Before: current = ${comp.state.current}`);
                    comp.state.current = 0;
                    console.log(`  After: current = ${comp.state.current}`);
                    console.log('✓ RESET: Progress reset complete');
                } else if (comp.type === 'tier') {
                    console.log(`  Before: current = ${comp.state.current}`);
                    comp.state.current = 0;
                    console.log(`  After: current = ${comp.state.current}`);
                    console.log('✓ RESET: Tier reset complete');
                } else if ((comp.type === 'nest' || comp.type === 'cycle') && comp.state.isCycle) {
                    // Recursively reset nested cycles
                    this.resetAllComponents(comp.state);
                }
            });
            
            if (state.tabComponents && Array.isArray(state.tabComponents)) {
                console.log(`🔄 RESET: Processing ${state.tabComponents.length} tabs`);
                state.tabComponents.forEach((tab, tabIdx) => {
                    console.log(`🔄 RESET: Tab ${tabIdx} has ${tab.length} components`);
                    tab.forEach(comp => {
                        console.log(`🔄 RESET: Processing ${comp.type} in tab ${tabIdx}`);
                        if (comp.type === 'list') {
                            // Reset main completed state
                            comp.state.completed = false;
                            // Reset each item's completed state
                            if (comp.state.items && Array.isArray(comp.state.items)) {
                                comp.state.items.forEach(item => item.completed = false);
                            }
                            console.log('✓ RESET: List in tab reset complete');
                        } else if (comp.type === 'checklist') {
                            // Reset each item's completed state
                            if (comp.state.items && Array.isArray(comp.state.items)) {
                                comp.state.items.forEach(item => item.completed = false);
                            }
                            console.log('✓ RESET: Checklist in tab reset complete');
                        } else if (comp.type === 'radio') {
                            console.log(`  Before: selectedIndex = ${comp.state.selectedIndex}`);
                            comp.state.selectedIndex = null;
                            console.log(`  After: selectedIndex = ${comp.state.selectedIndex}`);
                            console.log('✓ RESET: Radio in tab reset complete');
                        } else if (comp.type === 'threshold') {
                            console.log(`  Before: number1 = ${comp.state.number1}, manuallyChecked = ${comp.state.manuallyChecked}`);
                            // DON'T clear number1 - preserve the current progress value
                            // Only reset the completion tracking
                            comp.state.manuallyChecked = false;
                            // Reset each item's completed state
                            if (comp.state.items && Array.isArray(comp.state.items)) {
                                comp.state.items.forEach(item => item.completed = false);
                            }
                            console.log(`  After: number1 = ${comp.state.number1}, manuallyChecked = ${comp.state.manuallyChecked}`);
                            console.log('✓ RESET: Threshold in tab reset complete');
                        } else if (comp.type === 'accumulation') {
                            console.log(`  Before: value = ${comp.state.value}`);
                            comp.state.value = 0;
                            console.log(`  After: value = ${comp.state.value}`);
                            console.log('✓ RESET: Accumulation in tab reset complete');
                        } else if (comp.type === 'progress') {
                            console.log(`  Before: current = ${comp.state.current}`);
                            comp.state.current = 0;
                            console.log(`  After: current = ${comp.state.current}`);
                            console.log('✓ RESET: Progress in tab reset complete');
                        } else if (comp.type === 'tier') {
                            console.log(`  Before: current = ${comp.state.current}`);
                            comp.state.current = 0;
                            console.log(`  After: current = ${comp.state.current}`);
                            console.log('✓ RESET: Tier in tab reset complete');
                        } else if ((comp.type === 'nest' || comp.type === 'cycle') && comp.state.isCycle) {
                            // Recursively reset nested cycles
                            this.resetAllComponents(comp.state);
                        }
                    });
                });
            }
            console.log('🔄 RESET: resetAllComponents complete');
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
                if (state.hourlyMode === 'topOfHour') {
                    // Next reset is at top of next hour
                    nextReset.setMinutes(0, 0, 0);
                    if (nextReset <= now) nextReset.setHours(nextReset.getHours() + 1);
                } else if (state.hourlyMode === 'topOfNextMinute') {
                    // Next reset is 1 hour after lastReset (which is set to next minute boundary)
                    const lastReset = new Date(state.lastReset);
                    nextReset = new Date(lastReset.getTime() + (60 * 60 * 1000));
                } else if (state.hourlyMode === 'setToNow') {
                    // Next reset preserves seconds from when SET TO NOW was tapped
                    const lastReset = new Date(state.lastReset);
                    nextReset = new Date(lastReset.getTime() + (60 * 60 * 1000));
                }
            } else if (state.resetInterval === 'daily') {
                const [hours, minutes] = state.resetTime.split(':').map(Number);
                nextReset.setHours(hours, minutes, 0, 0);
                if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);
            } else if (state.resetInterval === 'weekly') {
                const daysUntil = (state.resetDay - now.getDay() + 7) % 7;
                nextReset.setDate(now.getDate() + (daysUntil === 0 ? 7 : daysUntil));
                nextReset.setHours(0, 0, 0, 0);
            } else if (state.resetInterval === 'monthly') {
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth();
                
                // Get the last day of current month
                let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                let adjustedResetDay = Math.min(state.resetDay, lastDayOfMonth);
                
                nextReset.setDate(adjustedResetDay);
                nextReset.setHours(0, 0, 0, 0);
                
                // If we've already passed this month's reset day, move to next month
                if (nextReset <= now) {
                    nextReset.setMonth(nextReset.getMonth() + 1);
                    // Recalculate for next month's days
                    lastDayOfMonth = new Date(nextReset.getFullYear(), nextReset.getMonth() + 1, 0).getDate();
                    adjustedResetDay = Math.min(state.resetDay, lastDayOfMonth);
                    nextReset.setDate(adjustedResetDay);
                }
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
            // Don't check for resets in build mode - only in view mode
            
            // Use nest's build renderer with correct signature
            GT50Lib.Nest.renderBuild(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending);
            
            // Replace the icon with cycle icon (⟳ circular arrow)
            const iconSection = container.querySelector('div > div[data-action="open"]');
            if (iconSection) {
                const existingIcon = iconSection.querySelector('div');
                if (existingIcon) {
                    existingIcon.innerHTML = `
                        <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="var(--font-color-3)"/>
                        </svg>
                    `;
                }
            }
        },
        
        // ===== VIEW MODE RENDERER =====
        // Delegates to Nest with correct signature - passes through ALL parameters including swipe actions
        renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions, parentShowsChildProgress, parentChildProgressMode) {
            const didReset = this.checkAndReset(state);
            
            // Pass all parameters through to Nest to enable swipe menu and all features
            GT50Lib.Nest.renderView(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions, parentShowsChildProgress, parentChildProgressMode);
        },
        
        // ===== EDIT WINDOW RENDERER =====
        // Delegates to Nest but ensures tempType is set to 'cycle'
        renderEditWindow: function(container, state, onChange, onClose, onSaveAndClose, onSaveAndOpen) {
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
            
            // Call nest's edit window with correct signature
            GT50Lib.Nest.renderEditWindow(container, state, onChange, onClose, onSaveAndClose, onSaveAndOpen);
        },
        
        // ===== BUILD MODE CONTROL CARD =====
        // Cycle-specific: Shows interval controls and configuration
        renderBuildControlCard: function(container, state, onChange) {
            // Don't check for resets in build mode - only in view mode
            
            const bgColor = state.countdownColor || 'var(--color-5)';
            
            const mainCard = document.createElement('div');
            mainCard.style.cssText = `
                background: ${bgColor};
                border: var(--border-width) solid var(--border-color);
                border-radius: 8px;
                height: var(--card-height);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin-bottom: var(--margin);
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
            
            container.appendChild(mainCard);
            
            // Add interval button event listeners
            mainCard.querySelectorAll('[data-interval]').forEach(btn => {
                const interval = btn.dataset.interval;
                btn.onclick = () => {
                    state.resetInterval = interval;
                    
                    // Reset to defaults for each interval type
                    if (interval === 'hourly') {
                        state.hourlyMode = 'topOfHour';
                        state.hourlyMinute = 0;
                    } else if (interval === 'daily') {
                        state.resetTime = '00:00';
                        state.resetHourDisplay = 12;
                        state.resetPeriod = 'AM';
                    } else if (interval === 'weekly') {
                        state.resetDay = 0; // Sunday
                    } else if (interval === 'monthly') {
                        state.resetDay = 1; // 1st of month
                    } else if (interval === 'custom') {
                        state.customMonths = 0;
                        state.customDays = 0;
                        state.customHours = 0;
                        state.customMinutes = 0;
                    }
                    
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Add custom interval card if selected
            if (state.resetInterval === 'custom') {
                const customCard = document.createElement('div');
                customCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                customCard.innerHTML = `
                    <div style="
                        display: flex;
                        height: 100%;
                    ">
                        <div data-action="reset-custom" style="
                            flex: 1;
                            background: ${bgColor};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 9px;
                            font-weight: 700;
                            color: var(--color-10);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">RESET</div>
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                        ">
                            <div style="
                                flex: 1;
                                background: var(--color-10);
                                border-bottom: var(--border-width) solid var(--border-color);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 7px;
                                font-weight: 700;
                                color: #000000;
                            ">MONTHS</div>
                            <div style="
                                flex: 1;
                                background: var(--bg-4);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <input type="tel" data-custom="months" value="${state.customMonths || 0}" 
                                    pattern="[0-9]*" inputmode="numeric"
                                    style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                            </div>
                        </div>
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                        ">
                            <div style="
                                flex: 1;
                                background: var(--color-10);
                                border-bottom: var(--border-width) solid var(--border-color);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 7px;
                                font-weight: 700;
                                color: #000000;
                            ">DAYS</div>
                            <div style="
                                flex: 1;
                                background: var(--bg-4);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <input type="tel" data-custom="days" value="${state.customDays || 0}" 
                                    pattern="[0-9]*" inputmode="numeric"
                                    style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                            </div>
                        </div>
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                        ">
                            <div style="
                                flex: 1;
                                background: var(--color-10);
                                border-bottom: var(--border-width) solid var(--border-color);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 7px;
                                font-weight: 700;
                                color: #000000;
                            ">HOURS</div>
                            <div style="
                                flex: 1;
                                background: var(--bg-4);
                                border-right: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <input type="tel" data-custom="hours" value="${state.customHours || 0}" 
                                    pattern="[0-9]*" inputmode="numeric"
                                    style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                            </div>
                        </div>
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                        ">
                            <div style="
                                flex: 1;
                                background: var(--color-10);
                                border-bottom: var(--border-width) solid var(--border-color);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 7px;
                                font-weight: 700;
                                color: #000000;
                            ">MINUTES</div>
                            <div style="
                                flex: 1;
                                background: var(--bg-4);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <input type="tel" data-custom="minutes" value="${state.customMinutes || 0}" 
                                    pattern="[0-9]*" inputmode="numeric"
                                    style="width: 100%; background: transparent; border: none; color: var(--color-10); text-align: center; font-size: 12px; font-weight: 700; outline: none; font-family: inherit;">
                            </div>
                        </div>
                    </div>
                `;
                
                container.appendChild(customCard);
                
                // Add reset button handler
                const resetBtn = customCard.querySelector('[data-action="reset-custom"]');
                resetBtn.onclick = () => {
                    state.customMonths = 0;
                    state.customDays = 0;
                    state.customHours = 0;
                    state.customMinutes = 0;
                    onChange();
                };
                resetBtn.onmouseover = () => resetBtn.style.filter = 'brightness(1.1)';
                resetBtn.onmouseout = () => resetBtn.style.filter = 'brightness(1)';
                
                // Add custom input event listeners - use onblur to prevent keyboard closing
                customCard.querySelectorAll('[data-custom]').forEach(input => {
                    const field = input.dataset.custom;
                    
                    // Update value as user types but don't trigger full onChange
                    input.oninput = (e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (field === 'months') state.customMonths = value;
                        else if (field === 'days') state.customDays = value;
                        else if (field === 'hours') state.customHours = value;
                        else if (field === 'minutes') state.customMinutes = value;
                    };
                    
                    // Only trigger onChange when input loses focus
                    input.onblur = () => {
                        onChange();
                    };
                });
            }
            
            // Add time/day/month specific controls based on interval
            if (state.resetInterval === 'hourly') {
                const hourlyCard = document.createElement('div');
                hourlyCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                hourlyCard.innerHTML = `
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
                    ">MODE</div>
                    <div style="
                        flex: 1;
                        display: flex;
                    ">
                        <div data-hourly-mode="topOfHour" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.hourlyMode === 'topOfHour' ? 'var(--color-10)' : bgColor};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 9px;
                            font-weight: 700;
                            color: ${state.hourlyMode === 'topOfHour' ? '#000000' : 'var(--color-10)'};
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">TOP OF HOUR</div>
                        <div data-hourly-mode="setToNow" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.hourlyMode === 'setToNow' ? 'var(--color-10)' : bgColor};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 9px;
                            font-weight: 700;
                            color: ${state.hourlyMode === 'setToNow' ? '#000000' : 'var(--color-10)'};
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SET TO NOW</div>
                        <div data-hourly-mode="topOfNextMinute" style="
                            flex: 1;
                            height: 100%;
                            background: ${state.hourlyMode === 'topOfNextMinute' ? 'var(--color-10)' : bgColor};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 7px;
                            font-weight: 700;
                            color: ${state.hourlyMode === 'topOfNextMinute' ? '#000000' : 'var(--color-10)'};
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">TOP OF NEXT MINUTE</div>
                    </div>
                `;
                
                container.appendChild(hourlyCard);
                
                hourlyCard.querySelectorAll('[data-hourly-mode]').forEach(btn => {
                    btn.onclick = () => {
                        const mode = btn.dataset.hourlyMode;
                        state.hourlyMode = mode;
                        
                        const now = new Date();
                        if (mode === 'topOfHour') {
                            state.hourlyMinute = 0;
                        } else if (mode === 'setToNow') {
                            state.hourlyMinute = now.getMinutes();
                            // Reset the timer countdown to start from now (preserves seconds)
                            state.lastReset = Date.now();
                        } else if (mode === 'topOfNextMinute') {
                            // Calculate next minute boundary
                            const nextMinute = new Date(now);
                            nextMinute.setSeconds(0, 0);
                            nextMinute.setMinutes(nextMinute.getMinutes() + 1);
                            
                            state.hourlyMinute = nextMinute.getMinutes();
                            // Set lastReset to the next minute boundary
                            // This makes countdown show 1h 0m XXs (where XX = seconds until next minute)
                            state.lastReset = nextMinute.getTime();
                        }
                        
                        onChange();
                    };
                    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
                });
            }
            
            if (state.resetInterval === 'daily') {
                // Initialize hour and period from resetTime if needed
                if (state.resetHourDisplay === undefined || state.resetPeriod === undefined) {
                    const [hours] = state.resetTime.split(':').map(Number);
                    state.resetPeriod = hours >= 12 ? 'PM' : 'AM';
                    state.resetHourDisplay = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
                }
                
                const timeCard = document.createElement('div');
                timeCard.style.cssText = `
                    background: ${bgColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                timeCard.innerHTML = `
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
                    ">TIME</div>
                    <div style="
                        flex: 1;
                        display: flex;
                    ">
                        <div data-period="AM" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            max-width: var(--square-section);
                            flex-shrink: 0;
                            height: 100%;
                            background: ${state.resetPeriod === 'AM' ? 'var(--color-10)' : bgColor};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: ${state.resetPeriod === 'AM' ? '#000000' : 'var(--color-10)'};
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">AM</div>
                        <div data-period="PM" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            max-width: var(--square-section);
                            flex-shrink: 0;
                            height: 100%;
                            background: ${state.resetPeriod === 'PM' ? 'var(--color-10)' : bgColor};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: ${state.resetPeriod === 'PM' ? '#000000' : 'var(--color-10)'};
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">PM</div>
                        ${[1,2,3,4,5,6,7,8,9,10,11,12].map((hour, i) => `
                            <div data-hour="${hour}" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.resetHourDisplay === hour ? 'var(--color-10)' : bgColor};
                                ${i < 11 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: ${state.resetHourDisplay === hour ? '#000000' : 'var(--color-10)'};
                                cursor: pointer;
                                transition: filter 0.2s;
                            ">${hour}</div>
                        `).join('')}
                    </div>
                `;
                
                container.appendChild(timeCard);
                
                // Period buttons (AM/PM)
                timeCard.querySelectorAll('[data-period]').forEach(btn => {
                    btn.onclick = () => {
                        state.resetPeriod = btn.dataset.period;
                        // Update resetTime
                        let hour24 = state.resetHourDisplay;
                        if (state.resetPeriod === 'PM' && hour24 !== 12) hour24 += 12;
                        if (state.resetPeriod === 'AM' && hour24 === 12) hour24 = 0;
                        state.resetTime = `${hour24.toString().padStart(2, '0')}:00`;
                        onChange();
                    };
                    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
                });
                
                // Hour buttons (1-12)
                timeCard.querySelectorAll('[data-hour]').forEach(btn => {
                    btn.onclick = () => {
                        state.resetHourDisplay = parseInt(btn.dataset.hour);
                        // Update resetTime
                        let hour24 = state.resetHourDisplay;
                        if (state.resetPeriod === 'PM' && hour24 !== 12) hour24 += 12;
                        if (state.resetPeriod === 'AM' && hour24 === 12) hour24 = 0;
                        state.resetTime = `${hour24.toString().padStart(2, '0')}:00`;
                        onChange();
                    };
                    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
                });
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
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                `;
                
                // Generate first row (1-15)
                const row1 = Array.from({length: 15}, (_, i) => i + 1).map((day, i) => `
                    <div data-day="${day}" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetDay === day ? 'var(--color-10)' : bgColor};
                        ${i < 14 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetDay === day ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">${day}</div>
                `).join('');
                
                // Generate second row (16-31)
                const row2 = Array.from({length: 16}, (_, i) => i + 16).map((day, i) => `
                    <div data-day="${day}" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.resetDay === day ? 'var(--color-10)' : bgColor};
                        ${i < 15 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: ${state.resetDay === day ? '#000000' : 'var(--color-10)'};
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">${day}</div>
                `).join('');
                
                monthCard.innerHTML = `
                    <div style="
                        flex: 1;
                        display: flex;
                        border-bottom: var(--border-width) solid var(--border-color);
                    ">${row1}</div>
                    <div style="
                        flex: 1;
                        display: flex;
                    ">${row2}</div>
                `;
                
                container.appendChild(monthCard);
                
                monthCard.querySelectorAll('[data-day]').forEach(btn => {
                    btn.onclick = () => {
                        state.resetDay = parseInt(btn.dataset.day);
                        onChange();
                    };
                    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
                });
            }
        },
        
        // ===== BUILD MODE COUNTDOWN CARD =====
        // Shows countdown with toggle and color picker in build mode
        renderCountdownCard: function(container, state, onRender) {
            // Don't check for resets in build mode - only in view mode
            
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
            
            // Set up real-time countdown updates (no reset detection in build mode)
            const displayElement = cycleCard.querySelector('[data-countdown-display]');
            if (displayElement) {
                const updateInterval = setInterval(() => {
                    if (!document.contains(displayElement)) {
                        clearInterval(updateInterval);
                        return;
                    }
                    
                    // Just update the countdown display, don't actually reset in build mode
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