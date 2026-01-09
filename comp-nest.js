(function() {
    // ===== NEST COMPONENT (NON-CYCLE) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Nest = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return {
                name: '',
                color: 'GRAY',
                tabs: {
                    tabs: [{ name: 'Main', label: 'Main', color: '' }],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                tabComponents: [[]],
                showSummary: true,
                summaryShowChildNestProgress: false, // NEW SETTING
                summaryChildNestProgressMode: 'first-tab', // 'first-tab' or 'all-tabs'
                editWindow: {
                    isOpen: false
                },
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending) {
            // Build mode always uses default nest color
            const bgColor = 'var(--color-5)';
            const iconBg = 'var(--blur)';
            const placeholder = 'Nest';
            
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
                        ">
                            <div style="
                                position: absolute;
                                inset: 6px;
                                border: var(--border-width) solid var(--font-color-3);
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
                        border-right: var(--border-width) solid var(--border-color);
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
                    <button data-action="move-up" style="
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
                    <button data-action="move-down" style="
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
                    <button data-action="delete" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${isDeletePending ? 'var(--color-1)' : 'transparent'};
                        border: none;
                        color: ${isDeletePending ? 'var(--color-10)' : 'var(--color-10)'};
                        cursor: pointer;
                        font-family: inherit;
                        position: relative;
                        font-size: var(--delete-sub-size);
                        font-weight: var(--delete-sub-weight);
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: ${isDeletePending ? 'var(--color-1)' : 'var(--bg-4)'};
                            filter: brightness(0.75);
                            z-index: -1;
                        "></div>×
                    </button>
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            const nameInput = container.querySelector('[data-field="name"]');
            if (nameInput) {
                nameInput.oninput = (e) => {
                    state.name = e.target.value;
                };
            }
            
            const openBtn = container.querySelector('[data-action="open"]');
            if (openBtn) {
                openBtn.onclick = () => {
                    // Initialize editWindow if it doesn't exist (for old nests)
                    if (!state.editWindow) {
                        state.editWindow = { isOpen: false };
                    }
                    if (!state.color) {
                        state.color = 'GRAY';
                    }
                    
                    // Only open edit window at root level (depth === 0)
                    // Inside nested structures, navigate directly
                    if (depth === 0) {
                        // Root level - open edit window
                        state.editWindow.isOpen = true;
                        if (onChange) onChange();
                    } else {
                        // Inside a nest - navigate directly
                        if (onNavigate) onNavigate();
                    }
                };
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
        
        // ===== VIEW MODE RENDERER =====
        renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions, parentShowsChildProgress, parentChildProgressMode) {
            const displayName = state.name || 'Nest';
            
            // Use the nest's stored color for view mode
            const colorMap = {
                'RED': 'var(--color-1)',
                'ORANGE': 'var(--color-2)',
                'YELLOW': 'var(--color-3)',
                'GREEN': 'var(--color-4)',
                'BLUE': 'var(--color-5)',
                'PURPLE': 'var(--color-6)',
                'PINK': 'var(--color-7)',
                'GRAY': 'var(--color-9)'
            };
            const nestColor = colorMap[state.color] || 'var(--color-9)';
            
            // Initialize actionState if it doesn't exist
            if (!state.actionState) {
                state.actionState = {
                    isOpen: false,
                    deletePending: false
                };
            }
            
            const isOpen = state.actionState.isOpen;
            const isDeletePending = state.actionState.deletePending;
            
            // Calculate progress for child nest fill (if enabled by parent)
            let showProgressFill = false;
            let showTabBars = false;
            let progressPercentage = 0;
            let progressColor = 'var(--color-4)';
            let tabProgressData = [];
            
            if (parentShowsChildProgress && depth > 0 && GT50Lib.Summary) {
                // Use parent's mode setting, not our own
                const mode = parentChildProgressMode || 'first-tab';
                
                if (mode === 'tab-bars') {
                    // Show individual tab bars instead of progress fill
                    showTabBars = true;
                    
                    // Calculate progress for each tab
                    const numTabs = state.tabs.tabs.length;
                    
                    // Special handling for single tab - show one "MAIN" bar
                    if (numTabs <= 1) {
                        // Calculate summary for the entire nest (all content)
                        const tabSummary = GT50Lib.Summary.calculateSummary(state, 'all-tabs');
                        const tabColor = (numTabs === 1 && state.tabs.tabs[0].color) ? state.tabs.tabs[0].color : 'var(--color-4)';
                        
                        let barColor = tabColor;
                        if (tabSummary.totalCards > 0) {
                            const difference = Math.abs(tabSummary.completedValue - tabSummary.totalCards);
                            const isComplete = difference < 0.001;
                            if (isComplete) {
                                barColor = '#d4af37';
                            }
                        }
                        
                        tabProgressData.push({
                            name: 'MAIN',
                            percentage: tabSummary.percentage,
                            color: barColor
                        });
                    } else {
                        // Multiple tabs - show individual bars (max 6)
                        for (let i = 0; i < Math.min(numTabs, 6); i++) {
                            const tabSummary = GT50Lib.Summary.calculateSummary(state, 'first-tab', i);
                            const tabColor = state.tabs.tabs[i].color || 'var(--color-4)';
                            const tabName = state.tabs.tabs[i].label || state.tabs.tabs[i].name || `Tab ${i + 1}`;
                            
                            let barColor = tabColor;
                            if (tabSummary.totalCards > 0) {
                                const difference = Math.abs(tabSummary.completedValue - tabSummary.totalCards);
                                const isComplete = difference < 0.001;
                                if (isComplete) {
                                    barColor = '#d4af37';
                                }
                            }
                            
                            tabProgressData.push({
                                name: tabName,
                                percentage: tabSummary.percentage,
                                color: barColor
                            });
                        }
                    }
                } else {
                    // Show progress fill (first-tab or all-tabs mode)
                    const summary = GT50Lib.Summary.calculateSummary(state, mode);
                    if (summary.totalCards > 0) {
                        showProgressFill = true;
                        progressPercentage = summary.percentage;
                        
                        // Check if 100% complete
                        const difference = Math.abs(summary.completedValue - summary.totalCards);
                        const isComplete = difference < 0.001;
                        progressColor = isComplete ? '#d4af37' : 'var(--color-4)';
                    }
                }
            }
            
            container.innerHTML = `
                ${showTabBars ? `
                <style>
                    /* Tab bar label scrolling animation */
                    @keyframes ticker-scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-33.333%);
                        }
                    }
                    
                    .tab-bar-label-text.scroll {
                        animation: ticker-scroll 12s linear 2s infinite;
                        white-space: nowrap;
                        display: inline-block;
                    }
                    
                    .tab-bar-label-text.scroll::before,
                    .tab-bar-label-text.scroll::after {
                        content: attr(data-text);
                        padding-right: 20px;
                    }
                    
                    .tab-bar-label-text.scroll::before {
                        padding-left: 0px;
                    }
                </style>
                ` : ''}
                <div class="nest-view-card" style="
                    background: ${nestColor};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    ${showTabBars ? 'flex-direction: column;' : 'align-items: center;'}
                    overflow: ${showTabBars ? 'visible' : 'hidden'};
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <!-- Progress Fill Layer (for child nests when parent enables it) -->
                    ${showProgressFill ? `
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: ${Math.min(100, progressPercentage)}%;
                            background: ${progressColor};
                            pointer-events: none;
                            z-index: 0;
                        "></div>
                    ` : ''}
                    
                    <!-- Action Sections Overlay -->
                    <div class="action-sections" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 100%;
                        display: ${isOpen ? 'flex' : 'none'};
                        z-index: 2;
                        background: var(--color-10);
                    ">
                        <!-- Move Up Section -->
                        <div data-action="move-up" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 700;
                            text-transform: uppercase;
                            color: var(--color-5);
                            line-height: 1.2;
                        ">
                            <div>Move</div>
                            <div>Up</div>
                        </div>
                        
                        <!-- Edit Section -->
                        <div data-action="edit" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 700;
                            text-transform: uppercase;
                            color: var(--color-4);
                        ">Edit</div>
                        
                        <!-- Cancel Section -->
                        <div data-action="close" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 700;
                            text-transform: uppercase;
                            color: var(--color-9);
                        ">Cancel</div>
                        
                        <!-- Delete Section -->
                        <div data-action="delete" style="
                            flex: 1;
                            height: 100%;
                            background: ${isDeletePending ? 'var(--color-1)' : 'var(--color-10)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 700;
                            text-transform: uppercase;
                            color: ${isDeletePending ? 'var(--color-10)' : 'var(--color-1)'};
                        ">Delete</div>
                        
                        <!-- Move Down Section -->
                        <div data-action="move-down" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 700;
                            text-transform: uppercase;
                            color: var(--color-5);
                            line-height: 1.2;
                        ">
                            <div>Move</div>
                            <div>Down</div>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div data-action="navigate" style="
                        ${showTabBars ? 'flex: 1;' : 'flex: 1; height: 100%;'}
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: ${showTabBars ? '11px' : '16px'};
                        font-weight: 600;
                        color: var(--color-10);
                        transition: opacity 0.2s, filter 0.2s;
                        position: relative;
                        z-index: 1;
                        opacity: ${isOpen ? '0.3' : '1'};
                    ">${displayName}</div>
                    
                    ${showTabBars ? `
                        <!-- Tab Progress Bars -->
                        <div style="
                            height: 22px;
                            display: flex;
                            gap: var(--margin);
                            padding: 0 var(--margin) var(--margin) var(--margin);
                        ">
                            ${tabProgressData.map(tab => `
                                <div style="
                                    flex: 1;
                                    background: var(--bg-1);
                                    border: var(--border-width) solid var(--border-color);
                                    border-radius: 4px;
                                    position: relative;
                                    overflow: hidden;
                                ">
                                    <div style="
                                        background: var(--bg-1);
                                        height: 100%;
                                        position: relative;
                                    ">
                                        <div style="
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            height: 100%;
                                            width: ${Math.min(100, tab.percentage)}%;
                                            background: ${tab.color};
                                            transition: width 0.3s ease;
                                        "></div>
                                        <div class="tab-bar-label" style="
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 8px;
                                            font-weight: 700;
                                            color: var(--color-10);
                                            text-transform: uppercase;
                                            letter-spacing: 0.5px;
                                            z-index: 1;
                                            overflow: hidden;
                                            white-space: nowrap;
                                        ">
                                            <span class="tab-bar-label-text" data-text="${tab.name}" style="white-space: nowrap;">${tab.name}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            const card = container.querySelector('.nest-view-card');
            const actionOverlay = container.querySelector('.action-sections');
            const navigateBtn = container.querySelector('[data-action="navigate"]');
            const editBtn = container.querySelector('[data-action="edit"]');
            const moveUpBtn = container.querySelector('[data-action="move-up"]');
            const moveDownBtn = container.querySelector('[data-action="move-down"]');
            const deleteBtn = container.querySelector('[data-action="delete"]');
            const closeBtn = container.querySelector('[data-action="close"]');
            
            let longPressTimer = null;
            
            // Auto-close after 5 seconds - store in state to persist across renders
            const startAutoClose = () => {
                if (state.actionState._autoCloseTimer) {
                    clearTimeout(state.actionState._autoCloseTimer);
                }
                state.actionState._autoCloseTimer = setTimeout(() => {
                    if (state.actionState.isOpen) {
                        state.actionState.isOpen = false;
                        state.actionState.deletePending = false;
                        if (render) render();
                    }
                }, 5000);
            };
            
            const cancelAutoClose = () => {
                if (state.actionState._autoCloseTimer) {
                    clearTimeout(state.actionState._autoCloseTimer);
                    state.actionState._autoCloseTimer = null;
                }
            };
            
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
            
            // Click on overlay background (outside action buttons) closes overlay
            if (actionOverlay && isOpen) {
                // Start auto-close timer when overlay is open
                startAutoClose();
                
                // Remove any existing listener first
                if (state.actionState._outsideClickListener) {
                    document.removeEventListener('click', state.actionState._outsideClickListener);
                }
                
                // Create and store the listener
                const closeOnClickOutside = (e) => {
                    const currentCard = container.querySelector('.nest-view-card');
                    if (currentCard && !currentCard.contains(e.target)) {
                        state.actionState.isOpen = false;
                        state.actionState.deletePending = false;
                        cancelAutoClose();
                        document.removeEventListener('click', closeOnClickOutside);
                        state.actionState._outsideClickListener = null;
                        if (render) render();
                    }
                };
                
                state.actionState._outsideClickListener = closeOnClickOutside;
                
                // Use setTimeout to avoid immediate trigger from the long press
                setTimeout(() => {
                    document.addEventListener('click', closeOnClickOutside);
                }, 100);
            } else if (state.actionState._outsideClickListener) {
                // Clean up listener if overlay is closed
                document.removeEventListener('click', state.actionState._outsideClickListener);
                state.actionState._outsideClickListener = null;
            }
            
            // Navigate action - also closes overlay if open when clicking dimmed area
            if (navigateBtn && onNavigate) {
                navigateBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (state.actionState.isOpen) {
                        // If overlay is open, clicking the dimmed card name closes it
                        state.actionState.isOpen = false;
                        state.actionState.deletePending = false;
                        cancelAutoClose();
                        if (render) render();
                    } else {
                        // If overlay is closed, navigate normally
                        onNavigate();
                    }
                };
            }
            
            // Edit action
            if (editBtn) {
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    state.actionState.isOpen = false;
                    state.actionState.deletePending = false;
                    // Open edit window
                    if (!state.editWindow) {
                        state.editWindow = { isOpen: false };
                    }
                    state.editWindow.isOpen = true;
                    if (render) render();
                };
            }
            
            // Move actions
            if (moveUpBtn && onMove) {
                moveUpBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    onMove(-1);
                    startAutoClose(); // Restart timer after action
                };
            }
            
            if (moveDownBtn && onMove) {
                moveDownBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    onMove(1);
                    startAutoClose(); // Restart timer after action
                };
            }
            
            // Delete action
            if (deleteBtn && onDelete) {
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    if (!state.actionState.deletePending) {
                        state.actionState.deletePending = true;
                        if (render) render();
                        // Don't call startAutoClose here - render() will do it
                    } else {
                        // Delete is pending and user tapped again - execute delete
                        cancelAutoClose();
                        onDelete();
                    }
                };
            }
            
            // Close actions (Cancel button)
            if (closeBtn) {
                closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    state.actionState.isOpen = false;
                    state.actionState.deletePending = false;
                    if (render) render();
                };
            }
            
            // Add scroll animation for long tab names in tab bars mode
            if (showTabBars) {
                // Use setTimeout to ensure DOM is ready
                setTimeout(() => {
                    const labels = container.querySelectorAll('.tab-bar-label-text');
                    labels.forEach(label => {
                        const parent = label.closest('.tab-bar-label');
                        if (!parent) return;
                        
                        // Measure if text overflows
                        const textWidth = label.scrollWidth;
                        const containerWidth = parent.offsetWidth;
                        
                        if (textWidth > containerWidth) {
                            label.classList.add('scroll');
                            // Override centering for scrolling parent
                            parent.style.justifyContent = 'flex-start';
                        }
                    });
                }, 0);
            }
        },
        
        // ===== EDIT WINDOW RENDERER =====
        renderEditWindow: function(container, state, onChange, onClose, onSaveAndClose, onSaveAndOpen) {
            if (!state.editWindow || !state.editWindow.isOpen) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            
            // Initialize temporary edit values if not already present
            if (!state.editWindow.tempName) {
                state.editWindow.tempName = state.name || '';
            }
            if (state.editWindow.tempColorIndex === undefined) {
                const colorIndex = GT50Lib.CreateNew.colors.findIndex(c => c.name === (state.color || 'GRAY'));
                state.editWindow.tempColorIndex = colorIndex >= 0 ? colorIndex : 7; // Default to GRAY (index 7)
            }
            if (state.editWindow.tempType === undefined) {
                // Determine current type - default to 'nest'
                state.editWindow.tempType = 'nest';
            }
            
            // Track if we should animate the color selection
            const shouldAnimateColor = state.editWindow._animateColorIndex !== undefined;
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-2);
                z-index: 2000;
                display: flex;
                flex-direction: column;
            `;
            
            // Create containers
            container.innerHTML = `
                <div id="nest-edit-header" style="
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                        text-transform: uppercase;
                    ">EDIT NEST</div>
                </div>
                <div id="nest-edit-content" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--margin);
                    padding-bottom: calc(var(--card-height) + var(--margin));
                "></div>
                <div id="nest-edit-footer"></div>
            `;
            
            // Render content
            const contentContainer = container.querySelector('#nest-edit-content');
            contentContainer.innerHTML = `
                <style>
                    /* ========================================
                       COLOR SELECTION ANIMATION - DO NOT REMOVE
                       This provides the pulse shrink-grow effect
                       when selecting colors in the edit window
                       ======================================== */
                    @keyframes color-select-animation {
                        0% { width: 16px; height: 16px; }
                        25% { width: 10px; height: 10px; }
                        35% { width: 4px; height: 4px; }
                        100% { width: 200px; height: 200px; }
                    }
                    
                    .color-circle-animated {
                        animation: color-select-animation 0.5s ease-out forwards;
                    }
                </style>
                
                <!-- Entry Name Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">ENTRY NAME</div>
                </div>
                
                <input 
                    data-field="name"
                    type="text" 
                    value="${state.editWindow.tempName}" 
                    placeholder="Nest Name"
                    style="
                        width: 100%;
                        background: var(--bg-4);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        padding: 0 var(--text-padding-left);
                        font-size: 16px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        outline: none;
                        font-family: inherit;
                        margin-bottom: var(--margin);
                    ">
                
                <!-- Color Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">COLOR</div>
                </div>
                
                <!-- Color Selector -->
                <div style="
                    background: var(--color-10);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    ${GT50Lib.CreateNew.colors.map((color, index) => `
                        <div data-action="select-color" data-color-index="${index}" style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            position: relative;
                            overflow: hidden;
                            ${index < GT50Lib.CreateNew.colors.length - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        ">
                            <div class="${shouldAnimateColor && state.editWindow._animateColorIndex === index ? 'color-circle-animated' : ''}" style="
                                width: ${state.editWindow.tempColorIndex === index ? '200px' : '16px'};
                                height: ${state.editWindow.tempColorIndex === index ? '200px' : '16px'};
                                background: ${color.value};
                                border-radius: 50%;
                                position: absolute;
                            "></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Summary Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">SUMMARY</div>
                </div>
                
                <div id="summary-controls"></div>
                
                <!-- Change Card Type Divider -->
                <div class="divider" style="
                    height: var(--card-height);
                    background: transparent;
                    border: var(--border-width) solid rgba(0, 0, 0, 0.0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--margin);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: calc(var(--border-width) * -1);
                        right: calc(var(--border-width) * -1);
                        height: var(--border-width);
                        background: var(--border-color);
                        transform: translateY(-50%);
                        z-index: 1;
                    "></div>
                    <div style="
                        background: var(--bg-2);
                        padding: 0 12px;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--font-color-3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        position: relative;
                        z-index: 2;
                    ">CHANGE CARD TYPE</div>
                </div>
                
                <!-- Card Type Toggle -->
                <div style="
                    background: var(--color-10);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    <div data-action="set-nest" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.editWindow.tempType === 'nest' ? 'var(--color-5)' : 'var(--color-10)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.editWindow.tempType === 'nest' ? 'var(--color-10)' : 'var(--color-5)'};
                        cursor: pointer;
                        text-transform: uppercase;
                        border-right: var(--border-width) solid var(--border-color);
                        transition: filter 0.2s;
                    ">Nest</div>
                    <div data-action="set-cycle" style="
                        flex: 1;
                        height: 100%;
                        background: ${state.editWindow.tempType === 'cycle' ? 'var(--color-5-2)' : 'var(--color-10)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.editWindow.tempType === 'cycle' ? 'var(--color-10)' : 'var(--color-5-2)'};
                        cursor: pointer;
                        text-transform: uppercase;
                        transition: filter 0.2s;
                    ">Cycle</div>
                </div>
            `;
            
            // Name input handler
            const nameInput = contentContainer.querySelector('[data-field="name"]');
            if (nameInput) {
                nameInput.oninput = (e) => {
                    state.editWindow.tempName = e.target.value;
                };
            }
            
            // Color selection handlers
            const colorButtons = contentContainer.querySelectorAll('[data-action="select-color"]');
            colorButtons.forEach(btn => {
                const colorIndex = parseInt(btn.dataset.colorIndex);
                btn.onclick = () => {
                    // Only animate if changing to a different color
                    if (state.editWindow.tempColorIndex !== colorIndex) {
                        state.editWindow._animateColorIndex = colorIndex;
                        state.editWindow.tempColorIndex = colorIndex;
                        onChange();
                        
                        // Clear animation flag after animation completes
                        setTimeout(() => {
                            delete state.editWindow._animateColorIndex;
                        }, 500);
                    }
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Render summary controls
            const summaryContainer = contentContainer.querySelector('#summary-controls');
            if (summaryContainer) {
                const summaryColor = 'var(--color-6)';
                
                // Initialize display mode if not set - default to null (none selected)
                if (state.summaryDisplayMode === undefined) {
                    state.summaryDisplayMode = null;
                }
                
                // Initialize new setting if not set
                if (state.summaryShowChildNestProgress === undefined) {
                    state.summaryShowChildNestProgress = false;
                }
                
                // Initialize mode if not set
                if (state.summaryChildNestProgressMode === undefined) {
                    state.summaryChildNestProgressMode = 'first-tab';
                }
                
                summaryContainer.innerHTML = `
                    <!-- Summary Activation Card -->
                    <div data-action="toggle-summary" style="
                        background: ${state.showSummary ? summaryColor : 'var(--color-10)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: var(--margin);
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.showSummary ? 'var(--color-10)' : summaryColor};
                        text-transform: uppercase;
                        transition: filter 0.2s;
                    ">Activate Summary Card</div>
                    
                    ${state.showSummary ? `
                        <!-- Summary Options Card (only visible when summary is active) -->
                        <div style="
                            background: var(--color-10);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                            margin-bottom: var(--margin);
                        ">
                            <!-- Track Child Nest Cards -->
                            <div data-action="toggle-children" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryIncludeChildren ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 11px;
                                font-weight: 700;
                                color: ${state.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                cursor: pointer;
                                border-right: var(--border-width) solid var(--border-color);
                                transition: filter 0.2s;
                            ">Track Child Nest Cards</div>
                            
                            <!-- XX/YY Display -->
                            <div data-action="set-value-display" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryDisplayMode === 'value' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 11px;
                                font-weight: 700;
                                color: ${state.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                border-right: var(--border-width) solid var(--border-color);
                                cursor: pointer;
                                transition: filter 0.2s;
                            ">XX/YY</div>
                            
                            <!-- Percentage Display -->
                            <div data-action="set-percentage-display" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryDisplayMode === 'percentage' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 11px;
                                font-weight: 700;
                                color: ${state.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                cursor: pointer;
                                transition: filter 0.2s;
                            ">Percentage</div>
                        </div>
                    ` : ''}
                    
                    <!-- Activate Child Nest Summaries Card (Independent) -->
                    <div data-action="toggle-child-nest-progress" style="
                        background: ${state.summaryShowChildNestProgress ? summaryColor : 'var(--color-10)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: var(--margin);
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.summaryShowChildNestProgress ? 'var(--color-10)' : summaryColor};
                        text-transform: uppercase;
                        transition: filter 0.2s;
                    ">Activate Child Nest Summaries</div>
                    
                    ${state.summaryShowChildNestProgress ? `
                        <!-- Child Nest Progress Mode Card -->
                        <div style="
                            background: var(--color-10);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                            margin-bottom: var(--margin);
                        ">
                            <!-- First Tab Only -->
                            <div data-action="set-first-tab-mode" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryChildNestProgressMode === 'first-tab' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: ${state.summaryChildNestProgressMode === 'first-tab' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                cursor: pointer;
                                border-right: var(--border-width) solid var(--border-color);
                                transition: filter 0.2s;
                            ">First Tab</div>
                            
                            <!-- All Tabs -->
                            <div data-action="set-all-tabs-mode" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryChildNestProgressMode === 'all-tabs' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: ${state.summaryChildNestProgressMode === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                cursor: pointer;
                                border-right: var(--border-width) solid var(--border-color);
                                transition: filter 0.2s;
                            ">All Tabs</div>
                            
                            <!-- Tab Bars -->
                            <div data-action="set-tab-bars-mode" style="
                                flex: 1;
                                height: 100%;
                                background: ${state.summaryChildNestProgressMode === 'tab-bars' ? summaryColor : 'var(--color-10)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: ${state.summaryChildNestProgressMode === 'tab-bars' ? 'var(--color-10)' : summaryColor};
                                text-transform: uppercase;
                                cursor: pointer;
                                transition: filter 0.2s;
                            ">Tab Bars</div>
                        </div>
                    ` : ''}
                `;
                
                // Summary activation handler
                const summaryBtn = summaryContainer.querySelector('[data-action="toggle-summary"]');
                if (summaryBtn) {
                    summaryBtn.onclick = () => {
                        state.showSummary = !state.showSummary;
                        onChange();
                    };
                    summaryBtn.onmouseover = () => summaryBtn.style.filter = 'brightness(1.1)';
                    summaryBtn.onmouseout = () => summaryBtn.style.filter = 'brightness(1)';
                }
                
                // Child tracking handler
                const childrenBtn = summaryContainer.querySelector('[data-action="toggle-children"]');
                if (childrenBtn) {
                    childrenBtn.onclick = () => {
                        state.summaryIncludeChildren = !state.summaryIncludeChildren;
                        onChange();
                    };
                    childrenBtn.onmouseover = () => childrenBtn.style.filter = 'brightness(1.1)';
                    childrenBtn.onmouseout = () => childrenBtn.style.filter = 'brightness(1)';
                }
                
                // XX/YY display mode handler
                const valueBtn = summaryContainer.querySelector('[data-action="set-value-display"]');
                if (valueBtn) {
                    valueBtn.onclick = () => {
                        // Toggle: if already selected, deselect; otherwise select
                        state.summaryDisplayMode = state.summaryDisplayMode === 'value' ? null : 'value';
                        onChange();
                    };
                    valueBtn.onmouseover = () => valueBtn.style.filter = 'brightness(1.1)';
                    valueBtn.onmouseout = () => valueBtn.style.filter = 'brightness(1)';
                }
                
                // Percentage display mode handler
                const percentageBtn = summaryContainer.querySelector('[data-action="set-percentage-display"]');
                if (percentageBtn) {
                    percentageBtn.onclick = () => {
                        // Toggle: if already selected, deselect; otherwise select
                        state.summaryDisplayMode = state.summaryDisplayMode === 'percentage' ? null : 'percentage';
                        onChange();
                    };
                    percentageBtn.onmouseover = () => percentageBtn.style.filter = 'brightness(1.1)';
                    percentageBtn.onmouseout = () => percentageBtn.style.filter = 'brightness(1)';
                }
                
                // NEW: Child nest progress handler
                const childNestProgressBtn = summaryContainer.querySelector('[data-action="toggle-child-nest-progress"]');
                if (childNestProgressBtn) {
                    childNestProgressBtn.onclick = () => {
                        state.summaryShowChildNestProgress = !state.summaryShowChildNestProgress;
                        onChange();
                    };
                    childNestProgressBtn.onmouseover = () => childNestProgressBtn.style.filter = 'brightness(1.1)';
                    childNestProgressBtn.onmouseout = () => childNestProgressBtn.style.filter = 'brightness(1)';
                }
                
                // NEW: Child nest progress mode handlers
                const firstTabModeBtn = summaryContainer.querySelector('[data-action="set-first-tab-mode"]');
                if (firstTabModeBtn) {
                    firstTabModeBtn.onclick = () => {
                        state.summaryChildNestProgressMode = 'first-tab';
                        onChange();
                    };
                    firstTabModeBtn.onmouseover = () => firstTabModeBtn.style.filter = 'brightness(1.1)';
                    firstTabModeBtn.onmouseout = () => firstTabModeBtn.style.filter = 'brightness(1)';
                }
                
                const allTabsModeBtn = summaryContainer.querySelector('[data-action="set-all-tabs-mode"]');
                if (allTabsModeBtn) {
                    allTabsModeBtn.onclick = () => {
                        state.summaryChildNestProgressMode = 'all-tabs';
                        onChange();
                    };
                    allTabsModeBtn.onmouseover = () => allTabsModeBtn.style.filter = 'brightness(1.1)';
                    allTabsModeBtn.onmouseout = () => allTabsModeBtn.style.filter = 'brightness(1)';
                }
                
                const tabBarsModeBtn = summaryContainer.querySelector('[data-action="set-tab-bars-mode"]');
                if (tabBarsModeBtn) {
                    tabBarsModeBtn.onclick = () => {
                        state.summaryChildNestProgressMode = 'tab-bars';
                        onChange();
                    };
                    tabBarsModeBtn.onmouseover = () => tabBarsModeBtn.style.filter = 'brightness(1.1)';
                    tabBarsModeBtn.onmouseout = () => tabBarsModeBtn.style.filter = 'brightness(1)';
                }
            }
            
            // Card type toggle handlers
            const nestBtn = contentContainer.querySelector('[data-action="set-nest"]');
            if (nestBtn) {
                nestBtn.onclick = () => {
                    state.editWindow.tempType = 'nest';
                    onChange();
                };
                nestBtn.onmouseover = () => nestBtn.style.filter = 'brightness(1.2)';
                nestBtn.onmouseout = () => nestBtn.style.filter = 'brightness(1)';
            }
            
            const cycleBtn = contentContainer.querySelector('[data-action="set-cycle"]');
            if (cycleBtn) {
                cycleBtn.onclick = () => {
                    state.editWindow.tempType = 'cycle';
                    onChange();
                };
                cycleBtn.onmouseover = () => cycleBtn.style.filter = 'brightness(1.2)';
                cycleBtn.onmouseout = () => cycleBtn.style.filter = 'brightness(1)';
            }
            
            // Render footer
            const footerContainer = container.querySelector('#nest-edit-footer');
            const canSave = state.editWindow.tempName && state.editWindow.tempName.trim() !== '';
            
            footerContainer.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: var(--card-height);
                background: var(--bg-3);
                border-top: var(--border-width) solid var(--border-color);
                display: flex;
                align-items: center;
                z-index: 1000;
            `;
            
            footerContainer.innerHTML = `
                <button data-action="cancel" style="
                    flex: 1;
                    height: 100%;
                    background: var(--color-1);
                    border: none;
                    border-right: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--color-10);
                    cursor: pointer;
                    text-transform: uppercase;
                    font-family: inherit;
                    transition: filter 0.2s;
                ">Cancel</button>
                <button data-action="save" style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--color-4)' : 'var(--color-9)'};
                    border: none;
                    border-right: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--color-10);
                    cursor: ${canSave ? 'pointer' : 'not-allowed'};
                    text-transform: uppercase;
                    font-family: inherit;
                    transition: filter 0.2s;
                    opacity: ${canSave ? '1' : '0.5'};
                ">Save</button>
                <button data-action="save-and-open" style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--color-4)' : 'var(--color-9)'};
                    border: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--color-10);
                    cursor: ${canSave ? 'pointer' : 'not-allowed'};
                    text-transform: uppercase;
                    font-family: inherit;
                    transition: filter 0.2s;
                    opacity: ${canSave ? '1' : '0.5'};
                    line-height: 1.2;
                ">
                    <div>Save</div>
                    <div>and Open</div>
                </button>
            `;
            
            // Footer handlers
            const cancelBtn = footerContainer.querySelector('[data-action="cancel"]');
            if (cancelBtn && onClose) {
                cancelBtn.onclick = onClose;
                cancelBtn.onmouseover = () => cancelBtn.style.filter = 'brightness(1.1)';
                cancelBtn.onmouseout = () => cancelBtn.style.filter = 'brightness(1)';
            }
            
            const saveBtn = footerContainer.querySelector('[data-action="save"]');
            if (saveBtn && onSaveAndClose && canSave) {
                saveBtn.onclick = onSaveAndClose;
                saveBtn.onmouseover = () => saveBtn.style.filter = 'brightness(1.1)';
                saveBtn.onmouseout = () => saveBtn.style.filter = 'brightness(1)';
            }
            
            const saveAndOpenBtn = footerContainer.querySelector('[data-action="save-and-open"]');
            if (saveAndOpenBtn && onSaveAndOpen && canSave) {
                saveAndOpenBtn.onclick = onSaveAndOpen;
                saveAndOpenBtn.onmouseover = () => saveAndOpenBtn.style.filter = 'brightness(1.1)';
                saveAndOpenBtn.onmouseout = () => saveAndOpenBtn.style.filter = 'brightness(1)';
            }
        }
    };
})();
