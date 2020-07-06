const form = document.querySelector("form");
let list = document.querySelector("#todos");

ipcRenderer.on("todos", (e, todos) => {
  const todoItems = todos.reduce((li, todo) => {
    li += `<li id="${todo.id}" class="item" tabindex="0">${todo.task}<i class="fas fa-edit"></i><i class="fas fa-trash"></i></li>`;
    return li;
  }, "");
  list.innerHTML = todoItems;
});

list.addEventListener("click", (e) => {
  if (e.target.className === "fas fa-trash") {
    ipcRenderer.send("delete-todo", e.target.parentNode.id);
  }
});

list.addEventListener("click", (e) => {
  if (e.target.className === "fas fa-edit") {
    const tmpInput = document.createElement("input");
    tmpli = e.target.parentNode;
    e.target.parentNode.replaceWith(tmpInput);
    tmpInput.value = tmpli.textContent;
    tmpInput.addEventListener("keydown", (e2) => {
      const enterKey = 13;
      if (e2.keyCode === enterKey && e2.target.value.length) {
        ipcRenderer.send("add-todo", tmpInput.value);
        ipcRenderer.send("delete-todo", tmpli.id);
      }
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target[0];
  if (input.value.length) {
    ipcRenderer.send("add-todo", input.value);
    input.value = "";
  }
});

ipcRenderer.on("item-focus", () => {
  document.querySelector("#item").focus();
});

//todo shortcut functionn for add todo and delete todo
//todo combine two operation into one function
