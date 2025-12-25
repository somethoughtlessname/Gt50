(function() {
    // Static injector ID
    const INJECTOR_ID = '0021';
    
    // ===== IMPORT COMPONENT (Nest Variation) =====
    // Enables importing pre-configured nest structures with complete component hierarchies
    // Once populated, transforms into a regular nest component
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Import = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                name: '',
                components: [],
                tabs: null,
                tabComponents: null,
                importWindow: {
                    isOpen: false,
                    header: {
                        isMain: false,
                        title: 'IMPORT NEST DATA'
                    }
                }
            };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, depth, onNavigate, onChange, onMove, onDelete, isDeletePending) {
            const bgColor = 'var(--color-5-3)';  // Distinct from regular nest
            const iconBg = 'var(--blur)';
            const placeholder = 'IMPORT (tap to configure)';
            
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
                    <div data-action="open-import" style="
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
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <div style="
                                width: 0;
                                height: 0;
                                border-left: 5px solid transparent;
                                border-right: 5px solid transparent;
                                border-top: 8px solid var(--font-color-3);
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
                            disabled
                            style="
                                width: 100%;
                                background: transparent;
                                border: none;
                                padding: 0 var(--text-padding-small);
                                font-size: 16px;
                                font-weight: 600;
                                color: var(--color-7);
                                outline: none;
                                font-family: inherit;
                                opacity: 0.7;
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
            const openBtn = container.querySelector('[data-action="open-import"]');
            if (openBtn) {
                openBtn.onclick = () => {
                    state.importWindow.isOpen = true;
                    if (onChange) onChange();
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
        
        // ===== RENDER IMPORT WINDOW =====
        renderImportWindow: function(container, componentRef, onChange) {
            if (!componentRef.state.importWindow.isOpen) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
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
            
            container.innerHTML = `
                <div style="
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                ">
                    <div data-action="close" style="
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
                        font-size: 16px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        color: var(--font-color-3);
                    ">${componentRef.state.importWindow.header.title}</div>
                    <div style="
                        width: var(--square-section);
                        min-width: var(--square-section);
                        height: 100%;
                        background: var(--bg-4);
                        border-left: var(--border-width) solid var(--border-color);
                    "></div>
                </div>
                
                <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: var(--margin);
                    overflow-y: auto;
                ">
                    <textarea 
                        id="import-textarea" 
                        placeholder="Paste nest data here (any GT50 format will be auto-detected)..."
                        style="
                            width: 100%;
                            flex: 1;
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            color: var(--color-10);
                            padding: 12px;
                            font-family: 'Courier New', monospace;
                            font-size: 11px;
                            line-height: 1.4;
                            resize: none;
                            margin-bottom: var(--margin);
                            outline: none;
                        "></textarea>
                    
                    <button id="import-btn" style="
                        height: var(--card-height);
                        background: var(--accent);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        color: var(--color-10);
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: filter 0.2s;
                        font-family: inherit;
                        margin-bottom: var(--margin);
                    ">IMPORT NEST DATA</button>
                    
                    <div id="import-status" style="
                        text-align: center;
                        font-size: 12px;
                        color: var(--color-10);
                        min-height: 20px;
                        margin-bottom: var(--margin);
                    "></div>
                    
                    <div style="
                        background: var(--bg-4);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 12px;
                        font-size: 11px;
                        color: var(--color-7);
                        line-height: 1.5;
                    ">
                        <div style="font-weight: 700; margin-bottom: 8px; color: var(--color-10);">📋 INSTRUCTIONS:</div>
                        <div>• Paste data exported from any GT50 nest component</div>
                        <div>• All formats are supported (GT50, JSON, compressed)</div>
                        <div>• Can import nest components or workspace data directly</div>
                        <div>• Imported data will transform this card into a nest component</div>
                    </div>
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            const closeBtn = container.querySelector('[data-action="close"]');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    componentRef.state.importWindow.isOpen = false;
                    if (onChange) onChange();
                };
                closeBtn.onmouseover = () => closeBtn.style.filter = 'brightness(1.2)';
                closeBtn.onmouseout = () => closeBtn.style.filter = 'brightness(1)';
            }
            
            const importBtn = document.getElementById('import-btn');
            const textarea = document.getElementById('import-textarea');
            const status = document.getElementById('import-status');
            
            if (importBtn && textarea && status) {
                importBtn.onclick = () => {
                    const text = textarea.value;
                    if (!text.trim()) {
                        status.textContent = '❌ Error: No data to import';
                        status.style.color = 'var(--color-1)';
                        return;
                    }
                    
                    try {
                        // Use existing impex.importData() function
                        const result = window.GT50Lib.ImpEx.importData(text);
                        
                        if (!result.success) {
                            status.textContent = `❌ Import failed: ${result.error}`;
                            status.style.color = 'var(--color-1)';
                            return;
                        }
                        
                        // Try to find a nest component in the imported data
                        let nestFound = null;
                        if (result.data && result.data.tabComponents) {
                            for (const tab of result.data.tabComponents) {
                                for (const component of tab) {
                                    if (component.type === 'nest') {
                                        nestFound = component;
                                        break;
                                    }
                                }
                                if (nestFound) break;
                            }
                        }
                        
                        // TRANSFORM: Change the component type from 'import' to 'nest'
                        componentRef.type = 'nest';
                        
                        if (nestFound) {
                            // If we found a nest component, use its state
                            componentRef.state = nestFound.state;
                        } else {
                            // If no nest found, treat the imported workspace data as nest contents
                            componentRef.state = {
                                name: 'Imported Nest',
                                tabs: result.data.tabs,
                                tabComponents: result.data.tabComponents
                            };
                        }
                        
                        const formatMsg = result.detectedFormat ? ` (${result.detectedFormat} format)` : '';
                        status.textContent = `✓ Import successful${formatMsg}!`;
                        status.style.color = 'var(--accent)';
                        
                        // Close window immediately
                        setTimeout(() => {
                            if (onChange) onChange();
                        }, 800);
                        
                    } catch (error) {
                        status.textContent = `❌ Import error: ${error.message}`;
                        status.style.color = 'var(--color-1)';
                    }
                };
                importBtn.onmouseover = () => importBtn.style.filter = 'brightness(1.2)';
                importBtn.onmouseout = () => importBtn.style.filter = 'brightness(1)';
            }
        }
    };
    
    // ===== INJECT RIGHT SECTION (for plugin UI) =====
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'comp-import.js') {
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