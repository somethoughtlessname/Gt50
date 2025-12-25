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
                const createNewBtn = container.querySelector('[data-action="open-create-new"]');
                if (createNewBtn && onNewOpen) {
                    createNewBtn.onclick = onNewOpen;
                    createNewBtn.onmouseover = () => createNewBtn.style.filter = 'brightness(1.2)';
                    createNewBtn.onmouseout = () => createNewBtn.style.filter = 'brightness(1)';
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
                            padding-left: var(--margin);
                            background: var(--bg-3);
                        ">
                            <input 
                                type="text" 
                                data-field="title"
                                value="${state.title || ''}"
                                placeholder="Enter title..."
                                style="
                                    flex: 1;
                                    background: none;
                                    border: none;
                                    color: var(--color-10);
                                    font-size: var(--text-size);
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
                const createNewBtn = container.querySelector('[data-action="open-create-new"]');
                if (createNewBtn && onNewOpen) {
                    createNewBtn.onclick = onNewOpen;
                    createNewBtn.onmouseover = () => createNewBtn.style.filter = 'brightness(1.2)';
                    createNewBtn.onmouseout = () => createNewBtn.style.filter = 'brightness(1)';
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
                // ===== NESTED WINDOW HEADER (VIEW MODE) =====
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
                            background: var(--bg-3);
                            font-size: var(--text-size);
                            font-weight: 600;
                            color: var(--color-10);
                            text-align: center;
                        ">${state.title || ''}</div>
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
                    backBtn.onmouseover = () => backBtn.style.filter = 'brightness(1.2)';
                    backBtn.onmouseout = () => backBtn.style.filter = 'brightness(1)';
                }
                
                const homeBtn = container.querySelector('[data-action="home"]');
                if (homeBtn && onHome) {
                    homeBtn.onclick = () => onHome();
                    homeBtn.onmouseover = () => homeBtn.style.filter = 'brightness(1.2)';
                    homeBtn.onmouseout = () => homeBtn.style.filter = 'brightness(1)';
                }
            }
        }
    };
})();