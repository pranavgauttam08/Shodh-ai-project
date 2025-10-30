# Contributing to Shodh-a-Code

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/shodh-a-code.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

### Backend Development
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

### Frontend Development
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Full Stack with Docker
\`\`\`bash
docker-compose up --build
\`\`\`

## Coding Standards

### Java (Backend)
- Follow Google Java Style Guide
- Use meaningful variable names
- Add Javadoc for public methods
- Keep methods focused and small
- Use appropriate access modifiers

### TypeScript/React (Frontend)
- Use Prettier for formatting
- Follow React best practices
- Use functional components with hooks
- Add PropTypes or TypeScript types
- Keep components focused

### General
- Write clear commit messages
- Add comments for complex logic
- Keep functions DRY (Don't Repeat Yourself)
- Use meaningful names

## Commit Message Format

\`\`\`
type(scope): subject

body

footer
\`\`\`

Types: feat, fix, docs, style, refactor, test, chore

Example:
\`\`\`
feat(judge): add Python language support

- Implement Python code compilation
- Add Python test case execution
- Update language enum

Closes #123
\`\`\`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers
6. Address feedback promptly

## Testing

### Backend Tests
\`\`\`bash
cd backend
mvn test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

### Integration Tests
\`\`\`bash
docker-compose up
# Run manual tests
\`\`\`

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots/logs if applicable

### Feature Requests
Include:
- Clear description
- Use case/motivation
- Proposed solution
- Alternative solutions

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for system changes
- Add code comments for complex logic
- Keep API documentation current

## Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Problem difficulty ratings
- [ ] Contest analytics
- [ ] Performance optimization

### Medium Priority
- [ ] Additional language support
- [ ] Discussion forums
- [ ] Email notifications
- [ ] Mobile app

### Low Priority
- [ ] UI/UX improvements
- [ ] Documentation enhancements
- [ ] Code refactoring
- [ ] Test coverage

## Questions?

- Open an issue for discussion
- Check existing documentation
- Review similar implementations
- Ask in pull request comments

Thank you for contributing to Shodh-a-Code!
