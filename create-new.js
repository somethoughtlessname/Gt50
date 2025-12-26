(function() {
    // Static injector ID
    const INJECTOR_ID = '0022';
    
    // ===== CREATE NEW ENTRY COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    // ===== TEMPLATE REGISTRY =====
    window.GT50 = window.GT50 || {};
    window.GT50.Templates = {
        registry: [],
        
        register: function(template) {
            /*
            template = {
                id: 'basic',
                name: 'BASIC',
                description: 'Single tab with essential tracking components',
                generate: function() {
                    return {
                        tabs: { tabs: [{name: 'Main', label: 'Main', color: ''}] },
                        tabComponents: [[
                            { type: 'list', state: {...} },
                            { type: 'progress', state: {...} }
                        ]]
                    };
                }
            }
            */
            this.registry.push(template);
        },
        
        get: function(id) {
            return this.registry.find(t => t.id === id);
        },
        
        getAll: function() {
            return this.registry;
        }
    };
    
    // ===== CREATE NEW COMPONENT =====
    window.GT50Lib.CreateNew = {
        // ===== COLOR OPTIONS =====
        colors: [
            { name: 'RED', value: 'var(--color-1)' },
            { name: 'ORANGE', value: 'var(--color-2)' },
            { name: 'YELLOW', value: 'var(--color-3)' },
            { name: 'GREEN', value: 'var(--color-4)' },
            { name: 'BLUE', value: 'var(--color-5)' },
            { name: 'PURPLE', value: 'var(--color-6)' },
            { name: 'PINK', value: 'var(--color-7)' },
            { name: 'GRAY', value: 'var(--color-9)' }
        ],
        
        // ===== STATE FACTORY =====
        defaultState: function() {
            return {
                isOpen: false,
                name: '',
                selectedTemplate: 'custom',
                currentColorIndex: 7, // Gray (default)
                cycleMode: false
            };
        },
        
        // ===== VALIDATION =====
        validateName: function(name, existingComponents) {
            if (!name || name.trim() === '') {
                return { valid: false, error: 'Name cannot be empty' };
            }
            
            const trimmedName = name.trim();
            const duplicate = existingComponents.find(c => 
                (c.type === 'nest' || c.type === 'cycle') && 
                c.state.name === trimmedName
            );
            
            if (duplicate) {
                return { valid: false, error: 'An entry with this name already exists' };
            }
            
            return { valid: true };
        },
        
        // ===== CREATE ENTRY =====
        createEntry: function(state, nextId, existingComponents) {
            const validation = this.validateName(state.name, existingComponents);
            if (!validation.valid) {
                alert(validation.error);
                return null;
            }
            
            const entryType = state.cycleMode ? 'cycle' : 'nest';
            const newEntry = {
                id: nextId,
                type: entryType,
                state: entryType === 'nest' 
                    ? GT50Lib.Nest.defaultState() 
                    : GT50Lib.Cycle.defaultState()
            };
            
            newEntry.state.name = state.name.trim();
            newEntry.state.color = this.colors[state.currentColorIndex].name;
            
            // Apply template if not custom
            if (state.selectedTemplate !== 'custom') {
                const template = window.GT50.Templates.get(state.selectedTemplate);
                if (template) {
                    const generated = template.generate();
                    if (generated.tabs) {
                        newEntry.state.tabs = generated.tabs;
                    }
                    if (generated.tabComponents) {
                        newEntry.state.tabComponents = generated.tabComponents;
                    }
                }
            }
            
            return newEntry;
        },
        
        // ===== WINDOW RENDERER =====
        render: function(container, state, onChange, onClose, onCreate) {
            console.log('CreateNew.render called, state.isOpen:', state.isOpen);
            
            if (!state.isOpen) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            
            // Check if we're in edit mode
            const isEditMode = state.editMode === true;
            
            console.log('CreateNew window should be visible');
            
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
            
            // ===== HEADER =====
            const headerHTML = `
                <div style="
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    padding: var(--margin);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                ">
                    <div style="
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--color-10);
                    ">${isEditMode ? 'EDIT NEST' : 'NEW ENTRY'}</div>
                    <button data-action="close" style="
                        background: var(--color-1);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        color: var(--color-10);
                        cursor: pointer;
                        font-family: inherit;
                        font-size: 16px;
                        font-weight: 700;
                        height: 40px;
                        width: 80px;
                        transition: filter 0.2s;
                    ">CLOSE</button>
                </div>
            `;
            
            // Get available templates
            const templates = window.GT50.Templates.getAll();
            const hasTemplates = templates && templates.length > 0;
            
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
                        value="${state.name || ''}"
                        placeholder="Enter entry name..." 
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
            
            // ===== TEMPLATE SECTION (only in create mode) =====
            const templateHTML = isEditMode ? '' : `
                <!-- Template Section -->
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
                    ">TEMPLATE</div>
                </div>
                
                ${templates.map(t => `
                    <div data-action="select-template" data-template="${t.id}" style="
                        background: ${state.selectedTemplate === t.id ? 'var(--accent)' : 'var(--bg-3)'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                        cursor: pointer;
                        transition: filter 0.2s;
                        padding: 0 16px;
                    ">
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            min-width: 0;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: var(--color-10);
                                margin-bottom: 2px;
                                line-height: 1;
                            ">${t.name}</div>
                            <div style="
                                font-size: 9px;
                                font-weight: 500;
                                color: var(--color-10);
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                line-height: 1.2;
                            ">${t.description}</div>
                        </div>
                    </div>
                `).join('')}
                
                <div data-action="select-template" data-template="custom" style="
                    background: ${state.selectedTemplate === 'custom' ? 'var(--accent)' : 'var(--bg-3)'};
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    transition: filter 0.2s;
                    padding: 0 16px;
                ">
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-width: 0;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            margin-bottom: 2px;
                            line-height: 1;
                        ">CUSTOM</div>
                        <div style="
                            font-size: 9px;
                            font-weight: 500;
                            color: var(--color-10);
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            line-height: 1.2;
                        ">Build your own template from scratch</div>
                    </div>
                </div>
                
                ${!hasTemplates ? `
                    <div style="
                        background: var(--bg-4);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        display: flex;
                        align-items: center;
                        margin-bottom: var(--margin);
                        padding: 0 16px;
                    ">
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            min-width: 0;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: var(--color-10);
                                line-height: 1;
                            ">TEMPLATES COMING SOON</div>
                        </div>
                    </div>
                ` : ''}
            `;
            
            // ===== SETTINGS SECTION (only in create mode) =====
            const settingsHTML = isEditMode ? '' : `
                <!-- Settings Section -->
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
                    ">SETTINGS</div>
                </div>
                
                <div data-action="toggle-cycle" style="
                    background: var(--bg-3);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    cursor: pointer;
                    overflow: hidden;
                ">
                    <div style="
                        width: var(--card-height);
                        min-width: var(--card-height);
                        height: 100%;
                        background: ${state.cycleMode ? 'var(--accent)' : 'var(--color-10)'};
                        border-right: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        color: var(--color-10);
                        padding-left: 1px;
                        padding-bottom: 3px;
                        transition: background 0.2s;
                    ">${state.cycleMode ? '✓' : ''}</div>
                    <div style="
                        flex: 1;
                        padding: 0 16px;
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--color-10);
                    ">Enable cycle mode - Auto-reset contents on schedule</div>
                </div>
                
                <div style="
                    background: var(--bg-4);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--margin);
                    padding: 0 16px;
                ">
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-width: 0;
                    ">
                        <div style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--color-10);
                            line-height: 1;
                        ">MORE SETTINGS COMING SOON</div>
                    </div>
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
                    background: ${this.colors[state.currentColorIndex].value};
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
                            background: ${this.colors[state.currentColorIndex].value};
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
                    ">${this.colors[state.currentColorIndex].name}</div>
                </div>
            `;
            
            // ===== ASSEMBLE CONTENT =====
            const contentHTML = `
                <div style="
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--margin);
                    padding-bottom: calc(var(--card-height) + var(--margin));
                ">
                    ${nameHTML}
                    ${templateHTML}
                    ${settingsHTML}
                    ${colorHTML}
                </div>
            `;
            
            container.innerHTML = headerHTML + contentHTML;
            
            // ===== FOOTER =====
            const footerContainer = document.createElement('div');
            footerContainer.id = 'create-new-footer';
            container.appendChild(footerContainer);
            
            const canCreate = state.name && state.name.trim() !== '';
            this.renderFooter(footerContainer, canCreate, onCreate, isEditMode);
            
            // ===== EVENT LISTENERS =====
            const closeBtn = container.querySelector('[data-action="close"]');
            if (closeBtn) {
                closeBtn.onclick = onClose;
                closeBtn.onmouseover = () => closeBtn.style.filter = 'brightness(1.2)';
                closeBtn.onmouseout = () => closeBtn.style.filter = 'brightness(1)';
            }
            
           const nameInput = container.querySelector('[data-field="name"]');
if (nameInput) {
    nameInput.oninput = (e) => {
        state.name = e.target.value;
        // DON'T call onChange() - just update the footer button
        const footerBtn = container.querySelector('[data-action="create"]');
        const canCreate = state.name && state.name.trim() !== '';
        if (footerBtn) {
            footerBtn.disabled = !canCreate;
            footerBtn.style.background = canCreate ? 'var(--accent)' : 'var(--bg-4)';
            footerBtn.style.color = canCreate ? 'var(--color-10)' : 'var(--color-9)';
            footerBtn.style.cursor = canCreate ? 'pointer' : 'not-allowed';
        }
    };
}
            
            container.querySelectorAll('[data-action="select-template"]').forEach(btn => {
                const templateId = btn.dataset.template;
                btn.onclick = () => {
                    state.selectedTemplate = templateId;
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            const cycleBtn = container.querySelector('[data-action="toggle-cycle"]');
            if (cycleBtn) {
                cycleBtn.onclick = () => {
                    state.cycleMode = !state.cycleMode;
                    onChange();
                };
                cycleBtn.onmouseover = () => cycleBtn.style.filter = 'brightness(1.1)';
                cycleBtn.onmouseout = () => cycleBtn.style.filter = 'brightness(1)';
            }
            
            const colorBtn = container.querySelector('[data-action="cycle-color"]');
            if (colorBtn) {
                colorBtn.onclick = () => {
                    state.currentColorIndex = (state.currentColorIndex + 1) % this.colors.length;
                    onChange();
                };
                colorBtn.onmouseover = () => colorBtn.style.filter = 'brightness(1.1)';
                colorBtn.onmouseout = () => colorBtn.style.filter = 'brightness(1)';
            }
        },
        
        // ===== FOOTER RENDERER =====
        renderFooter: function(container, enabled, onCreate, isEditMode) {
            container.style.cssText = `
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
            
            container.innerHTML = `
                <button data-action="create" ${!enabled ? 'disabled' : ''} style="
                    flex: 1;
                    height: 100%;
                    background: ${enabled ? 'var(--accent)' : 'var(--bg-4)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${enabled ? 'var(--color-10)' : 'var(--color-9)'};
                    cursor: ${enabled ? 'pointer' : 'not-allowed'};
                    transition: filter 0.2s;
                    border: none;
                    font-family: inherit;
                ">${isEditMode ? 'SAVE & OPEN' : 'CREATE'}</button>
            `;
            
            const createBtn = container.querySelector('[data-action="create"]');
            if (createBtn && enabled) {
                createBtn.onclick = onCreate;
                createBtn.onmouseover = () => createBtn.style.filter = 'brightness(1.2)';
                createBtn.onmouseout = () => createBtn.style.filter = 'brightness(1)';
            }
        }
    };
})();