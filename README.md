# 🚀 Terminax

Terminax is an intelligent deployment platform that enables developers to automatically build, deploy, and run console or GUI-based applications directly in the browser. With support for multiple programming languages and automatic build system detection, Terminax brings your GitHub repositories to life instantly.
 
## ✨ Overview

Transform your GitHub repositories into live, interactive applications without any configuration. Whether it's a CLI tool or a GUI application, Terminax handles the deployment automatically, providing secure access through your browser.

### 🎯 Key Features

#### 🔐 GitHub Integration

- Secure OAuth authentication
- Access to public and private repositories
- Automatic repository scanning and setup

#### 🧠 Smart Detection

- Automatic language detection (C++, Java, Python, etc.)
- Build system recognition (make, cmake, javac, etc.)
- Application type detection (console vs GUI)

#### ⚡ Auto Build & Deploy

- Automated build process in secure containers
- Support for both terminal and GUI applications
- GUI apps rendered via noVNC/Xvfb
- Terminal apps streamed via xterm.js

#### 🔄 Real-time Features

- Live terminal output streaming
- Interactive GUI applications
- Embedded terminal/GUI support
- Automatic redeployment on code push

#### 🛡️ Security

- Sandboxed execution environment
- Resource-limited containers
- Secure access controls
- Automatic timeout management

## 🚦 Getting Started

### Quick Start

1. Login with GitHub
2. Select a repository
3. Let Terminax analyze and deploy your application
4. Access your app via the provided URL

### Usage Examples

#### 💻 Terminal Output Streaming

```bash
# Stream any command output
$ ./my-app | terminax stream

# Show on both stdout and Terminax
$ python train.py | tee >(terminax)

# Include stderr
$ npm install 2>&1 | terminax
```

#### 🔌 Embedding

```html
<!-- Embed in your website -->
<iframe src="https://terminax.io/embed/{url}" width="100%" height="400"> </iframe>
```

#### 🛠️ Supported Build Systems

```bash
# C++ with CMake
cmake && make && ./app

# Java with Maven
mvn package && java -jar target/app.jar

# Python with Poetry
poetry install && poetry run python main.py

# Node.js with npm
npm install && npm start
```

### 🎨 Supported Application Types

#### Terminal Applications

- Command-line tools
- REPL environments
- Build tools and compilers
- Data processing scripts

#### GUI Applications

- Java Swing/JavaFX apps
- Python Tkinter/PyQt
- Electron applications
- X11-based applications

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
