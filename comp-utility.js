(function() {
    // Static injector ID
    const INJECTOR_ID = '0014';
    
    // =====================================================
    // GT50 UTILITY LIBRARY
    // =====================================================
    // Centralized utilities for consistent behavior across all components
    // This file provides reusable functions that eliminate code duplication
    // and ensure visual/functional consistency throughout the application
    // =====================================================
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Utils = {
        
        // =====================================================
        // SECTION 1: UI GENERATORS
        // =====================================================
        // Functions that generate common UI elements used across components
        // These ensure visual consistency and reduce HTML duplication
        // =====================================================
        
        /**
         * Creates standardized control buttons (move up, move down, delete)
         * Used in: ALL components' renderBuild methods
         * 
         * @param {HTMLElement} container - Container to attach buttons to
         * @param {string} bgColor - Background color for the buttons (CSS variable or hex)
         * @param {Function} onMoveUp - Callback for move up action
         * @param {Function} onMoveDown - Callback for move down action
         * @param {Function} onDelete - Callback for delete action
         * @param {boolean} isDeletePending - Whether delete confirmation is pending
         * 
         * Example usage in component:
         *   GT50Lib.Utils.attachControlButtons(
         *       container, 'var(--color-5)', 
         *       () => onMove(-1), () => onMove(1), 
         *       () => onDelete(), isDeletePending
         *   );
         */
        attachControlButtons: function(container, bgColor, onMoveUp, onMoveDown, onDelete, isDeletePending) {
            const controlsDiv = container.querySelector('[data-controls]');
            if (!controlsDiv) return;
            
            const upBtn = controlsDiv.querySelector('[data-action="move-up-card"]');
            const downBtn = controlsDiv.querySelector('[data-action="move-down-card"]');
            const delBtn = controlsDiv.querySelector('[data-action="delete-card"]');
            
            if (upBtn && onMoveUp) {
                upBtn.onclick = onMoveUp;
                upBtn.onmouseover = () => upBtn.style.filter = 'brightness(var(--hover-brightness))';
                upBtn.onmouseout = () => upBtn.style.filter = 'brightness(1)';
            }
            
            if (downBtn && onMoveDown) {
                downBtn.onclick = onMoveDown;
                downBtn.onmouseover = () => downBtn.style.filter = 'brightness(var(--hover-brightness))';
                downBtn.onmouseout = () => downBtn.style.filter = 'brightness(1)';
            }
            
            if (delBtn && onDelete) {
                delBtn.onclick = onDelete;
                if (!isDeletePending) {
                    delBtn.onmouseover = () => delBtn.style.filter = 'brightness(var(--hover-brightness))';
                    delBtn.onmouseout = () => delBtn.style.filter = 'brightness(1)';
                }
            }
        },
        
        /**
         * Generates HTML for standardized control buttons
         * Used in: ALL components' renderBuild methods
         * 
         * @param {string} bgColor - Background color for the buttons
         * @param {boolean} isDeletePending - Whether delete confirmation is pending
         * @returns {string} HTML string for control buttons
         * 
         * Example usage:
         *   const controlsHTML = GT50Lib.Utils.generateControlButtonsHTML('var(--color-5)', isDeletePending);
         */
        generateControlButtonsHTML: function(bgColor, isDeletePending) {
            return `
                <div data-controls style="
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: flex;
                    height: var(--card-height);
                    border-left: var(--border-width) solid var(--border-color);
                ">
                    <button data-action="move-up-card" style="
                        width: var(--square-section);
                        height: 100%;
                        background: transparent;
                        border: none;
                        border-right: var(--border-width) solid var(--border-color);
                        color: var(--control-button-color);
                        cursor: pointer;
                        font-family: inherit;
                        position: relative;
                        font-size: var(--up-sub-size);
                        font-weight: var(--up-sub-weight);
                        transition: filter var(--transition-speed);
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: ${bgColor};
                            filter: brightness(var(--control-button-brightness));
                            z-index: -1;
                        "></div>▲
                    </button>
                    <button data-action="move-down-card" style="
                        width: var(--square-section);
                        height: 100%;
                        background: transparent;
                        border: none;
                        border-right: var(--border-width) solid var(--border-color);
                        color: var(--control-button-color);
                        cursor: pointer;
                        font-family: inherit;
                        position: relative;
                        font-size: var(--down-sub-size);
                        font-weight: var(--down-sub-weight);
                        transition: filter var(--transition-speed);
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: ${bgColor};
                            filter: brightness(var(--control-button-brightness));
                            z-index: -1;
                        "></div>▼
                    </button>
                    <button data-action="delete-card" style="
                        width: var(--square-section);
                        height: 100%;
                        background: ${isDeletePending ? 'var(--delete-pending-bg)' : 'transparent'};
                        border: none;
                        color: ${isDeletePending ? 'var(--delete-pending-color)' : 'var(--control-button-color)'};
                        cursor: pointer;
                        font-family: inherit;
                        position: relative;
                        font-size: var(--delete-sub-size);
                        font-weight: var(--delete-sub-weight);
                        transition: filter var(--transition-speed);
                    ">
                        ${isDeletePending ? '' : `<div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: ${bgColor};
                            filter: brightness(var(--control-button-brightness));
                            z-index: -1;
                        "></div>`}×
                    </button>
                </div>
            `;
        },
        
        /**
         * Applies standardized dropdown padding fix
         * Used in: ALL components with dropdowns in renderView
         * 
         * @param {HTMLElement} container - Container with dropdown elements
         * 
         * Example usage:
         *   GT50Lib.Utils.applyDropdownPadding(container);
         */
        applyDropdownPadding: function(container) {
            const dropdownSection = container.querySelector('div[style*="border-radius: 0 0 8px 8px"]');
            if (dropdownSection) {
                const currentPadding = 'var(--margin)';
                dropdownSection.style.padding = `${currentPadding} ${currentPadding} 0 ${currentPadding}`;
                const lastChild = dropdownSection.lastElementChild;
                if (lastChild && !lastChild.style.marginBottom) {
                    lastChild.style.marginBottom = currentPadding;
                }
            }
        },
        
        /**
         * Creates empty state message HTML
         * Used in: Components when they have no content to display
         * 
         * @param {string} message - Message to display
         * @param {string} icon - Optional icon/emoji to show
         * @returns {string} HTML string for empty state
         * 
         * Example usage:
         *   const emptyHTML = GT50Lib.Utils.createEmptyState('No items yet', '📝');
         */
        createEmptyState: function(message, icon) {
            return `
                <div style="
                    background: var(--empty-state-bg);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--dropdown-item-radius);
                    height: var(--empty-state-height);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--empty-state-gap);
                    margin-bottom: var(--margin);
                    opacity: var(--empty-state-opacity);
                ">
                    ${icon ? `<div style="font-size: var(--empty-state-icon-size);">${icon}</div>` : ''}
                    <div style="
                        font-size: var(--empty-state-text-size);
                        font-weight: var(--empty-state-text-weight);
                        color: var(--color-10);
                        text-align: center;
                        padding: 0 var(--text-padding-small);
                    ">${message}</div>
                </div>
            `;
        },
        
        /**
         * Creates standardized dropdown toggle arrow
         * Used in: Components with dropdown functionality
         * 
         * @param {boolean} isOpen - Whether dropdown is currently open
         * @returns {string} HTML string for arrow
         * 
         * Example usage:
         *   const arrowHTML = GT50Lib.Utils.createDropdownArrow(state.open);
         */
        createDropdownArrow: function(isOpen) {
            return `
                <div style="
                    width: 0;
                    height: 0;
                    border-left: var(--dropdown-arrow-size) solid transparent;
                    border-right: var(--dropdown-arrow-size) solid transparent;
                    border-top: var(--dropdown-arrow-height) solid var(--color-10);
                    transform: rotate(${isOpen ? '180deg' : '0deg'});
                    transition: transform var(--transition-speed);
                "></div>
            `;
        },
        
        // =====================================================
        // SECTION 2: STATE MANAGEMENT
        // =====================================================
        // Functions for managing component state consistently
        // These ensure data integrity and consistent behavior
        // =====================================================
        
        /**
         * Validates that a state object has required properties
         * Used in: loadState() and import functions
         * 
         * @param {Object} state - State object to validate
         * @param {Array} requiredProps - Array of required property names
         * @returns {boolean} Whether state is valid
         * 
         * Example usage:
         *   const isValid = GT50Lib.Utils.validateStateProps(state, ['title', 'items', 'open']);
         */
        validateStateProps: function(state, requiredProps) {
            if (!state || typeof state !== 'object') return false;
            return requiredProps.every(prop => prop in state);
        },
        
        /**
         * Closes all dropdowns in component state recursively
         * Used in: Mode switching, navigation
         * 
         * @param {Array} tabComponentsArray - Array of tab components
         * 
         * Example usage:
         *   GT50Lib.Utils.closeAllDropdowns(state.tabComponents);
         */
        closeAllDropdowns: function(tabComponentsArray) {
            tabComponentsArray.forEach(components => {
                if (Array.isArray(components)) {
                    components.forEach(comp => {
                        if (comp.state && typeof comp.state.open !== 'undefined') {
                            comp.state.open = false;
                        }
                        if (comp.state && typeof comp.state.numpadOpen !== 'undefined') {
                            comp.state.numpadOpen = false;
                        }
                        if (comp.state && typeof comp.state.viewOpen !== 'undefined') {
                            comp.state.viewOpen = false;
                        }
                        if (comp.state && typeof comp.state.customDropdownOpen !== 'undefined') {
                            comp.state.customDropdownOpen = false;
                        }
                        
                        // Recursively close nested components
                        if (comp.type === 'nest' && comp.state.tabComponents) {
                            this.closeAllDropdowns(comp.state.tabComponents);
                        }
                        if (comp.type === 'cycle' && comp.state.tabComponents) {
                            this.closeAllDropdowns(comp.state.tabComponents);
                        }
                    });
                }
            });
        },
        
        /**
         * Deep clones an object (for state snapshots)
         * Used in: Undo/redo systems, state backups
         * 
         * @param {Object} obj - Object to clone
         * @returns {Object} Deep cloned object
         * 
         * Example usage:
         *   const snapshot = GT50Lib.Utils.deepClone(state);
         */
        deepClone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        
        /**
         * Merges default state with partial state
         * Used in: Component initialization, migration
         * 
         * @param {Object} defaultState - Default state object
         * @param {Object} partialState - Partial state to merge
         * @returns {Object} Merged state object
         * 
         * Example usage:
         *   const fullState = GT50Lib.Utils.mergeState(defaultState(), savedState);
         */
        mergeState: function(defaultState, partialState) {
            return Object.assign({}, defaultState, partialState);
        },
        
        // =====================================================
        // SECTION 3: INPUT HANDLING & VALIDATION
        // =====================================================
        // Functions for consistent input sanitization and validation
        // These prevent invalid data and ensure consistent behavior
        // =====================================================
        
        /**
         * Sanitizes numeric input with min/max bounds
         * Used in: Accumulation, Progress, Threshold, History components
         * 
         * @param {string|number} value - Input value to sanitize
         * @param {number} min - Minimum allowed value
         * @param {number} max - Maximum allowed value
         * @returns {number|null} Sanitized number or null if invalid
         * 
         * Example usage:
         *   const clean = GT50Lib.Utils.sanitizeNumeric(input.value, 0, 99);
         */
        sanitizeNumeric: function(value, min, max) {
            const num = parseInt(value);
            if (isNaN(num)) return null;
            if (min !== undefined && num < min) return min;
            if (max !== undefined && num > max) return max;
            return num;
        },
        
        /**
         * Clamps a numeric value between min and max
         * Used in: Any component with numeric constraints
         * 
         * @param {number} value - Value to clamp
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Clamped value
         * 
         * Example usage:
         *   const clamped = GT50Lib.Utils.clamp(value, 0, 100);
         */
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        /**
         * Validates date components (year, month, day)
         * Used in: History component timestamp editing
         * 
         * @param {number} year - Year value
         * @param {number} month - Month value (1-12)
         * @param {number} day - Day value (1-31)
         * @returns {boolean} Whether date is valid
         * 
         * Example usage:
         *   const isValid = GT50Lib.Utils.isValidDate(2024, 2, 29);
         */
        isValidDate: function(year, month, day) {
            if (year < 1000 || year > 9999) return false;
            if (month < 1 || month > 12) return false;
            
            const maxDays = this.getMaxDaysInMonth(month, year);
            return day >= 1 && day <= maxDays;
        },
        
        /**
         * Gets maximum days in a month (handles leap years)
         * Used in: History component, date validation
         * 
         * @param {number} month - Month value (1-12)
         * @param {number} year - Year value
         * @returns {number} Maximum days in month
         * 
         * Example usage:
         *   const maxDays = GT50Lib.Utils.getMaxDaysInMonth(2, 2024);
         */
        getMaxDaysInMonth: function(month, year) {
            if (month === 2) {
                return this.isLeapYear(year) ? 29 : 28;
            }
            if ([4, 6, 9, 11].includes(month)) {
                return 30;
            }
            return 31;
        },
        
        /**
         * Checks if a year is a leap year
         * Used in: Date validation, History component
         * 
         * @param {number} year - Year to check
         * @returns {boolean} Whether year is a leap year
         * 
         * Example usage:
         *   const isLeap = GT50Lib.Utils.isLeapYear(2024);
         */
        isLeapYear: function(year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        },
        
        /**
         * Truncates text to maximum length with ellipsis
         * Used in: Tab names, long text fields
         * 
         * @param {string} text - Text to truncate
         * @param {number} maxLength - Maximum length
         * @returns {string} Truncated text
         * 
         * Example usage:
         *   const short = GT50Lib.Utils.truncateText(longText, 20);
         */
        truncateText: function(text, maxLength) {
            if (!text || text.length <= maxLength) return text;
            return text.slice(0, maxLength - 3) + '...';
        },
        
        /**
         * Formats a number with leading zeros
         * Used in: Time displays, numeric formatting
         * 
         * @param {number} num - Number to format
         * @param {number} digits - Minimum digits
         * @returns {string} Formatted number string
         * 
         * Example usage:
         *   const formatted = GT50Lib.Utils.padZero(5, 2); // "05"
         */
        padZero: function(num, digits) {
            return String(num).padStart(digits, '0');
        },
        
        // =====================================================
        // SECTION 4: DATE & TIME UTILITIES
        // =====================================================
        // Functions for consistent date/time handling
        // Used across History, Cycle, and timestamp features
        // =====================================================
        
        /**
         * Formats timestamp into readable string
         * Used in: History component, display timestamps
         * 
         * @param {number} timestamp - Unix timestamp
         * @param {string} format - Format type ('full', 'relative', 'short')
         * @returns {string} Formatted date string
         * 
         * Example usage:
         *   const formatted = GT50Lib.Utils.formatTimestamp(Date.now(), 'relative');
         */
        formatTimestamp: function(timestamp, format) {
            const date = new Date(timestamp);
            const now = Date.now();
            const diff = now - timestamp;
            
            if (format === 'relative') {
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes}m ago`;
                if (hours < 24) return `${hours}h ago`;
                return `${days}d ago`;
            }
            
            if (format === 'short') {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                });
            }
            
            // Default: full format
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            return `${dateStr} - ${timeStr}`;
        },
        
        /**
         * Gets current date components
         * Used in: History component initialization
         * 
         * @param {number} timestamp - Optional timestamp (defaults to now)
         * @returns {Object} Object with year, month, day, hour, minute, second
         * 
         * Example usage:
         *   const components = GT50Lib.Utils.getDateComponents();
         */
        getDateComponents: function(timestamp) {
            const date = timestamp ? new Date(timestamp) : new Date();
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            };
        },
        
        // =====================================================
        // SECTION 5: VISUAL HELPERS
        // =====================================================
        // Functions for consistent visual styling and effects
        // These ensure UI polish and consistency
        // =====================================================
        
        /**
         * Adds hover effect to an element
         * Used in: Buttons, interactive elements
         * 
         * @param {HTMLElement} element - Element to add hover to
         * @param {number} brightness - Brightness multiplier (default 1.2)
         * 
         * Example usage:
         *   GT50Lib.Utils.addHoverEffect(button, 1.2);
         */
        addHoverEffect: function(element, brightness) {
            if (!element) return;
            const brightnessValue = brightness || 1.2;
            element.onmouseover = () => element.style.filter = `brightness(${brightnessValue})`;
            element.onmouseout = () => element.style.filter = 'brightness(1)';
        },
        
        /**
         * Expands touch target for better mobile usability
         * Used in: Small buttons, mobile-critical interactions
         * 
         * @param {HTMLElement} element - Element to expand
         * @param {number} minSize - Minimum size in pixels (default 44)
         * 
         * Example usage:
         *   GT50Lib.Utils.expandTouchTarget(smallButton, 44);
         */
        expandTouchTarget: function(element, minSize) {
            if (!element) return;
            const size = minSize || 44;
            const currentWidth = element.offsetWidth;
            const currentHeight = element.offsetHeight;
            
            if (currentWidth < size || currentHeight < size) {
                const padding = Math.max(
                    Math.ceil((size - currentWidth) / 2),
                    Math.ceil((size - currentHeight) / 2)
                );
                element.style.padding = `${padding}px`;
            }
        },
        
        /**
         * Gets computed CSS variable value
         * Used in: Dynamic styling, calculations
         * 
         * @param {string} varName - CSS variable name (with or without --)
         * @returns {string} Variable value
         * 
         * Example usage:
         *   const color = GT50Lib.Utils.getCSSVar('--primary');
         */
        getCSSVar: function(varName) {
            const name = varName.startsWith('--') ? varName : `--${varName}`;
            return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        },
        
        /**
         * Sets CSS variable value
         * Used in: Dynamic theming, style updates
         * 
         * @param {string} varName - CSS variable name (with or without --)
         * @param {string} value - New value
         * 
         * Example usage:
         *   GT50Lib.Utils.setCSSVar('--primary', '#7a6cb8');
         */
        setCSSVar: function(varName, value) {
            const name = varName.startsWith('--') ? varName : `--${varName}`;
            document.documentElement.style.setProperty(name, value);
        },
        
        // =====================================================
        // SECTION 6: PERFORMANCE UTILITIES
        // =====================================================
        // Functions for optimizing performance
        // Used for debouncing saves, throttling events, etc.
        // =====================================================
        
        /**
         * Debounces a function call
         * Used in: Auto-save, search input, resize handlers
         * 
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in milliseconds
         * @returns {Function} Debounced function
         * 
         * Example usage:
         *   const debouncedSave = GT50Lib.Utils.debounce(saveState, 500);
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        /**
         * Throttles a function call
         * Used in: Scroll handlers, frequent events
         * 
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function} Throttled function
         * 
         * Example usage:
         *   const throttledScroll = GT50Lib.Utils.throttle(handleScroll, 100);
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // =====================================================
        // SECTION 7: ERROR HANDLING
        // =====================================================
        // Functions for graceful error handling and recovery
        // Used throughout for robust error management
        // =====================================================
        
        /**
         * Wraps a render function with error boundary
         * Used in: Component rendering, prevents crashes
         * 
         * @param {Function} renderFunc - Function to wrap
         * @param {HTMLElement} container - Container element
         * @param {string} fallbackMsg - Fallback error message
         * @returns {boolean} Whether render succeeded
         * 
         * Example usage:
         *   GT50Lib.Utils.safeRender(() => component.render(), container, 'Error loading component');
         */
        safeRender: function(renderFunc, container, fallbackMsg) {
            try {
                renderFunc();
                return true;
            } catch (error) {
                console.error('Render error:', error);
                if (container) {
                    container.innerHTML = `
                        <div style="
                            background: var(--error-bg);
                            border: var(--border-width) solid var(--error-border);
                            border-radius: var(--dropdown-item-radius);
                            padding: var(--text-padding-small);
                            margin-bottom: var(--margin);
                            color: var(--error-color);
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            ⚠️ ${fallbackMsg || 'An error occurred'}
                        </div>
                    `;
                }
                return false;
            }
        },
        
        /**
         * Logs error with context
         * Used in: All error handling scenarios
         * 
         * @param {string} component - Component name
         * @param {string} action - Action being performed
         * @param {Error} error - Error object
         * 
         * Example usage:
         *   GT50Lib.Utils.logError('List', 'renderBuild', error);
         */
        logError: function(component, action, error) {
            console.error(`[${component}] Error in ${action}:`, error);
        },
        
        // =====================================================
        // SECTION 8: DATA HELPERS
        // =====================================================
        // Functions for data manipulation and generation
        // Used for IDs, sorting, filtering, etc.
        // =====================================================
        
        /**
         * Generates unique ID
         * Used in: Component creation, temporary IDs
         * 
         * @returns {string} Unique ID string
         * 
         * Example usage:
         *   const id = GT50Lib.Utils.generateId();
         */
        generateId: function() {
            return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        },
        
        /**
         * Safely gets nested property from object
         * Used in: State access, validation
         * 
         * @param {Object} obj - Object to query
         * @param {string} path - Dot notation path (e.g., 'state.items.0.text')
         * @param {any} defaultValue - Default if not found
         * @returns {any} Property value or default
         * 
         * Example usage:
         *   const value = GT50Lib.Utils.getNestedProp(component, 'state.items.0', null);
         */
        getNestedProp: function(obj, path, defaultValue) {
            const keys = path.split('.');
            let current = obj;
            
            for (const key of keys) {
                if (current === null || current === undefined) {
                    return defaultValue;
                }
                current = current[key];
            }
            
            return current !== undefined ? current : defaultValue;
        },
        
        /**
         * Safely sets nested property on object
         * Used in: State updates, deep modifications
         * 
         * @param {Object} obj - Object to modify
         * @param {string} path - Dot notation path
         * @param {any} value - Value to set
         * 
         * Example usage:
         *   GT50Lib.Utils.setNestedProp(component, 'state.items.0.completed', true);
         */
        setNestedProp: function(obj, path, value) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let current = obj;
            
            for (const key of keys) {
                if (!(key in current)) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
        }
    };
    
    // =====================================================
    // INJECT RIGHT SECTION (for plugin UI)
    // =====================================================
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'comp-utility.js') {
                    const rightSection = document.createElement('div');
                    rightSection.style.cssText = `
                        width: 60px;
                        height: 100%;
                        background: var(--primary);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-10);
                    `;
                    rightSection.textContent = INJECTOR_ID;
                    card.appendChild(rightSection);
                    break;
                }
            }
        }
    }, 100);
})();

