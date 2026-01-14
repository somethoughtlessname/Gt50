
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
  "timestamp": "2026-01-14T06:21:21.689Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "Stray",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "STORY",
          "name": "STORY",
          "color": "var(--color-4)"
        },
        {
          "label": "COLLECTIBLES",
          "name": "COLLECTIBLES",
          "color": "var(--color-6)"
        }
      ],
      "activeViewTab": 0,
      "selectedBuildTab": 0
    },
    "tabComponents": [
      [
        {
          "id": 1768370426660.4448,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 1 - Inside the Wall",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371659191
        },
        {
          "id": 1768370426660.6443,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 2 - Dead City",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371659606
        },
        {
          "id": 1768370426660.6587,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 3 - The Flat",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371660023
        },
        {
          "id": 1768370426660.9792,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 4 - The Slums (Part 1)",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371660449
        },
        {
          "id": 1768370426660.524,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 5 - Rooftop",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371660858
        },
        {
          "id": 1768370426660.9172,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 6 - The Slums (Part 2)",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371661284
        },
        {
          "id": 1768370426660.5466,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 7 - Dead End",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371661727
        },
        {
          "id": 1768370426660.6365,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 8 - The Sewers",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371662210
        },
        {
          "id": 1768370426660.2493,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 9 - Antvillage",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371662711
        },
        {
          "id": 1768370426660.7332,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 10 - Midtown",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371663221
        },
        {
          "id": 1768370426660.1626,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 11 - Jail",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371663771
        },
        {
          "id": 1768370426660.4016,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chaper 12 - Control Room",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768371664298
        }
      ],
      [
        {
          "id": 1768370426660.6,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 27,
            "target": 27,
            "title": "B-12 Memories",
            "dropdownText": ""
          },
          "lastUpdated": 1768371669933
        },
        {
          "id": 1768370426660.024,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 6,
            "target": 6,
            "title": "Badges",
            "dropdownText": ""
          },
          "lastUpdated": 1768371670943
        },
        {
          "id": 1768370426660.5183,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 12,
            "target": 12,
            "title": "Scratch Points",
            "dropdownText": "Only 1 per Chapter Needed"
          },
          "lastUpdated": 1768371673557
        },
        {
          "id": 1768370426660.8164,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 10,
            "target": 10,
            "title": "Nuzzles",
            "dropdownText": "Exclusive to Chapter 4 & 10"
          },
          "lastUpdated": 1768371674350
        },
        {
          "id": 1768370426660.8704,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 8,
            "target": 8,
            "title": "Sheet Music",
            "dropdownText": "Exclusive to Chapter 4"
          },
          "lastUpdated": 1768371675644
        },
        {
          "id": 1768370426660.9204,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 4,
            "target": 4,
            "title": "Energy Drink",
            "dropdownText": "Exclusive to Chapter 4"
          }
        }
      ]
    ]
  }
}
                
                
            
            // Register the import - data can be object or string, registry handles both
            window.GT50.Imports.register({
                id: 'rpg-game-tracker',
                name: 'Stray',
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



