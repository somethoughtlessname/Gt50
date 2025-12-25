(function() {
    // Static injector ID
    const INJECTOR_ID = '0022';
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Search = {
        inject: function(container, options = {}) {
            // Default to visible, but allow override via options
            const shouldShow = options.visible !== false;
            
            // Early return if search should not be shown
            if (!shouldShow) return;
            
            const searchWrapper = document.createElement('div');
            searchWrapper.setAttribute('data-search-card', 'true');
            
            searchWrapper.innerHTML = `
                <div style="
                    background: var(--color-9-3);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    margin-bottom: var(--margin);
                    padding: 0 12px;
                ">
                    <input 
                        type="text" 
                        data-search-input="true"
                        placeholder="type to search"
                        style="
                            flex: 1;
                            height: 100%;
                            background: transparent;
                            border: none;
                            padding: 0;
                            color: var(--font-color-3);
                            font-size: 14px;
                            font-weight: 600;
                            font-family: inherit;
                            outline: none;
                        "
                    >
                </div>
            `;
            
            // Insert at the beginning instead of appending at the end
            // This makes the search bar appear at the top, below header/tabs
            container.insertBefore(searchWrapper, container.firstChild);
            
            // Add filter logic
            const input = searchWrapper.querySelector('[data-search-input]');
            if (input) {
                input.addEventListener('input', function(e) {
                    const term = e.target.value.toLowerCase();
                    const allCards = container.querySelectorAll('[data-search-card]');
                    
                    // Loop through all children except search card
                    Array.from(container.children).forEach(child => {
                        // Skip search card itself
                        if (child.hasAttribute('data-search-card')) {
                            return;
                        }
                        
                        // Show all if empty search
                        if (!term) {
                            child.style.display = '';
                            return;
                        }
                        
                        // Filter by text content
                        const text = child.textContent.toLowerCase();
                        child.style.display = text.includes(term) ? '' : 'none';
                    });
                });
            }
        }
    };
})();