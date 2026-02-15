# Contributing to Smart Tracker

Thank you for your interest in contributing to Smart Tracker! 🎉

This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to:

- **Be respectful** - Respect differing opinions and experiences
- **Be inclusive** - Welcome people of all backgrounds and experience levels
- **Be constructive** - Offer helpful feedback and support
- **Be professional** - Keep interactions professional and free of harassment

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Great! Here's how to report it:

1. **Check existing issues** - Verify the bug hasn't been reported
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser and version information
   - Screenshots if applicable

**Example:**
```
Title: Drag and drop not working on Firefox

Description:
When trying to drag habits to reorder them on Firefox, the drag handle 
does not show visual feedback.

Steps to Reproduce:
1. Open app in Firefox
2. Create a habit
3. Attempt to drag the habit by the grip icon

Expected: Habit should be draggable with visual feedback
Actual: No drag feedback, habit doesn't reorder

Browser: Firefox 121.0
OS: Windows 10
```

### 💡 Suggesting Enhancements

Have an idea for improvement?

1. **Check existing suggestions** - Is this already requested?
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the enhancement
   - Motivation and use case
   - Possible implementation approach
   - Examples or mockups

**Example:**
```
Title: Add export to CSV functionality

Description:
Allow users to export their habits and progress data to CSV format 
for analysis in spreadsheet applications.

Use Case:
Users want to analyze their habit completion trends in Excel/Sheets.

Implementation:
- Add "Export Data" button in header
- Collect all habits with dates
- Convert to CSV format
- Trigger download
```

### 🔧 Code Contributions

Want to contribute code? Follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Push to your branch**
5. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Git

### Local Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/amr-khaled-dev/habits-smart-tracker.git
   cd smart-tracker
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Open in browser:**
   - Option A: Double-click `index.html`
   - Option B: Use local server
     ```bash
     python -m http.server 8000
     # Open http://localhost:8000
     ```

4. **Test your changes** thoroughly in multiple browsers

---

## Coding Standards

### JavaScript

- **Use ES6+** features
- **Use meaningful variable names**
- **Add comments** for complex logic
- **Keep functions focused** (single responsibility)
- **Avoid global variables** where possible
- **Use const/let**, not var

**Example:**
```javascript
// ❌ Bad
function add(a, b) {
    return a + b;
}
var x = add(5, 3);

// ✅ Good
function addNumbers(first, second) {
    // Calculate sum of two numbers
    return first + second;
}
const total = addNumbers(5, 3);
```

### CSS

- **Use CSS variables** for colors and sizes
- **Use meaningful class names** (BEM-style)
- **Keep specificity low**
- **Mobile-first approach**
- **Comment complex rules**

**Example:**
```css
/* ❌ Bad */
.habit { color: #4D1FAB; }
.habit:hover { color: #350c81; }

/* ✅ Good */
.habit-item {
    color: var(--main-color);
    transition: color 0.3s ease;
}

.habit-item:hover {
    color: var(--secondary-color);
}
```

### HTML

- **Use semantic HTML5** elements
- **Proper indentation** (2 spaces)
- **Meaningful id/class names**
- **Accessibility attributes** (aria-*, role)

**Example:**
```html
<!-- ❌ Bad -->
<div class="h">Click me</div>

<!-- ✅ Good -->
<button class="add-habit-btn" aria-label="Add new habit">
    <i class="fa-solid fa-plus"></i> Add Habit
</button>
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Build process, dependencies, etc.

### Examples

```bash
# Good commits
git commit -m "feat(habits): add drag-and-drop reordering"
git commit -m "fix(db): handle IndexedDB quota exceeded error"
git commit -m "docs: update README with installation steps"
git commit -m "refactor(ui): simplify habit rendering logic"
```

### Best Practices

- ✅ Keep commits focused and atomic
- ✅ Use present tense ("add feature" not "added feature")
- ✅ Reference issues when relevant (#123)
- ✅ Write meaningful commit messages

---

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with latest changes
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test thoroughly**
   - Test in multiple browsers
   - Test on mobile devices
   - Check console for errors
   - Test edge cases

3. **Run self-review**
   - Follow coding standards
   - No console errors/warnings
   - Code is well-commented

### Creating a PR

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub with:
   - Clear, descriptive title
   - Detailed description of changes
   - Reference related issues (#123)
   - Screenshots if UI changes
   - Testing checklist

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] No console errors

## Related Issues
Closes #123

## Screenshots
[If applicable]
```

### Review Process

- Maintainers will review your PR
- Changes may be requested
- Once approved, your PR will be merged
- Thank you for contributing! 🎉

---

## Testing Guidelines

### Manual Testing

1. **Feature Testing**
   - Test the new feature completely
   - Test edge cases
   - Test with empty data
   - Test with large data sets

2. **Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile browsers

3. **Regression Testing**
   - Ensure existing features still work
   - Check UI/UX not broken
   - Verify no performance degradation

### Bug Verification

When testing bug fixes:
1. Reproduce the original bug
2. Test the fix resolves it
3. Verify no new bugs introduced
4. Test related functionality

---

## Documentation

### When to Update Docs

- ✅ Adding new features → Update README.md
- ✅ Changing API/functions → Update comments
- ✅ New installation method → Update setup section
- ✅ UI/UX changes → Update usage guide

### Code Comments

```javascript
// Good comment - explains WHY
// Reset progress only if target wasn't reached
// Completed habits retain their streak
if (habit.progress < habit.target) {
    habit.streak = 0;
}

// Bad comment - explains WHAT (code already does this)
// Set streak to 0
habit.streak = 0;
```

---

## Reporting Issues

When reporting issues, include:

1. **Title** - Clear and concise
2. **Description** - What's the problem?
3. **Steps** - How to reproduce it?
4. **Expected** - What should happen?
5. **Actual** - What actually happened?
6. **Environment** - Browser, OS, version

---

## Suggesting Enhancements

When suggesting features:

1. **Title** - Clear feature description
2. **Motivation** - Why is this needed?
3. **Solution** - How should it work?
4. **Alternatives** - Other approaches?
5. **Examples** - Mockups or use cases?

---

## Recognition

Contributors will be:
- ✅ Listed in README.md
- ✅ Mentioned in commit messages
- ✅ Recognized in releases

---

## Questions?

- 💬 Open a discussion
- 📧 Comment on related issues
- 🐛 Create an issue with your question

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License. This project and all contributions are under the MIT License.

---

**Thank you for contributing to Smart Tracker! Together we build better tools. 🚀**
