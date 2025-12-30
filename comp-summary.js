(function() {
    // Static injector ID
    const INJECTOR_ID = '0027';
    
    // ===== SUMMARY CARD COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Summary = {
        
        // ===== CALCULATE SUMMARY FOR CURRENT TAB =====
        calculateSummary: function(nestState) {
            const activeTab = nestState.tabs.activeViewTab;
            const components = nestState.tabComponents[activeTab] || [];
            
            let totalCards = 0;
            let completedValue = 0;
            
            const processComponents = (comps) => {
                comps.forEach(card => {
                    if (card.type === 'list') {
                        totalCards += 1;
                        // If list has items (dropdown), each item contributes proportionally
                        if (card.state.items && card.state.items.length > 0) {
                            const completedItems = card.state.items.filter(item => item.completed).length;
                            const percent = completedItems / card.state.items.length;
                            completedValue += percent;
                        } else {
                            // Single item mode - check state.completed
                            if (card.state.completed) completedValue += 1;
                        }
                        
                    } else if (card.type === 'checklist') {
                        totalCards += 1;
                        // Checklist items contribute proportionally
                        if (card.state.items && card.state.items.length > 0) {
                            const completedItems = card.state.items.filter(item => item.completed).length;
                            const percent = completedItems / card.state.items.length;
                            completedValue += percent;
                        }
                        
                    } else if (card.type === 'progress') {
                        totalCards += 1;
                        const percent = card.state.total > 0 ? card.state.current / card.state.total : 0;
                        completedValue += percent;
                        
                    } else if (card.type === 'tier') {
                        // Each tier counts as 1 card slot, filled sequentially
                        let remainingCurrent = card.state.current;
                        
                        card.state.tiers.forEach(tier => {
                            totalCards += 1;
                            
                            if (remainingCurrent <= 0) {
                                // No progress in this tier
                                completedValue += 0;
                            } else if (remainingCurrent >= tier.amount) {
                                // Tier is completely filled
                                completedValue += 1;
                                remainingCurrent -= tier.amount;
                            } else {
                                // Tier is partially filled
                                const percent = remainingCurrent / tier.amount;
                                completedValue += percent;
                                remainingCurrent = 0;
                            }
                        });
                        
                    } else if (card.type === 'radio') {
                        totalCards += 1;
                        // Radio counts as 1 only when a selection is made
                        if (card.state.selectedIndex !== null && card.state.selectedIndex !== undefined) {
                            completedValue += 1;
                        }
                        
                    } else if (card.type === 'threshold') {
                        totalCards += 1;
                        // Threshold counts only required increments proportionally, not extras
                        const threshold = card.state.number1 || 0;
                        const completed = card.state.items.filter(i => i.completed).length;
                        const percent = threshold > 0 ? Math.min(completed / threshold, 1) : 0;
                        completedValue += percent;
                        
                    } else if ((card.type === 'nest' || card.type === 'cycle') && nestState.summaryIncludeChildren) {
                        // Recursively process child nests if option is enabled
                        if (card.state.tabComponents) {
                            card.state.tabComponents.forEach(tabComps => {
                                processComponents(tabComps);
                            });
                        }
                    }
                    // Accumulation, History, Scale, Text, Divider are NOT tracked
                });
            };
            
            processComponents(components);
            
            return {
                totalCards,
                completedValue,
                percentage: totalCards > 0 ? (completedValue / totalCards) * 100 : 0
            };
        },
        
        // ===== VIEW MODE SUMMARY CARD =====
        renderSummaryCard: function(container, nestState, onChange) {
            // Only render if toggle is enabled
            if (!nestState.showSummary) return;
            
            // Calculate for current tab
            const summary = this.calculateSummary(nestState);
            
            // Hide if no trackable cards at all
            if (summary.totalCards === 0) return;
            
            // Determine color: gold at 100%, otherwise tab color (or green if empty)
            const activeTab = nestState.tabs.activeViewTab;
            const tabColorRaw = nestState.tabs.tabs[activeTab]?.color;
            const tabColor = (tabColorRaw && tabColorRaw !== '') ? tabColorRaw : 'var(--color-4)';
            const isComplete = summary.percentage >= 100;
            const fillColor = isComplete ? '#d4af37' : tabColor;
            
            // Determine display text based on summaryDisplayMode
            let displayText = '';
            if (nestState.summaryDisplayMode === 'value') {
                // XX/YY format - round completed value to nearest integer
                const completed = Math.round(summary.completedValue);
                displayText = `${completed}/${summary.totalCards}`;
            } else if (nestState.summaryDisplayMode === 'percentage') {
                // XX% format - round to nearest integer
                displayText = `${Math.round(summary.percentage)}%`;
            }
            // If summaryDisplayMode is null/undefined, displayText stays empty
            
            const summaryDiv = document.createElement('div');
            summaryDiv.style.cssText = `
                position: relative;
                margin-bottom: var(--margin);
            `;
            
            summaryDiv.innerHTML = `
                <!-- Base card at 0% opacity (invisible, maintains spacing) -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    overflow: hidden;
                    opacity: 0;
                ">
                    <div style="
                        background: var(--bg-4);
                        height: 100%;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: ${Math.min(100, summary.percentage)}%;
                            background: ${fillColor};
                        "></div>
                    </div>
                </div>
                
                <!-- Overlay dropdown-sized card at full opacity -->
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    transform: translateY(-50%);
                    z-index: 10;
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: 22.5px;
                    overflow: hidden;
                ">
                    <div style="
                        background: var(--bg-4);
                        height: 100%;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: ${Math.min(100, summary.percentage)}%;
                            background: ${fillColor};
                            transition: width 0.3s ease, background 0.3s ease;
                        "></div>
                        ${displayText ? `
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 11px;
                                font-weight: 700;
                                color: var(--color-10);
                                z-index: 1;
                            ">${displayText}</div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            container.appendChild(summaryDiv);
        }
    };
})();