const panel1 = createPanel("explorer1", window.init.cwd);
const panel2 = createPanel("explorer2", window.init.cwd);

initEvents(panel1);
setCwd(panel1, window.init.cwd);

initEvents(panel2);
setCwd(panel2, window.init.cwd);

createImages();
