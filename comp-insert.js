(function() {
    // ===== INSERTION SELECTOR COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Insert = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { selectedIndex: 0 };
        },
        
        // ===== RENDER FUNCTION =====
        render: function(container, componentCount, selectedIndex, onSelect) {
            const numSections = componentCount + 1;
            
            // If selectedIndex is not provided or invalid, default to bottom
            if (selectedIndex === undefined || selectedIndex === null || selectedIndex < 0) {
                selectedIndex = componentCount; // Bottom position
            }
            // Ensure selectedIndex doesn't exceed available sections
            if (selectedIndex > componentCount) {
                selectedIndex = componentCount;
            }
            
            // ===== HEIGHT CALCULATIONS =====
            const firstHeight = 22.5;
            const lastHeight = 22.5;
            const middleHeight = 49;
            const totalHeight = firstHeight + (middleHeight * (numSections - 2)) + lastHeight;
            
            // ===== CONTAINER STRUCTURE =====
            container.innerHTML = `
                <div style="
                    width: 20px;
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: ${totalHeight}px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex-shrink: 0;
                ">
                    ${Array.from({ length: numSections }, (_, i) => {
                        let height;
                        if (i === 0) height = firstHeight;
                        else if (i === numSections - 1) height = lastHeight;
                        else height = middleHeight;
                        
                        const isSelected = i === selectedIndex;
                        const bgColor = isSelected ? 'var(--accent)' : 'var(--bg-4)';
                        
                        return `
                            <div data-selector-index="${i}" style="
                                background: ${bgColor};
                                ${i < numSections - 1 ? 'border-bottom: var(--border-width) solid var(--border-color);' : ''}
                                height: ${height}px;
                                min-height: ${height}px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: background 0.2s;
                            "></div>
                        `;
                    }).join('')}
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            container.querySelectorAll('[data-selector-index]').forEach(section => {
                const index = parseInt(section.dataset.selectorIndex);
                
                section.onclick = () => {
                    if (onSelect) onSelect(index);
                };
                
                section.onmouseover = () => {
                    if (index !== selectedIndex) {
                        section.style.background = 'var(--primary)';
                    }
                };
                
                section.onmouseout = () => {
                    if (index !== selectedIndex) {
                        section.style.background = 'var(--bg-4)';
                    }
                };
            });
        }
    };
})();