(function() {
    // Static injector ID
    const INJECTOR_ID = '0010';
    
    // ===== LIBRARY EXPORT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Tabs = {
        // Default state factory
        defaultState: function() {
            return {
                tabs: [],
                selectedBuildTab: 0,
                activeViewTab: 0,
                editingTab: null
            };
        },
        
        rainbowColors: [
            'var(--color-4)', 'var(--color-5)', 'var(--color-6)', 'var(--color-7)',
            'var(--color-1)', 'var(--color-2)', 'var(--color-3)'
        ],
        
        // Build mode renderer
        renderBuild: function(container, state, onChange) {
            const count = state.tabs.length;
            
            container.innerHTML = '';
            container.style.cssText = `
                position: fixed;
                top: var(--card-height);
                left: 0;
                right: 0;
                height: calc(var(--card-height) + 4px);
                background: var(--bg-3);
                border-bottom: var(--border-width) solid var(--border-color);
                z-index: 1000;
                display: flex;
            `;
            
            // If no tabs, show "ADD TABS" button
            if (count === 0) {
                const addTabsBtn = document.createElement('div');
                addTabsBtn.style.cssText = `
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
                `;
                addTabsBtn.textContent = 'ADD TABS';
                addTabsBtn.onmouseover = () => addTabsBtn.style.filter = 'brightness(1.2)';
                addTabsBtn.onmouseout = () => addTabsBtn.style.filter = 'brightness(1)';
                addTabsBtn.onclick = () => this.addTab(state, onChange);
                container.appendChild(addTabsBtn);
                return;
            }
            
            if (count <= 3) {
                // Single row
                container.className = 'tabs-container single-row';
                
                // Delete button
                const deleteBtn = this.createControlButton('×', () => this.deleteTab(state, onChange));
                deleteBtn.style.borderRight = 'var(--border-width) solid var(--border-color)';
                container.appendChild(deleteBtn);
                
                // Position control
                container.appendChild(this.createPositionControl(state, onChange));
                
                // Tabs
                for (let i = 0; i < count; i++) {
                    container.appendChild(this.createBuildTab(i, state, onChange, i === 0));
                }
                
                // Color control
                container.appendChild(this.createColorControl(state, onChange));
                
                // Add button
                const addBtn = this.createControlButton('+', () => this.addTab(state, onChange));
                addBtn.style.borderLeft = 'var(--border-width) solid var(--border-color)';
                container.appendChild(addBtn);
            } else {
                // Double row
                container.className = 'tabs-container double-row';
                
                let topCount, bottomCount;
                if (count === 4) {
                    topCount = 2;
                    bottomCount = 2;
                } else if (count === 5) {
                    topCount = 3;
                    bottomCount = 2;
                } else {
                    topCount = 3;
                    bottomCount = 3;
                }
                
                // Delete button (full height)
                const deleteBtn = this.createControlButton('×', () => this.deleteTab(state, onChange));
                deleteBtn.style.borderRight = 'var(--border-width) solid var(--border-color)';
                container.appendChild(deleteBtn);
                
                // Position control (full height)
                container.appendChild(this.createPositionControl(state, onChange));
                
                // Tabs wrapper
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-width: 0;
                    overflow: hidden;
                `;
                
                // Top row
                const topRow = document.createElement('div');
                topRow.style.cssText = `
                    flex: 1;
                    display: flex;
                    border-bottom: var(--border-width) solid var(--border-color);
                `;
                for (let i = 0; i < topCount; i++) {
                    topRow.appendChild(this.createBuildTab(i, state, onChange, i === 0));
                }
                wrapper.appendChild(topRow);
                
                // Bottom row
                const bottomRow = document.createElement('div');
                bottomRow.style.cssText = `
                    flex: 1;
                    display: flex;
                `;
                for (let i = topCount; i < count; i++) {
                    bottomRow.appendChild(this.createBuildTab(i, state, onChange, i === topCount));
                }
                wrapper.appendChild(bottomRow);
                
                container.appendChild(wrapper);
                
                // Color control (full height)
                container.appendChild(this.createColorControl(state, onChange));
                
                // Add button (full height)
                const addBtn = this.createControlButton('+', () => this.addTab(state, onChange));
                addBtn.style.borderLeft = 'var(--border-width) solid var(--border-color)';
                container.appendChild(addBtn);
            }
        },
        
        // View mode renderer
        renderView: function(container, state, onChange) {
            const count = state.tabs.length;
            
            container.innerHTML = '';
            container.style.cssText = `
                position: fixed;
                top: var(--card-height);
                left: 0;
                right: 0;
                height: calc(var(--card-height) + 4px);
                background: transparent;
                z-index: 1000;
                display: flex;
                flex-direction: column;
            `;
            
            // Create wrapper for actual tab content that accounts for header border
            const tabWrapper = document.createElement('div');
            tabWrapper.style.cssText = `
                flex: 1;
                display: flex;
                border-bottom: var(--border-width) solid var(--border-color);
            `;
            
            // If no tabs, show empty space
            if (count === 0) {
                const emptySpace = document.createElement('div');
                emptySpace.style.cssText = `
                    flex: 1;
                    height: 100%;
                    background: var(--bg-4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--font-color-3);
                    opacity: 0.5;
                `;
                emptySpace.textContent = 'NO TABS';
                tabWrapper.appendChild(emptySpace);
                container.appendChild(tabWrapper);
                return;
            }
            
            if (count <= 3) {
                // Single row
                for (let i = 0; i < count; i++) {
                    const tab = document.createElement('div');
                    tab.style.cssText = `
                        flex: 1;
                        min-width: 0;
                        height: 100%;
                        background: ${i === state.activeViewTab ? state.tabs[i].color : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                        ${i < count - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding: 0 8px;
                    `;
                    tab.textContent = state.tabs[i].name;
                    tab.onmouseover = () => tab.style.filter = 'brightness(1.2)';
                    tab.onmouseout = () => tab.style.filter = 'brightness(1)';
                    tab.onclick = () => {
                        state.activeViewTab = i;
                        onChange();
                    };
                    tabWrapper.appendChild(tab);
                }
            } else {
                // Double row
                let topCount, bottomCount;
                if (count === 4) {
                    topCount = 2;
                    bottomCount = 2;
                } else if (count === 5) {
                    topCount = 3;
                    bottomCount = 2;
                } else {
                    topCount = 3;
                    bottomCount = 3;
                }
                
                const innerWrapper = document.createElement('div');
                innerWrapper.style.cssText = `
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                `;
                
                // Top row
                const topRow = document.createElement('div');
                topRow.style.cssText = `
                    flex: 1;
                    display: flex;
                    border-bottom: var(--border-width) solid var(--border-color);
                `;
                for (let i = 0; i < topCount; i++) {
                    const tab = document.createElement('div');
                    tab.style.cssText = `
                        flex: 1;
                        min-width: 0;
                        height: 100%;
                        background: ${i === state.activeViewTab ? state.tabs[i].color : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                        ${i < topCount - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding: 0 8px;
                    `;
                    tab.textContent = state.tabs[i].name;
                    tab.onmouseover = () => tab.style.filter = 'brightness(1.2)';
                    tab.onmouseout = () => tab.style.filter = 'brightness(1)';
                    tab.onclick = () => {
                        state.activeViewTab = i;
                        onChange();
                    };
                    topRow.appendChild(tab);
                }
                innerWrapper.appendChild(topRow);
                
                // Bottom row
                const bottomRow = document.createElement('div');
                bottomRow.style.cssText = `
                    flex: 1;
                    display: flex;
                `;
                for (let i = topCount; i < count; i++) {
                    const tab = document.createElement('div');
                    tab.style.cssText = `
                        flex: 1;
                        min-width: 0;
                        height: 100%;
                        background: ${i === state.activeViewTab ? state.tabs[i].color : 'var(--bg-4)'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: var(--font-color-3);
                        cursor: pointer;
                        transition: filter 0.2s;
                        ${i < count - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding: 0 8px;
                    `;
                    tab.textContent = state.tabs[i].name;
                    tab.onmouseover = () => tab.style.filter = 'brightness(1.2)';
                    tab.onmouseout = () => tab.style.filter = 'brightness(1)';
                    tab.onclick = () => {
                        state.activeViewTab = i;
                        onChange();
                    };
                    bottomRow.appendChild(tab);
                }
                innerWrapper.appendChild(bottomRow);
                
                tabWrapper.appendChild(innerWrapper);
            }
            
            container.appendChild(tabWrapper);
        },
        
        // Helper: Create control button
        createControlButton: function(text, onClick) {
            const button = document.createElement('div');
            button.style.cssText = `
                width: var(--square-section);
                min-width: var(--square-section);
                max-width: var(--square-section);
                flex-shrink: 0;
                height: 100%;
                background: var(--bg-4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: 600;
                color: var(--font-color-3);
                cursor: pointer;
                transition: filter 0.2s;
            `;
            button.textContent = text;
            button.onmouseover = () => button.style.filter = 'brightness(1.2)';
            button.onmouseout = () => button.style.filter = 'brightness(1)';
            button.onclick = onClick;
            return button;
        },
        
        // Helper: Create position control
        createPositionControl: function(state, onChange) {
            const control = document.createElement('div');
            control.style.cssText = `
                width: calc(var(--square-section) * 2);
                min-width: calc(var(--square-section) * 2);
                max-width: calc(var(--square-section) * 2);
                flex-shrink: 0;
                height: 100%;
                background: var(--bg-4);
                display: flex;
                border-right: var(--border-width) solid var(--border-color);
            `;
            
            const leftBtn = document.createElement('div');
            leftBtn.style.cssText = `
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: 600;
                color: var(--font-color-3);
                cursor: pointer;
                transition: filter 0.2s;
                border-right: var(--border-width) solid var(--border-color);
            `;
            leftBtn.textContent = '◀';
            leftBtn.onmouseover = () => leftBtn.style.filter = 'brightness(1.2)';
            leftBtn.onmouseout = () => leftBtn.style.filter = 'brightness(1)';
            leftBtn.onclick = () => this.moveTab(state, -1, onChange);
            
            const rightBtn = document.createElement('div');
            rightBtn.style.cssText = `
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: 600;
                color: var(--font-color-3);
                cursor: pointer;
                transition: filter 0.2s;
            `;
            rightBtn.textContent = '▶';
            rightBtn.onmouseover = () => rightBtn.style.filter = 'brightness(1.2)';
            rightBtn.onmouseout = () => rightBtn.style.filter = 'brightness(1)';
            rightBtn.onclick = () => this.moveTab(state, 1, onChange);
            
            control.appendChild(leftBtn);
            control.appendChild(rightBtn);
            return control;
        },
        
        // Helper: Create color control
        createColorControl: function(state, onChange) {
            const control = document.createElement('div');
            control.style.cssText = `
                width: var(--square-section);
                min-width: var(--square-section);
                max-width: var(--square-section);
                flex-shrink: 0;
                height: 100%;
                background: var(--color-10);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: filter 0.2s;
                border-left: var(--border-width) solid var(--border-color);
            `;
            
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 14px;
                height: 14px;
                background: ${state.tabs[state.selectedBuildTab].color};
                border-radius: 50%;
            `;
            
            control.appendChild(dot);
            control.onmouseover = () => control.style.filter = 'brightness(1.2)';
            control.onmouseout = () => control.style.filter = 'brightness(1)';
            control.onclick = () => this.cycleColor(state, onChange);
            
            return control;
        },
        
        // Helper: Create build tab
        createBuildTab: function(index, state, onChange, isFirst) {
            const tab = document.createElement('div');
            tab.style.cssText = `
                flex: 1;
                min-width: 0;
                height: 100%;
                background: ${index === state.selectedBuildTab ? state.tabs[index].color : 'var(--bg-4)'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                color: var(--font-color-3);
                cursor: pointer;
                transition: filter 0.2s;
                ${isFirst ? '' : 'border-left: var(--border-width) solid var(--border-color);'}
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 8px;
                position: relative;
            `;
            
            if (state.editingTab === index) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = state.tabs[index].name;
                input.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--font-color-3);
                    padding: 0;
                `;
                input.oninput = (e) => {
                    state.tabs[index].name = e.target.value;
                };
                input.onblur = () => {
                    state.editingTab = null;
                    onChange();
                };
                input.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                        state.editingTab = null;
                        onChange();
                    }
                };
                tab.appendChild(input);
                setTimeout(() => input.focus(), 0);
            } else {
                tab.textContent = state.tabs[index].name;
                tab.onmouseover = () => tab.style.filter = 'brightness(1.2)';
                tab.onmouseout = () => tab.style.filter = 'brightness(1)';
                tab.onclick = () => {
                    if (index === state.selectedBuildTab) {
                        state.editingTab = index;
                    } else {
                        state.selectedBuildTab = index;
                        state.editingTab = null;
                    }
                    onChange();
                };
            }
            
            return tab;
        },
        
        // Actions
        addTab: function(state, onChange) {
            if (state.tabs.length < 6) {
                state.tabs.push({
                    name: `TAB ${state.tabs.length + 1}`,
                    color: 'var(--color-4)'
                });
                onChange();
            }
        },
        
        deleteTab: function(state, onChange) {
            if (state.tabs.length > 0) {
                state.tabs.splice(state.selectedBuildTab, 1);
                if (state.selectedBuildTab >= state.tabs.length && state.tabs.length > 0) {
                    state.selectedBuildTab = state.tabs.length - 1;
                } else if (state.tabs.length === 0) {
                    state.selectedBuildTab = 0;
                }
                state.editingTab = null;
                onChange();
            }
        },
        
        moveTab: function(state, direction, onChange) {
            const newIndex = state.selectedBuildTab + direction;
            if (newIndex >= 0 && newIndex < state.tabs.length) {
                [state.tabs[state.selectedBuildTab], state.tabs[newIndex]] = 
                [state.tabs[newIndex], state.tabs[state.selectedBuildTab]];
                state.selectedBuildTab = newIndex;
                onChange();
            }
        },
        
        cycleColor: function(state, onChange) {
            const currentColor = state.tabs[state.selectedBuildTab].color;
            const currentIndex = this.rainbowColors.indexOf(currentColor);
            const nextIndex = (currentIndex + 1) % this.rainbowColors.length;
            state.tabs[state.selectedBuildTab].color = this.rainbowColors[nextIndex];
            onChange();
        }
    };
    
    // ===== BACKWARD COMPATIBILITY =====
    if (typeof GT50 !== 'undefined' && GT50.registerCard) {
        GT50.registerCard('build', function(container) {
            const tabState = GT50Lib.Tabs.defaultState();
            function render() { GT50Lib.Tabs.renderBuild(container, tabState, render); }
            render();
        });
        
        GT50.registerCard('view', function(container) {
            const tabState = GT50Lib.Tabs.defaultState();
            function render() { GT50Lib.Tabs.renderView(container, tabState, render); }
            render();
        });
    }
    
})();