(function() {
    // Static injector ID
    const INJECTOR_ID = '0011';
    
    // ===== HEADER SYSTEM =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.HeaderSystem = {
        headers: [],
        
        // Register a header at a specific position
        register: function(config) {
            /*
            config = {
                position: 0,  // Stack order (0 = top, 1 = second, etc.)
                id: 'main-header',
                visible: function() { return true; },  // Function that returns visibility
                render: function(container) { ... }     // Function that renders to container
            }
            */
            this.headers.push(config);
            this.headers.sort((a, b) => a.position - b.position);
        },
        
        // Clear all registered headers
        clear: function() {
            this.headers = [];
        },
        
        // Render all visible headers and update body padding
        renderAll: function() {
            const visibleHeaders = this.headers.filter(h => h.visible());
            
            // Render each visible header
            visibleHeaders.forEach((header, index) => {
                const container = document.getElementById(header.id);
                if (!container) return;
                
                // Position the container
                container.style.position = 'fixed';
                container.style.top = `calc(var(--card-height) * ${header.position})`;
                container.style.left = '0';
                container.style.right = '0';
                container.style.zIndex = 1000 + (100 - header.position);
                
                // Show/hide based on visibility
                container.style.display = header.visible() ? 'block' : 'none';
                
                // Render content
                if (header.visible()) {
                    header.render(container);
                }
            });
            
            // Update body padding based on visible headers count
            this.updatePadding();
        },
        
        // Calculate and apply body padding
        updatePadding: function() {
            const visibleCount = this.headers.filter(h => h.visible()).length;
            document.body.style.paddingTop = `calc((var(--card-height) * ${visibleCount}) + 4px)`;
        }
    };
    
    // ===== LEGACY HEADER COMPONENT (for nested headers) =====
    window.GT50Lib.Header = {
        // Add property to track edit button visibility
        editSectionVisible: false,
        
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { title: '', isMain: true };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onBack, onHome, onToggleMode, activeMode, onDataOpen, onSettingsOpen, onNewOpen) {
            if (state.isMain) {
                // ===== MAIN WINDOW HEADER =====
                const modeButtonText = activeMode === 'build' ? 'VIEW' : 'EDIT';
                
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="open-create-new" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">NEW</div>
                        <div data-action="toggle-mode" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">${modeButtonText}</div>
                        <div data-action="open-settings" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SETTINGS</div>
                        <div data-action="open-data" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">DATA</div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const newBtn = container.querySelector('[data-action="open-create-new"]');
                if (newBtn && onNewOpen) {
                    newBtn.onclick = onNewOpen;
                    newBtn.onmouseover = () => newBtn.style.filter = 'brightness(1.2)';
                    newBtn.onmouseout = () => newBtn.style.filter = 'brightness(1)';
                }
                
                const toggleBtn = container.querySelector('[data-action="toggle-mode"]');
                if (toggleBtn && onToggleMode) {
                    toggleBtn.onclick = onToggleMode;
                    toggleBtn.onmouseover = () => toggleBtn.style.filter = 'brightness(1.2)';
                    toggleBtn.onmouseout = () => toggleBtn.style.filter = 'brightness(1)';
                }
                
                const settingsBtn = container.querySelector('[data-action="open-settings"]');
                if (settingsBtn && onSettingsOpen) {
                    settingsBtn.onclick = onSettingsOpen;
                    settingsBtn.onmouseover = () => settingsBtn.style.filter = 'brightness(1.2)';
                    settingsBtn.onmouseout = () => settingsBtn.style.filter = 'brightness(1)';
                }
                
                const dataBtn = container.querySelector('[data-action="open-data"]');
                if (dataBtn && onDataOpen) {
                    dataBtn.onclick = onDataOpen;
                    dataBtn.onmouseover = () => dataBtn.style.filter = 'brightness(1.2)';
                    dataBtn.onmouseout = () => dataBtn.style.filter = 'brightness(1)';
                }
            } else {
                // ===== NESTED WINDOW HEADER (BUILD MODE) =====
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="back" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--color-1);
                            padding: 0;
                            font-size: 18px;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            color: var(--color-10);
                            transition: filter 0.2s;
                        ">◀</div>
                        <div style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 var(--margin);
                            background: var(--bg-3);
                        ">
                            <input 
                                type="text" 
                                data-field="title"
                                value="${state.title || ''}"
                                placeholder="Enter title..."
                                style="
                                    width: 100%;
                                    background: none;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 14px;
                                    font-weight: 600;
                                    font-family: inherit;
                                    outline: none;
                                    text-align: center;
                                "
                            />
                        </div>
                        <div data-action="home" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--color-4);
                            border-left: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            font-size: 18px;
                            color: var(--color-10);
                            transition: filter 0.2s;
                        ">▶</div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const backBtn = container.querySelector('[data-action="back"]');
                if (backBtn && onBack) {
                    backBtn.onclick = () => onBack();
                    backBtn.onmouseover = () => backBtn.style.filter = 'brightness(1.2)';
                    backBtn.onmouseout = () => backBtn.style.filter = 'brightness(1)';
                }
                
                const homeBtn = container.querySelector('[data-action="home"]');
                if (homeBtn && onHome) {
                    homeBtn.onclick = () => onHome();
                    homeBtn.onmouseover = () => homeBtn.style.filter = 'brightness(1.2)';
                    homeBtn.onmouseout = () => homeBtn.style.filter = 'brightness(1)';
                }
                
                const titleInput = container.querySelector('[data-field="title"]');
                if (titleInput) {
                    titleInput.oninput = (e) => {
                        state.title = e.target.value;
                    };
                }
            }
        },
        
        // ===== VIEW MODE RENDERER =====
        renderView: function(container, state, onChange, onBack, onHome, onToggleMode, activeMode, onDataOpen, onSettingsOpen, onNewOpen) {
            if (state.isMain) {
                // ===== MAIN WINDOW HEADER =====
                const modeButtonText = activeMode === 'build' ? 'VIEW' : 'EDIT';
                
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="open-create-new" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">NEW</div>
                        <div data-action="toggle-mode" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: ${GT50Lib.Header.editSectionVisible ? 'flex' : 'none'};
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">${modeButtonText}</div>
                        <div data-action="open-settings" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SETTINGS</div>
                        <div data-action="open-data" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">DATA</div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const newBtn = container.querySelector('[data-action="open-create-new"]');
                if (newBtn && onNewOpen) {
                    let pressTimer = null;
                    let wasLongPress = false;
                    
                    // Mouse/touch start - begin timer
                    const startPress = (e) => {
                        wasLongPress = false;
                        pressTimer = setTimeout(() => {
                            // Long press detected - toggle edit button visibility
                            wasLongPress = true;
                            GT50Lib.Header.editSectionVisible = !GT50Lib.Header.editSectionVisible;
                            pressTimer = null;
                            if (onChange) onChange();
                        }, 500); // 500ms long press threshold
                    };
                    
                    // Mouse/touch end - cancel timer or execute normal click
                    const endPress = (e) => {
                        if (pressTimer) {
                            // Timer still running - it was a short press
                            clearTimeout(pressTimer);
                            pressTimer = null;
                            if (!wasLongPress) {
                                onNewOpen();
                            }
                        }
                        // If pressTimer is null, long press already fired, don't open window
                    };
                    
                    // Cancel on move (prevents accidental triggers)
                    const cancelPress = () => {
                        if (pressTimer) {
                            clearTimeout(pressTimer);
                            pressTimer = null;
                        }
                        wasLongPress = false;
                    };
                    
                    // Attach listeners for both mouse and touch
                    newBtn.addEventListener('mousedown', startPress);
                    newBtn.addEventListener('touchstart', startPress, { passive: true });
                    
                    newBtn.addEventListener('mouseup', endPress);
                    newBtn.addEventListener('touchend', endPress);
                    
                    newBtn.addEventListener('mouseleave', cancelPress);
                    newBtn.addEventListener('touchcancel', cancelPress);
                    
                    // Hover effects
                    newBtn.onmouseover = () => newBtn.style.filter = 'brightness(1.2)';
                    newBtn.onmouseout = () => newBtn.style.filter = 'brightness(1)';
                }
                
                const toggleBtn = container.querySelector('[data-action="toggle-mode"]');
                if (toggleBtn && onToggleMode) {
                    toggleBtn.onclick = onToggleMode;
                    toggleBtn.onmouseover = () => toggleBtn.style.filter = 'brightness(1.2)';
                    toggleBtn.onmouseout = () => toggleBtn.style.filter = 'brightness(1)';
                }
                
                const settingsBtn = container.querySelector('[data-action="open-settings"]');
                if (settingsBtn && onSettingsOpen) {
                    settingsBtn.onclick = onSettingsOpen;
                    settingsBtn.onmouseover = () => settingsBtn.style.filter = 'brightness(1.2)';
                    settingsBtn.onmouseout = () => settingsBtn.style.filter = 'brightness(1)';
                }
                
                const dataBtn = container.querySelector('[data-action="open-data"]');
                if (dataBtn && onDataOpen) {
                    dataBtn.onclick = onDataOpen;
                    dataBtn.onmouseover = () => dataBtn.style.filter = 'brightness(1.2)';
                    dataBtn.onmouseout = () => dataBtn.style.filter = 'brightness(1)';
                }
            } else {
                // ===== NESTED WINDOW HEADER =====
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="back" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--bg-4);
                            padding: 0;
                            font-size: 18px;
                            border-right: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            color: var(--color-10);
                        ">◀</div>
                        <div style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 var(--margin);
                            background: var(--bg-3);
                        ">
                            <input 
                                type="text" 
                                data-field="title"
                                value="${state.title || ''}"
                                placeholder="Enter title..."
                                style="
                                    width: 100%;
                                    background: none;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: 14px;
                                    font-weight: 600;
                                    font-family: inherit;
                                    outline: none;
                                    text-align: center;
                                "
                            />
                        </div>
                        <div data-action="home" style="
                            width: var(--square-section);
                            min-width: var(--square-section);
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--bg-4);
                            border-left: var(--border-width) solid var(--border-color);
                            cursor: pointer;
                            position: relative;
                        ">
                            <div style="
                                width: 20px;
                                height: 20px;
                                border: 3px solid var(--color-10);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div style="
                                    width: 6px;
                                    height: 6px;
                                    background: var(--color-10);
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const backBtn = container.querySelector('[data-action="back"]');
                if (backBtn && onBack) {
                    backBtn.onclick = () => onBack();
                }
                
                const homeBtn = container.querySelector('[data-action="home"]');
                if (homeBtn && onHome) {
                    homeBtn.onclick = () => onHome();
                }
                
                const titleInput = container.querySelector('[data-field="title"]');
                if (titleInput) {
                    titleInput.oninput = (e) => {
                        state.title = e.target.value;
                    };
                }
            }
        }
    };
    
    // =====================================================
    // INJECT RIGHT SECTION (for plugin UI)
    // =====================================================
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'comp-header.js') {
                    const rightSection = document.createElement('div');
                    rightSection.style.cssText = `
                        width: 60px;
                        height: 100%;
                        background: var(--primary);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-10);
                    `;
                    rightSection.textContent = INJECTOR_ID;
                    card.appendChild(rightSection);
                    break;
                }
            }
        }
    }, 100);
})();