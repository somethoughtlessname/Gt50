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
                tabComponents: [[], [], [], []]
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

