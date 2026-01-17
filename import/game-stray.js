// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-14T05:02:17.224Z
// Name: The Long Dark - Wintermute
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
  "timestamp": "2026-01-14T05:02:17.147Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "The Long Dark - Wintermute",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "Main Story",
          "name": "Main Story",
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
          "id": 1768363234561.8958,
          "type": "divider",
          "state": {
            "title": "EPISODE 1 - DO NOT GO GENTLE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.533,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Memories",
            "items": [],
            "dropdownText": "Wake up in Grey Mother's house and learn about Milton"
          }
        },
        {
          "id": 1768363234561.9968,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Find the Scent",
            "items": [],
            "dropdownText": "Track Astrid's trail through Milton"
          }
        },
        {
          "id": 1768363234561.4087,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Bear Hunt",
            "items": [],
            "dropdownText": "Help Grey Mother prepare for winter"
          }
        },
        {
          "id": 1768363234561.0642,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Paradise Lost",
            "items": [],
            "dropdownText": "Final mission of Episode 1, journey to Mystery Lake"
          }
        },
        {
          "id": 1768363234561.436,
          "type": "divider",
          "state": {
            "title": "EPISODE 2 - LUMINANCE FUGUE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.2366,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Enter the Abandoned Dam",
            "items": [],
            "dropdownText": "Retrieve medical supplies for Jeremiah"
          }
        },
        {
          "id": 1768363234561.888,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Hunt",
            "items": [],
            "dropdownText": "Complete hunting lesson - gather 10 kg deer meat"
          }
        },
        {
          "id": 1768363234561.2522,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Frozen Angler",
            "items": [],
            "dropdownText": "Complete fishing lesson - gather 5 kg fish"
          }
        },
        {
          "id": 1768363234561.9226,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Retrieve Transponder Parts",
            "items": [],
            "dropdownText": "Travel to three signal towers across regions"
          }
        },
        {
          "id": 1768363234561.5125,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Bear's Den",
            "items": [],
            "dropdownText": "Survive the Old Bear's attack and escape the cave"
          }
        },
        {
          "id": 1768363234561.2874,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Forge the Bear Spear",
            "items": [],
            "dropdownText": "Craft the spear at the Riken in the Dam"
          }
        },
        {
          "id": 1768363234561.3745,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Defeat the Old Bear",
            "items": [],
            "dropdownText": "Final confrontation with the bear"
          }
        },
        {
          "id": 1768363234561.7986,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Into the Dam at Night",
            "items": [],
            "dropdownText": "Access the Dam during an aurora"
          }
        },
        {
          "id": 1768363234561.025,
          "type": "divider",
          "state": {
            "title": "EPISODE 3 - CROSSROADS ELEGY",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.712,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Trauma",
            "items": [],
            "dropdownText": "Wake up at Molly's farmhouse in Pleasant Valley"
          }
        },
        {
          "id": 1768363234561.7732,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Fallen Star",
            "items": [],
            "dropdownText": "Rescue plane crash survivors and bring them to Thomson's Crossing"
          }
        },
        {
          "id": 1768363234561.4097,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Coming Storm",
            "items": [],
            "dropdownText": "Find three missing survivors and gather supplies"
          }
        },
        {
          "id": 1768363234561.7197,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Aftermath",
            "items": [],
            "dropdownText": "Complete preparations and survive the blizzard"
          }
        },
        {
          "id": 1768363234561.953,
          "type": "divider",
          "state": {
            "title": "EPISODE 4 - FURY, THEN SILENCE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.627,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Blackrock Blues",
            "items": [],
            "dropdownText": "Find medical supplies for Warden Franklin"
          }
        },
        {
          "id": 1768363234561.4556,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Power Plant - Part 1",
            "items": [],
            "dropdownText": "Travel to the old substation"
          }
        },
        {
          "id": 1768363234561.294,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Power Plant - Part 2",
            "items": [],
            "dropdownText": "Navigate the steam tunnels and sabotage the mechanism"
          }
        },
        {
          "id": 1768363234561.5974,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Detonators - Part 1",
            "items": [],
            "dropdownText": "Journey to the abandoned mine"
          }
        },
        {
          "id": 1768363234561.609,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Detonators - Part 2",
            "items": [],
            "dropdownText": "Navigate toxic gas and retrieve detonators"
          }
        },
        {
          "id": 1768363234561.7139,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Donner",
            "items": [],
            "dropdownText": "Final confrontation and escape from Blackrock"
          }
        },
        {
          "id": 1768363234561.758,
          "type": "divider",
          "state": {
            "title": "EPISODE 5 - THE LIGHT AT THE END OF ALL THINGS",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.8796,
          "type": "history",
          "state": {
            "title": "COMING SOON!",
            "entries": [
              {
                "timestamp": 1774944000475,
                "dropdownText": "",
                "displayMode": "relative",
                "locked": false
              }
            ],
            "dropdownText": ""
          }
        }
      ],
      [
        {
          "id": 1768363234561.202,
          "type": "divider",
          "state": {
            "title": "EPISODE 1 - DO NOT GO GENTLE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.3726,
          "type": "checklist",
          "state": {
            "title": "The Basics of Survival",
            "items": [
              {
                "text": "Find A Sewing Primer book",
                "completed": false
              },
              {
                "text": "Repair clothing 3 times",
                "completed": false
              },
              {
                "text": "Find Field Dressing Your Kill book",
                "completed": false
              },
              {
                "text": "Snare and harvest a rabbit",
                "completed": false
              },
              {
                "text": "Find Medicinal Plants of Great Bear book",
                "completed": false
              },
              {
                "text": "Collect and prepare Reishi mushrooms",
                "completed": false
              },
              {
                "text": "Collect and prepare Rosehips",
                "completed": false
              },
              {
                "text": "Collect and prepare Old Man's Beard",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.075,
          "type": "checklist",
          "state": {
            "title": "Milton Supply Caches",
            "items": [
              {
                "text": "Cache 1",
                "completed": false
              },
              {
                "text": "Cache 2",
                "completed": false
              },
              {
                "text": "Cache 3",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.6506,
          "type": "checklist",
          "state": {
            "title": "Extra Supplies for Grey Mother",
            "items": [
              {
                "text": "Gather 36 hours of fuel",
                "completed": false
              },
              {
                "text": "Gather 20,000 calories of food",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.9268,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Highway Robbery",
            "items": [],
            "dropdownText": "Find the cache on Spruce Falls Bridge"
          }
        },
        {
          "id": 1768363234561.0654,
          "type": "checklist",
          "state": {
            "title": "Milton Deposit Box Keys",
            "items": [
              {
                "text": "Bank Deposit Box Key 1",
                "completed": false
              },
              {
                "text": "Bank Deposit Box Key 2",
                "completed": false
              },
              {
                "text": "Bank Deposit Box Key 3",
                "completed": false
              },
              {
                "text": "Bank Deposit Box Key 4",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.7097,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Find the Flare Gun",
            "items": [],
            "dropdownText": "Unlock at 175 trust with Grey Mother"
          }
        },
        {
          "id": 1768363234561.9404,
          "type": "divider",
          "state": {
            "title": "EPISODE 2 - LUMINANCE FUGUE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.0737,
          "type": "checklist",
          "state": {
            "title": "Advanced Survival Skills",
            "items": [
              {
                "text": "Find Frontier Shooting Guide book",
                "completed": false
              },
              {
                "text": "Kill wolves with rifle",
                "completed": false
              },
              {
                "text": "Find Advanced: Guns Guns Guns book",
                "completed": false
              },
              {
                "text": "Clean and maintain rifle",
                "completed": false
              },
              {
                "text": "Find The Frozen Angler book",
                "completed": false
              },
              {
                "text": "Catch fish through ice",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.5642,
          "type": "checklist",
          "state": {
            "title": "Mystery Lake Supply Caches",
            "items": [
              {
                "text": "Alan's Cave",
                "completed": false
              },
              {
                "text": "Clearcut in Mystery Lake",
                "completed": false
              },
              {
                "text": "Near tunnel to Forlorn Muskeg",
                "completed": false
              },
              {
                "text": "Tree roots in Forlorn Muskeg",
                "completed": false
              },
              {
                "text": "Ravine in Broken Railroad",
                "completed": false
              },
              {
                "text": "Cache at Unnamed Pond",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.8894,
          "type": "checklist",
          "state": {
            "title": "Forest Talker Caches",
            "items": [
              {
                "text": "Forest Talker Cache 1",
                "completed": false
              },
              {
                "text": "Forest Talker Cache 2",
                "completed": false
              },
              {
                "text": "Forest Talker Cache 3",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.7356,
          "type": "checklist",
          "state": {
            "title": "Mystery Lake Cabin Keys",
            "items": [
              {
                "text": "Key 1: High Blind (Forlorn Muskeg)",
                "completed": false
              },
              {
                "text": "Key 2: Hunter's Blind (Mystery Lake)",
                "completed": false
              },
              {
                "text": "Key 3: Camp Office",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.982,
          "type": "divider",
          "state": {
            "title": "EPISODE 3 - CROSSROADS ELEGY",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.4475,
          "type": "checklist",
          "state": {
            "title": "Forest Talker Collectibles",
            "items": [
              {
                "text": "Forest Talker Note 1: Molly's Barn (upper floor)",
                "completed": false
              },
              {
                "text": "Forest Talker Note 2: Joplin's First Bunker",
                "completed": false
              },
              {
                "text": "Forest Talker Note 3: Three Strikes Farmstead",
                "completed": false
              },
              {
                "text": "Forest Talker Note 4",
                "completed": false
              },
              {
                "text": "Forest Talker Note 5",
                "completed": false
              },
              {
                "text": "Forest Talker Note 6",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.1748,
          "type": "checklist",
          "state": {
            "title": "The Big One (Bigfoot Fish)",
            "items": [
              {
                "text": "Find note at General Store in Thomson's Crossing",
                "completed": false
              },
              {
                "text": "Complete Joplin's Shelter Raid",
                "completed": false
              },
              {
                "text": "Find The Big One book in second bunker",
                "completed": false
              },
              {
                "text": "Catch the legendary fish",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.1135,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Blackrock Investigation",
            "items": [],
            "dropdownText": "Investigate prison guards and escaped convicts"
          }
        },
        {
          "id": 1768363234561.389,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Church Artifact",
            "items": [],
            "dropdownText": "Find and return the church artifact"
          }
        },
        {
          "id": 1768363234561.8535,
          "type": "checklist",
          "state": {
            "title": "Joplin's Shelter Raid",
            "items": [
              {
                "text": "Find note at General Store",
                "completed": false
              },
              {
                "text": "Locate and raid first bunker",
                "completed": false
              },
              {
                "text": "Locate and raid second bunker",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.7566,
          "type": "checklist",
          "state": {
            "title": "Pleasant Valley History",
            "items": [
              {
                "text": "Locals Collectible Part 1: Rural Store",
                "completed": false
              },
              {
                "text": "Locals Collectible Part 2: Point of Disagreement Cabin",
                "completed": false
              },
              {
                "text": "Locals Collectible Part 3: Signal Hill",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.0022,
          "type": "divider",
          "state": {
            "title": "EPISODE 4 - FURY, THEN SILENCE",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.5662,
          "type": "checklist",
          "state": {
            "title": "Blackrock Rumours",
            "items": [
              {
                "text": "Blackrock Archive Page 1",
                "completed": false
              },
              {
                "text": "Blackrock Archive Page 2",
                "completed": false
              },
              {
                "text": "Blackrock Archive Page 3",
                "completed": false
              },
              {
                "text": "Blackrock Archive Page 4",
                "completed": false
              },
              {
                "text": "Blackrock Archive Page 5",
                "completed": false
              },
              {
                "text": "Blackrock Archive Page 6",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.3987,
          "type": "checklist",
          "state": {
            "title": "Convict Caches",
            "items": [
              {
                "text": "Convict Cache 1",
                "completed": false
              },
              {
                "text": "Convict Cache 2",
                "completed": false
              },
              {
                "text": "Convict Cache 3",
                "completed": false
              },
              {
                "text": "Convict Cache 4",
                "completed": false
              },
              {
                "text": "Convict Cache 5",
                "completed": false
              },
              {
                "text": "Convict Cache 6",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.3887,
          "type": "checklist",
          "state": {
            "title": "Guard Lockers",
            "items": [
              {
                "text": "Guard Locker 1",
                "completed": false
              },
              {
                "text": "Guard Locker 2",
                "completed": false
              },
              {
                "text": "Guard Locker 3",
                "completed": false
              },
              {
                "text": "Guard Locker 4",
                "completed": false
              },
              {
                "text": "Guard Locker 5",
                "completed": false
              },
              {
                "text": "Guard Locker 6",
                "completed": false
              },
              {
                "text": "Guard Locker 7",
                "completed": false
              },
              {
                "text": "Guard Locker 8",
                "completed": false
              },
              {
                "text": "Guard Locker 9",
                "completed": false
              },
              {
                "text": "Guard Locker 10",
                "completed": false
              },
              {
                "text": "Guard Locker 11",
                "completed": false
              },
              {
                "text": "Guard Locker 12",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.4448,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Dark Star",
            "items": [],
            "dropdownText": "Find note in prison yard bus to unlock quest"
          }
        },
        {
          "id": 1768363234561.5466,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Lost Power Workers",
            "items": [],
            "dropdownText": "Locate missing power plant workers"
          }
        },
        {
          "id": 1768363234561.5244,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Forest Talker Mine Supply Cache",
            "items": [],
            "dropdownText": "Special cache hidden in the mines"
          }
        }
      ],
      [
        {
          "id": 1768363234561.9048,
          "type": "divider",
          "state": {
            "title": "EPISODE 1 COLLECTIBLES",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.7583,
          "type": "checklist",
          "state": {
            "title": "Skill Books",
            "items": [
              {
                "text": "A Sewing Primer",
                "completed": false
              },
              {
                "text": "Field Dressing Your Kill, Vol 1",
                "completed": false
              },
              {
                "text": "Medicinal Plants of Great Bear",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.3994,
          "type": "checklist",
          "state": {
            "title": "Milton Bank Deposit Box Keys",
            "items": [
              {
                "text": "Key 1",
                "completed": false
              },
              {
                "text": "Key 2",
                "completed": false
              },
              {
                "text": "Key 3",
                "completed": false
              },
              {
                "text": "Key 4",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.73,
          "type": "checklist",
          "state": {
            "title": "Milton Supply Cache Notes",
            "items": [
              {
                "text": "Cache Note 1",
                "completed": false
              },
              {
                "text": "Cache Note 2",
                "completed": false
              },
              {
                "text": "Cache Note 3",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.4644,
          "type": "divider",
          "state": {
            "title": "EPISODE 2 COLLECTIBLES",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.5037,
          "type": "checklist",
          "state": {
            "title": "Skill Books",
            "items": [
              {
                "text": "Frontier Shooting Guide",
                "completed": false
              },
              {
                "text": "Advanced: Guns Guns Guns",
                "completed": false
              },
              {
                "text": "The Frozen Angler",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.3855,
          "type": "checklist",
          "state": {
            "title": "Mystery Lake Cabin Keys",
            "items": [
              {
                "text": "Cabin Key 1: High Blind (Forlorn Muskeg)",
                "completed": false
              },
              {
                "text": "Cabin Key 2: Hunter's Blind (Mystery Lake)",
                "completed": false
              },
              {
                "text": "Cabin Key 3: Camp Office",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.231,
          "type": "checklist",
          "state": {
            "title": "Mystery Lake Cache Notes",
            "items": [
              {
                "text": "Alan's Cave Note",
                "completed": false
              },
              {
                "text": "Clearcut Note",
                "completed": false
              },
              {
                "text": "Tunnel Note",
                "completed": false
              },
              {
                "text": "Tree Roots Note",
                "completed": false
              },
              {
                "text": "Ravine Note",
                "completed": false
              },
              {
                "text": "Unnamed Pond Note",
                "completed": false
              },
              {
                "text": "Forest Talker Note 1",
                "completed": false
              },
              {
                "text": "Forest Talker Note 2",
                "completed": false
              },
              {
                "text": "Forest Talker Note 3",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.927,
          "type": "divider",
          "state": {
            "title": "EPISODE 3 COLLECTIBLES",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.997,
          "type": "checklist",
          "state": {
            "title": "Skill Books",
            "items": [
              {
                "text": "The Big One (legendary fish guide)",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.0444,
          "type": "checklist",
          "state": {
            "title": "Forest Talker Notes",
            "items": [
              {
                "text": "Forest Talker Note 1: Molly's Barn",
                "completed": false
              },
              {
                "text": "Forest Talker Note 2: Joplin's Bunker",
                "completed": false
              },
              {
                "text": "Forest Talker Note 3: Three Strikes Farmstead",
                "completed": false
              },
              {
                "text": "Forest Talker Note 4",
                "completed": false
              },
              {
                "text": "Forest Talker Note 5",
                "completed": false
              },
              {
                "text": "Forest Talker Note 6",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.2815,
          "type": "checklist",
          "state": {
            "title": "Pleasant Valley History Notes",
            "items": [
              {
                "text": "Locals Part 1: Rural Store",
                "completed": false
              },
              {
                "text": "Locals Part 2: Point of Disagreement Cabin",
                "completed": false
              },
              {
                "text": "Locals Part 3: Signal Hill",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1768363234561.9333,
          "type": "divider",
          "state": {
            "title": "EPISODE 4 COLLECTIBLES",
            "variant": "divider"
          }
        },
        {
          "id": 1768363234561.355,
          "type": "checklist",
          "state": {
            "title": "Blackrock Archive Pages",
            "items": [
              {
                "text": "Archive Page 1",
                "completed": false
              },
              {
                "text": "Archive Page 2",
                "completed": false
              },
              {
                "text": "Archive Page 3",
                "completed": false
              },
              {
                "text": "Archive Page 4",
                "completed": false
              },
              {
                "text": "Archive Page 5",
                "completed": false
              },
              {
                "text": "Archive Page 6",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        }
      ]
    ]
  }
}`;
    
    // Register the import
    window.GT50.Imports.register({
        id: 'stray',
        name: 'stray',
        description: 'you are a cat.',
        data: exportedData
    });
    
    console.log('✓ Import registered: Stray');
})();
