(function() {
    // ===== SORT FILTER SETTINGS =====
    // Provides settings card for auto-sorting functionality in create/edit windows
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.SortFilter = {
        // ===== RENDER SETTINGS CARD =====
        // This renders in create-new and nest edit windows
        renderSettings: function(container, state, onChange) {
            const settingsColor = 'var(--color-5)';
            
            const html = `
                <!-- Auto Sort Divider -->
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
                    ">AUTO SORT</div>
                </div>
                
                <!-- Auto Sort Activation Card -->
                <div data-action="toggle-sort" style="
                    background: ${state.autoSortByLastUpdated ? settingsColor : 'var(--color-10)'};
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
                ">
                    <div style="
                        font-size: 12px;
                        font-weight: 700;
                        color: ${state.autoSortByLastUpdated ? 'var(--color-10)' : settingsColor};
                        text-transform: uppercase;
                        text-align: center;
                    ">Auto Sort by Last Updated</div>
                    <div style="
                        font-size: 7px;
                        color: ${state.autoSortByLastUpdated ? 'var(--color-10)' : settingsColor};
                        opacity: 0.7;
                        margin-top: 2px;
                        text-align: center;
                        line-height: 1.2;
                    ">Sorts cards by most recently changed</div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', html);
            
            // Event listener
            const toggleBtn = container.querySelector('[data-action="toggle-sort"]');
            if (toggleBtn) {
                toggleBtn.onclick = () => {
                    state.autoSortByLastUpdated = !state.autoSortByLastUpdated;
                    onChange();
                };
                toggleBtn.onmouseover = () => toggleBtn.style.filter = 'brightness(1.2)';
                toggleBtn.onmouseout = () => toggleBtn.style.filter = 'brightness(1)';
            }
        },
        
        // ===== TIMESTAMP TRACKING =====
        // General callback for any component data change
        onComponentChanged: function(container) {
            // Get component index from container's data attribute
            if (container && container.dataset && container.dataset.componentIndex !== undefined) {
                const componentIndex = parseInt(container.dataset.componentIndex);
                
                // Access the current tab's components
                if (window.GT50 && window.GT50._currentTabComponents) {
                    const component = window.GT50._currentTabComponents[componentIndex];
                    if (component) {
                        this.updateTimestamp(component);
                        
                        // Also update parent nests up the hierarchy
                        this.updateParentNestTimestamps();
                        
                        // Trigger save and re-render to apply sorting
                        if (window.saveState) window.saveState();
                        if (window.render) window.render();
                    }
                }
            }
        },
        
        // Update timestamps for all parent nests in the navigation stack
        updateParentNestTimestamps: function() {
            // Access navigation stack and state from global scope
            if (!window.navigationStack || !window.state) return;
            
            const navigationStack = window.navigationStack;
            const rootTabComponents = window.state.tabComponents;
            
            if (!navigationStack || navigationStack.length === 0) return;
            
            // For each nest in the navigation path, update its timestamp
            let currentTabComponents = rootTabComponents;
            
            for (const nestId of navigationStack) {
                // Find the nest component in current level
                const nestComponent = currentTabComponents.flat().find(c => c.id === nestId);
                
                if (nestComponent) {
                    // Update this nest's timestamp
                    this.updateTimestamp(nestComponent);
                    
                    // Move to next level
                    currentTabComponents = nestComponent.state.tabComponents || [[]];
                }
            }
        },
        
        // Legacy callback for list checkboxes (kept for compatibility)
        onListCheckboxToggled: function(container) {
            this.onComponentChanged(container);
        },
        
        // Initialize lastUpdated timestamps for all components
        initializeTimestamps: function(components) {
            const now = Date.now();
            return components.map(comp => {
                if (!comp.lastUpdated) {
                    comp.lastUpdated = now;
                }
                return comp;
            });
        },
        
        // Update timestamp for a specific component
        updateTimestamp: function(component) {
            component.lastUpdated = Date.now();
        },
        
        // Sort components by lastUpdated (most recent first)
        applySorting: function(components) {
            // Initialize timestamps if missing
            this.initializeTimestamps(components);
            
            return [...components].sort((a, b) => {
                const timeA = a.lastUpdated || 0;
                const timeB = b.lastUpdated || 0;
                return timeB - timeA; // Most recent first
            });
        }
    };
})();
