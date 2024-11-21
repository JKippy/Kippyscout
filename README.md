# Kippyscout
## How to set up dev environment in MacOS/Linux:
1. Download and install Node 21.7.3 [Node.js](https://nodejs.org/en/download/prebuilt-installer)
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
1. To test Firebase features in your own dev environment, run `firebase emulators:start --project everyscout` to start a local server.
2. If your emulator doesn't work, run `firebase init firestore` to make sure you have Firestore installed on your device.
3. If you get a Java error, install Java JDK 17.
4. This emulator will allow you to test the database/auth/storage functions of the app without having to deploy to the production app.

## Intro to Web Dev with React
### for people who haven't done any of this before:
1. React is a library for building user interfaces with javascript.
2. You can think of `.js` files being "function" and `.css` files being "form."
  - If you want your page to perform a certain action, you would code that in the `.js` file.
  - If you want your page to look a certain way, you usse the `.css` file for that.
3. In this project, you really only need to work in the `src` folder.
  - In the `src` folder, there are sub folders for pages, components, and assets.
      - Pages holds all the pages
      - Components holds everything that mauy be resued across pages e.g., the side bar or login/logout buttons.
      - Assets are where we store pictures or other media.
4. App.js is the main file that defines the structure of the app. If you would want to add a new page, you would define it as a "route" in this file.
