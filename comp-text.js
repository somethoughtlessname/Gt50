(function() {
    // ===== TEXT COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Text = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                open: false, 
                title: '', 
                text: '',
                alignment: 'left',
                fontWeight: '600',
                fontStyle: 'system'
            };
        },
        
        // ===== HELPER: Get Font Family =====
        getFontFamily: function(fontStyle) {
            if (fontStyle === 'serif') {
                return 'Georgia, Times, serif';
            } else if (fontStyle === 'mono') {
                return 'Courier, monospace';
            } else if (fontStyle === 'sans') {
                return 'Arial, Helvetica, sans-serif';
            }
            return '-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif';
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            // Store textarea reference for auto-resize
            if (!state._textareaId) {
                state._textareaId = 'textarea-' + Date.now();
            }
            
            const fontFamily = this.getFontFamily(state.fontStyle);
            
            container.innerHTML = `
                <div style="
                    background: var(--color-6);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${state.open ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: ${state.open ? '0' : 'var(--margin)'};
                    position: relative;
                ">
                    <div data-action="toggle" style="
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
                        font-size: ${state.open ? '20px' : '16px'};
                        font-weight: 700;
                        color: var(--color-6);
                        cursor: pointer;
                    ">${state.open ? '−' : '+'}</div>
                    <input type="text" 
                        data-field="title"
                        value="${state.title || ''}"
                        placeholder="TEXT"
                        style="
                            flex: 1;
                            background: transparent;
                            border: none;
                            color: var(--color-10);
                            padding: 0 var(--text-padding-small) 0 var(--text-padding-left);
                            font-size: 16px;
                            font-weight: 700;
                            height: var(--card-height);
                            outline: none;
                            font-family: inherit;
                        ">
                    <div style="
                        display: flex;
                        height: 100%;
                        border-left: var(--border-width) solid var(--border-color);
                    ">
                        <button data-action="move-up-card" style="
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
                        <button data-action="move-down-card" style="
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
                        <button data-action="delete-card" style="
                            width: var(--square-section);
                            height: 100%;
                            background: ${isDeletePending ? 'var(--color-10)' : 'transparent'};
                            border: none;
                            color: ${isDeletePending ? 'var(--color-1)' : 'var(--color-10)'};
                            cursor: pointer;
                            font-family: inherit;
                            position: relative;
                            font-size: var(--delete-sub-size);
                            font-weight: var(--delete-sub-weight);
                        ">
                            ${isDeletePending ? '' : '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-4); filter: brightness(0.75); z-index: -1;"></div>'}×
                        </button>
                    </div>
                </div>
                ${state.open ? `<div style="
                    background: var(--bg-2);
                    border-radius: 0 0 8px 8px;
                    display: block;
                    padding: var(--margin);
                    border: var(--border-width) solid var(--border-color);
                    border-top: none;
                    margin-bottom: var(--margin);
                ">
                    <div style="
                        background: var(--color-6);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <button data-align="left" style="flex: 1; background: ${state.alignment === 'left' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.alignment === 'left' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">LEFT</button>
                        <button data-align="center" style="flex: 1; background: ${state.alignment === 'center' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.alignment === 'center' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">CENTER</button>
                        <button data-align="right" style="flex: 1; background: ${state.alignment === 'right' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.alignment === 'right' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">RIGHT</button>
                        <button data-align="justify" style="flex: 1; background: ${state.alignment === 'justify' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; color: ${state.alignment === 'justify' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">JUSTIFY</button>
                    </div>
                    <div style="
                        background: var(--color-6);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <button data-weight="400" style="flex: 1; background: ${state.fontWeight === '400' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontWeight === '400' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">REGULAR</button>
                        <button data-weight="500" style="flex: 1; background: ${state.fontWeight === '500' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontWeight === '500' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">MEDIUM</button>
                        <button data-weight="600" style="flex: 1; background: ${state.fontWeight === '600' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontWeight === '600' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">SEMIBOLD</button>
                        <button data-weight="700" style="flex: 1; background: ${state.fontWeight === '700' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; color: ${state.fontWeight === '700' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">BOLD</button>
                    </div>
                    <div style="
                        background: var(--color-6);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: 32px;
                        display: flex;
                        margin-bottom: var(--margin);
                        overflow: hidden;
                    ">
                        <button data-style="system" style="flex: 1; background: ${state.fontStyle === 'system' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontStyle === 'system' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">SYSTEM</button>
                        <button data-style="serif" style="flex: 1; background: ${state.fontStyle === 'serif' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontStyle === 'serif' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">SERIF</button>
                        <button data-style="mono" style="flex: 1; background: ${state.fontStyle === 'mono' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; border-right: var(--border-width) solid var(--border-color); color: ${state.fontStyle === 'mono' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">MONO</button>
                        <button data-style="sans" style="flex: 1; background: ${state.fontStyle === 'sans' ? 'var(--color-10)' : 'var(--color-6-2)'}; border: none; color: ${state.fontStyle === 'sans' ? 'var(--color-6)' : 'var(--color-10)'}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: filter 0.2s;">SANS</button>
                    </div>
                    <textarea 
                        id="${state._textareaId}"
                        data-field="text"
                        placeholder="Write your text here..."
                        style="
                            width: 100%;
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            color: var(--color-10);
                            padding: 12px;
                            font-size: 14px;
                            line-height: 1.6;
                            font-family: ${fontFamily};
                            font-weight: ${state.fontWeight};
                            text-align: ${state.alignment};
                            resize: none;
                            outline: none;
                            overflow: hidden;
                            min-height: 80px;
                        ">${state.text || ''}</textarea>
                </div>` : ''}
            `;
            
            // Store reference to this instance for callbacks
            const self = this;
            
            // ===== HELPER: Update Textarea Styles =====
            const updateTextareaStyles = () => {
                const textarea = container.querySelector('[data-field="text"]');
                if (textarea) {
                    const fontFamily = self.getFontFamily(state.fontStyle);
                    textarea.style.fontFamily = fontFamily;
                    textarea.style.fontWeight = state.fontWeight;
                    textarea.style.textAlign = state.alignment;
                }
            };
            
            // ===== EVENT LISTENERS =====
            const toggle = container.querySelector('[data-action="toggle"]');
            if (toggle) {
                toggle.onclick = () => {
                    state.open = !state.open;
                    onChange();
                };
            }
            
            const titleInput = container.querySelector('[data-field="title"]');
            if (titleInput) {
                titleInput.oninput = (e) => {
                    state.title = e.target.value;
                };
            }
            
            // Alignment buttons
            container.querySelectorAll('[data-align]').forEach(btn => {
                btn.onclick = () => {
                    state.alignment = btn.dataset.align;
                    updateTextareaStyles();
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.2)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Font weight buttons
            container.querySelectorAll('[data-weight]').forEach(btn => {
                btn.onclick = () => {
                    state.fontWeight = btn.dataset.weight;
                    updateTextareaStyles();
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.2)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Font style buttons
            container.querySelectorAll('[data-style]').forEach(btn => {
                btn.onclick = () => {
                    state.fontStyle = btn.dataset.style;
                    updateTextareaStyles();
                    onChange();
                };
                btn.onmouseover = () => btn.style.filter = 'brightness(1.2)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });
            
            // Textarea with auto-resize
            const textarea = container.querySelector('[data-field="text"]');
            if (textarea) {
                const autoResize = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                };
                
                textarea.oninput = (e) => {
                    state.text = e.target.value;
                    autoResize();
                };
                
                // Initial resize
                setTimeout(autoResize, 0);
            }
            
            // Card-level controls
            const moveUpBtn = container.querySelector('[data-action="move-up-card"]');
            if (moveUpBtn && onMove) {
                moveUpBtn.onclick = () => onMove(-1);
            }
            
            const moveDownBtn = container.querySelector('[data-action="move-down-card"]');
            if (moveDownBtn && onMove) {
                moveDownBtn.onclick = () => onMove(1);
            }
            
            const deleteBtn = container.querySelector('[data-action="delete-card"]');
            if (deleteBtn && onDelete) {
                deleteBtn.onclick = onDelete;
            }
        },
        
       // ===== VIEW MODE RENDERER =====
renderView: function(container, state, onChange) {
    const fontFamily = this.getFontFamily(state.fontStyle);
    
    container.innerHTML = `
        <div style="
            background: var(--bg-2);
            border: var(--border-width) solid var(--border-color);
            border-radius: 8px;
            margin-bottom: var(--margin);
            overflow: hidden;
            min-height: var(--card-height);
            display: flex;
            align-items: stretch;
        ">
            <div style="
                background: var(--bg-4);
                padding: 0 8px;
                font-size: 11px;
                line-height: 15px;
                white-space: pre-wrap;
                word-wrap: break-word;
                text-align: ${state.alignment};
                font-weight: ${state.fontWeight};
                font-family: ${fontFamily};
                color: var(--color-10);
                width: 100%;
                display: flex;
                align-items: center;
            ">${state.text || ''}</div>
        </div>
    `;
}
    };
})();