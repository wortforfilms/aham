const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("mahavisphotDesktop", {
  runtime: "electron",
  shell: "standalone",
});
