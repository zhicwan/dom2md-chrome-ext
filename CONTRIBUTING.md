# Contributing to DOM2MD

Thank you for your interest in contributing! Here's how you can help.

## Getting Started

> **Requirements:** Node.js >= 18, npm >= 9

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/<your-username>/dom2md-chrome-ext.git`
3. **Install** dependencies: `npm install`
4. **Build**: `npm run build`
5. Create a **branch** for your changes: `git checkout -b feature/your-feature`

## Development

```bash
npm run watch    # Watch mode for TypeScript
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm run build    # Full build
```

Load the `dist/` folder as an unpacked extension in `chrome://extensions/` to test your changes.

## Submitting Changes

1. Ensure your code passes linting: `npm run lint`
2. Ensure your code is formatted: `npm run format:check`
3. Ensure the project builds: `npm run build`
4. Commit your changes with a clear message
5. Push to your fork and open a **Pull Request**

## Code Style

- TypeScript for all source files
- ESLint + Prettier for code quality and formatting
- Keep changes focused and minimal

## Reporting Issues

- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) for bugs
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) for ideas

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
