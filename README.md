# Kippyscout
## How to set up dev environment in MacOS/Linux:
1. Download and install the latest version of [Node.js](https://nodejs.org/en/download/prebuilt-installer)
2. Confirm installation of node with `node -v` and `npm -v` in your terminal. You should see the version number of each.
3. Run this command to be able to start a local version of the website `npm install react-scripts --save`
4. Optional: Download [VSCode](https://code.visualstudio.com) to easily manage site development. If you don't want to use this, you can just edit files in a text editor.
5. Clone the repository to your computer manually or through VSCode. Open the project folder.
6. In the terminal or console, run `npm start` to start a local version of the website
7. If the website successfully started, stop the local site and move to a new branch.
  - Do `git branch` to view all available branchs
  - Do `git checkout [branch name]` to move your head to a different branch
  - For best practice, never edit the *main* branch.
8. To build and deploy to firebase run `npm install firebase` and `sudo npm install -g firebase-tools`

## Editing Pages
1. Go to the *src* directory and open the *pages* folder. Here you will see a .js and .css file for each page.
2. Open the .js file for a page to edit content and basic design or open the .css for more advanced page design.

## Firebase
Code should only be built and deployed to the production Firebase project after having been reviewed and merged into the main branch.
1. To test Firebase features in your own dev environment, run `firebase emulators:start` to start a local server.
