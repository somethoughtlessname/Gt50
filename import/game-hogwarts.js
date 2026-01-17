
// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-17T01:06:12.967Z
// Name: Hogwarts Legacy
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
  "timestamp": "2026-01-17T01:06:10.880Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "Hogwarts Legacy",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "STORY QUESTS",
          "name": "STORY QUESTS",
          "color": "var(--color-4)"
        },
        {
          "label": "SIDE QUESTS",
          "name": "SIDE QUESTS",
          "color": "var(--color-5)"
        },
        {
          "label": "COLLECTIBLES",
          "name": "COLLECTIBLES",
          "color": "var(--color-6)"
        },
        {
          "label": "CHALLENGES",
          "name": "CHALLENGES",
          "color": "var(--color-7)"
        }
      ],
      "activeViewTab": 0,
      "selectedBuildTab": 0
    },
    "tabComponents": [
      [
        {
          "id": 1767106109878.535,
          "type": "divider",
          "state": {
            "title": "SUMMER'S END",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.1433,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Journey to Hogwarts",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397627097
        },
        {
          "id": 1767106109878.324,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Welcome to Hogwarts",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397628101
        },
        {
          "id": 1767106109878.0862,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Defense Against the Dark Arts Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397628449
        },
        {
          "id": 1767106109878.8457,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Charms Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397628819
        },
        {
          "id": 1767106109878.6592,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Weasley After Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397629244
        },
        {
          "id": 1767106109878.3142,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Welcome to Hogsmead",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397629721
        },
        {
          "id": 1767106109878.57,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Locket's Secret",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397630144
        },
        {
          "id": 1767106109878.5505,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Secrets of the Restricted Section",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397630596
        },
        {
          "id": 1767106109878.2883,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Tomes and Tribulations",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397631038
        },
        {
          "id": 1767106109878.135,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Girl from Uagadou",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397631473
        },
        {
          "id": 1767106109878.0564,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Herbology Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397631948
        },
        {
          "id": 1767106109878.0508,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Potions Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397632408
        },
        {
          "id": 1767106109878.5837,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Trials of Merlin",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397633593
        },
        {
          "id": 1767106109878.7507,
          "type": "radio",
          "state": {
            "selectedIndex": null,
            "title": "House Specific Quest",
            "items": [
              {
                "text": "Gryffindor"
              },
              {
                "text": "Slytherin"
              },
              {
                "text": "Hufflepuff"
              },
              {
                "text": "Ravenclaw"
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768397633993
        },
        {
          "id": 1767106109878.7947,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Jackdaw's Rest",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397634377
        },
        {
          "id": 1767106109878.5408,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Flying Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397635462
        },
        {
          "id": 1767106109878.4539,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Room of Requirement",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397635956
        },
        {
          "id": 1767106109878.2502,
          "type": "list",
          "state": {
            "completed": false,
            "title": "In the Shadow of the Undercroft",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397637274
        },
        {
          "id": 1767106109878.1711,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Map Chamber",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397637600
        },
        {
          "id": 1767106109878.054,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Percival Rackham's Trial",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397637958
        },
        {
          "id": 1767106109878.2314,
          "type": "divider",
          "state": {
            "title": "AUTUMN BEGINS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.9868,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Beasts Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397639278
        },
        {
          "id": 1767106109878.562,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Caretaker's Lunar Lament",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397639619
        },
        {
          "id": 1767106109878.0422,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Helm of Urtkot",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397639962
        },
        {
          "id": 1767106109878.676,
          "type": "list",
          "state": {
            "completed": false,
            "title": "In the Shadow of the Estate",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397640437
        },
        {
          "id": 1767106109878.155,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Elf, the Nab-Sack, and the Loom",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397640939
        },
        {
          "id": 1767106109878.275,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The High Keep",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397641381
        },
        {
          "id": 1767106109878.9497,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Astronomy Class",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397641860
        },
        {
          "id": 1767106109878.975,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Back on the Path",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397642385
        },
        {
          "id": 1767106109878.3367,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Charles Rookwood's Trial",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397642774
        },
        {
          "id": 1767106109878.9385,
          "type": "divider",
          "state": {
            "title": "WINTER BEGINS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.1294,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Fire and Vice",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397644051
        },
        {
          "id": 1767106109878.6245,
          "type": "list",
          "state": {
            "completed": false,
            "title": "In the Shadow of the Mine",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397644429
        },
        {
          "id": 1767106109878.285,
          "type": "list",
          "state": {
            "completed": false,
            "title": "It's All Gobbledegook",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397644836
        },
        {
          "id": 1767106109878.6152,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Headmistress Speaks",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397645298
        },
        {
          "id": 1767106109878.4834,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Polyjuice Plot",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397645722
        },
        {
          "id": 1767106109878.178,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Niamh Fitzgerald's Trial",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397646130
        },
        {
          "id": 1767106109878.7651,
          "type": "list",
          "state": {
            "completed": false,
            "title": "In the Shadow of the Mountain",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397646565
        },
        {
          "id": 1767106109878.511,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Lodgok's Loyalty",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397647943
        },
        {
          "id": 1767106109878.7004,
          "type": "list",
          "state": {
            "completed": false,
            "title": "San Bakar's Trial",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397648260
        },
        {
          "id": 1767106109878.9438,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Wand Mastery",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397648601
        },
        {
          "id": 1767106109878.763,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The Final Repository",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397649020
        },
        {
          "id": 1767106109878.8918,
          "type": "list",
          "state": {
            "completed": false,
            "title": "In the Shadow of Revelation",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397649470
        },
        {
          "id": 1767106109878.529,
          "type": "divider",
          "state": {
            "title": "SPRING BEGINS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.2854,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Weasley's Watchful Eye",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397650138
        },
        {
          "id": 1767106109878.4895,
          "type": "list",
          "state": {
            "completed": false,
            "title": "The House Cup",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397650597
        }
      ],
      [
        {
          "id": 1767106109878.879,
          "type": "divider",
          "state": {
            "title": "RELATIONSHIP",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.7976,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Professor Assignments",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397655004
        },
        {
          "id": 1767106109878.9048,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Natsai Onai",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397655507
        },
        {
          "id": 1767106109878.13,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Poppy Sweeting",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397655923
        },
        {
          "id": 1767106109878.25,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Sebastian Sallow",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397656382
        },
        {
          "id": 1767106109878.277,
          "type": "divider",
          "state": {
            "title": "REGIONAL",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.3882,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Hogwarts Castle",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.8647,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Hogsmead",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.5444,
          "type": "list",
          "state": {
            "completed": false,
            "title": "South Hogwarts",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397657201
        },
        {
          "id": 1767106109878.9001,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Hogsmead Valley",
            "items": [],
            "dropdownText": ""
          },
          "lastUpdated": 1768397657651
        },
        {
          "id": 1767106109878.8755,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Hogwarts Valley",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.603,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Feldcroft",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.5864,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Poidsear",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.643,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Maruweem Lake",
            "items": [],
            "dropdownText": ""
          }
        },
        {
          "id": 1767106109878.7156,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Cragcroftshire",
            "items": [],
            "dropdownText": ""
          }
        }
      ],
      [
        {
          "id": 1767106109878.4502,
          "type": "divider",
          "state": {
            "title": "PROGRESS TRACKERS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.3499,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 33,
            "target": 33,
            "title": "Demiguise Statues",
            "dropdownText": ""
          },
          "lastUpdated": 1768397666935
        },
        {
          "id": 1767106109878.1782,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 241,
            "target": 241,
            "title": "Field Guide Pages",
            "dropdownText": ""
          },
          "lastUpdated": 1768397667995
        },
        {
          "id": 1767106109878.767,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 86,
            "target": 86,
            "title": "Floo Flames",
            "dropdownText": ""
          },
          "lastUpdated": 1768397717442
        },
        {
          "id": 1767106109878.1523,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 150,
            "target": 150,
            "title": "Revelio Pages",
            "dropdownText": ""
          },
          "lastUpdated": 1768397743262
        },
        {
          "id": 1767106109878.0322,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 195,
            "target": 195,
            "title": "Merlin Trials",
            "dropdownText": ""
          },
          "lastUpdated": 1768397746032
        },
        {
          "id": 1767106109878.6553,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 10,
            "target": 10,
            "title": "Tools",
            "dropdownText": ""
          },
          "lastUpdated": 1768397749531
        },
        {
          "id": 1767106109878.1777,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 69,
            "target": 69,
            "title": "Enemies",
            "dropdownText": ""
          },
          "lastUpdated": 1768397768906
        },
        {
          "id": 1767106109878.7668,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 104,
            "target": 104,
            "title": "Appearances",
            "dropdownText": ""
          },
          "lastUpdated": 1768397796822
        },
        {
          "id": 1767106109878.3745,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 15,
            "target": 15,
            "title": "Brooms",
            "dropdownText": ""
          },
          "lastUpdated": 1768397799142
        },
        {
          "id": 1767106109878.439,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 16,
            "target": 16,
            "title": "Ingredients",
            "dropdownText": ""
          },
          "lastUpdated": 1768397805829
        },
        {
          "id": 1767106109878.0176,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 140,
            "target": 140,
            "title": "Conjurations",
            "dropdownText": ""
          },
          "lastUpdated": 1768397818394
        },
        {
          "id": 1767106109878.9536,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 42,
            "target": 42,
            "title": "Wand Handles",
            "dropdownText": ""
          },
          "lastUpdated": 1768397821064
        },
        {
          "id": 1767106109878.0967,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 75,
            "target": 75,
            "title": "Traits",
            "dropdownText": ""
          },
          "lastUpdated": 1768397829747
        },
        {
          "id": 1767106109878.9211,
          "type": "divider",
          "state": {
            "title": "CHECKLISTS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.1873,
          "type": "checklist",
          "state": {
            "title": "Beasts",
            "items": [
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768397831896
        },
        {
          "id": 1767106109878.585,
          "type": "checklist",
          "state": {
            "title": "Mounts",
            "items": [
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              },
              {
                "text": "",
                "completed": false
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768397832953
        }
      ],
      [
        {
          "id": 1767106109878.0847,
          "type": "divider",
          "state": {
            "title": "COMBAT",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.2615,
          "type": "tier",
          "state": {
            "title": "Defeat Dark Wizards",
            "current": 0,
            "total": 240,
            "tiers": [
              {
                "name": "Defeat 10 Dark Wizards",
                "amount": 10
              },
              {
                "name": "Defeat 20 Dark Wizards",
                "amount": 20
              },
              {
                "name": "Defeat 40 Dark Wizards",
                "amount": 40
              },
              {
                "name": "Defeat 70 Dark Wizards",
                "amount": 70
              },
              {
                "name": "Defeat 100 Dark Wizards",
                "amount": 100
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398162777
        },
        {
          "id": 1767106109878.9504,
          "type": "tier",
          "state": {
            "title": "Defeat Dugbogs",
            "current": 0,
            "total": 35,
            "tiers": [
              {
                "name": "Defeat 5 Dugbogs",
                "amount": 5
              },
              {
                "name": "Defeat 10 Dugbogs",
                "amount": 10
              },
              {
                "name": "Defeat 20 Dugbogs",
                "amount": 20
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398164699
        },
        {
          "id": 1767106109878.9446,
          "type": "tier",
          "state": {
            "title": "Defeat Goblins",
            "current": 0,
            "total": 190,
            "tiers": [
              {
                "name": "Defeat 30 Goblins",
                "amount": 30
              },
              {
                "name": "Defeat 60 Goblins",
                "amount": 60
              },
              {
                "name": "Defeat 100 Goblins",
                "amount": 100
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398166334
        },
        {
          "id": 1767106109878.178,
          "type": "tier",
          "state": {
            "title": "Defeat Inferi",
            "current": 0,
            "total": 66,
            "tiers": [
              {
                "name": "Defeat 10 Inferi",
                "amount": 10
              },
              {
                "name": "Defeat 20 Inferi",
                "amount": 20
              },
              {
                "name": "Defeat 36 Inferi",
                "amount": 36
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398168122
        },
        {
          "id": 1767106109878.5886,
          "type": "tier",
          "state": {
            "title": "Defeat Infamous Foes",
            "current": 0,
            "total": 21,
            "tiers": [
              {
                "name": "Defeat 3 Infamous Foes",
                "amount": 3
              },
              {
                "name": "Defeat 6 Infamous Foes",
                "amount": 6
              },
              {
                "name": "Defeat 12 Infamous Foes",
                "amount": 12
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398169766
        },
        {
          "id": 1767106109878.666,
          "type": "tier",
          "state": {
            "title": "Defeat Spiders",
            "current": 0,
            "total": 240,
            "tiers": [
              {
                "name": "Defeat 10 Spiders",
                "amount": 10
              },
              {
                "name": "Defeat 20 Spiders",
                "amount": 20
              },
              {
                "name": "Defeat 40 Spiders",
                "amount": 40
              },
              {
                "name": "Defeat 70 Spiders",
                "amount": 70
              },
              {
                "name": "Defeat 100 Spiders",
                "amount": 100
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398171459
        },
        {
          "id": 1767106109878.7131,
          "type": "tier",
          "state": {
            "title": "Defeat Trolls",
            "current": 0,
            "total": 30,
            "tiers": [
              {
                "name": "Defeat 5 Trolls",
                "amount": 5
              },
              {
                "name": "Defeat 10 Trolls",
                "amount": 10
              },
              {
                "name": "Defeat 15 Trolls",
                "amount": 15
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768397898210
        },
        {
          "id": 1767106109878.3333,
          "type": "tier",
          "state": {
            "title": "Defeat Mongrels",
            "current": 0,
            "total": 60,
            "tiers": [
              {
                "name": "Defeat 10 Mongrels",
                "amount": 10
              },
              {
                "name": "Defeat 20 Mongrels",
                "amount": 20
              },
              {
                "name": "Defeat 30 Mongrels",
                "amount": 30
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768397877657
        },
        {
          "id": 1767106109878.5874,
          "type": "divider",
          "state": {
            "title": "QUESTS",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.915,
          "type": "tier",
          "state": {
            "title": "Complete Duelling Feats",
            "current": 0,
            "total": 112,
            "tiers": [
              {
                "name": "Complete 5 Duelling Feats",
                "amount": 5
              },
              {
                "name": "Complete 10 Duelling Feats",
                "amount": 10
              },
              {
                "name": "Complete 20 Duelling Feats",
                "amount": 20
              },
              {
                "name": "Complete 32 Duelling Feats",
                "amount": 32
              },
              {
                "name": "Complete 45 Duelling Feats",
                "amount": 45
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398080574
        },
        {
          "id": 1767106109878.3389,
          "type": "tier",
          "state": {
            "title": "Complete Assignments",
            "current": 0,
            "total": 12,
            "tiers": [
              {
                "name": "Complete 2 Assignments",
                "amount": 2
              },
              {
                "name": "Complete 4 Assignments",
                "amount": 4
              },
              {
                "name": "Complete 6 Assignments",
                "amount": 6
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398087754
        },
        {
          "id": 1767106109878.6692,
          "type": "tier",
          "state": {
            "title": "Complete Main Quests",
            "current": 0,
            "total": 34,
            "tiers": [
              {
                "name": "Complete 2 Main Quests",
                "amount": 2
              },
              {
                "name": "Complete 4 Main Quests",
                "amount": 4
              },
              {
                "name": "Complete 6 Main Quests",
                "amount": 6
              },
              {
                "name": "Complete 8 Main Quests",
                "amount": 8
              },
              {
                "name": "Complete 14 Main Quests",
                "amount": 14
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398087495
        },
        {
          "id": 1767106109878.307,
          "type": "tier",
          "state": {
            "title": "Complete Side Quests",
            "current": 0,
            "total": 69,
            "tiers": [
              {
                "name": "Complete 3 Side Quests",
                "amount": 3
              },
              {
                "name": "Complete 6 Side Quests",
                "amount": 6
              },
              {
                "name": "Complete 10 Side Quests",
                "amount": 10
              },
              {
                "name": "Complete 18 Side Quests",
                "amount": 18
              },
              {
                "name": "Complete 32 Side Quests",
                "amount": 32
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398105092
        },
        {
          "id": 1767106109878.2815,
          "type": "divider",
          "state": {
            "title": "EXPLORATION",
            "variant": "divider"
          }
        },
        {
          "id": 1767106109878.8267,
          "type": "tier",
          "state": {
            "title": "Ancient Magic Traces",
            "current": 0,
            "total": 20,
            "tiers": [
              {
                "name": "Collect 2 Ancient Magic Traces",
                "amount": 2
              },
              {
                "name": "Collect 6 Ancient Magic Traces",
                "amount": 6
              },
              {
                "name": "Collect 12 Ancient Magic Traces",
                "amount": 12
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398105202
        },
        {
          "id": 1767106109878.0542,
          "type": "tier",
          "state": {
            "title": "Sets of Balloons",
            "current": 0,
            "total": 32,
            "tiers": [
              {
                "name": "Pop 2 Sets of Balloons",
                "amount": 2
              },
              {
                "name": "Pop 5 Sets of Balloons",
                "amount": 5
              },
              {
                "name": "Pop 10 Sets of Balloons",
                "amount": 10
              },
              {
                "name": "Pop 15 Sets of Balloons",
                "amount": 15
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398116288
        },
        {
          "id": 1767106109879.0103,
          "type": "tier",
          "state": {
            "title": "Landing Platforms",
            "current": 0,
            "total": 20,
            "tiers": [
              {
                "name": "Find 2 Landing Platforms",
                "amount": 2
              },
              {
                "name": "Find 4 Landing Platforms",
                "amount": 4
              },
              {
                "name": "Find 6 Landing Platforms",
                "amount": 6
              },
              {
                "name": "Find 8 Landing Platforms",
                "amount": 8
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398118862
        },
        {
          "id": 1767106109879.1838,
          "type": "tier",
          "state": {
            "title": "Merlin Trials",
            "current": 0,
            "total": 52,
            "tiers": [
              {
                "name": "Solve 2 Merlin Trials",
                "amount": 2
              },
              {
                "name": "Solve 6 Merlin Trials",
                "amount": 6
              },
              {
                "name": "Solve 10 Merlin Trials",
                "amount": 10
              },
              {
                "name": "Solve 14 Merlin Trials",
                "amount": 14
              },
              {
                "name": "Solve 20 Merlin Trials",
                "amount": 20
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768475483488
        },
        {
          "id": 1767106109879.24,
          "type": "tier",
          "state": {
            "title": "Astronomy Tables",
            "current": 0,
            "total": 15,
            "tiers": [
              {
                "name": "View Constellations from 5 Astronomy Tables",
                "amount": 5
              },
              {
                "name": "View Constellations from 5 Astronomy Tables",
                "amount": 5
              },
              {
                "name": "View Constellations from 5 Astronomy Tables",
                "amount": 5
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398125795
        },
        {
          "id": 1767106109879.8936,
          "type": "tier",
          "state": {
            "title": "Solve Hogwarts Secrets",
            "current": 0,
            "total": 3,
            "tiers": [
              {
                "name": "Solve 1 Hogwarts Secret",
                "amount": 1
              },
              {
                "name": "Solve 1 Hogwarts Secret",
                "amount": 1
              },
              {
                "name": "Solve 1 Hogwarts Secret",
                "amount": 1
              }
            ],
            "dropdownText": ""
          },
          "lastUpdated": 1768398127223
        }
      ]
    ]
  }
}`;
    
    // Register the import
    window.GT50.Imports.register({
        id: 'hogwarts-legacy',
        name: 'Hogwarts Legacy',
        description: 'Choose your house and define your legacy as a wizard.',
        data: exportedData
    });
    
    console.log('✓ Import registered: Hogwarts Legacy');
})();

