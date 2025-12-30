(function() {
    const INJECTOR_ID = '9001';
    
    // ============================================================
    // TEMPLATE: GAME TRACKER
    // ============================================================
    
    // Ensure GT50.Templates exists
    window.GT50 = window.GT50 || {};
    window.GT50.Templates = window.GT50.Templates || {
        registry: [],
        register: function(template) {
            this.registry.push(template);
        },
        get: function(id) {
            return this.registry.find(t => t.id === id);
        },
        getAll: function() {
            return this.registry;
        }
    };
    
    window.GT50.Templates.register({
        id: 'game',
        name: 'GAME TRACKER',
        description: 'Track story, side quests, collectibles, and challenges',
        
        generate: function() {
            return {
                tabs: {
                    tabs: [
                        { name: 'STORY', label: 'STORY', color: 'var(--color-4)' },
                        { name: 'SIDE', label: 'SIDE', color: 'var(--color-5)' },
                        { name: 'COLLECTION', label: 'COLLECTION', color: 'var(--color-6)' },
                        { name: 'CHALLENGES', label: 'CHALLENGES', color: 'var(--color-1)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                tabComponents: [
                    [
                        {
                            type: 'divider',
                            state: {
                                title: 'CHAPTER 1'
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: true,
                                title: '',
                                items: [],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: '',
                                items: [],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'divider',
                            state: {
                                title: 'CHAPTER 2'
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: '',
                                items: [],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: '',
                                items: [],
                                completed: false,
                                dropdownText: ''
                            }
                        }
                    ],
                    [
                        {
                            type: 'divider',
                            state: {
                                title: 'CHARACTER MISSIONS'
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: true,
                                title: 'Character 1',
                                items: [
                                    { text: 'Mission 1', checked: false },
                                    { text: 'Mission 2', checked: false }
                                ],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: 'Character 2',
                                items: [
                                    { text: 'Mission 1', checked: false },
                                    { text: 'Mission 2', checked: false }
                                ],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'divider',
                            state: {
                                title: 'REGIONAL MISSIONS'
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: 'Location 1',
                                items: [
                                    { text: 'Mission 1', checked: false },
                                    { text: 'Mission 2', checked: false }
                                ],
                                completed: false,
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'list',
                            state: {
                                open: false,
                                title: 'Location 2',
                                items: [
                                    { text: 'Mission 1', checked: false },
                                    { text: 'Mission 2', checked: false }
                                ],
                                completed: false,
                                dropdownText: ''
                            }
                        }
                    ],
                    [
                        {
                            type: 'divider',
                            state: {
                                title: 'PROGRESS TRACKERS'
                            }
                        },
                        {
                            type: 'progress',
                            state: {
                                open: true,
                                current: 0,
                                total: '20',
                                title: 'Items',
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'progress',
                            state: {
                                current: 0,
                                total: '50',
                                title: 'Objects',
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'divider',
                            state: {
                                title: 'LIST TRACKERS'
                            }
                        },
                        {
                            type: 'checklist',
                            state: {
                                open: false,
                                title: 'List 1',
                                items: [
                                    { text: 'Item 1', checked: false },
                                    { text: 'Item 2', checked: false },
                                    { text: 'Item 3', checked: false },
                                    { text: 'Item 4', checked: false },
                                    { text: 'Item 5', checked: false }
                                ],
                                dropdownText: ''
                            }
                        },
                        {
                            type: 'checklist',
                            state: {
                                open: false,
                                title: 'List 2',
                                items: [
                                    { text: 'Item 1', checked: false },
                                    { text: 'Item 2', checked: false },
                                    { text: 'Item 3', checked: false },
                                    { text: 'Item 4', checked: false },
                                    { text: 'Item 5', checked: false }
                                ],
                                dropdownText: ''
                            }
                        }
                    ],
                    [
                        {
                            type: 'divider',
                            state: {
                                title: 'COMBAT CHALLENGES'
                            }
                        },
                        {
                            type: 'tier',
                            state: {
                                open: true,
                                current: 0,
                                total: 250,
                                tiers: [
                                    { name: 'Bronze', amount: '50' },
                                    { name: 'Silver', amount: '100' },
                                    { name: 'Gold', amount: '100' }
                                ],
                                title: 'Enemy Types Defeated',
                                dropdownText: '',
                                autofillEnabled: false,
                                autofillCollect: '',
                                autofillObjects: '',
                                autofillObjectsSingular: ''
                            }
                        },
                        {
                            type: 'tier',
                            state: {
                                open: false,
                                current: 0,
                                total: 500,
                                tiers: [
                                    { name: 'Bronze', amount: '100' },
                                    { name: 'Silver', amount: '200' },
                                    { name: 'Gold', amount: '200' }
                                ],
                                title: 'Boss Battles Won',
                                dropdownText: '',
                                autofillEnabled: false,
                                autofillCollect: '',
                                autofillObjects: '',
                                autofillObjectsSingular: ''
                            }
                        },
                        {
                            type: 'divider',
                            state: {
                                title: 'EXPLORATION CHALLENGES'
                            }
                        },
                        {
                            type: 'tier',
                            state: {
                                open: false,
                                current: 0,
                                total: 150,
                                tiers: [
                                    { name: 'Bronze', amount: '30' },
                                    { name: 'Silver', amount: '60' },
                                    { name: 'Gold', amount: '60' }
                                ],
                                title: 'Locations Discovered',
                                dropdownText: '',
                                autofillEnabled: false,
                                autofillCollect: '',
                                autofillObjects: '',
                                autofillObjectsSingular: ''
                            }
                        },
                        {
                            type: 'tier',
                            state: {
                                open: false,
                                current: 0,
                                total: 1000,
                                tiers: [
                                    { name: 'Bronze', amount: '200' },
                                    { name: 'Silver', amount: '300' },
                                    { name: 'Gold', amount: '500' }
                                ],
                                title: 'Distance Traveled',
                                dropdownText: '',
                                autofillEnabled: false,
                                autofillCollect: '',
                                autofillObjects: '',
                                autofillObjectsSingular: ''
                            }
                        }
                    ]
                ]
            };
        }
    });
    
    // ============================================================
    // TEMPLATE: DAILY HABITS
    // ============================================================
    
    window.GT50.Templates.register({
        id: 'habits',
        name: 'DAILY HABITS',
        description: 'Morning and evening routine tracker',
        
        generate: function() {
            return {
                tabs: {
                    tabs: [],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                tabComponents: [[
                    {
                        type: 'checklist',
                        state: {
                            title: 'Morning Routine',
                            items: [
                                { text: 'Wake up on time', checked: false },
                                { text: 'Exercise', checked: false },
                                { text: 'Healthy breakfast', checked: false },
                                { text: 'Plan the day', checked: false }
                            ]
                        }
                    },
                    {
                        type: 'checklist',
                        state: {
                            title: 'Evening Routine',
                            items: [
                                { text: 'Review the day', checked: false },
                                { text: 'Prep for tomorrow', checked: false },
                                { text: 'Read 20 minutes', checked: false },
                                { text: 'Sleep by 11pm', checked: false }
                            ]
                        }
                    },
                    {
                        type: 'history',
                        state: {
                            title: 'Completion Log',
                            entries: []
                        }
                    }
                ]]
            };
        }
    });
    
    // ============================================================
    // TEMPLATE: PROS/CONS
    // ============================================================
    
    window.GT50.Templates.register({
        id: 'proscons',
        name: 'PROS/CONS',
        description: 'Compare advantages and disadvantages',
        
        generate: function() {
            return {
                tabs: {
                    tabs: [
                        { name: 'PROS', label: 'PROS', color: 'var(--color-4)' },
                        { name: 'CONS', label: 'CONS', color: 'var(--color-1)' }
                    ],
                    activeViewTab: 0,
                    selectedBuildTab: 0
                },
                tabComponents: [
                    [
                        {
                            type: 'list',
                            state: {
                                title: 'Advantages',
                                items: []
                            }
                        },
                        {
                            type: 'text',
                            state: {
                                title: 'Additional Thoughts',
                                value: ''
                            }
                        }
                    ],
                    [
                        {
                            type: 'list',
                            state: {
                                title: 'Disadvantages',
                                items: []
                            }
                        },
                        {
                            type: 'text',
                            state: {
                                title: 'Additional Thoughts',
                                value: ''
                            }
                        }
                    ]
                ]
            };
        }
    });
    
    // ============================================================
    // TEMPLATE: [YOUR NEXT TEMPLATE NAME]
    // ============================================================
    
    // Add your next template here...
    
})();

