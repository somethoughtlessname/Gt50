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
                },
                // Global settings
                tierDropdownCheckboxes: false
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
        padding: 4px;
        padding-top: calc(var(--card-height) + 4px);
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
        <div id="settings-content"></div>
    `;
    
    // Render header
    const headerContainer = container.querySelector('#settings-header');
    GT50Lib.Header.renderBuild(headerContainer, state.header, onChange, null, null, null, null, null, null);
    
    // Add close button functionality
    const backBtn = headerContainer.querySelector('[data-action="back"]');
    if (backBtn) {
        backBtn.onclick = onClose;
    }
    
    // Render content - PASS cardInfoState and settings state here
    const contentContainer = container.querySelector('#settings-content');
    this.renderContent(contentContainer, state, onChange, cardInfoState);
},
        
// ===== RENDER CONTENT =====
renderContent: function(container, settingsState, onChange, cardInfoState) {
    container.innerHTML = '';
    
    // FIRST CARD: Card Info Button (if CardInfo system is available)
    if (window.GT50Lib.CardInfo && cardInfoState) {
        const cardInfoCard = document.createElement('div');
        cardInfoCard.style.cssText = `
            background: var(--bg-2);
            border: var(--border-width) solid var(--border-color);
            border-radius: 8px;
            height: var(--card-height);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: filter 0.2s;
            margin-bottom: 4px;
        `;
        cardInfoCard.innerHTML = `
            <div style="
                font-size: 16px;
                font-weight: 700;
                color: var(--color-10);
                text-align: center;
            ">CARD INFO</div>
        `;
        
        cardInfoCard.onmouseover = () => cardInfoCard.style.filter = 'brightness(1.2)';
        cardInfoCard.onmouseout = () => cardInfoCard.style.filter = 'brightness(1)';
        cardInfoCard.onclick = () => GT50Lib.CardInfo.open(cardInfoState, 'list', onChange);
        
        container.appendChild(cardInfoCard);
    }
    
    // DIVIDER: App Settings
    const dividerCard = document.createElement('div');
    dividerCard.style.cssText = `
        height: var(--card-height);
        background: transparent;
        border: var(--border-width) solid rgba(0, 0, 0, 0.0);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;
        position: relative;
    `;
    dividerCard.innerHTML = `
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
            background: var(--bg-1);
            padding: 0 12px;
            font-size: 12px;
            font-weight: 700;
            color: var(--font-color-3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 2;
        ">APP SETTINGS</div>
    `;
    container.appendChild(dividerCard);
    
    // SECOND CARD: Tier Dropdown Checkboxes Toggle
    const tierToggleCard = document.createElement('div');
    tierToggleCard.style.cssText = `
        background: var(--bg-2);
        border: var(--border-width) solid var(--border-color);
        border-radius: 8px;
        height: var(--card-height);
        display: flex;
        align-items: center;
        overflow: hidden;
    `;
    
    const isEnabled = settingsState.tierDropdownCheckboxes || false;
    
    tierToggleCard.innerHTML = `
        <div style="
            width: var(--square-section);
            height: 100%;
            background: ${isEnabled ? 'var(--color-4)' : 'var(--color-10)'};
            border-right: var(--border-width) solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 700;
            color: ${isEnabled ? 'var(--color-10)' : 'var(--color-4)'};
            cursor: pointer;
        " data-action="toggle-tier-dropdown">✓</div>
        <div style="
            flex: 1;
            padding: 0 var(--text-padding-left);
            font-size: 14px;
            font-weight: 600;
            color: var(--font-color-3);
        ">Tier Dropdown Checkboxes</div>
    `;
    
    const toggleBtn = tierToggleCard.querySelector('[data-action="toggle-tier-dropdown"]');
    toggleBtn.onclick = () => {
        settingsState.tierDropdownCheckboxes = !settingsState.tierDropdownCheckboxes;
        onChange();
    };
    
    container.appendChild(tierToggleCard);
}
    };
})();