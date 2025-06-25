# Terminax

A modern hosting platform for terminal-based applications that enables developers to deploy, share, and run CLI apps directly in the browser.

## Overview

Terminax transforms your command-line applications into shareable web experiences. Connect your GitHub repository, specify your run command, and get a live-streaming terminal URL instantly.

### Key Features

- **GitHub Integration**: One-click deployment from repositories
- **Live Terminal Streaming**: Real-time terminal output in browser
- **Instant URLs**: Get shareable links immediately after deployment
- **QR Code Sharing**: Easy mobile sharing with auto-generated QR codes
- **Easy Embedding**: Embed terminals into websites with iframe
- **Lightning Fast**: Deploy in seconds with optimised infrastructure
- **Multiple Languages**: Java, C++, C, JavaScript (Python, Go, Rust coming soon)

## Getting Started


### Usage

1. **Connect GitHub**: Login and authorize Terminax
2. **Select Repository**: Choose your CLI application repository
3. **Configure Build**: Specify run command (e.g., `javac Main.java && java Main`)
4. **Deploy**: Get your live terminal URL
5. **Share**: Use the generated URL(customise it) or QR code

### Example Commands

# Java
javac HelloWorld.java && java HelloWorld

# C++
g++ -o app main.cpp && ./app

# C
gcc -o app main.c && ./app

# JavaScript
node index.js

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
