(function() {
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.CardInfo = {
        defaultState: function() {
            return {
                isOpen: false,
                header: {
                    isMain: false,
                    title: 'CARD INFO'
                }
            };
        },
        
        open: function(state, cardType, onChange) {
            state.isOpen = true;
            state.header.title = 'CARD INFO';
            onChange();
        },
        
        close: function(state, onChange) {
            state.isOpen = false;
            onChange();
        },
        
        renderSettingsCard: function(container, state, onChange) {
            const card = document.createElement('div');
            card.style.cssText = `
                margin: var(--margin);
                background: var(--bg-2);
                border: var(--border-width) solid var(--border-color);
                border-radius: 8px;
                height: var(--card-height);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: filter 0.2s;
            `;
            card.innerHTML = `
                <div style="
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--color-10);
                    text-align: center;
                ">CARD INFO</div>
            `;
            
            card.onmouseover = () => card.style.filter = 'brightness(1.2)';
            card.onmouseout = () => card.style.filter = 'brightness(1)';
            card.onclick = () => this.open(state, 'list', onChange);
            
            container.appendChild(card);
        },
        
        render: function(container, state, onChangeOrClose, onClose) {
            const actualOnChange = onClose ? onChangeOrClose : null;
            const actualOnClose = onClose || onChangeOrClose;
            
            const internalRender = () => {
                this.renderContent(container, state, internalRender, actualOnClose);
            };
            
            internalRender();
        },
        
        renderContent: function(container, state, onChange, onClose) {
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
                -webkit-overflow-scrolling: touch;
            `;
            
            container.innerHTML = `
                <div id="cardinfo-header" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                <div id="cardinfo-content" style="
                    padding-top: calc(var(--card-height) + var(--margin));
                    padding-bottom: var(--margin);
                    padding-left: var(--margin);
                    padding-right: var(--margin);
                "></div>
            `;
            
            const headerContainer = container.querySelector('#cardinfo-header');
            GT50Lib.Header.renderBuild(
                headerContainer,
                state.header,
                onChange,
                onClose,
                onClose,
                null,
                null
            );
            
            const contentContainer = container.querySelector('#cardinfo-content');
            this.renderCardList(contentContainer);
        },
        
        renderCardList: function(contentContainer) {
            const allCards = [
                { type: 'list', label: 'LIST', color: 'var(--color-1)', desc: 'Check off tasks as you complete them' },
                { type: 'checklist', label: 'CHECKLIST', color: 'var(--color-1-2)', desc: 'Watch a progress bar fill up as you go' },
                { type: 'radio', label: 'RADIO', color: 'var(--color-1-3)', desc: 'Pick one option from your list' },
                { type: 'threshold', label: 'THRESHOLD', color: 'var(--color-1-4)', desc: 'Count up to a target number for each item' },
                { type: 'accumulation', label: 'COUNT', color: 'var(--color-2)', desc: 'Keep a running total that goes up or down' },
                { type: 'history', label: 'HISTORY', color: 'var(--color-2-2)', desc: 'Record when things happen with timestamps' },
                { type: 'progress', label: 'PROGRESS', color: 'var(--color-3)', desc: 'Watch a bar fill from start to finish' },
                { type: 'tier', label: 'TIER', color: 'var(--color-4)', desc: 'Level up through ranks as you earn points' },
                { type: 'nest', label: 'NEST', color: 'var(--color-5)', desc: 'Click to open a whole new workspace inside' },
                { type: 'cycle', label: 'CYCLE', color: 'var(--color-5-2)', desc: 'Auto-resets daily, weekly, or monthly' },
                { type: 'import', label: 'IMPORT', color: 'var(--color-5-3)', desc: 'Load saved templates and backups' },
                { type: 'divider', label: 'DIVIDER', color: 'var(--color-6)', desc: 'Add labeled sections to organize cards' },
                { type: 'text', label: 'TEXT', color: 'var(--color-6-2)', desc: 'Store notes and info you need to see' },
                { type: 'scale', label: 'SCALE', color: 'var(--color-6-3)', desc: 'Multiply recipe amounts automatically' },
                { type: 'tabs', label: 'TABS', color: 'var(--color-7)', desc: 'Split your cards into separate pages' },
                { type: 'footer', label: 'FOOTER', color: 'var(--color-7-2)', desc: 'The menu at the bottom for adding cards' },
                { type: 'impex', label: 'IMPORT/EXPORT', color: 'var(--color-7-3)', desc: 'Save or load your entire workspace' },
                { type: 'selector', label: 'SELECTOR', color: 'var(--color-7-4)', desc: 'Choose where new cards get placed' }
            ];
            
            contentContainer.innerHTML = allCards.map((card, index) => `
                <div style="
                    width: 100%;
                    height: var(--card-height);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    margin-bottom: ${index === allCards.length - 1 ? '0' : 'var(--margin)'};
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 4px 8px;
                    text-align: center;
                    background: ${card.color};
                ">
                    <div style="
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                        color: var(--font-color-3);
                    ">${card.label}</div>
                    <div style="
                        font-size: 9px;
                        font-weight: 600;
                        opacity: 0.9;
                        line-height: 1.1;
                        color: var(--font-color-3);
                    ">${card.desc}</div>
                </div>
            `).join('');
        }
    };
})();
