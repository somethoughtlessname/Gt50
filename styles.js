(function() {
    // Static injector ID
    const INJECTOR_ID = '0001';
    
    // CSS content - STYLES ONLY, NO FUNCTIONS
    const cssContent = `
        :root {
            /* ========================================= */
            /* CARD DIMENSIONS */
            /* ========================================= */
            --margin: 4px;
            --card-height: 45px;
            --square-section: 28px;
            --half-square: 14px;
            --border-width: 3px;
            --border-color: #000000;
            
            /* ========================================= */
            /* PRIMARY COLORS */
            /* ========================================= */
            --primary: #7a6cb8;
            --secondary: #3b82f6;
            --accent: #08a971;
            
            /* ========================================= */
            /* BACKGROUND COLORS */
            /* ========================================= */
            --bg-1: #243342;
            --bg-2: #374151;
            --bg-3: #0f1520;
            --bg-4: #636B76;
            --bg-5: #4a4a4a;
            --bg-9: #374151;
            
            /* ========================================= */
            /* RAINBOW COLORS - BASE */
            /* ========================================= */
            --color-1: #C85A5A;      /* Red */
            --color-2: #C7824A;      /* Orange */
            --color-3: #d4c956;      /* Yellow */
            --color-4: #48a971;      /* Green */
            --color-5: #5A8DB8;      /* Blue */
            --color-6: #8a7ca8;      /* Purple */
            --color-7: #B87390;      /* Pink */
            --color-8: #000000;      /* Black */
            --color-9: #6b7280;      /* Gray */
            --color-10: #ffffff;     /* White */
            
            /* ========================================= */
            /* RAINBOW COLORS - RED VARIATIONS */
            /* ========================================= */
            --color-1-2: #a04848;    /* -20% brightness */
            --color-1-3: #783636;    /* -40% brightness */
            --color-1-4: #502424;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - ORANGE VARIATIONS */
            /* ========================================= */
            --color-2-2: #9f683b;    /* -20% brightness */
            --color-2-3: #774e2c;    /* -40% brightness */
            --color-2-4: #4f341d;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - YELLOW VARIATIONS */
            /* ========================================= */
            --color-3-2: #aaa145;    /* -20% brightness */
            --color-3-3: #7f7934;    /* -40% brightness */
            --color-3-4: #555023;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - GREEN VARIATIONS */
            /* ========================================= */
            --color-4-2: #3a875a;    /* -20% brightness */
            --color-4-3: #2b6544;    /* -40% brightness */
            --color-4-4: #1d442d;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - BLUE VARIATIONS */
            /* ========================================= */
            --color-5-2: #487193;    /* -20% brightness */
            --color-5-3: #36556e;    /* -40% brightness */
            --color-5-4: #24384a;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - PURPLE VARIATIONS */
            /* ========================================= */
            --color-6-2: #6e6386;    /* -20% brightness */
            --color-6-3: #534a65;    /* -40% brightness */
            --color-6-4: #373243;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - PINK VARIATIONS */
            /* ========================================= */
            --color-7-2: #935c73;    /* -20% brightness */
            --color-7-3: #6e4556;    /* -40% brightness */
            --color-7-4: #4a2e3a;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - GRAY VARIATIONS */
            /* ========================================= */
            --color-9-2: #565b66;    /* -20% brightness */
            --color-9-3: #40444d;    /* -40% brightness */
            --color-9-4: #2b2e33;    /* -60% brightness */
            
            /* ========================================= */
            /* FONT COLORS */
            /* ========================================= */
            --font-color-1: #000000;
            --font-color-2: #9ca3af;
            --font-color-3: #ffffff;
            
            /* ========================================= */
            /* TEXT SIZING & PADDING */
            /* ========================================= */
            --dropdown-text-size: 10px;
            --dropdown-text-weight: 600;
            --text-padding-left: 4px;
            --text-padding-right: 16px;
            --text-padding-small: 12px;
            
            /* ========================================= */
            /* CONTROL BUTTONS */
            /* ========================================= */
            --control-button-color: var(--color-10);
            --control-button-brightness: 0.75;
            --delete-pending-bg: var(--color-10);
            --delete-pending-color: var(--color-1);
            
            /* ========================================= */
            /* TRANSITIONS & EFFECTS */
            /* ========================================= */
            --transition-speed: 0.2s;
            --hover-brightness: 1.2;
            
            /* ========================================= */
            /* DROPDOWN STYLING */
            /* ========================================= */
            --dropdown-bg: var(--bg-2);
            --dropdown-radius: 0 0 8px 8px;
            --dropdown-item-radius: 8px;
            --dropdown-item-height: 32px;
            --dropdown-text-bg: var(--bg-3);
            --dropdown-text-display-size: 10px;
            --dropdown-text-display-weight: 600;
            --dropdown-arrow-size: 6px;
            --dropdown-arrow-height: 8px;
            
            /* ========================================= */
            /* EMPTY STATES */
            /* ========================================= */
            --empty-state-bg: var(--bg-3);
            --empty-state-height: 80px;
            --empty-state-gap: 8px;
            --empty-state-opacity: 0.6;
            --empty-state-icon-size: 32px;
            --empty-state-text-size: 12px;
            --empty-state-text-weight: 600;
            
            /* ========================================= */
            /* ERROR STATES */
            /* ========================================= */
            --error-bg: #3f1f1f;
            --error-border: #8b0000;
            --error-color: #ff6b6b;
            
            /* ========================================= */
            /* SYMBOLS: CHECKMARK */
            /* ========================================= */
            --check-size: 25px;
            --check-weight: 900;
            --check-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: CHECKMARK BOLD */
            /* ========================================= */
            --check-bold-size: 45px;
            --check-bold-weight: 700;
            --check-bold-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DELETE */
            /* ========================================= */
            --delete-size: 35px;
            --delete-weight: 700;
            --delete-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DELETE SUB */
            /* ========================================= */
            --delete-sub-size: 25px;
            --delete-sub-weight: 700;
            --delete-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: MINUS */
            /* ========================================= */
            --minus-size: 35px;
            --minus-weight: 700;
            --minus-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: PLUS */
            /* ========================================= */
            --plus-size: 45px;
            --plus-weight: 700;
            --plus-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: UP ARROW */
            /* ========================================= */
            --up-size: 25px;
            --up-weight: 700;
            --up-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: UP ARROW SUB */
            /* ========================================= */
            --up-sub-size: 22px;
            --up-sub-weight: 700;
            --up-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DOWN ARROW */
            /* ========================================= */
            --down-size: 25px;
            --down-weight: 700;
            --down-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DOWN ARROW SUB */
            /* ========================================= */
            --down-sub-size: 22px;
            --down-sub-weight: 700;
            --down-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: CIRCLE */
            /* ========================================= */
            --circle-size: 8px;
            --circle-weight: 400;
            --circle-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: ASTERISK */
            /* ========================================= */
            --asterisk-size: 45px;
            --asterisk-weight: 900;
            --asterisk-position: 20px;
            
            /* ========================================= */
            /* SYMBOLS: COUNT */
            /* ========================================= */
            --count-size: 20px;
            --count-weight: 900;
            --count-position: 0px;
        }
        
        /* ========================================= */
        /* PLACEHOLDER STYLING */
        /* ========================================= */
        ::placeholder {
            color: var(--font-color-3);
            opacity: 0.5;
        }

        ::-webkit-input-placeholder {
            color: var(--font-color-3);
            opacity: 0.5;
        }

        ::-moz-placeholder {
            color: var(--font-color-3);
            opacity: 0.5;
        }

        :-ms-input-placeholder {
            color: var(--font-color-3);
            opacity: 0.5;
        }
        
/* ========================================= */
/* FOCUS INDICATORS */
/* ========================================= */
input:focus,
textarea:focus,
button:focus,
select:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* Disable mobile tap highlight */
* {
    -webkit-tap-highlight-color: transparent;
}
        
        /* ========================================= */
        /* SMOOTH SCROLLING */
        /* ========================================= */
        html {
            scroll-behavior: smooth;
        }
        
        /* ========================================= */
        /* SELECTION STYLING */
        /* ========================================= */
        ::selection {
            background: var(--primary);
            color: var(--color-10);
        }
        
        ::-moz-selection {
            background: var(--primary);
            color: var(--color-10);
        }
    `;
    
    // Inject CSS into document head
    const style = document.createElement('style');
    style.id = `injector-${INJECTOR_ID}`;
    style.textContent = cssContent;
    document.head.appendChild(style);
})();