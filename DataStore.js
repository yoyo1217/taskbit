const electron = require("electron");
const path = require("path");
const fs = require("fs");

class Store {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );
    this.todoList = [];
    this.path = path.join(userDataPath, options.configName + ".txt");
    this.todoList = parseDataFile(this.path, options.todoList);
  }

  get() {
    return this.todoList;
  }

  save(todoList) {
    fs.writeFileSync(this.path, JSON.stringify(todoList, null, 2), "utf-8");
    return this.todoList;
  }

  addTodo(id, task, done) {
    const newObject = new Object();
    newObject.id = id;
    newObject.task = task;
    newObject.done = done;
    this.todoList.push(newObject);
    return this.save(this.todoList);
  }

  deleteTodo(id) {
    this.todoList = this.todoList.filter((d) => d.id !== id);
    return this.save(this.todoList);
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return defaults;
  }
}

module.exports = Store;
