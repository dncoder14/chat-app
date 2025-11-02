# Contributing to Chat App

Thank you for your interest in contributing to our real-time chat application! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/chat-app.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in README.md

## Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add typing indicator to chat
fix: resolve socket connection issues
docs: update API documentation
```

### Branch Naming

- `feature/feature-name` for new features
- `fix/bug-description` for bug fixes
- `docs/documentation-update` for documentation
- `refactor/component-name` for refactoring

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Update README.md if necessary
6. Create a detailed pull request description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested with different browsers

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Feature Requests

When suggesting new features:
1. Check existing issues first
2. Provide detailed description
3. Explain the use case
4. Consider implementation complexity

## Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB
- Cloudinary account

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests
- Write unit tests for utilities
- Add integration tests for API endpoints
- Include component tests for React components

## Code Review Guidelines

### For Reviewers
- Check code quality and style
- Verify functionality works as expected
- Ensure security best practices
- Provide constructive feedback

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear
- Test changes thoroughly

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Follow the code of conduct

## Questions?

- Open an issue for technical questions
- Join our Discord community
- Check existing documentation first

Thank you for contributing! 🚀