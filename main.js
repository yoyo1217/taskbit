const { app, BrowserWindow, Menu, ipcMain, Tray } = require("electron");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const DataStore = require("./DataStore");

process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;
// let tray;

const todosData = new DataStore({
  configName: "todoList",
  todoList: [
    {
      id: uuidv4(),
      task: "task 1",
      done: false,
    },
    {
      id: uuidv4(),
      task: "task 2",
      done: false,
    },
    {
      id: uuidv4(),
      task: "task 3",
      done: false,
    },
  ],
});

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "taskbit",
    width: isDev ? 700 : 350,
    height: 500,
    icon: `${__dirname}/assets/icons/task.png`,
    opacity: 0.9,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, "/preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.loadFile("./app/index.html");
}

function main() {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.once("show", () => {
    mainWindow.webContents.send("todos", todosData.get());
  });

  ipcMain.on("add-todo", (e, todo) => {
    const updatedtodos = todosData.addTodo(uuidv4(), todo, false);
    mainWindow.webContents.send("todos", updatedtodos);
  });

  ipcMain.on("delete-todo", (e, id) => {
    const updatedtodos = todosData.deleteTodo(id);
    mainWindow.webContents.send("todos", updatedtodos);
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  main();
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    main();
  }
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "New task",
        accelerator: "CommandOrControl+N",
        click() {
          if (mainWindow !== null) {
            mainWindow.send("item-focus");
          } else {
            main();
          }
        },
      },
      { role: "undo" },
      isMac ? { role: "close" } : { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            {
              role: "reload",
            },
            {
              role: "forcereload",
            },
            {
              type: "separator",
            },
            {
              role: "toggledevtools",
            },
          ],
        },
      ]
    : []),
];

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About taskbit",
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/task.png`,
    resizable: false,
  });

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  aboutWindow.loadFile("./app/about.html");
}
