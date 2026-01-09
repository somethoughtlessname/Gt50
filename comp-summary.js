(function() {
    // Static injector ID
    const INJECTOR_ID = '0027';
    
    // ===== SUMMARY CARD COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Summary = {
        
        // ===== CALCULATE SUMMARY FOR CURRENT TAB =====
        calculateSummary: function(nestState, mode = 'first-tab', specificTabIndex = null) {
            // mode can be 'first-tab' or 'all-tabs'
            // specificTabIndex: if provided, calculate only for that tab (overrides mode)
            let tabsToProcess = [];
            
            if (typeof specificTabIndex === 'number') {
                // Calculate for a specific tab index (handles 0 correctly)
                tabsToProcess = [specificTabIndex];
            } else if (mode === 'all-tabs') {
                // Process all tabs
                for (let i = 0; i < nestState.tabComponents.length; i++) {
                    tabsToProcess.push(i);
                }
            } else {
                // Default: only process active tab (first-tab mode)
                tabsToProcess = [nestState.tabs.activeViewTab];
            }
            
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
                        // FIXED: Count individual items instead of treating as one card
                        if (card.state.items && card.state.items.length > 0) {
                            const completedItems = card.state.items.filter(item => item.completed).length;
                            // Add the total number of items to totalCards
                            totalCards += card.state.items.length;
                            // Add the number of completed items to completedValue
                            completedValue += completedItems;
                        }
                        
                    } else if (card.type === 'progress') {
                        // FIXED: Count individual items instead of treating as one card
                        const total = parseInt(card.state.total) || 0;
                        const current = parseInt(card.state.current) || 0;
                        
                        // Add the total number of items to totalCards
                        totalCards += total;
                        // Add the current progress to completedValue
                        completedValue += current;
                        
                    } else if (card.type === 'tier') {
                        // Use the SAME logic as the tier card view mode
                        let cumulativeAmount = 0;
                        let tiersComplete = 0;
                        
                        for (let i = 0; i < card.state.tiers.length; i++) {
                            const tierAmount = parseInt(card.state.tiers[i].amount) || 0;
                            
                            // Skip invalid amounts
                            if (tierAmount <= 0) continue;
                            
                            // Count this tier
                            totalCards += 1;
                            
                            // Check if this tier is fully complete
                            if (card.state.current >= cumulativeAmount + tierAmount) {
                                cumulativeAmount += tierAmount;
                                tiersComplete += 1;
                            } else {
                                break; // We're in this tier (not complete), stop checking
                            }
                        }
                        
                        completedValue += tiersComplete;
                        
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
            
            // Process all selected tabs
            tabsToProcess.forEach(tabIndex => {
                const components = nestState.tabComponents[tabIndex] || [];
                processComponents(components);
            });
            
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
            
            // Determine color: gold ONLY when 100% complete
            const activeTab = nestState.tabs.activeViewTab;
            const tabColorRaw = nestState.tabs.tabs[activeTab]?.color;
            const tabColor = (tabColorRaw && tabColorRaw !== '') ? tabColorRaw : 'var(--color-4)';
            
            // Check if complete - must be within 0.001 of being exactly equal
            const difference = Math.abs(summary.completedValue - summary.totalCards);
            const isComplete = difference < 0.001;
            
            const fillColor = isComplete ? '#d4af37' : tabColor;
            
            // Determine display text based on summaryDisplayMode
            let displayText = '';
            if (nestState.summaryDisplayMode === 'value') {
                // XX/YY format - FLOOR so partial never rounds up
                const completed = Math.floor(summary.completedValue);
                displayText = `${completed}/${summary.totalCards}`;
            } else if (nestState.summaryDisplayMode === 'percentage') {
                // XX% format - round to nearest integer
                displayText = `${Math.round(summary.percentage)}%`;
            }
            
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
