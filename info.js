(function() {
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.CardInfo = {
        cardData: {
            list: {
                label: 'LIST',
                color: 'var(--color-1)',
                variations: [
                    { type: 'list', label: 'LIST', color: 'var(--color-1)' },
                    { type: 'checklist', label: 'CHECKLIST', color: 'var(--color-1-2)' },
                    { type: 'radio', label: 'RADIO', color: 'var(--color-1-3)' },
                    { type: 'threshold', label: 'THRESHOLD', color: 'var(--color-1-4)' }
                ],
                info: {
                    list: {
                        purpose: 'Lists are where your intentions become reality. They\'re the bridge between "I should do this" and "I did this." Each List card represents a collection of related tasks that you want to track and complete. Whether it\'s five things or fifty, the List keeps everything visible and accountable, preventing tasks from slipping through the cracks.',
                        build: 'You start with an empty List and a vision. Click that title and name it something specific - not just "Tasks" but "Launch Campaign Tasks" or "Saturday Errands." Now fill it up. Type your first task and hit the + or press enter. Another one. And another. Don\'t hold back. Get everything out of your head and into the List. Notice something out of order? Grab those arrows and move it. Realize you duplicated something? Hit that × and it\'s gone. You\'re building your personal roadmap here, and it should reflect exactly what needs to happen. When you\'re satisfied, collapse it with that dropdown arrow and move on to building your next card.',
                        view: 'This is where you actually execute. Open your List and you\'ll see every item you added, each with an empty checkbox waiting for you. As you complete each task in real life, come back and check it off. That number at the top? That\'s your score. Watch it climb from 0/15 to 5/15 to 15/15. There\'s something deeply satisfying about that progression. You can\'t change the items themselves here - this mode is about doing, not planning. But if something changes and you need to revise the List, you can always switch back to Build Mode, make your edits, and return to View Mode to continue checking things off.',
                        useCases: 'Weekly goals, household chores, side project milestones, learning objectives, birthday party planning, home organization, garden tasks, creative writing prompts, business development, personal improvement, skill practice, community service.'
                    },
                    checklist: {
                        purpose: 'Checklists take everything you love about Lists and add one crucial element: visible progress. That horizontal bar filling up as you complete tasks? That\'s pure motivation fuel. You\'re not just checking boxes anymore - you\'re watching a visual representation of your momentum. It transforms task completion from a mundane activity into something that feels like achievement.',
                        build: 'Building a Checklist feels just like building a List, because it basically is one - with a superpower. Name it something meaningful. Add your tasks one by one, reordering as needed. The magic happens automatically: that progress bar at the top calculates your completion percentage in real-time. You don\'t configure it, you don\'t set it up - it just knows. Add 10 items and complete 3, the bar fills 30%. It\'s mathematical honesty about where you stand.',
                        view: 'Watch the bar. Seriously, just watch it. Start with an empty Checklist and that bar is a thin line, barely visible. Check off your first item and it springs to life, filling a little. Check another. And another. The bar grows, the percentage climbs, and suddenly you\'re racing toward 100%. Each click on an item doesn\'t just mark it done - it feeds that progress bar, making your achievement visible and undeniable. When you hit 100%, the satisfaction is real because you\'ve watched it build.',
                        useCases: 'Project phases, learning curriculums, certification requirements, fitness program milestones, book chapter completion, course modules, renovation stages, onboarding steps, training progression, skill development paths.'
                    },
                    radio: {
                        purpose: 'Radio cards solve the "one and only one" problem. You\'re not tracking multiple possibilities here - you\'re making a choice. Pick your current focus. Select today\'s priority. Choose which plan you\'re following. It\'s decision-making captured in a card, with your selection always visible and easy to change when circumstances shift.',
                        build: 'Name your Radio card based on what you\'re choosing between. "Today\'s Focus", "Active Project", "Current Phase" - whatever fits. Then add your options. "Deep Work" or "Admin Tasks". "Project A", "Project B", "Project C". Each option is a button waiting to be selected. Order matters here because you\'ll see these in View Mode, so put the most common choices first. You can add as many options as you need, but remember - this is for choosing ONE thing, not many. Keep it focused.',
                        view: 'Your Radio card shows all your options as buttons. One of them is highlighted - that\'s your current selection. Changed your mind? Tap a different button. The highlight moves, and now that\'s your active choice. Need to see what you selected earlier? Open the dropdown and there\'s your history - every selection you\'ve made with timestamps. It\'s like breadcrumbs showing how your priorities evolved. The current choice is always front and center, impossible to miss.',
                        useCases: 'Current project focus, today\'s workout type, active learning subject, meal plan selection, work context switching, priority project tracking, phase indicators, current sprint, active client, mode selection.'
                    },
                    threshold: {
                        purpose: 'Threshold cards are for when quantity matters. Not just "did I do it?" but "did I do it enough times?" Eight glasses of water. Three sets of ten reps. Five sales calls. These are goals with specific numbers attached, and Threshold cards track each one individually until you hit that magic number.',
                        build: 'Start by naming what you\'re tracking. Then create your items - but these aren\'t simple tasks. Each one has two numbers: where you are now, and where you need to be. "Water Glass: 0/8", "Push-ups: 0/50", "Pages Read: 0/30". Set those thresholds based on your actual goals. You\'re creating a series of mini-goals that all live together in one card. Reorder them by priority. Delete the ones that don\'t matter anymore. This is your quantified target list.',
                        view: 'Each item shows you exactly where you stand: "5/8", "12/50", "23/30". Tap an item and the counter goes up by one. Tap again, it goes up again. You\'re manually logging each occurrence, each glass of water, each rep, each page. When you hit the threshold, a checkmark appears. But here\'s the thing - you can keep going. The counter doesn\'t stop at the threshold. Hit your goal of 8 glasses? The ninth still counts. The tenth still counts. Because sometimes "enough" isn\'t the end, it\'s just the beginning.',
                        useCases: 'Daily water tracking, exercise rep counting, medication doses, reading targets, practice sessions, sales quotas, call volumes, servings per day, study hours, habit repetitions, task iterations.'
                    }
                }
            },
            accumulation: {
                label: 'COUNT',
                color: 'var(--color-2)',
                variations: [
                    { type: 'accumulation', label: 'COUNT', color: 'var(--color-2)' },
                    { type: 'history', label: 'HISTORY', color: 'var(--color-2-2)' }
                ],
                info: {
                    accumulation: {
                        purpose: 'Sometimes you just need a number. How many days in a row? How many total? How many left? The Accumulation card is that number, big and bold and impossible to ignore. It goes up, it goes down, it tells the story of quantity over time. No lists, no progress bars, just the count that matters to you.',
                        build: 'Name what you\'re counting. That\'s basically it. "Workout Streak", "Inventory Count", "Days Until Launch", "Items Sold" - whatever needs tracking. You can add a note in the dropdown if you want context, but the star of the show is that number. Set it to whatever starting value makes sense, or leave it at zero and build from there.',
                        view: 'That number dominates the screen. It should - it\'s what you came here for. Tap the + button and it goes up. Tap the - button and it goes down. Need to jump to a specific number? Tap the center and a numpad appears. Type it in directly. The dropdown gives you quick jumps: +10, +100, -10, -100 for when you need to move fast. But mostly, you\'re tapping that + button, watching the number grow, feeling the momentum of accumulation. That\'s what this card is about - making the number real, visible, and ever-present.',
                        useCases: 'Habit streaks, inventory quantities, savings progress, distance covered, repetitions completed, items collected, units produced, points scored, calories tracked, expenses logged.'
                    },
                    history: {
                        purpose: 'History cards are your timeline. Every time something happens, you record it. Not what happened - just when. The card becomes a chronological log of events, each entry timestamped and permanent. You\'re building a record that you can look back on to see patterns, frequency, and gaps.',
                        build: 'Name the event you\'re tracking. "Workout Sessions", "Medication Doses", "Symptom Occurrences", "Customer Visits" - whatever needs a timeline. Then add entries. Each entry is a full timestamp: year, month, day, hour, minute, second. You can edit any part if you need to backdate an entry or correct a mistake. The beauty is in the accumulation - every entry is another data point in your personal history.',
                        view: 'One button: +. That\'s how you add entries. Tap it and boom - current date and time, captured forever. The list shows newest first because recent events matter most. But scroll down and you\'ll see everything, each entry showing both relative time ("2 hours ago", "3 days ago") and exact timestamp ("Dec 24, 2024 - 2:30 PM"). You\'re creating a log of when things happened. Later, you can look back and see patterns. Did you work out three times this week or five? When did that symptom last occur? The History card remembers so you don\'t have to.',
                        useCases: 'Workout logging, medication tracking, symptom diaries, customer interactions, maintenance records, event attendance, milestone documentation, incident reports, habit timestamps, activity logs.'
                    }
                }
            },
            progress: {
                label: 'PROGRESS',
                color: 'var(--color-3)',
                variations: [],
                info: {
                    progress: {
                        purpose: 'Progress cards answer the question "How far along am I?" with a bar that fills from left to right. You set a goal, you track your current position, and that bar shows you the journey. It\'s visual, it\'s immediate, and it turns abstract goals into concrete progress you can see.',
                        build: 'Name your goal. "Book Pages", "Savings Target", "Project Completion" - be specific. Then set two numbers: where you are now, and where you\'re going. 150 pages read out of 400. $3,000 saved toward $10,000. The system does the math instantly, calculating your percentage and showing you that progress bar. Change either number anytime - this isn\'t locked in. Goals shift, progress updates, the card adapts.',
                        view: 'That bar is your North Star. Empty at the start, it fills as you progress. 15% filled, 37% filled, 82% filled. The numbers are there too - "150/400" tells the exact story - but that bar? That\'s what your eyes go to. Tap + to increment your progress. Tap - if you need to adjust back. Tap the center to enter a specific value via numpad. Every change makes that bar move, and watching it grow toward 100% is addictive. When it fills completely, you\'ve hit your goal. The visual feedback makes success undeniable.',
                        useCases: 'Reading goals, savings targets, weight loss, skill development, project completion, learning progress, fundraising, course completion, production quotas, renovation phases.'
                    }
                }
            },
            tier: {
                label: 'TIER',
                color: 'var(--color-4)',
                variations: [],
                info: {
                    tier: {
                        purpose: 'Tier cards are for leveling up. You\'re not just tracking progress - you\'re climbing ranks. Bronze to Silver to Gold. Beginner to Intermediate to Expert. Each tier has a threshold, and when you cross it, you ascend. It\'s gamification built into a card, turning linear progress into achievement milestones that feel like victories.',
                        build: 'Name your ranking system. "Skill Level", "Membership Tier", "Game Rank" - whatever fits your progression model. Then build your ladder. Start at the bottom: "Bronze - 0 points", "Silver - 100 points", "Gold - 250 points", "Platinum - 500 points". Each tier has a name and a threshold. Order them lowest to highest because that\'s how you\'ll climb. The system will auto-highlight where you currently are based on your total points. Add, remove, or edit tiers as your system evolves.',
                        view: 'Your tiers stack vertically, showing the full ladder of achievement. One tier is highlighted - that\'s where you are right now. Below it are the tiers you\'ve conquered. Above it are the tiers you\'re climbing toward. Tap + to earn points. Tap - to lose them. The center shows your total. Cross a threshold and watch the highlight shift up to your new tier. Those dots next to each tier? Visual progress markers. It\'s not just about the points - it\'s about seeing yourself rise through the ranks, tier by tier, toward the top.',
                        useCases: 'Skill rankings, loyalty programs, achievement levels, game ranks, belt systems, performance ratings, membership tiers, certification levels, mastery stages, advancement paths.'
                    }
                }
            },
            divider: {
                label: 'DIVIDER',
                color: 'var(--color-10)',
                variations: [
                    { type: 'divider', label: 'DIVIDER', color: 'var(--color-10)' },
                    { type: 'text', label: 'TEXT', color: 'var(--color-2)' },
                    { type: 'scale', label: 'SCALE', color: 'var(--color-6-3)' }
                ],
                info: {
                    divider: {
                        purpose: 'Dividers create breathing room. Your dashboard is filling up with cards, and they\'re starting to blur together. Drop in a Divider and suddenly you have sections. "Morning Routine" cards live here, "Work Tasks" live there, "Evening Wind-Down" is at the bottom. The Divider isn\'t functional - it doesn\'t track or count or calculate. It just separates, organizes, and clarifies.',
                        build: 'Type a section name. That\'s it. "WORK", "PERSONAL", "FITNESS", "WEEKLY GOALS" - whatever labels your sections. The Divider appears as a thin line with your text centered on top. Move it up or down to position it between the card groups it\'s meant to separate. Delete it if you change your organizational structure. It\'s simple because it doesn\'t need to be complex - it just needs to create visual space.',
                        view: 'The Divider sits there, quietly doing its job. A thin line, a clear label, unmistakable separation between what came before and what comes after. You don\'t interact with it. You don\'t click it. You just see it, and instantly understand that you\'ve moved from one section of your dashboard to another. It\'s the visual equivalent of a chapter break.',
                        useCases: 'Section headers, category separation, workflow phases, time-of-day grouping, project stages, priority levels, area organization, routine segments, context switching markers.'
                    },
                    text: {
                        purpose: 'Text cards hold information. Not tasks, not counts, not progress - just text. Instructions you need to reference. Notes you want to keep visible. Procedures you follow repeatedly. The Text card keeps it all accessible without cluttering your view, because it collapses when you\'re not reading it.',
                        build: 'Give it a title that hints at the content inside. "Recipe: Chocolate Cake", "Workout Instructions", "Meeting Notes from Dec 15", "Emergency Contacts". Then fill the text area with whatever needs to be stored. No length limit. Write paragraphs, lists, instructions, notes, whatever. It all saves automatically. When you collapse the dropdown, all that text hides away but stays ready for when you need it.',
                        view: 'The Text card shows its title, collapsed and minimal. Need to read it? Click anywhere on the card and it expands, revealing all your text. Read it, reference it, absorb it. Click again and it collapses back to just the title. The text stays there, persistent and unchanging, ready to be referenced whenever you need it. It\'s your personal reference library, built right into your dashboard.',
                        useCases: 'Reference notes, instructions, meeting notes, recipes, procedures, contact information, reminders, documentation, templates, quick-reference guides, scripts, important information.'
                    },
                    scale: {
                        purpose: 'Scale cards solve the recipe multiplication problem. You have ingredient quantities for 4 servings but you need 6. Or 12. Or 2. Instead of grabbing a calculator and doing math for each ingredient, the Scale card does it instantly. List your base quantities once, adjust the multiplier, and watch every measurement scale proportionally. It\'s the difference between fumbling with fractions and confidently cooking.',
                        build: 'Start by adding your base recipe or formula. Each line has two parts: the quantity and what it measures. "2 cups flour", "1.5 tsp salt", "3 eggs", "250g butter". Add as many ingredients as you need. The optional description field at top is perfect for the recipe name or scaling notes. You\'re building the master template here - the 1x version that everything else scales from. Get these numbers right because they\'re your foundation.',
                        view: 'Here\'s where the magic happens. Your ingredients are listed with their base quantities visible. At the top, there\'s a multiplier control. Set it to 1x and you see your original recipe. Bump it to 2x and every quantity doubles instantly. Try 0.5x and everything halves. The math happens automatically, behind the scenes. "2 cups" becomes "4 cups" or "1 cup" depending on your multiplier. You\'re not calculating - you\'re just reading the scaled amounts and cooking. Change the multiplier anytime and the entire recipe recalculates. It\'s like having a recipe that adapts to however many people you\'re feeding.',
                        useCases: 'Recipe scaling, chemical formulas, paint mixing ratios, cleaning solution recipes, batch sizing, ingredient proportions, medication dosing by weight, nutrient calculations, crafting materials, ratio-based conversions.'
                    }
                }
            },
            nest: {
                label: 'NEST',
                color: 'var(--color-5)',
                variations: [
                    { type: 'nest', label: 'NEST', color: 'var(--color-5)' },
                    { type: 'cycle', label: 'CYCLE', color: 'var(--color-5-2)' },
                    { type: 'import', label: 'IMPORT', color: 'var(--color-5-3)' }
                ],
                info: {
                    nest: {
                        purpose: 'Nests are dashboards within dashboards. You\'ve outgrown a single flat workspace, and now you need hierarchy. Structure. Folders. The Nest gives you that - click it and you enter a completely separate workspace with its own cards, its own tabs, its own organization. You can nest Nests within Nests, creating complex structures as deep as you need. Each level stays isolated and focused.',
                        build: 'Name your Nest. "Client Projects", "Home Renovation", "Learning Goals" - think of it like naming a folder. Then click the enter arrow or hit enter on your keyboard. You\'re inside now. This is a fresh workspace. Build it like you built your main dashboard: add cards, create tabs, organize however makes sense for this specific context. When you\'re done, hit the back arrow. You\'re out of the Nest and back in the parent workspace. The Nest card sits there quietly, containing all that complexity you just built.',
                        view: 'The Nest card shows a folder icon and an enter arrow. That arrow is your portal. Click the card and you dive in. Inside, you see the workspace you built - all your cards, all your tabs, everything organized for this specific area of your life or work. Navigate with the back button to return to the parent level. Use the home button to jump straight back to your root dashboard. Each Nest maintains its own state, its own scroll position, its own organization. They\'re separate worlds, connected by simple navigation.',
                        useCases: 'Project sub-tasks, client workspaces, category organization, multi-phase projects, department dashboards, complex workflows, hierarchical planning, area-specific tracking, nested projects.'
                    },
                    cycle: {
                        purpose: 'Cycles are Nests that reset themselves. Every day, every week, every month - whatever schedule you set - the Cycle wipes everything clean and starts fresh. It\'s perfect for recurring workflows where you do the same set of tasks repeatedly. Your daily routine. Your weekly review. Your monthly goals. Build the structure once, then let it auto-reset on schedule while you execute the current cycle.',
                        build: 'Name your Cycle and set its reset schedule. Daily at 6am? Weekly on Monday? Monthly on the 1st? Choose your frequency and timing. Then click enter and build your recurring workspace. Add all the cards you need for one cycle - morning checklist, daily goals, habits to track. When you exit back to the main view, that schedule is locked in. At the designated time, everything inside resets: Lists empty, counts go to zero, History clears. Fresh slate for the next cycle.',
                        view: 'The Cycle card shows a countdown: "Resets in: 3h 42m" or "Resets in: 2d 5h". Click to enter and you\'ll see a countdown card at the top of the workspace, reminding you how much time remains in this cycle. Use the workspace normally - check off tasks, track progress, log data. When the reset time hits, everything clears automatically. No manual cleanup, no carrying over yesterday\'s incomplete tasks. Every cycle starts clean, letting you focus on now instead of drowning in the past.',
                        useCases: 'Daily routines, weekly goals, monthly reviews, recurring templates, habit cycles, sprint planning, workout programs, periodic resets, routine checklists, cyclical workflows.'
                    },
                    import: {
                        purpose: 'Import cards exist only in Build Mode, and only for one purpose: bringing in pre-built Nest structures from elsewhere. Someone shared a template with you? Import it. You exported a Nest for backup? Import it back. The Import card is temporary scaffolding that transforms into a real Nest once it successfully loads the data.',
                        build: 'Click the Import card to open the import window. You\'ll see a large text area and instructions. Paste your exported data - doesn\'t matter if it\'s GT50 format, JSON, compressed, or encrypted. The system auto-detects and processes it. Click Import. If the data is valid, the Import card transforms into a real Nest containing all the imported structure. If something\'s wrong, you get an error message with details. Fix it and try again. Once import succeeds, the Import card disappears - it\'s done its job.',
                        view: 'Import cards don\'t exist in View Mode. Switch to View and they vanish. Why? Because they\'re not real cards - they\'re temporary tools for bringing data in. Once import succeeds, what you have is a regular Nest card, fully functional and ready to use. You navigate into it, interact with its contents, and forget it was ever an import. The Import card is just the doorway, not the destination.',
                        useCases: 'Template importing, structure duplication, backup restoration, shared workflows, data migration, template libraries, configuration transfer, workspace cloning.'
                    }
                }
            }
        },
        
        defaultState: function() {
            return {
                selectedCard: 'list',
                selectedVariation: 'list',
                activeTab: 'purpose',
                isOpen: false,
                header: {
                    isMain: false,
                    title: 'CARD INFO'
                }
            };
        },
        
        open: function(state, cardType, onChange) {
            state.isOpen = true;
            state.selectedCard = cardType || 'list';
            state.selectedVariation = cardType || 'list';
            state.activeTab = 'purpose';
            state.header.title = 'CARD INFO';
            onChange();
        },
        
        close: function(state, onChange) {
            state.isOpen = false;
            onChange();
        },
        
        renderSettingsCard: function(container, state, onChange) {
            const card = document.createElement('div');
            card.style.cssText = `
                margin: var(--margin);
                background: var(--bg-2);
                border: var(--border-width) solid var(--border-color);
                border-radius: 8px;
                height: var(--card-height);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: filter 0.2s;
            `;
            card.innerHTML = `
                <div style="
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--color-10);
                    text-align: center;
                ">CARD INFO</div>
            `;
            
            card.onmouseover = () => card.style.filter = 'brightness(1.2)';
            card.onmouseout = () => card.style.filter = 'brightness(1)';
            card.onclick = () => this.open(state, 'list', onChange);
            
            container.appendChild(card);
        },
        
        render: function(container, state, onChangeOrClose, onClose) {
            const actualOnChange = onClose ? onChangeOrClose : null;
            const actualOnClose = onClose || onChangeOrClose;
            
            const internalRender = () => {
                this.renderContent(container, state, internalRender, actualOnClose);
            };
            
            internalRender();
        },
        
        renderContent: function(container, state, onChange, onClose) {
            if (!state.isOpen) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-1);
                z-index: 2000;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            `;
            
            const data = this.cardData[state.selectedCard];
            const variation = data.variations.find(v => v.type === state.selectedVariation);
            const info = data.info[state.selectedVariation];
            
            container.innerHTML = `
                <div id="cardinfo-header" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                <div id="cardinfo-content" style="
                    padding-top: calc(var(--card-height) + var(--margin));
                    padding-bottom: var(--margin);
                "></div>
            `;
            
            const headerContainer = container.querySelector('#cardinfo-header');
            GT50Lib.Header.renderBuild(
                headerContainer,
                state.header,
                onChange,
                onClose,
                onClose,
                null,
                null
            );
            
            const contentContainer = container.querySelector('#cardinfo-content');
            contentContainer.innerHTML = `
                <div style="
                    margin: var(--margin);
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    overflow: hidden;
                ">
                    ${Object.keys(this.cardData).map((key, index, array) => {
                        const card = this.cardData[key];
                        const isSelected = key === state.selectedCard;
                        const isLast = index === array.length - 1;
                        const textColor = key === 'divider' ? 'var(--color-10)' : card.color;
                        
                        return `
                            <div data-card="${key}" style="
                                flex: 1;
                                background: ${isSelected ? card.color : 'var(--bg-3)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: filter 0.2s;
                                border-right: ${isLast ? 'none' : 'var(--border-width) solid var(--border-color)'};
                            ">
                                <div style="
                                    font-size: 12px;
                                    font-weight: 700;
                                    color: ${isSelected ? 'var(--color-10)' : textColor};
                                ">${card.label}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${data.variations.length > 1 ? `
                    <div style="
                        margin: var(--margin);
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        height: var(--card-height);
                        display: flex;
                        overflow: hidden;
                    ">
                        ${data.variations.map((v, index, array) => {
                            const isSelected = v.type === state.selectedVariation;
                            const isLast = index === array.length - 1;
                            
                            return `
                                <div data-variation="${v.type}" style="
                                    flex: 1;
                                    background: ${isSelected ? v.color : 'var(--bg-3)'};
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    transition: filter 0.2s;
                                    border-right: ${isLast ? 'none' : 'var(--border-width) solid var(--border-color)'};
                                ">
                                    <div style="
                                        font-size: 11px;
                                        font-weight: 700;
                                        color: ${isSelected ? 'var(--color-10)' : v.color};
                                    ">${v.label}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
                
                <div style="
                    margin: var(--margin);
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: var(--card-height);
                    display: flex;
                    overflow: hidden;
                ">
                    ${['purpose', 'build', 'view', 'useCases'].map((tab, index, array) => {
                        const isSelected = state.activeTab === tab;
                        const isLast = index === array.length - 1;
                        const labels = {
                            purpose: 'PURPOSE',
                            build: 'BUILD',
                            view: 'VIEW',
                            useCases: 'USE CASES'
                        };
                        
                        return `
                            <div data-tab="${tab}" style="
                                flex: 1;
                                background: ${isSelected ? 'var(--accent)' : 'var(--bg-3)'};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: filter 0.2s;
                                border-right: ${isLast ? 'none' : 'var(--border-width) solid var(--border-color)'};
                            ">
                                <div style="
                                    font-size: 11px;
                                    font-weight: 700;
                                    color: var(--color-10);
                                ">${labels[tab]}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div id="tab-content-area"></div>
            `;
            
            // Add click handlers for card selection
            Object.keys(this.cardData).forEach(key => {
                const cardBtn = contentContainer.querySelector(`[data-card="${key}"]`);
                if (cardBtn) {
                    cardBtn.onmouseover = () => cardBtn.style.filter = 'brightness(1.2)';
                    cardBtn.onmouseout = () => cardBtn.style.filter = 'brightness(1)';
                    cardBtn.onclick = () => {
                        state.selectedCard = key;
                        state.selectedVariation = this.cardData[key].variations[0].type;
                        onChange();
                    };
                }
            });
            
            // Add click handlers for variation selection
            if (data.variations.length > 1) {
                data.variations.forEach(v => {
                    const varBtn = contentContainer.querySelector(`[data-variation="${v.type}"]`);
                    if (varBtn) {
                        varBtn.onmouseover = () => varBtn.style.filter = 'brightness(1.2)';
                        varBtn.onmouseout = () => varBtn.style.filter = 'brightness(1)';
                        varBtn.onclick = () => {
                            state.selectedVariation = v.type;
                            onChange();
                        };
                    }
                });
            }
            
            // Add click handlers for tab selection
            ['purpose', 'build', 'view', 'useCases'].forEach(tab => {
                const tabBtn = contentContainer.querySelector(`[data-tab="${tab}"]`);
                if (tabBtn) {
                    tabBtn.onmouseover = () => tabBtn.style.filter = 'brightness(1.2)';
                    tabBtn.onmouseout = () => tabBtn.style.filter = 'brightness(1)';
                    tabBtn.onclick = () => {
                        state.activeTab = tab;
                        onChange();
                    };
                }
            });
            
            // Render tab content
            this.renderTabContent(state);
        },
        
        renderTabContent: function(state) {
            const tabContentArea = document.getElementById('tab-content-area');
            if (!tabContentArea) return;
            
            const data = this.cardData[state.selectedCard];
            const info = data.info[state.selectedVariation];
            
            if (state.activeTab === 'purpose' || state.activeTab === 'build' || state.activeTab === 'view' || state.activeTab === 'useCases') {
                const content = info[state.activeTab];
                tabContentArea.innerHTML = `
                    <div style="
                        margin: var(--margin);
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: var(--margin);
                        font-size: 13px;
                        line-height: 1.6;
                        color: var(--color-10);
                    ">${content}</div>
                `;
            }
        },
        
        renderDemoCard: function(state, mode) {
            const containerId = mode === 'build' ? 'build-demo' : 'view-demo';
            const demoContainer = document.getElementById(containerId);
            if (!demoContainer) return;
            
            const type = state.selectedVariation;
            let componentLib = null;
            let demoState = null;
            
            switch(type) {
                case 'list':
                    componentLib = window.GT50Lib.List;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example List';
                    demoState.items = [
                        { text: 'Item 1', completed: false },
                        { text: 'Item 2', completed: true },
                        { text: 'Item 3', completed: false }
                    ];
                    break;
                case 'checklist':
                    componentLib = window.GT50Lib.Checklist;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Checklist';
                    demoState.items = [
                        { text: 'Task 1', completed: true },
                        { text: 'Task 2', completed: true },
                        { text: 'Task 3', completed: false }
                    ];
                    break;
                case 'radio':
                    componentLib = window.GT50Lib.Radio;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Priority';
                    demoState.options = [
                        { text: 'Low', selected: false },
                        { text: 'Medium', selected: true },
                        { text: 'High', selected: false }
                    ];
                    break;
                case 'threshold':
                    componentLib = window.GT50Lib.Threshold;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Thresholds';
                    demoState.items = [
                        { text: 'Water (8 cups)', threshold: 8, count: 5 },
                        { text: 'Exercise (30 min)', threshold: 30, count: 30 }
                    ];
                    break;
                case 'accumulation':
                    componentLib = window.GT50Lib.Accumulation;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Counter';
                    demoState.value = 42;
                    break;
                case 'history':
                    componentLib = window.GT50Lib.History;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example History';
                    demoState.entries = [
                        { timestamp: Date.now() - 3600000 },
                        { timestamp: Date.now() }
                    ];
                    break;
                case 'progress':
                    componentLib = window.GT50Lib.Progress;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Progress';
                    demoState.current = 7;
                    demoState.total = 10;
                    break;
                case 'tier':
                    componentLib = window.GT50Lib.Tier;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Tier';
                    demoState.tiers = [
                        { name: 'Bronze', amount: '0' },
                        { name: 'Silver', amount: '100' },
                        { name: 'Gold', amount: '250' }
                    ];
                    demoState.current = 150;
                    demoState.total = 350;
                    break;
                case 'divider':
                    componentLib = window.GT50Lib.Divider;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Divider';
                    break;
                case 'text':
                    componentLib = window.GT50Lib.Text;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Text';
                    demoState.text = 'This is example text content that can be expanded and collapsed.';
                    break;
                case 'scale':
                    componentLib = window.GT50Lib.Scale;
                    demoState = componentLib.defaultState();
                    demoState.dropdownText = 'Example Recipe';
                    demoState.items = [
                        { number: 2, unit: 'cups', title: 'flour' },
                        { number: 1, unit: 'tsp', title: 'salt' },
                        { number: 3, unit: '', title: 'eggs' }
                    ];
                    demoState.multiplier = 1;
                    break;
                case 'nest':
                    componentLib = window.GT50Lib.Nest;
                    demoState = componentLib.defaultState();
                    demoState.name = 'Example Nest';
                    break;
                case 'cycle':
                    componentLib = window.GT50Lib.Cycle;
                    demoState = componentLib.defaultState();
                    demoState.name = 'Daily Routine';
                    break;
                case 'import':
                    componentLib = window.GT50Lib.Import;
                    demoState = componentLib.defaultState();
                    demoState.name = 'Import Nest';
                    break;
            }
            
            if (!componentLib || !demoState) return;
            
            const onChange = () => {};
            
            if (mode === 'build') {
                if (type === 'nest' || type === 'cycle' || type === 'import') {
                    componentLib.renderBuild(demoContainer, demoState, 0, null, onChange, null, null, false);
                } else if (type === 'divider' || type === 'text' || type === 'scale') {
                    componentLib.renderBuild(demoContainer, demoState, onChange, null, null, false);
                } else {
                    componentLib.renderBuild(demoContainer, demoState, onChange, null, null, false);
                }
            } else {
                if (type === 'nest' || type === 'cycle') {
                    componentLib.renderView(demoContainer, demoState, 0, null);
                } else if (type === 'import') {
                    demoContainer.innerHTML = `
                        <div style="
                            margin: var(--margin);
                            background: var(--bg-2);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: var(--card-height);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--color-9);
                            font-size: 14px;
                            font-weight: 600;
                        ">Import components are not visible in view mode</div>
                    `;
                } else {
                    componentLib.renderView(demoContainer, demoState, onChange);
                }
            }
        }
    };
})();