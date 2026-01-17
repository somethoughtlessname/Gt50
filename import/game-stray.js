// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-17T00:29:58.273Z
// Name: Stray
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
  "timestamp": "2026-01-17T00:29:51.614Z",
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
          "id": 1768377457615.1028,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 1 - Inside the Wall",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398325608
        },
        {
          "id": 1768377457615.5918,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 2 - Dead City",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398326007
        },
        {
          "id": 1768377457615.5964,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 3 - The Flat",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398326451
        },
        {
          "id": 1768377457615.1113,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 4 - The Slums (Part 1)",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398326918
        },
        {
          "id": 1768377457615.1636,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 5 - Rooftop",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398327412
        },
        {
          "id": 1768377457615.0474,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 6 - The Slums (Part 2)",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398330673
        },
        {
          "id": 1768377457615.0085,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 7 - Dead End",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398330407
        },
        {
          "id": 1768377457615.7366,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 8 - The Sewers",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398330072
        },
        {
          "id": 1768377457615.3003,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 9 - Antvillage",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398329747
        },
        {
          "id": 1768377457615.2637,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 10 - Midtown",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398329422
        },
        {
          "id": 1768377457615.1968,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 11 - Jail",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398329138
        },
        {
          "id": 1768377457615.971,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chaper 12 - Control Room",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768398328829
        }
      ],
      [
        {
          "id": 1768377457615.5957,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 27,
            "target": 27,
            "title": "B-12 Memories",
            "dropdownText": ""
          },
          "lastUpdated": 1768398336744
        },
        {
          "id": 1768377457615.3062,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 6,
            "target": 6,
            "title": "Badges",
            "dropdownText": ""
          },
          "lastUpdated": 1768398337552
        },
        {
          "id": 1768377457615.3818,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 12,
            "target": 12,
            "title": "Scratch Points",
            "dropdownText": "Only 1 per Chapter Needed"
          },
          "lastUpdated": 1768398340441
        },
        {
          "id": 1768377457615.4438,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 10,
            "target": 10,
            "title": "Nuzzles",
            "dropdownText": "Exclusive to Chapter 4 & 10"
          },
          "lastUpdated": 1768398341284
        },
        {
          "id": 1768377457615.4297,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 8,
            "target": 8,
            "title": "Sheet Music",
            "dropdownText": "Exclusive to Chapter 4"
          },
          "lastUpdated": 1768398343088
        },
        {
          "id": 1768377457615.2473,
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
}`;
    
    // Register the import
    window.GT50.Imports.register({
        id: 'stray',
        name: 'Stray',
        description: 'See a beautiful, dystopian future through the eyes of a cat.',
        data: exportedData
    });
    
    console.log('✓ Import registered: Stray');
})();
