// ===== GT50 IMPORT FILE =====
// Generated: 2026-01-28T04:32:48.472Z
// Name: The Holy Gosh Darn
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
  "timestamp": "2026-01-28T04:32:45.072Z",
  "app": "GT50 Tester",
  "type": "nest",
  "name": "The Holy Gosh Darn",
  "data": {
    "tabs": {
      "tabs": [
        {
          "label": "Main Story",
          "name": "Main Story",
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
          "id": 1769472960114.0347,
          "type": "divider",
          "state": {
            "title": "Prologue",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960114.0566,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Wake Up in Heaven",
            "items": [],
            "dropdownText": "Cassiel's boring day begins - guess dog breeds with Puriel"
          }
        },
        {
          "id": 1769472960114.7122,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Meet Death & Get the Clock",
            "items": [],
            "dropdownText": "Heaven explodes! Death gives you a time-traveling watch to prevent it"
          }
        },
        {
          "id": 1769472960114.3523,
          "type": "divider",
          "state": {
            "title": "Act 1: The Investigation",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960114.2354,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Talk to Peter About the Key",
            "items": [],
            "dropdownText": "Get the Vault key from Peter by learning about the Phantoms"
          }
        },
        {
          "id": 1769472960114.451,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Open the Vault",
            "items": [],
            "dropdownText": "Use Peter's key to access the Vault"
          }
        },
        {
          "id": 1769472960114.5176,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Talk to Elder 7",
            "items": [],
            "dropdownText": "Wake Elder 7 and learn about the Holy Gosh Darn artifact"
          }
        },
        {
          "id": 1769472960114.4375,
          "type": "list",
          "state": {
            "title": "Get Coffee for Elder 7",
            "items": [
              {
                "text": "Make coffee in your apartment",
                "completed": false
              },
              {
                "text": "Bring two cups to Elder 7",
                "completed": false
              },
              {
                "text": "Access the inner vault",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960114.4128,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Discover the Fake Holy Gosh Darn",
            "items": [],
            "dropdownText": "Find the decoy artifact in the vault"
          }
        },
        {
          "id": 1769472960114.4248,
          "type": "divider",
          "state": {
            "title": "Act 2: The Search",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960114.9004,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Display the Fake Artifact",
            "items": [],
            "dropdownText": "Place the fake Holy Gosh Darn on the display near the clouds"
          }
        },
        {
          "id": 1769472960115.6716,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Read the Note on the Fake",
            "items": [],
            "dropdownText": "Learn information about the real artifact"
          }
        },
        {
          "id": 1769472960115.5132,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Cloud-Jump to Robocorp",
            "items": [],
            "dropdownText": "Travel to Robocorp to investigate"
          }
        },
        {
          "id": 1769472960115.5942,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Platform to the Meeting",
            "items": [],
            "dropdownText": "Navigate Robocorp's interior to reach the meeting room"
          }
        },
        {
          "id": 1769472960115.9023,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Appear to the Board Member",
            "items": [],
            "dropdownText": "Reveal yourself to trigger key events"
          }
        },
        {
          "id": 1769472960115.4443,
          "type": "divider",
          "state": {
            "title": "Act 3: The Bus Heist",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960115.437,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Ask Beelzebrøth for a Ride",
            "items": [],
            "dropdownText": "Get on the bus at the bus stop"
          }
        },
        {
          "id": 1769472960115.7266,
          "type": "list",
          "state": {
            "title": "Get the Bus Working",
            "items": [
              {
                "text": "Ask the ghost to be a lookout",
                "completed": false
              },
              {
                "text": "Try to hotwire the bus",
                "completed": false
              },
              {
                "text": "Get pliers from the ghost",
                "completed": false
              },
              {
                "text": "Successfully steal the bus",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.9407,
          "type": "divider",
          "state": {
            "title": "Act 4: Finding the Holy Gosh Darn",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960115.0872,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Visit Hell",
            "items": [],
            "dropdownText": "Travel to the demonic realm"
          }
        },
        {
          "id": 1769472960115.6145,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Visit Earth",
            "items": [],
            "dropdownText": "Travel to the mortal realm in 2016"
          }
        },
        {
          "id": 1769472960115.2456,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Visit Helheim",
            "items": [],
            "dropdownText": "Travel to the Norse underworld"
          }
        },
        {
          "id": 1769472960115.705,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Locate the Real Holy Gosh Darn",
            "items": [],
            "dropdownText": "Find the true artifact created by God"
          }
        },
        {
          "id": 1769472960115.471,
          "type": "divider",
          "state": {
            "title": "Final Act",
            "variant": "divider"
          }
        },
        {
          "id": 1769472960115.8042,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Activate the Holy Gosh Darn",
            "items": [],
            "dropdownText": "Use the artifact to stop the Phantoms"
          }
        },
        {
          "id": 1769472960115.8606,
          "type": "list",
          "state": {
            "completed": false,
            "title": "Save Heaven",
            "items": [],
            "dropdownText": "Complete the mission and prevent Heaven's destruction"
          }
        }
      ],
      [
        {
          "id": 1769472960115.7327,
          "type": "checklist",
          "state": {
            "title": "Heavenly Elders (23 Total)",
            "items": [
              {
                "text": "Elder 1 - Heaven, Apartment (brush teeth 5 times)",
                "completed": false
              },
              {
                "text": "Elder 2 - Heaven, On the Clouds (left of Earth jump point)",
                "completed": false
              },
              {
                "text": "Elder 3 - Heaven, Call phone number 555-145",
                "completed": false
              },
              {
                "text": "Elder 4 - Heaven, Apartment area",
                "completed": false
              },
              {
                "text": "Elder 5 - Heaven, God's Throne",
                "completed": false
              },
              {
                "text": "Elder 6 - Heaven, Statue to the right",
                "completed": false
              },
              {
                "text": "Elder 7 - Heaven, Vault (quest giver - doesn't count toward total)",
                "completed": false
              },
              {
                "text": "Elder 8 - Hell, Jump up balcony past the gate (need double jump)",
                "completed": false
              },
              {
                "text": "Elder 9 - Helheim at 2pm, then A New Record at 3pm (record album, she buys it and gets insulted)",
                "completed": false
              },
              {
                "text": "Elder 10 - Heaven, Vault roof (climb phonebooth, then vault roof, need double jump)",
                "completed": false
              },
              {
                "text": "Elder 11 - Heaven, Mysterious Ways (need sandwich from bus driver, give to Sammy)",
                "completed": false
              },
              {
                "text": "Elder 12 - Hell, Boardgames, Coffee and Friends (costs 25 chips)",
                "completed": false
              },
              {
                "text": "Elder 13 - Heaven, Inside vault (enter from window, fall down hole, appears at 12:45, buy ticket first)",
                "completed": false
              },
              {
                "text": "Elder 14 - Hell, Down alley with Elder 14 poster, stage on right (need ticket from Elder 13 + megaphone from Boardgames, insult during soft singing)",
                "completed": false
              },
              {
                "text": "Elder 15 - Heaven, Laundry room (falls out of washer at 17:45)",
                "completed": false
              },
              {
                "text": "Elder 16 - Heaven, Far right side of Heaven",
                "completed": false
              },
              {
                "text": "Elder 17 - Hell, Bus driver location (steal bus, create Hell portal in Robocorp, teleport back, approach bus driver)",
                "completed": false
              },
              {
                "text": "Elder 18 - Need to explore thoroughly",
                "completed": false
              },
              {
                "text": "Elder 19 - Need to explore thoroughly",
                "completed": false
              },
              {
                "text": "Elder 20 - Heaven, Bridge outside apartment at 17:00 OR washing machine area at 17:45",
                "completed": false
              },
              {
                "text": "Elder 21 - Need to explore thoroughly",
                "completed": false
              },
              {
                "text": "Elder 22 - Need to explore thoroughly",
                "completed": false
              },
              {
                "text": "Elder 23 - Need to explore thoroughly",
                "completed": false
              },
              {
                "text": "Elder 24 - Heaven, Has apartment (book location, in Mysterious Ways area)",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.5342,
          "type": "checklist",
          "state": {
            "title": "Holy Spirits (6 Total)",
            "items": [
              {
                "text": "Dave - Story-related, cannot miss during main quest",
                "completed": false
              },
              {
                "text": "Holy Spirit 1 - Heaven, Portal to RoboCorp (where dogs enter Heaven)",
                "completed": false
              },
              {
                "text": "Holy Spirit 2 - Hell, Boardgames, Coffee and Friends VIP section",
                "completed": false
              },
              {
                "text": "Holy Spirit 3 - Hell, The Laughing Gland bathroom (must wear horns cosmetic before entering)",
                "completed": false
              },
              {
                "text": "Holy Spirit 4 - Heaven, Vault 3rd lamp (enter vault from window above, interact with 3rd lamp)",
                "completed": false
              },
              {
                "text": "Holy Spirit 5 - Heaven, On clouds beside Elder 2 (left of Earth jumping point)",
                "completed": false
              },
              {
                "text": "Holy Spirit 6 - Need All-Seeing Goggles equipped to find all Holy Spirits",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.3076,
          "type": "checklist",
          "state": {
            "title": "Divine Memories (6 Total)",
            "items": [
              {
                "text": "Memory 1 - Heaven, Leftmost area on a cloud",
                "completed": false
              },
              {
                "text": "Memory 2 - Heaven, Museum on the light fixture",
                "completed": false
              },
              {
                "text": "Memory 3 - Earth, Talk to woman in lab, she drives away, memory appears blocked by her car",
                "completed": false
              },
              {
                "text": "Memory 4 - Heaven, Bridge on the way to God's throne",
                "completed": false
              },
              {
                "text": "Memory 5 - Heaven, Apartment area (near Elder 4 location)",
                "completed": false
              },
              {
                "text": "Memory 6 - Explore all locations with All-Seeing Goggles equipped",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.8193,
          "type": "checklist",
          "state": {
            "title": "Books (6 Total)",
            "items": [
              {
                "text": "Book 1 - Earth, Robocorp meeting room (walk all the way left)",
                "completed": false
              },
              {
                "text": "Book 2 - Hell, Book exchange (bring a different book to trade)",
                "completed": false
              },
              {
                "text": "Book 3 - Helheim, Book exchange at entrance (bring a different book to trade)",
                "completed": false
              },
              {
                "text": "Book 4 - Heaven, Elder 24's apartment in Mysterious Ways",
                "completed": false
              },
              {
                "text": "Book 5 - Earth, Samuel Senior's office",
                "completed": false
              },
              {
                "text": "Book 6 - Hell, Hospital",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.4592,
          "type": "checklist",
          "state": {
            "title": "Phone Numbers (15 Total)",
            "items": [
              {
                "text": "010-101 - Call to discover what happens",
                "completed": false
              },
              {
                "text": "101-010 - Heaven, Written on Elder 10's clothes",
                "completed": false
              },
              {
                "text": "111-111 - Heaven, Mysterious Ways (written on wall)",
                "completed": false
              },
              {
                "text": "123-456 - Found on a computer",
                "completed": false
              },
              {
                "text": "128-945 - Heaven, Mysterious Ways (on poster)",
                "completed": false
              },
              {
                "text": "287-472 - Found in radio broadcasts",
                "completed": false
              },
              {
                "text": "420-420 - Call to discover what happens",
                "completed": false
              },
              {
                "text": "471-900 - Heaven, Note in the phone booth",
                "completed": false
              },
              {
                "text": "555-145 - Heaven, Elder 20 has this number",
                "completed": false
              },
              {
                "text": "666-666 - Hell, Written on Satan's bed",
                "completed": false
              },
              {
                "text": "696-969 - Call to discover what happens",
                "completed": false
              },
              {
                "text": "777-777 - Call to discover what happens",
                "completed": false
              },
              {
                "text": "788-423 - Heaven, Graffiti next to the phone booth",
                "completed": false
              },
              {
                "text": "934-882 - Written on the H-121 form",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.1133,
          "type": "checklist",
          "state": {
            "title": "Coffee Types (3+ Total)",
            "items": [
              {
                "text": "Apartment Coffee - Heaven, Your apartment coffee maker (make during Elder 7 quest)",
                "completed": false
              },
              {
                "text": "Laughing Gland Coffee - Hell, The Laughing Gland Bar (costs 3 soul coins or 1 meaning of life coin)",
                "completed": false
              },
              {
                "text": "Additional Coffees - Explore all locations for more varieties",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.217,
          "type": "checklist",
          "state": {
            "title": "Wardrobe Items (12 Total)",
            "items": [
              {
                "text": "All-Seeing Goggles - Earth, Robocorp (story-related, ask about goggles in security room)",
                "completed": false
              },
              {
                "text": "Death's Hoodie - Hell, Death's apartment (story-related)",
                "completed": false
              },
              {
                "text": "Death's Cap - Hell, Death's apartment (story-related)",
                "completed": false
              },
              {
                "text": "Skinny Jeans - Helheim, A New Record (get after recording Elder 9 dis-track album)",
                "completed": false
              },
              {
                "text": "I Heart Hell Shirt - Hell, Boardgames, Coffee and Friends (purchase with tickets as prize)",
                "completed": false
              },
              {
                "text": "Party Hat #1 - Hell, Boardgames (set checkpoint, choose hat, wait for inventory, rewind, repeat)",
                "completed": false
              },
              {
                "text": "Party Hat #2 - Hell, Boardgames (set checkpoint, choose hat, wait for inventory, rewind, repeat)",
                "completed": false
              },
              {
                "text": "Party Hat #3 - Hell, Boardgames (set checkpoint, choose hat, wait for inventory, rewind, repeat)",
                "completed": false
              },
              {
                "text": "Party Hat #4 - Hell, Boardgames (set checkpoint, choose hat, wait for inventory, rewind, repeat)",
                "completed": false
              },
              {
                "text": "Horn #1 - Hell, Horn vending machine (set checkpoint, buy horn, rewind, repeat for all 4-5)",
                "completed": false
              },
              {
                "text": "Horn #2 - Hell, Horn vending machine (set checkpoint, buy horn, rewind, repeat for all 4-5)",
                "completed": false
              },
              {
                "text": "Horn #3 - Hell, Horn vending machine (set checkpoint, buy horn, rewind, repeat for all 4-5)",
                "completed": false
              },
              {
                "text": "Horn #4 - Hell, Horn vending machine (set checkpoint, buy horn, rewind, repeat for all 4-5)",
                "completed": false
              }
            ],
            "dropdownText": ""
          }
        },
        {
          "id": 1769472960115.3333,
          "type": "progress",
          "state": {
            "current": 0,
            "total": 20,
            "target": 20,
            "title": "Artwork Viewed",
            "dropdownText": "Look at 20 paintings and art pieces throughout Heaven, Hell, Earth, and Helheim for achievement"
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
        id: 'the-holy-gosh-darn',
        name: 'The Holy Gosh Darn',
        description: 'Includes: Main Story, Collectibles',
        data: exportedData
    });
    
    console.log('✓ Import registered: The Holy Gosh Darn');
})();
