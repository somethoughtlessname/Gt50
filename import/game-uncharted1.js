// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-28T12:15:37.172Z
// Name: Uncharted 2: Among Thieves 1
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
  "timestamp": "2026-01-28T12:15:35.100Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "Uncharted 2: Among Thieves 1",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "Main",
          "name": "Main",
          "color": "var(--color-4)"
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
          "id": 1769602360004.5754,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Chapter 1: A Rock and a Hard Place",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1769602525872
        }
      ],
      [
        {
          "id": 1769602360004.102,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 50,
            "target": 50,
            "title": "Treasures",
            "dropdownText": ""
          }
        }
      ]
    ],
    "color": "GRAY",
    "autoSortByLastUpdated": false,
    "showSummary": false,
    "summaryShowChildNestProgress": false,
    "summaryChildNestProgressMode": "0"
  }
}`;
    
    // Register the import
    window.GT50.Imports.register({
        id: 'uncharted-2-among-thieves-1',
        name: 'Uncharted 2: Among Thieves 1',
        description: 'Includes: Main, Collectibles',
        data: exportedData
    });
    
    console.log('✓ Import registered: Uncharted 2: Among Thieves 1');
})();
