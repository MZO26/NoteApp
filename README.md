# NoteApp

A note-taking desktop application built with Electron and JavaScript.
It offers the ability to create simple notes as well as to-do lists.
You can create, view, and manage your notes and tasks on your desktop, offline or online.

## Motivation

This project was created as a personal challenge to build a functional note-taking application using only JavaScript that runs entirely in the browser. It helped me improve my JavaScript skills and practice frontend development principles. The application is perfect for users who want quick access to their notes / to-do's with minimal setup.

## Features

- Create, edit, and delete notes / to-do's in the browser
- Responsive design for desktop and mobile use
- Uses Bootstrap Icons for UI enhancements
- Data saved locally in the browser (localStorage/sessionStorage)
- Electron App with minimalistic user interface
- Cross-platform support (Windows, macOs, Linux (needs to be configured))

## Installation

1. Ensure [Node.js](https://nodejs.org/) is installed on your machine.

2. Clone the repository: git clone https://github.com/Mewtu26/project.git

3. Open your terminal and navigate to the project’s root directory.

4. Install dependencies: Install the project dependencies with: npm install

5. Run the App in development mode: Start the Electron app locally by running: npm start
   Type rs in the console to reload for developing and testing

6. Build the app for distribution: Package and create installers for the app with: npm run make
   This command uses the build configuration (in this case Electron Forge) and outputs platform-specific installers in the `out/` directory

7. Replace `https://github.com/Mewtu26/project.git` with your repository URL and adjust scripts if customized.

## License

This project is licensed under the MIT License.  
Electron and Bootstrap Icons included are also licensed under the MIT License. See `NOTICE.txt` for details.

## Contact

For questions or feedback, please open an issue in this repository.
