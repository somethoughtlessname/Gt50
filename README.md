# GT50 - Modular Productivity Tracker

A sophisticated card-based productivity and tracking system built with vanilla JavaScript. GT50 is a zero-dependency, mobile-optimized dashboard builder featuring dual modes for creating custom tracking workflows and interactive progress monitoring.

## ✨ Features

### Dual Mode System
- **Build Mode**: Create and configure custom tracking cards with full control over layout and hierarchy
- **View Mode**: Interactive progress tracking with streamlined interface and automatic cleanup

### Rich Component Library
- **List** - Task tracking with checkboxes and completion status
- **Checklist** - Habit tracking with progress indicators
- **Radio** - Single-choice selection with visual feedback
- **Progress** - Visual progress bars with current/total tracking
- **Accumulation** - Counters with increment/decrement controls
- **Tier** - Multi-level progression systems with named tiers
- **Threshold/Quota** - Partial completion goals with subset tracking
- **History** - Timestamp logging with chronological entries
- **Text** - Expandable content blocks with formatting options
- **Scale** - Recipe scaling with ingredient multipliers
- **Divider** - Visual organization and section breaks
- **Nest** - Hierarchical structures with independent tab systems
- **Cycle** - Auto-resetting containers for recurring workflows (daily/weekly/monthly)

### Data Management
- Multiple export formats: JSON, GT50 text format, ultra-compact compression
- Automatic format detection on import
- Round-trip accuracy - exports import back identically
- Template sharing and backup restoration
- Import/Export cards for structure duplication

### Design System
- Dark gaming aesthetic with bold 3px black borders
- Rainbow color palette with progressive darker variations
- Consistent spacing (4px gaps) and card heights (45px standard, 60px large)
- Mobile-first responsive design
- CSS custom properties for centralized styling
- Zero external dependencies for maximum portability

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gt50.git
cd gt50
```

2. Open `Tester.html` in your browser - no build process required!

### Quick Start

1. **Switch to Build Mode** - Click the MODE button in the header
2. **Add Components** - Use the footer to add cards (List, Progress, etc.)
3. **Configure Cards** - Tap any card to edit its properties
4. **Create Tabs** - Organize cards into multiple tabs
5. **Switch to View Mode** - Start tracking your progress
6. **Auto-Save** - All changes persist automatically to localStorage

## 📁 Project Structure

```
gt50/
├── Tester.html           # Main application file
├── Styles.js             # CSS custom properties and global styles
├── Comp-*.js             # Individual component implementations
│   ├── Comp-header.js    # Header system with navigation
│   ├── Comp-footer.js    # Footer with component creation
│   ├── Comp-tabs.js      # Tab management system
│   ├── Comp-list.js      # List component
│   ├── Comp-progress.js  # Progress bars
│   ├── Comp-nest.js      # Nested containers
│   ├── Comp-cycle.js     # Auto-reset cycles
│   └── ...               # Other components
├── Comp-utility.js       # Shared utilities and helpers
├── Comp-impex.js         # Import/Export system
├── Format-*.js           # Data format adapters
│   ├── Format-json.js    # JSON format
│   ├── Format-gt50.js    # GT50 text format
│   └── Format-compact.js # Compressed format
└── Info.js               # Component documentation
```

## 🎨 Component Architecture

All components follow the GT50Lib pattern:

```javascript
window.GT50Lib.ComponentName = {
    // Create default state
    defaultState: function() {
        return { /* initial state */ };
    },
    
    // Render in Build Mode
    renderBuild: function(container, state, onChange) {
        // Edit interface with controls
    },
    
    // Render in View Mode
    renderView: function(container, state, onChange) {
        // Interactive tracking interface
    }
};
```

### Adding New Components

1. Create `Comp-yourcomponent.js`
2. Implement `defaultState()`, `renderBuild()`, and `renderView()`
3. Register color mapping in `Comp-footer.js`
4. Add to component type arrays in format adapters
5. That's it - the modular architecture handles the rest!

## 💾 Data Persistence

GT50 uses localStorage for automatic state persistence:
- Saves after every render
- Saves on tab switches
- Periodic auto-save intervals
- Save before page unload

### Export Formats

**JSON Format**
```json
{
  "version": "1.0",
  "timestamp": "2025-12-25T10:30:00Z",
  "app": "GT50 Tester",
  "data": { /* state */ }
}
```

**GT50 Text Format**
```
===== GT50 EXPORT =====
Version: 1.0

--- TAB START: Main ---
LIST|Task Manager
list-item|0|Buy groceries
list-item|1|Finish project
--- TAB END ---
```

**Compressed Format**
- Ultra-compact using LZ-String compression
- Ideal for sharing large configurations
- Automatic decompression on import

## 🎯 Use Cases

- **Daily Workflows** - Morning routines, work tasks, evening checklists
- **Goal Tracking** - Fitness progress, reading lists, learning paths
- **Habit Formation** - Daily habits with streak tracking
- **Project Management** - Sprint planning, task boards, milestone tracking
- **Recurring Templates** - Weekly reviews, monthly reports, seasonal goals
- **Recipe Management** - Ingredient scaling, cooking workflows
- **Time Tracking** - History logs with timestamps
- **Multi-Level Systems** - Tier progression, achievement tracking

## 🔧 Technical Highlights

### No External Dependencies
- Pure vanilla JavaScript (ES6+)
- Native CSS custom properties
- Standard DOM APIs only
- LZ-String for compression (included)

### Mobile-First Design
- Touch-optimized controls with 44px minimum touch targets
- Auto-scroll to position inputs above mobile keyboards
- Responsive layouts with flexbox
- Gesture-friendly interactions

### State Management
- Immutable state updates with onChange callbacks
- Proper render timing to prevent keyboard closure
- Independent state isolation for nested structures
- Two-tap deletion with visual feedback

### Visual Consistency
- Centralized CSS variables - no hardcoded values
- Consistent component spacing and sizing
- Progressive color variations for hierarchy
- Dynamic tab coloring system

## 🛠️ Development

### Key Principles

1. **Component Reusability** - Every component exports reusable functions
2. **State Isolation** - Nested structures maintain independent state
3. **Visual Feedback** - Immediate UI response to all interactions
4. **Data Integrity** - Format adapters ensure round-trip accuracy
5. **Mobile UX** - Keyboard behavior and auto-scroll considerations

### CSS Variables

```css
/* Card dimensions */
--card-height: 45px;
--square-section: 28px;
--margin: 4px;
--border-width: 3px;

/* Rainbow color palette */
--color-1: #C85A5A;  /* Red */
--color-2: #C7824A;  /* Orange */
--color-3: #d4c956;  /* Yellow */
--color-4: #48a971;  /* Green */
--color-5: #5A8DB8;  /* Blue */
--color-6: #8a7ca8;  /* Purple */
/* ...with progressive variations */
--color-1-2: /* 20% darker */
--color-1-3: /* 40% darker */
--color-1-4: /* 60% darker */
```

### Adding Format Adapters

```javascript
window.GT50Lib.ImpEx.registerFormat({
    serialize: function(data) { /* convert to format */ },
    deserialize: function(text) { /* parse from format */ },
    detect: function(text) { /* auto-detection */ },
    getFormatName: function() { return 'Format Name'; },
    getFileExtension: function() { return '.ext'; },
    getVersion: function() { return '1.0'; }
});
```

## 🎮 Controls

### Build Mode
- **Tap Card** - Edit properties
- **▲/▼ Buttons** - Reorder cards
- **✕ Button** - Delete (tap twice to confirm)
- **Footer** - Add new components
- **Tabs** - Create/switch/delete tabs

### View Mode
- **Checkboxes** - Toggle completion
- **Progress Bars** - Visual tracking
- **+/- Buttons** - Increment/decrement counters
- **History** - Add timestamped entries
- **Nest Cards** - Navigate into nested structures
- **Cycle Cards** - Auto-reset on schedule

## 📱 Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Android)
- localStorage enabled

## 🤝 Contributing

Contributions welcome! The modular architecture makes it easy to add new components or features.

1. Fork the repository
2. Create a feature branch
3. Follow the GT50Lib component pattern
4. Test in both Build and View modes
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with a focus on portability, consistency, and mobile-first design. No frameworks, no build process, no dependencies - just pure JavaScript doing what it does best.

---

**GT50** - Where productivity meets modularity.
