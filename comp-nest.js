(function() {
    // ===== NEST COMPONENT (NON-CYCLE) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Nest = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return {
                name: '',
                color: 'GRAY',
                autoSortByLastUpdated: false,
                autoSortDropdownOpen: false,
                tabs: {
                    tabs: [{ name: 'Main', label: 'Main', color: '' }],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                tabComponents: [[]],
                showSummary: true,
                summaryDropdownOpen: false,
                summaryShowChildNestProgress: false,
                summaryShowChildNestProgressDropdownOpen: false,
                summaryChildNestProgressMode: 'first-tab', // 'first-tab' or 'all-tabs' or 'tab-bars'
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
                        ${onMove || onDelete ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
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
                    ${onMove ? `<button data-action="move-up" style="
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
                    </button>` : ''}
                    ${onMove ? `<button data-action="move-down" style="
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
                    </button>` : ''}
                    ${onDelete ? `<button data-action="delete" style="
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
                    </button>` : ''}
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
                    console.log('Nest open button clicked, onNavigate:', onNavigate ? 'provided' : 'null');
                    
                    // Initialize editWindow and color if they don't exist (for old nests)
                    if (!state.editWindow) {
                        state.editWindow = { isOpen: false };
                    }
                    if (!state.color) {
                        state.color = 'GRAY';
                    }
                    
                    // Always navigate directly - no edit window in build mode
                    if (onNavigate) {
                        console.log('Calling onNavigate...');
                        onNavigate();
                    } else {
                        console.log('onNavigate is null - this should not happen in normal build mode!');
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
                    deletePending: false,
                    moreDropdownOpen: false
                };
            }
            
            const isOpen = state.actionState.isOpen;
            const isDeletePending = state.actionState.deletePending;
            const isMoreDropdownOpen = state.actionState.moreDropdownOpen || false;
            
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
                    
                    // Special handling for single tab - show one bar with tab name
                    if (numTabs <= 1) {
                        // Calculate summary for the entire nest (all content)
                        const tabSummary = GT50Lib.Summary.calculateSummary(state, 'all-tabs');
                        const tabColor = (numTabs === 1 && state.tabs.tabs[0].color) ? state.tabs.tabs[0].color : 'var(--color-4)';
                        const tabName = (numTabs === 1) ? (state.tabs.tabs[0].name || state.tabs.tabs[0].label || 'MAIN') : 'MAIN';
                        
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
                    } else {
                        // Multiple tabs - show individual bars (max 6)
                        for (let i = 0; i < Math.min(numTabs, 6); i++) {
                            const tabSummary = GT50Lib.Summary.calculateSummary(state, 'first-tab', i);
                            const tabColor = state.tabs.tabs[i].color || 'var(--color-4)';
                            const tabName = state.tabs.tabs[i].name || state.tabs.tabs[i].label || `Tab ${i + 1}`;
                            
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
                    border-radius: ${showTabBars || isMoreDropdownOpen ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${showTabBars || isMoreDropdownOpen ? '0' : 'var(--margin)'};
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
                            width: var(--square-section);
                            min-width: var(--square-section);
                            max-width: var(--square-section);
                            flex-shrink: 0;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 20px;
                            font-weight: 700;
                            color: var(--color-5);
                        ">▲</div>
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
                        <!-- More Section -->
                        <div data-action="more" style="
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
                            color: var(--color-6);
                        ">More</div>
                        <!-- Move Down Section -->
                        <div data-action="move-down" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            max-width: var(--square-section);
                            flex-shrink: 0;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            font-size: 20px;
                            font-weight: 700;
                            color: var(--color-5);
                        ">▼</div>
                    </div>
                    <!-- Main Content -->
                    <div data-action="navigate" style="
                        flex: 1;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: var(--color-10);
                        transition: opacity 0.2s, filter 0.2s;
                        position: relative;
                        z-index: 1;
                        opacity: ${isOpen ? '0.3' : '1'};
                    ">${displayName}</div>
                </div>
                ${showTabBars || isMoreDropdownOpen ? `
                    <!-- Tab Bars or More Actions Dropdown -->
                    <div style="
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        border-radius: 0 0 8px 8px;
                        margin-top: calc(var(--border-width) * -1);
                        margin-bottom: var(--margin);
                        height: calc(var(--card-height) + 7px);
                        padding: 0 var(--margin);
                        display: flex;
                        align-items: center;
                        gap: var(--margin);
                    ">
                        ${isMoreDropdownOpen ? `
                            <!-- Export Button (replaces tab bars when More is open) -->
                            <div data-action="export" style="
                                flex: 1;
                                height: 22.5px;
                                background: var(--color-3);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                font-size: 9px;
                                font-weight: 700;
                                text-transform: uppercase;
                                color: var(--color-10);
                                transition: filter 0.2s;
                                letter-spacing: 0.5px;
                            ">Export</div>
                        ` : showTabBars ? tabProgressData.map((tab, tabIndex) => `
                            <div class="tab-bar-clickable" data-tab-index="${tabIndex}" style="
                                flex: 1;
                                height: 22.5px;
                                background: var(--bg-1);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                position: relative;
                                overflow: hidden;
                                cursor: pointer;
                                transition: filter 0.2s;
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
                                        font-size: 9px;
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
                        `).join('') : ''}
                    </div>
                ` : ''}
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
            const moreBtn = container.querySelector('[data-action="more"]');
            const exportBtn = container.querySelector('[data-action="export"]');
            
            // Auto-close after 5 seconds - store in state to persist across renders
            const startAutoClose = () => {
                if (state.actionState._autoCloseTimer) {
                    clearTimeout(state.actionState._autoCloseTimer);
                }
                state.actionState._autoCloseTimer = setTimeout(() => {
                    if (state.actionState.isOpen) {
                        state.actionState.isOpen = false;
                        state.actionState.deletePending = false;
                        state.actionState.moreDropdownOpen = false;
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
            
            // Horizontal swipe detection
            let touchStartX = 0;
            let touchStartY = 0;
            let touchCurrentX = 0;
            let touchCurrentY = 0;
            let swipeDetected = false;
            let scrollDetected = false;
            
            const startSwipe = (e) => {
                if (state.actionState.isOpen) return; // Don't start if already open
                
                touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
                touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
                touchCurrentX = touchStartX;
                touchCurrentY = touchStartY;
                swipeDetected = false;
                scrollDetected = false;
            };
            
            const moveSwipe = (e) => {
                if (state.actionState.isOpen) return;
                if (scrollDetected) return;
                
                touchCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
                touchCurrentY = e.touches ? e.touches[0].clientY : e.clientY;
                
                const deltaX = Math.abs(touchCurrentX - touchStartX);
                const deltaY = Math.abs(touchCurrentY - touchStartY);
                
                // Check once we have meaningful movement
                if (deltaX > 5 || deltaY > 5) {
                    // Strict horizontal: vertical movement must be < 30% of horizontal
                    if (deltaY > deltaX * 0.3) {
                        // Too much vertical - this is a scroll
                        scrollDetected = true;
                    } else if (deltaX > 30) {
                        // Enough horizontal, minimal vertical - this is a swipe
                        swipeDetected = true;
                        if (e.preventDefault) e.preventDefault();
                    }
                }
            };
            
            const endSwipe = () => {
                if (scrollDetected) {
                    scrollDetected = false;
                    return;
                }
                
                const deltaX = touchCurrentX - touchStartX;
                const deltaY = Math.abs(touchCurrentY - touchStartY);
                const absDeltaX = Math.abs(deltaX);
                
                const threshold = 50;
                
                // Only trigger if horizontal and minimal vertical
                if (swipeDetected && absDeltaX > threshold && deltaY < absDeltaX * 0.3) {
                    if (closeAllActions) closeAllActions(); // Close all other panels first
                    state.actionState.isOpen = true;
                    if (render) render();
                }
                
                swipeDetected = false;
                scrollDetected = false;
            };
            
            // Attach swipe detection to the card
            card.addEventListener('touchstart', startSwipe, { passive: true });
            card.addEventListener('touchmove', moveSwipe);
            card.addEventListener('touchend', endSwipe);
            card.addEventListener('touchcancel', () => {
                swipeDetected = false;
                scrollDetected = false;
            });
            
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
                        state.actionState.moreDropdownOpen = false;
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
                        state.actionState.moreDropdownOpen = false;
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
                    state.actionState.moreDropdownOpen = false;
                    // Open edit window
                    if (!state.editWindow) {
                        state.editWindow = { isOpen: false };
                    }
                    state.editWindow.isOpen = true;
                    // Close all dropdowns when opening edit window
                    state.autoSortDropdownOpen = false;
                    state.summaryDropdownOpen = false;
                    state.summaryShowChildNestProgressDropdownOpen = false;
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
                    state.actionState.moreDropdownOpen = false;
                    if (render) render();
                };
            }
            
            // More action - toggle dropdown
            if (moreBtn) {
                moreBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    state.actionState.moreDropdownOpen = !state.actionState.moreDropdownOpen;
                    if (render) render();
                    startAutoClose(); // Restart timer after action
                };
            }
            
            // Export action - exports this nest to all available formats
            if (exportBtn) {
                exportBtn.onclick = (e) => {
                    e.stopPropagation();
                    cancelAutoClose();
                    
                    // Generate raw export package for this nest (will be serialized in selected format)
                    const nestName = state.name || 'Nest';
                    const exportPackage = GT50Lib.ImpEx.exportNest(state, nestName);
                    
                    // Set the export override data and open the ImpEx window
                    if (window.state && window.state.impex) {
                        window.state.impex.exportOverrideData = exportPackage; // Raw package, will be serialized on-demand
                        window.state.impex.activeTab = 'export';
                        window.state.impex.header.title = `EXPORT: ${nestName.toUpperCase()}`;
                        GT50Lib.ImpEx.open(window.state.impex, render);
                    }
                    
                    // Close the nest action menu
                    state.actionState.isOpen = false;
                    state.actionState.moreDropdownOpen = false;
                    state.actionState.deletePending = false;
                    
                    if (render) render();
                };
                
                // Hover effects
                exportBtn.onmouseover = () => exportBtn.style.filter = 'brightness(1.2)';
                exportBtn.onmouseout = () => exportBtn.style.filter = 'brightness(1)';
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
                    
                    // Add click handlers to navigate to specific tab
                    const clickableBars = container.querySelectorAll('.tab-bar-clickable');
                    clickableBars.forEach(bar => {
                        const tabIndex = parseInt(bar.dataset.tabIndex);
                        
                        bar.onclick = () => {
                            // Set the active tab before navigating
                            state.tabs.activeViewTab = tabIndex;
                            // Render to persist state change, then navigate
                            if (render) {
                                render();
                                // Use setTimeout to ensure state is saved before navigation
                                setTimeout(() => {
                                    if (onNavigate) onNavigate();
                                }, 0);
                            } else {
                                if (onNavigate) onNavigate();
                            }
                        };
                        
                        // Add hover effect
                        bar.onmouseover = () => bar.style.filter = 'brightness(1.2)';
                        bar.onmouseout = () => bar.style.filter = 'brightness(1)';
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
            
            // Create backup of state on first render (when temp values don't exist)
            if (!state.editWindow._backup) {
                state.editWindow._backup = {
                    name: state.name,
                    color: state.color,
                    autoSortByLastUpdated: state.autoSortByLastUpdated,
                    showSummary: state.showSummary,
                    summaryDisplayMode: state.summaryDisplayMode,
                    summaryShowChildNestProgress: state.summaryShowChildNestProgress,
                    summaryChildNestProgressMode: state.summaryChildNestProgressMode
                };
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
                    ">COLORS</div>
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
                
                <!-- Sorting Divider -->
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
                    ">SORTING</div>
                </div>
                
                <!-- Auto Sort Settings -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? '0' : 'var(--margin)'};
                    overflow: hidden;
                ">
                    <div data-action="toggle-auto-sort" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${state.autoSortByLastUpdated ? 'var(--color-5)' : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: ${state.autoSortByLastUpdated ? 'var(--color-10)' : 'var(--color-5)'};
                        cursor: pointer;
                    ">${state.autoSortByLastUpdated ? '✓' : ''}</div>
                    <div data-action="auto-sort-card-click" style="
                        flex: 1;
                        background: var(--bg-4);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            text-transform: uppercase;
                        ">Auto Sort by Last Updated</div>
                        <div style="
                            font-size: 10px;
                            font-weight: 700;
                            color: var(--color-10);
                            opacity: 0.7;
                            margin-top: 2px;
                            text-align: center;
                            line-height: 1.2;
                        ">Sorts cards by most recently changed</div>
                    </div>
                    <div data-action="toggle-auto-sort-dropdown" style="
                        width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: ${state.autoSortByLastUpdated ? 'pointer' : 'default'};
                        pointer-events: ${state.autoSortByLastUpdated ? 'auto' : 'none'};
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 8px solid var(--color-10);
                            transform: rotate(${state.autoSortDropdownOpen ? '180deg' : '0deg'});
                            opacity: ${state.autoSortByLastUpdated ? '1' : '0.3'};
                        "></div>
                    </div>
                </div>
                ${state.autoSortByLastUpdated && state.autoSortDropdownOpen ? `
                    <div style="
                        background: var(--bg-2);
                        border-radius: 0 0 8px 8px;
                        padding: var(--margin);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        margin-bottom: var(--margin);
                    ">
                        <!-- Placeholder for future sub-settings -->
                        <div style="
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--color-10);
                            font-size: 10px;
                            font-weight: 600;
                            opacity: 0.5;
                        ">No additional settings</div>
                    </div>
                ` : ''}
                
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
                    ">CARD TYPE</div>
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
                    <!-- Parent Nest Summary Divider -->
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
                        ">SUMMARY SETTINGS</div>
                    </div>
                    
                    <!-- Summary Activation Card -->
                    <div style="
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: ${state.showSummary && state.summaryDropdownOpen ? '8px 8px 0 0' : '8px'};
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        margin-bottom: ${state.showSummary && state.summaryDropdownOpen ? '0' : 'var(--margin)'};
                        overflow: hidden;
                    ">
                        <div data-action="toggle-summary" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${state.showSummary ? summaryColor : 'var(--color-10)'};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 700;
                            color: ${state.showSummary ? 'var(--color-10)' : summaryColor};
                            cursor: pointer;
                        ">${state.showSummary ? '✓' : ''}</div>
                        <div data-action="summary-card-click" style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                            ">Activate Summary Card</div>
                            <div style="
                                font-size: 10px;
                                font-weight: 700;
                                color: var(--color-10);
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Shows summary with counts & completion</div>
                        </div>
                        <div data-action="toggle-summary-dropdown" style="
                            width: var(--square-section);
                            height: 100%;
                            background: var(--bg-4);
                            border-left: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: ${state.showSummary ? 'pointer' : 'default'};
                            pointer-events: ${state.showSummary ? 'auto' : 'none'};
                        ">
                            <div style="
                                width: 0;
                                height: 0;
                                border-left: 6px solid transparent;
                                border-right: 6px solid transparent;
                                border-top: 8px solid var(--color-10);
                                transform: rotate(${state.summaryDropdownOpen ? '180deg' : '0deg'});
                                opacity: ${state.showSummary ? '1' : '0.3'};
                            "></div>
                        </div>
                    </div>
                    ${state.showSummary && state.summaryDropdownOpen ? `
                        <div style="
                            background: var(--bg-2);
                            border-radius: 0 0 8px 8px;
                            padding: var(--margin);
                            border: var(--border-width) solid var(--border-color);
                            border-top: none;
                            margin-bottom: var(--margin);
                        ">
                            <!-- Track Child Nest Cards -->
                            <div data-action="toggle-children" style="
                                background: ${state.summaryIncludeChildren ? summaryColor : 'var(--color-10)'};
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                height: var(--card-height);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: var(--margin);
                                cursor: pointer;
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 12px;
                                    font-weight: 700;
                                    color: ${state.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                    text-align: center;
                                ">Track Child Nest Cards</div>
                                <div style="
                                    font-size: 10px;
                                    font-weight: 700;
                                    color: ${state.summaryIncludeChildren ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Includes cards from child nests in the summary count</div>
                            </div>
                            <!-- Display Mode Toggle (None / XX/YY / Percentage) -->
                            <div style="
                                background: var(--color-10);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                height: var(--card-height);
                                display: flex;
                                align-items: center;
                                overflow: hidden;
                            ">
                                <div data-action="set-none-display" style="
                                    flex: 1;
                                    height: 100%;
                                    background: ${state.summaryDisplayMode === null ? summaryColor : 'var(--color-10)'};
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    border-right: var(--border-width) solid var(--border-color);
                                    transition: filter 0.2s;
                                    padding: 4px;
                                ">
                                    <div style="
                                        font-size: 14px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === null ? 'var(--color-10)' : summaryColor};
                                        text-transform: uppercase;
                                    ">None</div>
                                    <div style="
                                        font-size: 10px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === null ? 'var(--color-10)' : summaryColor};
                                        opacity: 0.7;
                                        margin-top: 2px;
                                        text-align: center;
                                        line-height: 1.2;
                                    ">No display format</div>
                                </div>
                                <div data-action="set-value-display" style="
                                    flex: 1;
                                    height: 100%;
                                    background: ${state.summaryDisplayMode === 'value' ? summaryColor : 'var(--color-10)'};
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    border-right: var(--border-width) solid var(--border-color);
                                    transition: filter 0.2s;
                                    padding: 4px;
                                ">
                                    <div style="
                                        font-size: 14px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                                        text-transform: uppercase;
                                    ">XX/YY</div>
                                    <div style="
                                        font-size: 10px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === 'value' ? 'var(--color-10)' : summaryColor};
                                        opacity: 0.7;
                                        margin-top: 2px;
                                        text-align: center;
                                        line-height: 1.2;
                                    ">Completed/total format (e.g., 5/10)</div>
                                </div>
                                <div data-action="set-percentage-display" style="
                                    flex: 1;
                                    height: 100%;
                                    background: ${state.summaryDisplayMode === 'percentage' ? summaryColor : 'var(--color-10)'};
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    transition: filter 0.2s;
                                    padding: 4px;
                                ">
                                    <div style="
                                        font-size: 14px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                                        text-transform: uppercase;
                                    ">%</div>
                                    <div style="
                                        font-size: 10px;
                                        font-weight: 700;
                                        color: ${state.summaryDisplayMode === 'percentage' ? 'var(--color-10)' : summaryColor};
                                        opacity: 0.7;
                                        margin-top: 2px;
                                        text-align: center;
                                        line-height: 1.2;
                                    ">Percentage format (e.g., 50%)</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    <!-- Activate Child Nest Summaries Card -->
                    <div style="
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: ${state.summaryShowChildNestProgress && state.summaryShowChildNestProgressDropdownOpen ? '8px 8px 0 0' : '8px'};
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        margin-bottom: ${state.summaryShowChildNestProgress && state.summaryShowChildNestProgressDropdownOpen ? '0' : 'var(--margin)'};
                        overflow: hidden;
                    ">
                        <div data-action="toggle-child-nest-progress" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${state.summaryShowChildNestProgress ? summaryColor : 'var(--color-10)'};
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 700;
                            color: ${state.summaryShowChildNestProgress ? 'var(--color-10)' : summaryColor};
                            cursor: pointer;
                        ">${state.summaryShowChildNestProgress ? '✓' : ''}</div>
                        <div data-action="child-nest-progress-card-click" style="
                            flex: 1;
                            background: var(--bg-4);
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: var(--color-10);
                                text-transform: uppercase;
                            ">Activate Child Nest Summaries</div>
                            <div style="
                                font-size: 10px;
                                font-weight: 700;
                                color: var(--color-10);
                                opacity: 0.7;
                                margin-top: 2px;
                                text-align: center;
                                line-height: 1.2;
                            ">Show progress on child nest cards</div>
                        </div>
                        <div data-action="toggle-child-nest-progress-dropdown" style="
                            width: var(--square-section);
                            height: 100%;
                            background: var(--bg-4);
                            border-left: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: ${state.summaryShowChildNestProgress ? 'pointer' : 'default'};
                            pointer-events: ${state.summaryShowChildNestProgress ? 'auto' : 'none'};
                        ">
                            <div style="
                                width: 0;
                                height: 0;
                                border-left: 6px solid transparent;
                                border-right: 6px solid transparent;
                                border-top: 8px solid var(--color-10);
                                transform: rotate(${state.summaryShowChildNestProgressDropdownOpen ? '180deg' : '0deg'});
                                opacity: ${state.summaryShowChildNestProgress ? '1' : '0.3'};
                            "></div>
                        </div>
                    </div>
                    ${state.summaryShowChildNestProgress && state.summaryShowChildNestProgressDropdownOpen ? `
                        <div style="
                            background: var(--bg-2);
                            border-radius: 0 0 8px 8px;
                            padding: var(--margin);
                            border: var(--border-width) solid var(--border-color);
                            border-top: none;
                            margin-bottom: var(--margin);
                        ">
                            <!-- Child Nest Progress Mode Card -->
                            <!-- First Tab -->
                            <div data-action="set-first-tab-mode" style="
                                background: ${(!state.summaryChildNestProgressMode || state.summaryChildNestProgressMode === 'first-tab') ? summaryColor : 'var(--color-10)'};
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                height: var(--card-height);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: var(--margin);
                                cursor: pointer;
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 12px;
                                    font-weight: 700;
                                    color: ${(!state.summaryChildNestProgressMode || state.summaryChildNestProgressMode === 'first-tab') ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                    text-align: center;
                                ">First Tab</div>
                                <div style="
                                    font-size: 10px;
                                    font-weight: 700;
                                    color: ${(!state.summaryChildNestProgressMode || state.summaryChildNestProgressMode === 'first-tab') ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Fills child nest card background based on first tab's progress</div>
                            </div>
                            <!-- All Tabs -->
                            <div data-action="set-all-tabs-mode" style="
                                background: ${state.summaryChildNestProgressMode === 'all-tabs' ? summaryColor : 'var(--color-10)'};
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                height: var(--card-height);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: var(--margin);
                                cursor: pointer;
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 12px;
                                    font-weight: 700;
                                    color: ${state.summaryChildNestProgressMode === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                    text-align: center;
                                ">All Tabs</div>
                                <div style="
                                    font-size: 10px;
                                    font-weight: 700;
                                    color: ${state.summaryChildNestProgressMode === 'all-tabs' ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Fills child nest card background based on combined progress of all tabs</div>
                            </div>
                            <!-- Tab Bars -->
                            <div data-action="set-tab-bars-mode" style="
                                background: ${state.summaryChildNestProgressMode === 'tab-bars' ? summaryColor : 'var(--color-10)'};
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                height: var(--card-height);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: filter 0.2s;
                                padding: 4px;
                            ">
                                <div style="
                                    font-size: 12px;
                                    font-weight: 700;
                                    color: ${state.summaryChildNestProgressMode === 'tab-bars' ? 'var(--color-10)' : summaryColor};
                                    text-transform: uppercase;
                                    text-align: center;
                                ">Tab Bars</div>
                                <div style="
                                    font-size: 10px;
                                    font-weight: 700;
                                    color: ${state.summaryChildNestProgressMode === 'tab-bars' ? 'var(--color-10)' : summaryColor};
                                    opacity: 0.7;
                                    margin-top: 2px;
                                    text-align: center;
                                    line-height: 1.2;
                                ">Shows clickable progress bars for each tab - tap to navigate directly to that tab</div>
                            </div>
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
                
                // Summary card click - toggles feature or dropdown based on state
                const summaryCardClick = summaryContainer.querySelector('[data-action="summary-card-click"]');
                if (summaryCardClick) {
                    summaryCardClick.onclick = () => {
                        if (!state.showSummary) {
                            state.showSummary = true;
                        } else {
                            const wasOpen = state.summaryDropdownOpen;
                            // Close all other dropdowns
                            state.autoSortDropdownOpen = false;
                            state.summaryShowChildNestProgressDropdownOpen = false;
                            // Toggle this dropdown
                            state.summaryDropdownOpen = !wasOpen;
                        }
                        onChange();
                    };
                }
                
                // Summary dropdown toggle
                const summaryDropdownBtn = summaryContainer.querySelector('[data-action="toggle-summary-dropdown"]');
                if (summaryDropdownBtn) {
                    summaryDropdownBtn.onclick = (e) => {
                        e.stopPropagation();
                        const wasOpen = state.summaryDropdownOpen;
                        // Close all other dropdowns
                        state.autoSortDropdownOpen = false;
                        state.summaryShowChildNestProgressDropdownOpen = false;
                        // Toggle this dropdown
                        state.summaryDropdownOpen = !wasOpen;
                        onChange();
                    };
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
                
                // None display mode handler
                const noneBtn = summaryContainer.querySelector('[data-action="set-none-display"]');
                if (noneBtn) {
                    noneBtn.onclick = () => {
                        state.summaryDisplayMode = null;
                        onChange();
                    };
                    noneBtn.onmouseover = () => noneBtn.style.filter = 'brightness(1.1)';
                    noneBtn.onmouseout = () => noneBtn.style.filter = 'brightness(1)';
                }
                
                // XX/YY display mode handler
                const valueBtn = summaryContainer.querySelector('[data-action="set-value-display"]');
                if (valueBtn) {
                    valueBtn.onclick = () => {
                        state.summaryDisplayMode = 'value';
                        onChange();
                    };
                    valueBtn.onmouseover = () => valueBtn.style.filter = 'brightness(1.1)';
                    valueBtn.onmouseout = () => valueBtn.style.filter = 'brightness(1)';
                }
                
                // Percentage display mode handler
                const percentageBtn = summaryContainer.querySelector('[data-action="set-percentage-display"]');
                if (percentageBtn) {
                    percentageBtn.onclick = () => {
                        state.summaryDisplayMode = 'percentage';
                        onChange();
                    };
                    percentageBtn.onmouseover = () => percentageBtn.style.filter = 'brightness(1.1)';
                    percentageBtn.onmouseout = () => percentageBtn.style.filter = 'brightness(1)';
                }
                
                // Child nest progress handler
                const childNestProgressBtn = summaryContainer.querySelector('[data-action="toggle-child-nest-progress"]');
                if (childNestProgressBtn) {
                    childNestProgressBtn.onclick = () => {
                        state.summaryShowChildNestProgress = !state.summaryShowChildNestProgress;
                        onChange();
                    };
                    childNestProgressBtn.onmouseover = () => childNestProgressBtn.style.filter = 'brightness(1.1)';
                    childNestProgressBtn.onmouseout = () => childNestProgressBtn.style.filter = 'brightness(1)';
                }
                
                // Child nest progress card click - toggles feature or dropdown based on state
                const childNestProgressCardClick = summaryContainer.querySelector('[data-action="child-nest-progress-card-click"]');
                if (childNestProgressCardClick) {
                    childNestProgressCardClick.onclick = () => {
                        if (!state.summaryShowChildNestProgress) {
                            state.summaryShowChildNestProgress = true;
                        } else {
                            const wasOpen = state.summaryShowChildNestProgressDropdownOpen;
                            // Close all other dropdowns
                            state.autoSortDropdownOpen = false;
                            state.summaryDropdownOpen = false;
                            // Toggle this dropdown
                            state.summaryShowChildNestProgressDropdownOpen = !wasOpen;
                        }
                        onChange();
                    };
                }
                
                // Child nest progress dropdown toggle
                const childNestProgressDropdownBtn = summaryContainer.querySelector('[data-action="toggle-child-nest-progress-dropdown"]');
                if (childNestProgressDropdownBtn) {
                    childNestProgressDropdownBtn.onclick = (e) => {
                        e.stopPropagation();
                        const wasOpen = state.summaryShowChildNestProgressDropdownOpen;
                        // Close all other dropdowns
                        state.autoSortDropdownOpen = false;
                        state.summaryDropdownOpen = false;
                        // Toggle this dropdown
                        state.summaryShowChildNestProgressDropdownOpen = !wasOpen;
                        onChange();
                    };
                }
                
                // Child nest progress mode handlers
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
            
            // Auto sort toggle (checkmark button only)
            const autoSortBtn = contentContainer.querySelector('[data-action="toggle-auto-sort"]');
            if (autoSortBtn) {
                autoSortBtn.onclick = () => {
                    state.autoSortByLastUpdated = !state.autoSortByLastUpdated;
                    onChange();
                };
                autoSortBtn.onmouseover = () => autoSortBtn.style.filter = 'brightness(1.2)';
                autoSortBtn.onmouseout = () => autoSortBtn.style.filter = 'brightness(1)';
            }
            
            // Auto sort card click - toggles feature or dropdown based on state
            const autoSortCardClick = contentContainer.querySelector('[data-action="auto-sort-card-click"]');
            if (autoSortCardClick) {
                autoSortCardClick.onclick = () => {
                    if (!state.autoSortByLastUpdated) {
                        state.autoSortByLastUpdated = true;
                    } else {
                        const wasOpen = state.autoSortDropdownOpen;
                        // Close all other dropdowns
                        state.summaryDropdownOpen = false;
                        state.summaryShowChildNestProgressDropdownOpen = false;
                        // Toggle this dropdown
                        state.autoSortDropdownOpen = !wasOpen;
                    }
                    onChange();
                };
            }
            
            // Auto sort dropdown toggle
            const autoSortDropdownBtn = contentContainer.querySelector('[data-action="toggle-auto-sort-dropdown"]');
            if (autoSortDropdownBtn) {
                autoSortDropdownBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevent triggering the card-click handler
                    const wasOpen = state.autoSortDropdownOpen;
                    // Close all other dropdowns
                    state.summaryDropdownOpen = false;
                    state.summaryShowChildNestProgressDropdownOpen = false;
                    // Toggle this dropdown
                    state.autoSortDropdownOpen = !wasOpen;
                    onChange();
                };
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
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--color-10);
                    cursor: pointer;
                    text-transform: uppercase;
                    font-family: inherit;
                    transition: filter 0.2s;
                    line-height: 1.2;
                ">
                    <div>Cancel</div>
                    <div>and Close</div>
                </button>
                <button data-action="save" style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--color-6)' : 'var(--color-9)'};
                    border: none;
                    border-right: var(--border-width) solid var(--border-color);
                    display: flex;
                    flex-direction: column;
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
                    line-height: 1.2;
                ">
                    <div>Save</div>
                    <div>and Close</div>
                </button>
                <button data-action="save-and-open" style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--color-4)' : 'var(--color-9)'};
                    border: none;
                    display: flex;
                    flex-direction: column;
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
                    line-height: 1.2;
                ">
                    <div>Save</div>
                    <div>and Edit</div>
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
