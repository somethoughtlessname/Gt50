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
                        useCases: `• <strong>Weekly goals</strong> - Track your objectives and priorities for the week ahead<br><br>
• <strong>Household chores</strong> - Keep on top of cleaning, maintenance, and home tasks<br><br>
• <strong>Side project milestones</strong> - Break down personal projects into manageable steps<br><br>
• <strong>Learning objectives</strong> - Track skills you're developing and knowledge you're acquiring<br><br>
• <strong>Birthday party planning</strong> - Organize all the details for an upcoming event<br><br>
• <strong>Home organization</strong> - Declutter and organize different areas of your space<br><br>
• <strong>Garden tasks</strong> - Seasonal planting, maintenance, and harvest activities<br><br>
• <strong>Creative writing prompts</strong> - Ideas and exercises to spark your creativity<br><br>
• <strong>Business development</strong> - Track outreach, partnerships, and growth initiatives<br><br>
• <strong>Personal improvement</strong> - Habits and behaviors you want to develop<br><br>
• <strong>Skill practice</strong> - Drills and exercises for mastering new abilities<br><br>
• <strong>Community service</strong> - Volunteer work and ways to give back`
                    },
                    checklist: {
                        purpose: 'Checklists take everything you love about Lists and add one crucial element: visible progress. That horizontal bar filling up as you complete tasks? That\'s pure motivation fuel. You\'re not just checking boxes anymore - you\'re watching a visual representation of your momentum. It transforms task completion from a mundane activity into something that feels like achievement.',
                        build: 'Building a Checklist feels just like building a List, because it basically is one - with a superpower. Name it something meaningful. Add your tasks one by one, reordering as needed. The magic happens automatically: that progress bar at the top calculates your completion percentage in real-time. You don\'t configure it, you don\'t set it up - it just knows. Add 10 items and complete 3, the bar fills 30%. It\'s mathematical honesty about where you stand.',
                        view: 'Watch the bar. Seriously, just watch it. Start with an empty Checklist and that bar is a thin line, barely visible. Check off your first item and it springs to life, filling a little. Check another. And another. The bar grows, the percentage climbs, and suddenly you\'re racing toward 100%. Each click on an item doesn\'t just mark it done - it feeds that progress bar, making your achievement visible and undeniable. When you hit 100%, the satisfaction is real because you\'ve watched it build.',
                        useCases: `• <strong>Project phases</strong> - Break complex projects into sequential stages with clear completion<br><br>
• <strong>Learning curriculums</strong> - Progress through courses, tutorials, or educational materials<br><br>
• <strong>Certification requirements</strong> - Track all the steps needed to earn professional credentials<br><br>
• <strong>Fitness program milestones</strong> - Complete workout phases or training cycles<br><br>
• <strong>Book chapter completion</strong> - Track reading progress through lengthy books<br><br>
• <strong>Course modules</strong> - Complete online courses or training programs section by section<br><br>
• <strong>Renovation stages</strong> - Major home improvement projects with multiple phases<br><br>
• <strong>Onboarding steps</strong> - New job or role training requirements and tasks<br><br>
• <strong>Training progression</strong> - Build skills through structured learning paths<br><br>
• <strong>Skill development paths</strong> - Master complex abilities through progressive exercises`
                    },
                    radio: {
                        purpose: 'Radio cards solve the "one and only one" problem. You\'re not tracking multiple possibilities here - you\'re making a choice. Pick your current focus. Select today\'s priority. Choose which plan you\'re following. It\'s decision-making captured in a card, with your selection always visible and easy to change when circumstances shift.',
                        build: 'Name your Radio card based on what you\'re choosing between. "Today\'s Focus", "Active Project", "Current Phase" - whatever fits. Then add your options. "Deep Work" or "Admin Tasks". "Project A", "Project B", "Project C". Each option is a button waiting to be selected. Order matters here because you\'ll see these in View Mode, so put the most common choices first. You can add as many options as you need, but remember - this is for choosing ONE thing, not many. Keep it focused.',
                        view: 'Your Radio card shows all your options as buttons. One of them is highlighted - that\'s your current selection. Changed your mind? Tap a different button. The highlight moves, and now that\'s your active choice. Need to see what you selected earlier? Open the dropdown and there\'s your history - every selection you\'ve made with timestamps. It\'s like breadcrumbs showing how your priorities evolved. The current choice is always front and center, impossible to miss.',
                        useCases: `• <strong>Current project focus</strong> - Track which project has your attention right now<br><br>
• <strong>Today's workout type</strong> - Select from different exercise routines for each session<br><br>
• <strong>Active learning subject</strong> - Switch between different topics you're studying<br><br>
• <strong>Meal plan selection</strong> - Choose between different eating approaches or diets<br><br>
• <strong>Work context switching</strong> - Track whether you're doing deep work, meetings, or admin<br><br>
• <strong>Priority project tracking</strong> - Highlight which major initiative gets your energy today<br><br>
• <strong>Phase indicators</strong> - Show which stage of a multi-phase process you're currently in<br><br>
• <strong>Current sprint</strong> - Track which iteration or cycle you're actively working on<br><br>
• <strong>Active client</strong> - Freelancers can mark which client project is the current priority<br><br>
• <strong>Mode selection</strong> - Switch between different working modes or approaches`
                    },
                    threshold: {
                        purpose: 'Threshold cards are for when quantity matters. Not just "did I do it?" but "did I do it enough times?" Eight glasses of water. Three sets of ten reps. Five sales calls. These are goals with specific numbers attached, and Threshold cards track each one individually until you hit that magic number.',
                        build: 'Start by naming what you\'re tracking. Then create your items - but these aren\'t simple tasks. Each one has two numbers: where you are now, and where you need to be. "Water Glass: 0/8", "Push-ups: 0/50", "Pages Read: 0/30". Set those thresholds based on your actual goals. You\'re creating a series of mini-goals that all live together in one card. Reorder them by priority. Delete the ones that don\'t matter anymore. This is your quantified target list.',
                        view: 'Each item shows you exactly where you stand: "5/8", "12/50", "23/30". Tap an item and the counter goes up by one. Tap again, it goes up again. You\'re manually logging each occurrence, each glass of water, each rep, each page. When you hit the threshold, a checkmark appears. But here\'s the thing - you can keep going. The counter doesn\'t stop at the threshold. Hit your goal of 8 glasses? The ninth still counts. The tenth still counts. Because sometimes "enough" isn\'t the end, it\'s just the beginning.',
                        useCases: `• <strong>Daily water tracking</strong> - Hit your hydration goal by logging each glass consumed<br><br>
• <strong>Exercise rep counting</strong> - Track sets and reps for strength training workouts<br><br>
• <strong>Medication doses</strong> - Ensure you're taking the correct number of doses per day<br><br>
• <strong>Reading targets</strong> - Log pages or chapters read toward daily reading goals<br><br>
• <strong>Practice sessions</strong> - Count repetitions for skill practice like music or languages<br><br>
• <strong>Sales quotas</strong> - Track calls made, emails sent, or meetings booked against targets<br><br>
• <strong>Call volumes</strong> - Customer service or outreach call tracking<br><br>
• <strong>Servings per day</strong> - Nutritional goals like fruits, vegetables, or protein servings<br><br>
• <strong>Study hours</strong> - Track focused study time against daily or weekly targets<br><br>
• <strong>Habit repetitions</strong> - Build habits by tracking daily occurrences<br><br>
• <strong>Task iterations</strong> - Count how many times you've completed recurring tasks`
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
                        purpose: 'Accumulation cards are pure, unfiltered counting. Not "did I do it?" but "how many times have I done it?" Every tap of the + button increments your total. No goals, no thresholds, no completion - just accumulation. It\'s perfect for tracking things that don\'t have an endpoint: total workouts, total books read, total sales made, total days sober.',
                        build: 'Give it a name that describes what you\'re counting. "Total Workouts", "Books Read This Year", "Coffee Cups". That\'s it. The counter starts at zero and waits for you to start adding to it. There\'s no configuration, no setup, no complexity. It\'s a number that goes up when you tell it to. Simple, honest, effective.',
                        view: 'Two buttons. + and -. That\'s your interface. Every time you complete whatever you\'re tracking, tap +. The number climbs. Made a mistake? Tap -. The number drops. The center shows your current count, always visible, always accurate. There\'s something satisfying about watching a number grow over time, especially when it represents consistent effort. This is your personal scoreboard for anything quantifiable in your life.',
                        useCases: `• <strong>Lifetime counters</strong> - Track total achievements over your entire journey<br><br>
• <strong>Running totals</strong> - Cumulative counts that never reset, showing long-term progress<br><br>
• <strong>Aggregate tracking</strong> - Total activities across all time periods<br><br>
• <strong>Continuous metrics</strong> - Numbers that only go up, like total miles run or books read<br><br>
• <strong>Cumulative achievements</strong> - Career or life milestones that accumulate over time<br><br>
• <strong>Streak counting</strong> - Days in a row maintaining a habit or behavior<br><br>
• <strong>Total repetitions</strong> - All-time workout counts or practice sessions<br><br>
• <strong>Career statistics</strong> - Professional accomplishments tracked over your career<br><br>
• <strong>Long-term accumulation</strong> - Wealth building, skill hours, or other patient growth<br><br>
• <strong>Frequency tracking</strong> - How often something happens without a specific goal`
                    },
                    history: {
                        purpose: 'History cards are your timeline. Every time something happens, you record it. Not what happened - just when. The card becomes a chronological log of events, each entry timestamped and permanent. You\'re building a record that you can look back on to see patterns, frequency, and gaps.',
                        build: 'Name the event you\'re tracking. "Workout Sessions", "Medication Doses", "Symptom Occurrences", "Customer Visits" - whatever needs a timeline. Then add entries. Each entry is a full timestamp: year, month, day, hour, minute, second. You can edit any part if you need to backdate an entry or correct a mistake. The beauty is in the accumulation - every entry is another data point in your personal history.',
                        view: 'One button: +. That\'s how you add entries. Tap it and boom - current date and time, captured forever. The list shows newest first because recent events matter most. But scroll down and you\'ll see everything, each entry showing both relative time ("2 hours ago", "3 days ago") and exact timestamp ("Dec 24, 2024 - 2:30 PM"). You\'re creating a log of when things happened. Later, you can look back and see patterns. Did you work out three times this week or five? When did that symptom last occur? The History card remembers so you don\'t have to.',
                        useCases: `• <strong>Workout logging</strong> - Record when you exercise to track patterns and consistency<br><br>
• <strong>Medication tracking</strong> - Log each dose to ensure proper medication adherence<br><br>
• <strong>Symptom diaries</strong> - Track when health symptoms occur for medical discussions<br><br>
• <strong>Customer interactions</strong> - Record touchpoints and communications with clients<br><br>
• <strong>Maintenance records</strong> - Log when equipment or vehicles receive service<br><br>
• <strong>Event attendance</strong> - Track which meetings, classes, or gatherings you've attended<br><br>
• <strong>Milestone documentation</strong> - Record important life or project moments with timestamps<br><br>
• <strong>Incident reports</strong> - Log when problems or issues occur for pattern analysis<br><br>
• <strong>Habit timestamps</strong> - Track exactly when you complete daily habits<br><br>
• <strong>Activity logs</strong> - Create detailed timelines of any recurring or important activity`
                    }
                }
            },
            progress: {
                label: 'PROGRESS',
                color: 'var(--color-3)',
                variations: [
                    { type: 'progress', label: 'PROGRESS', color: 'var(--color-3)' }
                ],
                info: {
                    progress: {
                        purpose: 'Progress cards answer the question "How far along am I?" with a bar that fills from left to right. You set a goal, you track your current position, and that bar shows you the journey. It\'s visual, it\'s immediate, and it turns abstract goals into concrete progress you can see.',
                        build: 'Name your goal. "Book Pages", "Savings Target", "Project Completion" - be specific. Then set two numbers: where you are now, and where you\'re going. 150 pages read out of 400. $3,000 saved toward $10,000. The system does the math instantly, calculating your percentage and showing you that progress bar. Change either number anytime - this isn\'t locked in. Goals shift, progress updates, the card adapts.',
                        view: 'That bar is your North Star. Empty at the start, it fills as you progress. 15% filled, 37% filled, 82% filled. The numbers are there too - "150/400" tells the exact story - but that bar? That\'s what your eyes go to. Tap + to increment your progress. Tap - if you need to go backward. The bar moves in real-time. When it fills completely, it turns gold - visual confirmation that you\'ve arrived. But you can keep going beyond 100% if your goal was just a milestone, not a ceiling.',
                        useCases: `• <strong>Reading goals</strong> - Track pages or chapters completed toward finishing a book<br><br>
• <strong>Savings targets</strong> - Watch your money grow toward a specific financial goal<br><br>
• <strong>Project milestones</strong> - Monitor completion percentage of major initiatives<br><br>
• <strong>Weight loss tracking</strong> - See visual progress toward your target weight<br><br>
• <strong>Distance goals</strong> - Running, cycling, or walking mileage accumulation<br><br>
• <strong>Skill mastery</strong> - Practice hours logged toward expertise (10,000 hour rule)<br><br>
• <strong>Course completion</strong> - Progress through online courses or training programs<br><br>
• <strong>Renovation progress</strong> - Track completion of home improvement projects<br><br>
• <strong>Collection building</strong> - How close you are to completing a set or collection<br><br>
• <strong>Achievement hunting</strong> - Game or life achievements completed vs. total available`
                    }
                }
            },
            tier: {
                label: 'TIER',
                color: 'var(--color-4)',
                variations: [
                    { type: 'tier', label: 'TIER', color: 'var(--color-4)' }
                ],
                info: {
                    tier: {
                        purpose: 'Tier cards are about climbing. You start at the bottom and work your way up through levels, each one requiring more effort than the last. Bronze to Silver to Gold. Beginner to Intermediate to Expert. Level 1 to Level 2 to Level 3. It\'s progress with thresholds, where each tier represents a meaningful achievement.',
                        build: 'Name your tier system. "Fitness Level", "Customer Status", "Skill Rank" - whatever hierarchy you\'re tracking. Then define your tiers from bottom to top. Each tier needs a name and a point value: "Bronze: 0", "Silver: 100", "Gold: 250". The points are cumulative - to reach Gold, you need 350 total points (0 + 100 + 250). You\'re building a ladder where each rung gets progressively harder to reach.',
                        view: 'The card shows your current tier highlighted, with the tier name and your progress toward the next level. Below is your current tier - that\'s where you are right now. Above it are the tiers you\'re climbing toward. Tap + to earn points. Tap - to lose them. The center shows your total. Cross a threshold and watch the highlight shift up to your new tier. Those dots next to each tier? Visual progress markers. It\'s not just about the points - it\'s about seeing yourself rise through the ranks, tier by tier, toward the top.',
                        useCases: `• <strong>Skill rankings</strong> - Progress from novice to intermediate to expert levels<br><br>
• <strong>Loyalty programs</strong> - Track tier status in reward programs (Silver, Gold, Platinum)<br><br>
• <strong>Achievement levels</strong> - Gaming-style progression through increasingly difficult tiers<br><br>
• <strong>Game ranks</strong> - Competitive rankings in games or sports (Bronze, Silver, Gold)<br><br>
• <strong>Belt systems</strong> - Martial arts progression through colored belts<br><br>
• <strong>Performance ratings</strong> - Work performance tiers or rating systems<br><br>
• <strong>Membership tiers</strong> - Paid membership levels or subscription tiers<br><br>
• <strong>Certification levels</strong> - Professional certifications with progressive credentials<br><br>
• <strong>Mastery stages</strong> - Learning paths with beginner, intermediate, advanced stages<br><br>
• <strong>Advancement paths</strong> - Career or organizational hierarchy progression`
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
                        useCases: `• <strong>Project sub-tasks</strong> - Break down large projects into nested workspaces<br><br>
• <strong>Client workspaces</strong> - Separate dashboards for each client's work<br><br>
• <strong>Category organization</strong> - Group related cards by life area or work category<br><br>
• <strong>Multi-phase projects</strong> - Complex initiatives with distinct phases or stages<br><br>
• <strong>Department dashboards</strong> - Team or department-specific tracking spaces<br><br>
• <strong>Complex workflows</strong> - Intricate processes requiring multiple levels of organization<br><br>
• <strong>Hierarchical planning</strong> - Nested goals and sub-goals with proper structure<br><br>
• <strong>Area-specific tracking</strong> - Dedicated spaces for home, work, fitness, etc.<br><br>
• <strong>Nested projects</strong> - Projects within projects that need independent tracking`
                    },
                    cycle: {
                        purpose: 'Cycles are Nests that reset themselves. Every day, every week, every month - whatever schedule you set - the Cycle wipes everything clean and starts fresh. It\'s perfect for recurring workflows where you do the same set of tasks repeatedly. Your daily routine. Your weekly review. Your monthly goals. Build the structure once, then let it auto-reset on schedule while you execute the current cycle.',
                        build: 'Name your Cycle and set its reset schedule. Daily at 6am? Weekly on Monday? Monthly on the 1st? Choose your frequency and timing. Then click enter and build your recurring workspace. Add all the cards you need for one cycle - morning checklist, daily goals, habits to track. When you exit back to the main view, that schedule is locked in. At the designated time, everything inside resets: Lists empty, counts go to zero, History clears. Fresh slate for the next cycle.',
                        view: 'The Cycle card shows a countdown: "Resets in: 3h 42m" or "Resets in: 2d 5h". Click to enter and you\'ll see a countdown card at the top of the workspace, reminding you how much time remains in this cycle. Use the workspace normally - check off tasks, track progress, log data. When the reset time hits, everything clears automatically. No manual cleanup, no carrying over yesterday\'s incomplete tasks. Every cycle starts clean, letting you focus on now instead of drowning in the past.',
                        useCases: `• <strong>Daily routines</strong> - Morning, evening, or full-day workflows that reset each day<br><br>
• <strong>Weekly goals</strong> - Plans and tasks that reset every Monday for a fresh start<br><br>
• <strong>Monthly reviews</strong> - Recurring monthly planning and reflection processes<br><br>
• <strong>Recurring templates</strong> - Standard workflows you execute on a schedule<br><br>
• <strong>Habit cycles</strong> - Daily or weekly habit tracking that auto-resets<br><br>
• <strong>Sprint planning</strong> - Agile development cycles with automatic refresh<br><br>
• <strong>Workout programs</strong> - Exercise routines that repeat on weekly or daily cycles<br><br>
• <strong>Periodic resets</strong> - Any recurring activity needing a clean slate on schedule<br><br>
• <strong>Routine checklists</strong> - Standard procedures that repeat regularly<br><br>
• <strong>Cyclical workflows</strong> - Business processes that recur on fixed schedules`
                    },
                    import: {
                        purpose: 'Import cards exist only in Build Mode, and only for one purpose: bringing in pre-built Nest structures from elsewhere. Someone shared a template with you? Import it. You exported a Nest for backup? Import it back. The Import card is temporary scaffolding that transforms into a real Nest once it successfully loads the data.',
                        build: 'Click the Import card to open the import window. You\'ll see a large text area and instructions. Paste your exported data - doesn\'t matter if it\'s GT50 format, JSON, compressed, or encrypted. The system auto-detects and processes it. Click Import. If the data is valid, the Import card transforms into a real Nest containing all the imported structure. If something\'s wrong, you get an error message with details. Fix it and try again. Once import succeeds, the Import card disappears - it\'s done its job.',
                        view: 'Import cards don\'t exist in View Mode. Switch to View and they vanish. Why? Because they\'re not real cards - they\'re temporary tools for bringing data in. Once import succeeds, what you have is a regular Nest card, fully functional and ready to use. You navigate into it, interact with its contents, and forget it was ever an import. The Import card is just the doorway, not the destination.',
                        useCases: `• <strong>Template importing</strong> - Load pre-built dashboard structures from others<br><br>
• <strong>Structure duplication</strong> - Clone your own nested workspaces for reuse<br><br>
• <strong>Backup restoration</strong> - Recover previously exported dashboard states<br><br>
• <strong>Shared workflows</strong> - Import team or community-created templates<br><br>
• <strong>Data migration</strong> - Move dashboards between devices or accounts<br><br>
• <strong>Template libraries</strong> - Maintain collections of reusable dashboard structures<br><br>
• <strong>Configuration transfer</strong> - Copy setups from one project to another<br><br>
• <strong>Workspace cloning</strong> - Duplicate entire workspace configurations quickly`
                    }
                }
            },
            divider: {
                label: 'DIVIDER',
                color: 'var(--color-6)',
                variations: [
                    { type: 'divider', label: 'DIVIDER', color: 'var(--color-6)' },
                    { type: 'text', label: 'TEXT', color: 'var(--color-6-2)' },
                    { type: 'scale', label: 'SCALE', color: 'var(--color-6-3)' }
                ],
                info: {
                    divider: {
                        purpose: 'Dividers create breathing room. Your dashboard is filling up with cards, and they\'re starting to blur together. Drop in a Divider and suddenly you have sections. "Morning Routine" cards live here, "Work Tasks" live there, "Evening Wind-Down" is at the bottom. The Divider isn\'t functional - it doesn\'t track or count or calculate. It just separates, organizes, and clarifies.',
                        build: 'Type a section name. That\'s it. "WORK", "PERSONAL", "FITNESS", "WEEKLY GOALS" - whatever labels your sections. The Divider appears as a thin line with your text centered on top. Move it up or down to position it between the card groups it\'s meant to separate. Delete it if you change your organizational structure. It\'s simple because it doesn\'t need to be complex - it just needs to create visual space.',
                        view: 'The Divider sits there, quietly doing its job. A thin line, a clear label, unmistakable separation between what came before and what comes after. You don\'t interact with it. You don\'t click it. You just see it, and instantly understand that you\'ve moved from one section of your dashboard to another. It\'s the visual equivalent of a chapter break.',
                        useCases: `• <strong>Section headers</strong> - Label distinct areas of your dashboard clearly<br><br>
• <strong>Category separation</strong> - Divide cards by type, priority, or project<br><br>
• <strong>Workflow phases</strong> - Separate stages in a sequential process<br><br>
• <strong>Time-of-day grouping</strong> - Morning, afternoon, evening task sections<br><br>
• <strong>Project stages</strong> - Distinguish between planning, execution, and review phases<br><br>
• <strong>Priority levels</strong> - Separate high, medium, and low priority items<br><br>
• <strong>Area organization</strong> - Work, personal, health, finance divisions<br><br>
• <strong>Routine segments</strong> - Break daily routines into manageable chunks<br><br>
• <strong>Context switching markers</strong> - Signal transitions between different modes or focuses`
                    },
                    text: {
                        purpose: 'Text cards hold information. Not tasks, not counts, not progress - just text. Instructions you need to reference. Notes you want to keep visible. Procedures you follow repeatedly. The Text card keeps it all accessible without cluttering your view, because it collapses when you\'re not reading it.',
                        build: 'Give it a title that hints at the content inside. "Recipe: Chocolate Cake", "Workout Instructions", "Meeting Notes from Dec 15", "Emergency Contacts". Then fill the text area with whatever needs to be stored. No length limit. Write paragraphs, lists, instructions, notes, whatever. It all saves automatically. When you collapse the dropdown, all that text hides away but stays ready for when you need it.',
                        view: 'The Text card shows its title, collapsed and minimal. Need to read it? Click anywhere on the card and it expands, revealing all your text. Read it, reference it, absorb it. Click again and it collapses back to just the title. The text stays there, persistent and unchanging, ready to be referenced whenever you need it. It\'s your personal reference library, built right into your dashboard.',
                        useCases: `• <strong>Reference notes</strong> - Information you need to look up frequently<br><br>
• <strong>Instructions</strong> - Step-by-step procedures for recurring tasks<br><br>
• <strong>Meeting notes</strong> - Key takeaways and action items from discussions<br><br>
• <strong>Recipes</strong> - Cooking instructions and ingredient lists kept handy<br><br>
• <strong>Procedures</strong> - Standard operating procedures for work or life tasks<br><br>
• <strong>Contact information</strong> - Important phone numbers, addresses, emails<br><br>
• <strong>Reminders</strong> - Important information you need to reference regularly<br><br>
• <strong>Documentation</strong> - Technical details or specifications for projects<br><br>
• <strong>Templates</strong> - Email templates, message templates, or format guides<br><br>
• <strong>Quick-reference guides</strong> - Condensed information for rapid lookup<br><br>
• <strong>Scripts</strong> - Talking points or prepared statements for calls or presentations<br><br>
• <strong>Important information</strong> - Critical details that need to stay visible`
                    },
                    scale: {
                        purpose: 'Scale cards solve the recipe multiplication problem. You have ingredient quantities for 4 servings but you need 6. Or 12. Or 2. Instead of grabbing a calculator and doing math for each ingredient, the Scale card does it instantly. List your base quantities once, adjust the multiplier, and watch every measurement scale proportionally. It\'s the difference between fumbling with fractions and confidently cooking.',
                        build: 'Start by adding your base recipe or formula. Each line has two parts: the quantity and what it measures. "2 cups flour", "1 tsp salt", "3 eggs". Add as many ingredients as you need. The dropdown text becomes your recipe title - "Chocolate Chip Cookies" or "Concrete Mix Formula". When you\'re done, you have a base recipe stored and ready to scale.',
                        view: 'The top shows your multiplier - start at 1x for the original recipe. Need to double it? Tap the + button and watch every ingredient instantly recalculate. "2 cups" becomes "4 cups". Need half? Tap - until you hit 0.5x and "2 cups" becomes "1 cup". The math happens automatically for every single ingredient. No calculator, no mental arithmetic, no mistakes. Just accurate, scaled quantities ready to use.',
                        useCases: `• <strong>Recipe scaling</strong> - Adjust serving sizes up or down automatically<br><br>
• <strong>Chemical formulas</strong> - Scale laboratory or industrial mixtures proportionally<br><br>
• <strong>Paint mixing ratios</strong> - Calculate paint colors for different quantities<br><br>
• <strong>Cleaning solution recipes</strong> - Mix cleaning products at different concentrations<br><br>
• <strong>Batch sizing</strong> - Scale manufacturing or cooking batches to any size<br><br>
• <strong>Ingredient proportions</strong> - Maintain ratios while changing quantities<br><br>
• <strong>Medication dosing by weight</strong> - Calculate doses based on patient weight<br><br>
• <strong>Nutrient calculations</strong> - Scale meal prep for different calorie targets<br><br>
• <strong>Crafting materials</strong> - Adjust material quantities for projects of different sizes<br><br>
• <strong>Ratio-based conversions</strong> - Any calculation requiring proportional scaling`
                    }
                }
            },
            features: {
                label: 'FEATURES',
                color: 'var(--color-7)',
                variations: [
                    { type: 'tabs', label: 'TABS', color: 'var(--color-7)' },
                    { type: 'footer', label: 'FOOTER', color: 'var(--color-7-2)' },
                    { type: 'impex', label: 'IMPORT/EXPORT', color: 'var(--color-7-3)' },
                    { type: 'selector', label: 'SELECTOR', color: 'var(--color-7-4)' }
                ],
                info: {
                    tabs: {
                        purpose: 'Tabs let you organize cards into separate views within the same workspace. Think of them as pages in a notebook - each tab holds a different set of cards, but they all live in the same nest or dashboard. You can quickly switch between tabs to focus on different contexts without losing your place. In Build Mode, tabs appear at the top of your workspace where you can edit names, customize colors, add new tabs (up to 6 total), reorder them with arrows, or delete tabs you no longer need. Each tab maintains its own independent collection of cards. In View Mode, tabs become your navigation system - click any tab to instantly switch to that view and see its cards. The active tab is highlighted in its custom color, and all your cards stay exactly where you left them. It\'s seamless context switching.',
                        useCases: `• <strong>Time-based organization</strong> - Separate tabs for Morning, Afternoon, Evening routines<br><br>
• <strong>Project phases</strong> - Planning tab, Execution tab, Review tab for complex projects<br><br>
• <strong>Life areas</strong> - Work tab, Personal tab, Health tab, Finance tab<br><br>
• <strong>Priority levels</strong> - Urgent tab, Important tab, Someday tab for task management<br><br>
• <strong>Client separation</strong> - One tab per client for freelancers or consultants<br><br>
• <strong>Habit tracking</strong> - Daily tab, Weekly tab, Monthly tab for different habit frequencies<br><br>
• <strong>Workout splits</strong> - Push tab, Pull tab, Legs tab for training organization<br><br>
• <strong>Content creation</strong> - Ideas tab, In Progress tab, Published tab<br><br>
• <strong>Sprint planning</strong> - Backlog tab, Current Sprint tab, Done tab`
                    },
                    footer: {
                        purpose: 'The Footer is your card creation interface, living at the bottom of Build Mode and always accessible. It\'s a powerful selector that lets you add any type of card to your workspace with just a tap. The top row shows the six main card families: List, Count, Progress, Tier, Nest, and Divider. Tap any section to open a dropdown showing variations (if available). The bottom row displays the currently selected card type and acts as the "add" button - tap it to create that card type at your current insertion point. It\'s designed for speed - get in, add what you need, get out. The Footer doesn\'t appear in View Mode since View Mode is for execution and interaction with your cards, not for building new ones.',
                        useCases: `• <strong>Quick card creation</strong> - Add new tracking cards without complex menus<br><br>
• <strong>Card type discovery</strong> - Browse available card types and their variations<br><br>
• <strong>Rapid dashboard building</strong> - Build entire workspaces efficiently<br><br>
• <strong>Card variation selection</strong> - Choose between List, Checklist, Radio, Threshold variants<br><br>
• <strong>Organized card families</strong> - Find related card types grouped together<br><br>
• <strong>Template construction</strong> - Build reusable dashboard templates quickly`
                    },
                    impex: {
                        purpose: 'Import/Export is your data portability system, accessible from the settings menu in Build Mode. Export creates a snapshot of your entire workspace that you can save, share, or backup - choose JSON for compatibility, GT50 format for readability, or compressed formats for smaller file sizes. Copy the output or download it as a file. Import loads those snapshots back in, whether from your own backups or templates shared by others. Just paste your data and click Import - the system auto-detects the format and validates before importing. It\'s how you move data between devices, share workflows with team members, and protect against data loss. Import/Export is a Build Mode feature, so you need to switch from View Mode to access these tools.',
                        useCases: `• <strong>Backup creation</strong> - Save snapshots of your workspace before major changes<br><br>
• <strong>Cross-device sync</strong> - Move your dashboard from phone to desktop<br><br>
• <strong>Template sharing</strong> - Share your workflow setups with team members<br><br>
• <strong>Version control</strong> - Keep multiple versions of your dashboard setup<br><br>
• <strong>Data recovery</strong> - Restore previous versions if something goes wrong<br><br>
• <strong>Workspace cloning</strong> - Duplicate successful setups for new projects<br><br>
• <strong>Team onboarding</strong> - Give new team members pre-built dashboards<br><br>
• <strong>Template libraries</strong> - Maintain a collection of reusable structures`
                    },
                    selector: {
                        purpose: 'The Selector is your insertion point indicator in Build Mode - a vertical line that appears to the left of your cards showing exactly where new cards will be added when you create them. Think of it as a cursor for your dashboard, marking the position where the next card will appear. The Selector appears as a thin line to the left of each card in Build Mode. Click on any Selector line to set that as your insertion point - it turns green to visually confirm your selection. When you add a new card using the Footer, it appears at the current green-highlighted Selector position. The Selector always defaults to the bottom of your card list, but you can click any position to insert cards precisely where you want them. The Selector doesn\'t exist in View Mode since View Mode is for interacting with existing cards, not for positioning new ones.',
                        useCases: `• <strong>Precise card placement</strong> - Add new cards exactly where you want them<br><br>
• <strong>Dashboard reorganization</strong> - Insert cards between existing ones during restructuring<br><br>
• <strong>Logical grouping</strong> - Place related cards together by selecting the right position<br><br>
• <strong>Section building</strong> - Add cards to specific sections marked by Dividers<br><br>
• <strong>Priority ordering</strong> - Insert urgent cards at the top of your list<br><br>
• <strong>Template construction</strong> - Build dashboards with intentional card ordering`
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
            const hasVariations = data.variations.length > 0;
            
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
                    margin-bottom: ${hasVariations ? '0' : 'var(--margin)'};
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: ${hasVariations ? '8px 8px 0 0' : '8px'};
                    height: var(--card-height);
                    display: flex;
                    overflow: hidden;
                ">
                    ${Object.keys(this.cardData).map((key, index, array) => {
                        const card = this.cardData[key];
                        const isSelected = key === state.selectedCard;
                        const isLast = index === array.length - 1;
                        const textColor = card.color;
                        
                        return `
                            <div data-card="${key}" style="
                                flex: 1;
                                background: ${isSelected ? card.color : 'var(--color-10)'};
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
                
                ${hasVariations ? `
                    <div style="
                        background: var(--bg-2);
                        border: var(--border-width) solid var(--border-color);
                        border-top: none;
                        border-radius: 0 0 8px 8px;
                        padding: var(--margin);
                        margin: 0 var(--margin) var(--margin) var(--margin);
                    ">
                        <div style="
                            background: var(--bg-4);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            height: 32px;
                            display: flex;
                            overflow: hidden;
                        ">
                            ${data.variations.map((v, index, array) => {
                                const isSelected = v.type === state.selectedVariation;
                                const isLast = index === array.length - 1;
                                
                                return `
                                    <div data-variation="${v.type}" style="
                                        flex: 1;
                                        background: ${isSelected ? v.color : 'var(--color-10)'};
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
                    </div>
                ` : ''}
                
                <div style="
                    background: var(--bg-4);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 8px;
                    height: 32px;
                    display: flex;
                    overflow: hidden;
                    margin: 0 var(--margin) var(--margin) var(--margin);
                ">
                    ${(state.selectedCard === 'features' ? ['purpose', 'useCases'] : ['purpose', 'build', 'view', 'useCases']).map((tab, index, array) => {
                        const isSelected = tab === state.activeTab;
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
                        // If switching to features and currently on build/view tab, switch to purpose
                        if (key === 'features' && (state.activeTab === 'build' || state.activeTab === 'view')) {
                            state.activeTab = 'purpose';
                        }
                        onChange();
                    };
                }
            });
            
            // Add click handlers for variation selection
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
            
            // Add click handlers for tab selection
            const tabsToShow = state.selectedCard === 'features' ? ['purpose', 'useCases'] : ['purpose', 'build', 'view', 'useCases'];
            tabsToShow.forEach(tab => {
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
            
            // Features section only has purpose and useCases, no build/view demos
            const isFeatures = state.selectedCard === 'features';
            
            if (state.activeTab === 'purpose' || state.activeTab === 'useCases') {
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
            } else if (!isFeatures && (state.activeTab === 'build' || state.activeTab === 'view')) {
                const content = info[state.activeTab];
                const mode = state.activeTab;
                
                tabContentArea.innerHTML = `
                    <div style="margin: var(--margin); ${mode === 'build' ? 'pointer-events: none;' : ''} user-select: none;">
                        <div id="${mode}-demo"></div>
                    </div>
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
                
                this.renderDemoCard(state, mode);
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
                        { text: 'Task 1', completed: false },
                        { text: 'Task 2', completed: true },
                        { text: 'Task 3', completed: false }
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
                    demoState.items = [
                        { text: 'Low', selected: false },
                        { text: 'Medium', selected: true },
                        { text: 'High', selected: false }
                    ];
                    break;
                case 'threshold':
                    componentLib = window.GT50Lib.Threshold;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Thresholds';
                    demoState.number1 = 2;
                    demoState.items = [
                        { text: 'Water (8 cups)', threshold: 8, count: 5, completed: false },
                        { text: 'Exercise (30 min)', threshold: 30, count: 30, completed: true }
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
                        { timestamp: Date.now() - 7200000 },
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
                        { name: 'Bronze', amount: '100' },
                        { name: 'Silver', amount: '100' },
                        { name: 'Gold', amount: '150' }
                    ];
                    demoState.current = 150;
                    demoState.total = 350;
                    break;
                case 'divider':
                    componentLib = window.GT50Lib.Divider;
                    demoState = componentLib.defaultState();
                    demoState.title = 'SECTION TITLE';
                    break;
                case 'text':
                    componentLib = window.GT50Lib.Text;
                    demoState = componentLib.defaultState();
                    demoState.title = 'Example Text';
                    demoState.text = 'This is example text content that can be expanded and collapsed. You can store notes, instructions, recipes, or any other reference material here.';
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
            
            const onChange = () => {
                this.renderDemoCard(state, mode);
            };
            
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
