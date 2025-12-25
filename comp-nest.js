(function() {
    // ===== NEST COMPONENT (NON-CYCLE) =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Nest = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                name: '', 
                components: []
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending) {
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
        
       // ===== VIEW MODE RENDERER =====
renderView: function(container, state, depth, onNavigate, onMove, onDelete, render, closeAllActions) {
    const displayName = state.name || 'Nest';
    
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