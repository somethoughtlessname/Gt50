// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-21T22:47:31.444Z
// Name: LEGO Harry Potter Collection
//
// INSTALLATION:
// 1. Save this file as: import/[filename].js
// 2. Add the filename to Imports-list.js
// 3. Reload GT50
// 4. Find it in Create New → Import tab

(function() {
    // Wait for registry to be available
    if (!window.GT50 || !window.GT50.Imports) {
        console.error('Import registry not available');
        return;
    }
    
    // Export data in JSON format
    const exportedData = `{
  "version": "1.0",
  "timestamp": "2026-01-21T22:47:28.467Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "LEGO Harry Potter Collection",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "Main",
          "name": "Main",
          "color": "var(--color-4)"
        },
        {
          "label": "Side Quests",
          "name": "Side Quests",
          "color": "var(--color-5)"
        },
        {
          "label": "Collectibles",
          "name": "Collectibles",
          "color": "var(--color-6)"
        }
      ],
      "activeViewTab": 0,
      "selectedBuildTab": 0
    },
    "tabComponents": [
      [
        {
          "id": 1768973010968.7302,
          "type": "divider",
          "state": {
            "title": "Year 1",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.6672,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Magic Begins",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6614,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Out of the Dungeon",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.1624,
          "type": "list",
          "state": {
            "completed": false,
            "title": "A Jinxed Broom",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9324,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Restricted Section",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.569,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Forbidden Forest",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9197,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Face of the Enemy",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.8472,
          "type": "divider",
          "state": {
            "title": "Year 2",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.4114,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Floo Powder",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.046,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dobby's Plan",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.4226,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Crabbe and Goyle",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.4814,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Tom Riddle's Diary",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.8945,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Follow the Spiders",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6323,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Basilisk",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.724,
          "type": "divider",
          "state": {
            "title": "Year 3",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.1394,
          "type": "list",
          "state": {
            "completed": false,
            "title": "News from Azkaban",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.0964,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Hogsmead",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6694,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Mischief Managed",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6523,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Shrieking Shack",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.2031,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dementor's Kiss",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9688,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Dark Tower",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.1501,
          "type": "divider",
          "state": {
            "title": "Year 4",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.4324,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Quidditch Cup",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6973,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dragons",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.2263,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The First Task",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.1755,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Secret of the Egg",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.3074,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Black Lake",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.0544,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Dark Lord Returns",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.888,
          "type": "divider",
          "state": {
            "title": "Year 5",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.528,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dark Times",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.2668,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dumbledore's Army",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.0012,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Focus!",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9243,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Kreature Discomforts",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.2795,
          "type": "list",
          "state": {
            "completed": false,
            "title": "A Giant Virtuoso",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.0728,
          "type": "list",
          "state": {
            "completed": false,
            "title": "A Veiled Threat",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.8833,
          "type": "divider",
          "state": {
            "title": "Year 6",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.9792,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.0347,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.327,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6443,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.8809,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.976,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.1724,
          "type": "divider",
          "state": {
            "title": "Year 7 (Part 1)",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.9421,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9626,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.4443,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.375,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.293,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.3308,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.277,
          "type": "divider",
          "state": {
            "title": "Year 7 (Part 2)",
            "variant": "divider"
          }
        },
        {
          "id": 1768973010968.1072,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.3276,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.469,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.9622,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.351,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.6704,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Untitled",
            "items": [],
            "dropdownText": ""
          }
        }
      ],
      [],
      [
        {
          "id": 1768973010968.0417,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 50,
            "target": 50,
            "title": "Student In Peril",
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.5342,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 200,
            "target": 200,
            "title": "Gold Bricks",
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.7866,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 20,
            "target": 20,
            "title": "Red Bricks",
            "dropdownText": ""
          }
        },
        {
          "id": 1768973010968.5708,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 24,
            "target": 24,
            "title": "School Crests",
            "dropdownText": ""
          }
        }
      ]
    ],
    "color": "GRAY",
    "autoSortByLastUpdated": false,
    "showSummary": true,
    "summaryShowChildNestProgress": false,
    "summaryChildNestProgressMode": "first-tab"
  }
}`;
    
    // Register the import
    window.GT50.Imports.register({
        id: 'lego-harry-potter-collection',
        name: 'LEGO Harry Potter Collection',
        description: 'Relive the entire cinematic saga with charming plastic brick humor.',
        data: exportedData
    });
    
    console.log('✓ Import registered: LEGO Harry Potter Collection');
})();


