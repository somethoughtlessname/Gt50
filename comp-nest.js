(function() {
    // ===== NEST COMPONENT (NON-CYCLE) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Nest = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                name: '', 
                components: [],
                color: 'GRAY',  // Default color
                editWindow: {
                    isOpen: false
                }
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
        renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions) {
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
            
            container.innerHTML = `
                <div class="nest-view-card" style="
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
                        background: ${nestColor};
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
            const card = container.querySelector('.nest-view-card');
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
            
            // Navigate action
            if (navigateBtn && onNavigate) {
                navigateBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (!state.actionState.isOpen) {
                        onNavigate();
                    }
                };
            }
            
            // Edit action
if (editBtn) {
    editBtn.onclick = (e) => {
        e.stopPropagation();
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
                    onMove(-1);
                };
            }
            
            if (moveDownBtn && onMove) {
                moveDownBtn.onclick = (e) => {
                    e.stopPropagation();
                    onMove(1);
                };
            }
            
            // Delete action
            if (deleteBtn && onDelete) {
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (!state.actionState.deletePending) {
                        state.actionState.deletePending = true;
                        if (render) render();
                    } else {
                        onDelete();
                    }
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
        },
        
        // ===== EDIT WINDOW RENDERER =====
        renderEditWindow: function(container, state, onChange, onClose, onSave) {
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
            
            // Create header state
            const headerState = {
                isMain: false,
                title: 'EDIT NEST'
            };
            
            // Create header container
            const headerHTML = '<div id="nest-edit-header"></div>';
            
            // Create content container
            const contentHTML = '<div id="nest-edit-content" style="flex: 1; overflow-y: auto;"></div>';
            
            container.innerHTML = headerHTML + contentHTML;
            
            // Render header using Comp-header.js
            const headerContainer = container.querySelector('#nest-edit-header');
            GT50Lib.Header.renderBuild(
                headerContainer,
                headerState,
                onChange,
                onClose,  // onBack
                onClose,  // onHome
                null,     // onToggleMode (not used in nested contexts)
                null,     // activeMode (not used)
                null,     // onDataOpen
                null,     // onSettingsOpen
                null      // onNewOpen
            );
            
            // Now render the edit content using CreateNew component
            const contentContainer = container.querySelector('#nest-edit-content');
            
            // Render just the content part into contentContainer
            contentContainer.style.cssText = `
                padding: var(--margin);
                padding-bottom: calc(var(--card-height) + var(--margin));
            `;
            
            // Get available templates
            const templates = window.GT50.Templates.getAll();
            
            // ===== NAME SECTION =====
            const nameHTML = `
                <!-- Name Section -->
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
                    ">NAME</div>
                </div>
                
                <div style="
                    background: var(--bg-3);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                ">
                    <input type="text" 
                        data-field="name"
                        value="${state.editWindow.tempName}"
                        placeholder="Enter nest name..." 
                        style="
                            flex: 1;
                            background: transparent;
                            border: none;
                            color: var(--font-color-3);
                            padding: 0 16px;
                            font-size: 14px;
                            font-weight: 600;
                            height: 100%;
                            outline: none;
                            font-family: inherit;
                        ">
                </div>
            `;
            
            // ===== COLOR SECTION =====
            const colorHTML = `
                <!-- Color Section -->
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
                
                <div data-action="cycle-color" style="
                    background: ${GT50Lib.CreateNew.colors[state.editWindow.tempColorIndex].value};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    <div style="
                        width: var(--card-height);
                        min-width: var(--card-height);
                        height: 100%;
                        background: var(--blur);
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            width: 20px;
                            height: 20px;
                            background: ${GT50Lib.CreateNew.colors[state.editWindow.tempColorIndex].value};
                            border: 2px solid var(--color-10);
                            border-radius: 50%;
                        "></div>
                    </div>
                    <div style="
                        flex: 1;
                        padding: 0 16px;
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--color-10);
                    ">${GT50Lib.CreateNew.colors[state.editWindow.tempColorIndex].name}</div>
                </div>
            `;
            
            contentContainer.innerHTML = nameHTML + colorHTML;
            
            // ===== FOOTER =====
            const footerContainer = document.createElement('div');
            footerContainer.id = 'nest-edit-footer';
            container.appendChild(footerContainer);
            
            const canSave = state.editWindow.tempName && state.editWindow.tempName.trim() !== '';
            
            // Custom footer with two buttons
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
                <button data-action="save-close" ${!canSave ? 'disabled' : ''} style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--color-6)' : 'var(--bg-4)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${canSave ? 'var(--color-10)' : 'var(--color-9)'};
                    cursor: ${canSave ? 'pointer' : 'not-allowed'};
                    transition: filter 0.2s;
                    border: none;
                    font-family: inherit;
                ">SAVE & CLOSE</button>
                <div style="
                    width: var(--border-width);
                    height: 100%;
                    background: var(--border-color);
                "></div>
                <button data-action="save-open" ${!canSave ? 'disabled' : ''} style="
                    flex: 1;
                    height: 100%;
                    background: ${canSave ? 'var(--accent)' : 'var(--bg-4)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${canSave ? 'var(--color-10)' : 'var(--color-9)'};
                    cursor: ${canSave ? 'pointer' : 'not-allowed'};
                    transition: filter 0.2s;
                    border: none;
                    font-family: inherit;
                ">SAVE & OPEN</button>
            `;
            
            const saveCloseBtn = footerContainer.querySelector('[data-action="save-close"]');
            if (saveCloseBtn && canSave) {
                saveCloseBtn.onclick = () => {
                    // Save and close without navigating
                    state.name = state.editWindow.tempName.trim();
                    state.color = GT50Lib.CreateNew.colors[state.editWindow.tempColorIndex].name;
                    state.editWindow.isOpen = false;
                    // Clear temp values
                    delete state.editWindow.tempName;
                    delete state.editWindow.tempColorIndex;
                    onChange();
                };
                saveCloseBtn.onmouseover = () => saveCloseBtn.style.filter = 'brightness(1.2)';
                saveCloseBtn.onmouseout = () => saveCloseBtn.style.filter = 'brightness(1)';
            }
            
            const saveOpenBtn = footerContainer.querySelector('[data-action="save-open"]');
            if (saveOpenBtn && canSave) {
                saveOpenBtn.onclick = () => {
                    // Save and navigate into nest
                    state.name = state.editWindow.tempName.trim();
                    state.color = GT50Lib.CreateNew.colors[state.editWindow.tempColorIndex].name;
                    // Clear temp values
                    delete state.editWindow.tempName;
                    delete state.editWindow.tempColorIndex;
                    onSave();
                };
                saveOpenBtn.onmouseover = () => saveOpenBtn.style.filter = 'brightness(1.2)';
                saveOpenBtn.onmouseout = () => saveOpenBtn.style.filter = 'brightness(1)';
            }
            
            // ===== EVENT LISTENERS =====
            const nameInput = contentContainer.querySelector('[data-field="name"]');
            if (nameInput) {
                nameInput.oninput = (e) => {
                    state.editWindow.tempName = e.target.value;
                    // DON'T call onChange() here - it causes re-render and closes keyboard
                    // Just update the temp value silently
                };
            }
            
            const colorBtn = contentContainer.querySelector('[data-action="cycle-color"]');
            if (colorBtn) {
                colorBtn.onclick = () => {
                    state.editWindow.tempColorIndex = (state.editWindow.tempColorIndex + 1) % GT50Lib.CreateNew.colors.length;
                    onChange();
                };
                colorBtn.onmouseover = () => colorBtn.style.filter = 'brightness(1.1)';
                colorBtn.onmouseout = () => colorBtn.style.filter = 'brightness(1)';
            }
        }
    };
})();