
// ===== EXAMPLE IMPORT: RPG GAME TRACKER =====
// This file demonstrates the import format for GT50 Import Registry
// Place files like this in your /uta/import/ folder and they'll appear in Create New → Import tab
// This uses the EXACT format that GT50 exports - you can paste your exports directly!

(function() {
    // Wait for Import Registry to be available
    function registerImport() {
        if (window.GT50 && window.GT50.Imports) {
            
            // This is EXACTLY the format GT50 exports when you export a nest
            // You can copy-paste your own exports here!
            const importData = {
                "version": "1.0",
                "timestamp": "2025-01-13T12:00:00.000Z",
                "app": "GT50",
                "type": "nest",
                "name": "RPG Game Tracker",
                "data": {
                    "tabs": {
                        "tabs": [
                            {"name": "Quests", "label": "Quests", "color": "var(--color-5-2)"},
                            {"name": "Progress", "label": "Progress", "color": "var(--color-5-2)"},
                            {"name": "Dailies", "label": "Dailies", "color": "var(--color-5-2)"}
                        ],
                        "activeViewTab": 0,
                        "selectedBuildTab": 0
                    },
                    "tabComponents": [
                        [
                            {
                                "type": "list",
                                "state": {
                                    "name": "Main Quests",
                                    "items": [
                                        {"text": "Defeat the Dragon", "done": false},
                                        {"text": "Find the Sacred Artifact", "done": false},
                                        {"text": "Rescue the Princess", "done": false}
                                    ]
                                }
                            },
                            {
                                "type": "list",
                                "state": {
                                    "name": "Side Quests",
                                    "items": [
                                        {"text": "Help the Merchant", "done": false},
                                        {"text": "Clear the Bandit Camp", "done": false}
                                    ]
                                }
                            }
                        ],
                        [
                            {
                                "type": "progress",
                                "state": {
                                    "name": "Character Level",
                                    "current": 15,
                                    "target": 50
                                }
                            },
                            {
                                "type": "progress",
                                "state": {
                                    "name": "Story Completion",
                                    "current": 35,
                                    "target": 100
                                }
                            },
                            {
                                "type": "accumulation",
                                "state": {
                                    "name": "Gold Collected",
                                    "value": 2500
                                }
                            }
                        ],
                        [
                            {
                                "type": "checklist",
                                "state": {
                                    "name": "Daily Tasks",
                                    "items": [
                                        {"text": "Complete 3 bounties", "done": false},
                                        {"text": "Defeat 10 enemies", "done": false},
                                        {"text": "Collect resources", "done": false},
                                        {"text": "Visit the blacksmith", "done": false}
                                    ]
                                }
                            }
                        ]
                    ]
                }
            };
            
            // Register the import - data can be object or string, registry handles both
            window.GT50.Imports.register({
                id: 'rpg-game-tracker',
                name: 'RPG Game Tracker',
                description: 'Track quests, character progress, and daily tasks',
                data: importData  // Pass the export package directly
            });
            
            console.log('✓ RPG Game Tracker import registered');
            
        } else {
            // Registry not loaded yet, try again
            setTimeout(registerImport, 100);
        }
    }
    
    // Start registration attempt
    registerImport();
})();

