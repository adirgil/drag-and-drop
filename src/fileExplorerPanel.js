async function setCwd(panel, newPath) {
  panel.cwd = newPath;
  panel.files = await getFiles(panel.cwd);
  await updateView(panel);
}

async function getFiles(cwd) {
  const files = await window.api.getFiles(cwd);
  return files;
}

async function updateView(panel) {
  const dirName = document.querySelector(`#${panel.id} .dir-name`);
  dirName.innerText = panel.cwd;
  panel.files.sort((a, b) => {
    return a[panel.sortKey] < b[panel.sortKey] ? -1 : 1;
  });
  createList(panel);
}

function initEvents(panel) {
  document.querySelector(`#${panel.id} .up-dir`).onclick = function () {
    const path = panel.cwd.split("\\");
    const newPath = path.slice(0, path.length - 1).join("\\");
    setCwd(panel, newPath);
  };
  const dirNameElement = document.querySelector(`#${panel.id} .dir-name`);
  createDropEvent(dirNameElement, panel);
  const filesElement = document.querySelector(`#${panel.id} .files-section`);
  createDropEvent(filesElement, panel);
  document.querySelector(`#${panel.id} .sort`).onchange = function (e) {
    const sortKey = e.target.value;
    panel.sortKey = sortKey;
    updateView(panel);
  };
}

async function createDropEvent(element, panel) {
  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  element.addEventListener("drop", async (e) => {
    await dropHandler(e, panel);
  });
}

async function dropHandler(e, panel) {
  e.stopPropagation();
  e.preventDefault();
  const { fromPanel, fileName } = JSON.parse(
    e.dataTransfer.getData("draggedItem")
  );
  const draggedItemPath = `${fromPanel.cwd}\\${fileName}`;
  const droppedItem = e.target;
  const fileType = droppedItem.getAttribute("type");
  let droppedPath = panel.cwd;
  if (fileType === "folder") {
    droppedPath = `${panel.cwd}\\${droppedItem.innerText}`;
  } else if (fileType === "file") {
    //if we drag file to file in the same panel, we want nothing to happen.
    if (panel.id === fromPanel.id) return;
  }
  if (fromPanel.cwd === droppedPath && panel.id === fromPanel.id) {
    return;
  }

  displayModal(`Copying...${draggedItemPath} To ${droppedPath}`);
  const res = await window.api.copyItem(draggedItemPath, droppedPath);
  removeModal();
  if (res === "success") {
    panel.files = await getFiles(panel.cwd);
    updateView(panel);
  } else {
    displayModal("oops!! file or folder is already exists", true);
  }
}

function handleDrag(e, panel) {
  e.dataTransfer.clearData();
  if (e.target.innerText) {
    e.dataTransfer.setData(
      "draggedItem",
      JSON.stringify({ fromPanel: panel, fileName: e.target.innerText })
    );
  }
}

function createList(panel) {
  let list = document.createElement("ul");

  panel.files.forEach((file) => {
    const { fileName, type } = file;
    let item = document.createElement("li");
    item.type = type;
    item.draggable = true;
    appendIconToFile(item, type);
    item.addEventListener("dragstart", (e) => {
      handleDrag(e, panel);
    });

    if (type === "folder") {
      item.ondblclick = function () {
        const newPath = `${panel.cwd}\\${fileName}`;
        setCwd(panel, newPath);
      };
    }
    item.appendChild(document.createTextNode(fileName));
    list.appendChild(item);
  });

  const filesElement = document.querySelector(`#${panel.id} .files-section`);
  filesElement.innerHTML = "";
  filesElement.appendChild(list);
}

function removeModal() {
  document.getElementsByClassName("modal")[0].remove();
}

function displayModal(message, addCloseBtn) {
  const body = document.getElementsByTagName("body")[0];
  const modal = document.createElement("div");
  modal.className = "modal";
  const messageBox = document.createElement("div");
  messageBox.className = "message-box";
  const messageDiv = document.createElement("div");
  messageDiv.innerText = message;
  messageBox.appendChild(messageDiv);
  if (addCloseBtn) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerText = "Close";
    closeBtn.onclick = function () {
      removeModal();
    };
    messageBox.appendChild(closeBtn);
  }
  modal.appendChild(messageBox);
  body.appendChild(modal);
}

function appendIconToFile(item, type) {
  const img = document.createElement("img");
  img.setAttribute("draggable", false);
  img.setAttribute("type", type);
  if (type === "folder") {
    img.src = "./assets/folder.png";
  } else {
    img.src = "./assets/file.png";
  }
  item.appendChild(img);
}

createPanel = function (id, cwd) {
  return {
    id,
    cwd,
    files: [],
    sortKey: "fileName",
  };
};
