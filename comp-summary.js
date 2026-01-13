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
            
            // NEW LOGIC FOR ALL-TABS MODE:
            // Each tab contributes equally to the overall percentage
            // If tab is 100% complete, it fills its portion (1/numTabs) of the card
            if (mode === 'all-tabs' && specificTabIndex === null) {
                const numTabs = nestState.tabComponents.length;
                if (numTabs === 0) {
                    return { totalCards: 0, completedValue: 0, percentage: 0 };
                }
                
                let totalPercentage = 0;
                let totalCardsAcrossAllTabs = 0;
                let completedValueAcrossAllTabs = 0;
                
                // Calculate completion percentage for each tab
                for (let i = 0; i < numTabs; i++) {
                    const tabSummary = this.calculateSummary(nestState, 'first-tab', i);
                    
                    // Each tab contributes its percentage divided by number of tabs
                    totalPercentage += tabSummary.percentage / numTabs;
                    
                    // Also track total cards and completed for display purposes
                    totalCardsAcrossAllTabs += tabSummary.totalCards;
                    completedValueAcrossAllTabs += tabSummary.completedValue;
                }
                
                return {
                    totalCards: totalCardsAcrossAllTabs,
                    completedValue: completedValueAcrossAllTabs,
                    percentage: totalPercentage
                };
            }
            
            // ORIGINAL LOGIC FOR FIRST-TAB OR SPECIFIC TAB:
            let tabsToProcess = [];
            
            if (specificTabIndex !== null) {
                // Calculate for a specific tab index
                tabsToProcess = [specificTabIndex];
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
            
            // Check if tab tracking bars mode is enabled
            const showTabBars = nestState.summaryShowTabBars === true;
            const numTabs = nestState.tabs.tabs.length;
            
            if (showTabBars && numTabs > 1) {
                // Render tab tracking bars mode (only if 2+ tabs)
                this.renderTabTrackingBars(container, nestState);
            } else {
                // Render standard summary bar
                this.renderStandardSummary(container, nestState);
            }
        },
        
        // ===== RENDER STANDARD SUMMARY BAR =====
        renderStandardSummary: function(container, nestState) {
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
        },
        
        // ===== RENDER TAB TRACKING BARS =====
        renderTabTrackingBars: function(container, nestState) {
            const numTabs = nestState.tabs.tabs.length;
            
            // Don't show bars if only 1 tab
            if (numTabs <= 1) return;
            
            // Calculate progress for each tab (max 6 tabs)
            const tabProgressData = [];
            for (let i = 0; i < Math.min(numTabs, 6); i++) {
                const tabSummary = this.calculateSummary(nestState, 'first-tab', i);
                
                // Skip this tab if it has no trackable cards
                if (tabSummary.totalCards === 0) continue;
                
                const tabColorRaw = nestState.tabs.tabs[i].color;
                const tabColor = (tabColorRaw && tabColorRaw !== '') ? tabColorRaw : 'var(--color-4)';
                const tabName = nestState.tabs.tabs[i].label || nestState.tabs.tabs[i].name || `Tab ${i + 1}`;
                
                // Determine color: gold if 100% complete
                const difference = Math.abs(tabSummary.completedValue - tabSummary.totalCards);
                const isComplete = difference < 0.001;
                const barColor = isComplete ? '#d4af37' : tabColor;
                
                tabProgressData.push({
                    name: tabName,
                    percentage: tabSummary.percentage,
                    color: barColor
                });
            }
            
            // Don't render if no tabs have trackable cards
            if (tabProgressData.length === 0) return;
            
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'summary-tab-bars';
            summaryDiv.style.cssText = `
                position: relative;
                margin-bottom: var(--margin);
            `;
            
            summaryDiv.innerHTML = `
                <style>
                    /* Tab label overflow scrolling animation */
                    @keyframes ticker-scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-33.333%);
                        }
                    }
                    
                    .tab-bar-label-text.scroll {
                        animation: ticker-scroll 12s linear infinite;
                    }
                    
                    .tab-bar-label-text.scroll::before,
                    .tab-bar-label-text.scroll::after {
                        content: attr(data-text);
                        padding-right: 40px;
                    }
                    
                    .tab-bar-label-text.scroll::before {
                        padding-left: 40px;
                    }
                    
                    /* Override centering for scrolling labels */
                    .tab-bar-label:has(.scroll) {
                        justify-content: flex-start !important;
                    }
                </style>
                
                <!-- Base card at 0% opacity (invisible, maintains spacing) -->
                <div style="
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    overflow: hidden;
                    opacity: 0;
                "></div>
                
                <!-- Overlay card with tab bars -->
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
                        height: 100%;
                        display: flex;
                        gap: var(--margin);
                        padding: var(--margin);
                    ">
                        ${tabProgressData.map(tab => `
                            <div style="
                                flex: 1;
                                background: var(--bg-2);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 4px;
                                position: relative;
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
                                        width: ${Math.min(100, tab.percentage)}%;
                                        background: ${tab.color};
                                        transition: width 0.3s ease;
                                    "></div>
                                    <div class="tab-bar-label" style="
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 7px;
                                        font-weight: 700;
                                        color: var(--color-10);
                                        text-transform: uppercase;
                                        letter-spacing: 0.5px;
                                        z-index: 1;
                                        overflow: hidden;
                                    ">
                                        <span class="tab-bar-label-text" data-text="${tab.name}">${tab.name}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.appendChild(summaryDiv);
            
            // Check for overflow and add scroll animation
            setTimeout(() => {
                const labels = summaryDiv.querySelectorAll('.tab-bar-label-text');
                labels.forEach(label => {
                    const parent = label.closest('.tab-bar-label');
                    const textWidth = label.offsetWidth;
                    const containerWidth = parent.offsetWidth;
                    
                    // Add scroll class if text is wider than container
                    if (textWidth > containerWidth) {
                        label.classList.add('scroll');
                    }
                });
            }, 0);
        }
    };
})();
