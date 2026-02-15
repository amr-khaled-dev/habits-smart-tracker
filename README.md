# 🎯 Smart Tracker

A modern, responsive **Habits & Focus Tracker** web application designed to help you build better habits, track your progress, and maintain focus on your goals.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow)

---

## ✨ Features

- 📝 **Add & Manage Habits** - Create habits with custom targets and frequencies
- 📊 **Progress Tracking** - Visual progress bars and real-time statistics
- 🎯 **Flexible Frequency** - Track habits daily or weekly
- 🏆 **Streak Counter** - Keep track of your longest streaks
- 🎨 **Dark Mode** - Eye-friendly dark theme toggle
- 🔔 **Smart Notifications** - Toast notifications for important events
- 🔍 **Search & Filter** - Filter habits by status or search by name/tags
- 🏷️ **Tags & Priority** - Organize habits with tags and priority levels (Low, Medium, High)
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 💾 **Local Storage** - All data stored locally using IndexedDB (server-side not needed, but live server required)
- 🎯 **Drag & Drop** - Reorder habits with intuitive drag-and-drop functionality
- ↩️ **Undo Delete** - Recover accidentally deleted habits

---

## 📋 Project Structure

```
Smart Tracker/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── css/
│   ├── all.min.css           # Font Awesome icons
│   ├── normalize.css         # CSS normalization
│   └── smartTracker.css      # Main stylesheet (891 lines)
├── js/
│   ├── main.js               # Application logic (729 lines)
│   ├── db.js                 # Database operations (IndexedDB)
│   └── libs/
│       └── idb.js            # IndexedDB wrapper library
└── webfonts/                 # Font files
```

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, Grid & Flexbox
- **JavaScript (ES6+)** - Application logic and state management
- **Font Awesome** - Icon library
- **Google Fonts** - Open Sans typeface

### Storage & Libraries
- **IndexedDB** - Client-side database for persistent storage
- **idb.js** - Promise-based IndexedDB wrapper for cleaner API

### Architecture
- ES6 modules for code organization
- Responsive design with mobile-first approach
- State management pattern
- Event-driven architecture

---

## 📥 Installation & Setup

### Prerequisites
- Modern web browser with:
  - JavaScript enabled
  - ES6 support
  - IndexedDB support
  - CSS Grid & Flexbox support

### ⚠️ Important: Live Server Required

This project **requires a live server** to run properly due to ES6 module imports. Opening `index.html` directly in the browser (file:// protocol) will cause a CORS error.

### Setup: Use a Local Server

Choose one of the following methods:

**Using Python 3:**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
# Open http://localhost:8000
```

**Using Node.js (with http-server):**
```bash
npx http-server
# Open http://localhost:8080
```

**Using Live Server (VS Code):**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 📖 Usage Guide

### Adding a Habit

1. Click **"+ Add Habit"** button in the header
2. Fill in the form:
   - **Habit Name** (3-30 characters)
   - **Target** (1-100)
   - **Frequency** (Daily or Weekly)
   - **Priority** (Low, Medium, High)
   - **Tags** (comma-separated, optional)
3. Click **"Save Habit"**

```
Example:
Name: "Drink Water"
Target: 8
Frequency: Daily
Priority: High
Tags: "health, hydration"
```

### Tracking Progress

- Click **"+1"** button to increment progress
- Progress bar updates in real-time
- Once target is reached:
  - Status changes to "✅ Completed"
  - Streak counter increments
  - Completed count in stats updates

### Managing Habits

| Action | How |
|--------|-----|
| **Pause** | Click "Pause" button to temporarily stop tracking |
| **Resume** | Click "Resume" button to continue tracking |
| **Delete** | Click trash icon to remove (undo available) |
| **Reorder** | Drag habit by the grip icon |
| **Search** | Type in search box to find by name or tags |
| **Filter** | Click "All", "Active", "Completed", or "Paused" |

### Statistics Dashboard

Three stat cards show:
- 🌊 **Total Habits** - Total habits created
- 🏆 **Completed Today** - Habits completed this period
- 📈 **Completion Rate** - Percentage of habits completed

Page title also shows: `Smart Tracker — Today: X/Y ✅ | Best Streak 🔥 Z`

### Customization

- **🌙 Dark Mode** - Click moon/sun icon to toggle
- **🔔 Notifications** - Click bell icon to enable/disable toasts
- **🔍 Search** - Instantly search habits by name or tags
- **🗑️ Clear** - Reset all filters

---

## 🎨 Key Features Explained

### Progress Bars
Visual representation of habit completion:
```
Habit Name    Today | 2 / 4
████████░░░░ 50%
```

### Streaks
- Automatic reset on new day/week
- Increment when target is reached
- Longest streak shown in page title

### Smart Notifications
- **✅ Success** - Habit completed
- **ℹ️ Info** - General information
- **❗ Error** - Invalid input or errors
- **⚠️ Attention** - Delete actions with "Undo" button

### Data Persistence
- All data stored locally in **IndexedDB**
- Persists across browser sessions
- Works completely offline
- ~50MB+ storage available (browser dependent)

### Responsive Design

| Viewport | Width |
|----------|-------|
| Mobile | 320px - 767px |
| Tablet | 768px - 991px |
| Desktop | 1200px+ |

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Safari (iOS) | ✅ Latest |
| Chrome Mobile | ✅ Latest |

---

## 🔧 Customization

### Change Color Scheme

Edit variables in `css/smartTracker.css`:

```css
:root {
    --main-color: #4D1FAB;              /* Primary purple */
    --Secondary-color: #350c81;         /* Dark purple */
    --error-color: #E74C3C;             /* Red */
    --success-color: #30BA67;           /* Green */
    --active-sun-color: #f39c12;        /* Orange */
    --background-color: #f8f8f8;
    --default-background-color: #fff;
    --default-text-color: #000;
    --border-radius: 10px;
}
```

Dark mode colors:
```css
body.dark {
    --default-background-color: #1e2939;
    --checked-color: #374151;
    --background-color: #101828;
    --default-text-color: #e5e7eb;
}
```

### Habit Name Validation

In `js/main.js`, line 24:
```javascript
let habitNameRegex = /^[a-zA-Z0-9 ]{3,30}$/;
```

Modify to allow different characters (e.g., hyphens, emoji):
```javascript
let habitNameRegex = /^[a-zA-Z0-9\s\-]{3,30}$/;
```

---

## 🏗️ Architecture Overview

### State Management
```javascript
let appState = {
    habits: new Map(),           // Store all habits
    habitNames: new Set(),       // Track unique names
    lastActiveDate: null,        // For daily reset
    filters: {
        status: "all",           // all, active, paused, completed
        q: ""                    // Search query
    },
    ui: {
        theme: 'light',          // light || dark
        notifications: true
    }
};
```

### Database Schema

**Habits Store:**
```javascript
{
    id: 1234567890,
    name: "Drink Water",
    cleanName: "drink water",
    target: 8,
    frequency: "daily",          // daily | weekly
    priority: "high",            // low | medium | high
    tags: ["health"],
    progress: 5,
    streak: 10,
    status: "active",            // active | paused | completed
    order: 0,
    periodKey: "2026-02-15",     // For daily reset
    createdAt: "2026-02-15T10:30:00Z"
}
```

**Meta Store:**
- `filters` - User's filter preferences
- `lastActiveDate` - Last date app was active
- `ui` - Theme and notification settings

### Key Functions

| Function | Purpose |
|----------|---------|
| `addHabit()` | Create new habit |
| `incrementHabit()` | Increment progress |
| `toggleHabitStatus()` | Pause/Resume |
| `removeHabit()` | Delete habit |
| `reorderHabits()` | Change habit order |
| `renderHabits()` | Update UI list |
| `resetProgressIfNewPeriod()` | Daily/weekly reset |
| `saveHabitsState()` | Persist to DB |

---

## 🐛 Troubleshooting

### Habits not saving?
- Check browser's IndexedDB quota
- Ensure cookies/storage not disabled
- Try clearing browser cache
- Check browser console for errors

### Dark mode not working?
- Clear browser cache
- Refresh page
- Check if `localStorage` is disabled

### Drag and drop not working?
- Only works on non-completed habits
- Not available on mobile (touch support coming soon)
- Try refreshing page

---

## 🚀 Future Roadmap

- [ ] **Data Export** - Export habits as JSON/CSV
- [ ] **Backup & Restore** - Manual data backup
- [ ] **Analytics** - Charts and detailed statistics
- [ ] **Habit Templates** - Pre-made habit suggestions
- [ ] **Categories** - Organize habits by category
- [ ] **Calendar View** - Visual calendar display
- [ ] **Cloud Sync** - Sync across devices
- [ ] **Reminders** - Time-based notifications
- [ ] **PWA** - Install as native app
- [ ] **Social** - Share progress with friends

---

## 📊 Project Stats

- **Total Lines of Code**: ~1,700
- **JavaScript Functions**: 30+
- **CSS Rules**: 100+
- **Database Stores**: 2
- **Responsive Breakpoints**: 3
- **Zero External Dependencies**: ✅

---

## 🤝 How to Contribute

We welcome contributions! Here's how:

1. **Fork** the repository on GitHub
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes
4. **Commit** with clear message
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly
- Update README if needed
- Keep commits atomic and meaningful

---

## 📝 License

This project is licensed under the **MIT License**.

### You can:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Use privately

### You must:
- ✅ Include license and copyright notice

See [LICENSE](LICENSE) file for full details.

---

## 👨‍💻 Author

**Amr Khaled**

---

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) - Beautiful icon library
- [Google Fonts](https://fonts.google.com/) - Open Sans typeface
- [idb.js](https://github.com/jakearchibald/idb) - Promise-based IndexedDB wrapper
- [normalize.css](https://necolas.github.io/normalize.css/) - CSS normalization

---

## 📞 Support & Feedback

Have a question or found a bug?

1. Check the [Issues](issues) page
2. Create a [New Issue](issues/new) with:
   - Clear title
   - Detailed description
   - Browser and version
   - Steps to reproduce

---

## 🎯 Project Goals

✅ Create a simple, intuitive habit tracker  
✅ Zero dependencies (no node_modules!)  
✅ Fast and responsive  
✅ Beautiful modern UI  
✅ Privacy-first (all local storage)  
✅ Easy to customize and extend  

---

## 📅 Version History

### v1.0.0 (February 15, 2026)
**Initial Release**
- Core habit tracking
- Daily & weekly habits
- Progress bars & streaks
- Dark mode support
- Drag-and-drop reordering
- Search & filter
- Local storage with IndexedDB
- Fully responsive design
- Toast notifications
- Undo delete functionality
- Bug fixes and improvements

---

## 🌟 Show Your Support

If you like this project:
- ⭐ Star the repository
- 📢 Share with friends
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code

---

**Happy Habit Tracking! 🎯✨**

*Built with ❤️ using vanilla JavaScript*

*Last updated: February 15, 2026*
