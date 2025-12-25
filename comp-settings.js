(function() {
    // Static injector ID
    const INJECTOR_ID = '0015';
    
    // ===== SETTINGS WINDOW COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Settings = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { 
                isOpen: false,
                header: {
                    isMain: false,
                    title: 'SETTINGS'
                }
            };
        },
        
        // ===== OPEN WINDOW =====
        open: function(state, onChange) {
            state.isOpen = true;
            onChange();
        },
        
        // ===== CLOSE WINDOW =====
        close: function(state, onChange) {
            state.isOpen = false;
            onChange();
        },
        
      // ===== RENDER WINDOW =====
render: function(container, state, onChange, onClose, cardInfoState) {
    if (!state.isOpen) {
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
        background: var(--bg-1);
        z-index: 2000;
        overflow-y: auto;
        padding-top: calc(var(--card-height) + 4px);
        padding-bottom: 4px;
    `;
    
    container.innerHTML = `
        <div id="settings-header" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--card-height);
            z-index: 2001;
        "></div>
        <div id="settings-content" style="
            padding: var(--margin);
        "></div>
    `;
    
    // Render header
    const headerContainer = container.querySelector('#settings-header');
    GT50Lib.Header.renderBuild(headerContainer, state.header, onChange, null, null, null, null, null, null);
    
    // Add close button functionality
    const backBtn = headerContainer.querySelector('[data-action="back"]');
    if (backBtn) {
        backBtn.onclick = onClose;
    }
    
    // Render content - PASS cardInfoState here
    const contentContainer = container.querySelector('#settings-content');
    this.renderContent(contentContainer, onChange, cardInfoState);
},
        
// ===== RENDER CONTENT =====
renderContent: function(container, onChange, cardInfoState) {
    container.innerHTML = '';
    
    // FIRST CARD: Card Info Button (if CardInfo system is available)
    if (window.GT50Lib.CardInfo && cardInfoState) {
        GT50Lib.CardInfo.renderSettingsCard(container, cardInfoState, onChange);
    }
    
    // Add any other settings cards here in the future
    // Example: 
    // this.renderThemeSettings(container, onChange);
    // this.renderExportSettings(container, onChange);
    
    // Placeholder for future settings
    const placeholderCard = document.createElement('div');
    placeholderCard.style.cssText = `
        margin: var(--margin);
        background: var(--bg-2);
        border: var(--border-width) solid var(--border-color);
        border-radius: 8px;
        height: var(--card-height);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-9);
        font-size: 14px;
        font-weight: 600;
    `;
    placeholderCard.textContent = 'More settings coming soon...';
    container.appendChild(placeholderCard);
}
    };
})();