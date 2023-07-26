const { app, nativeImage, Tray, Menu, shell } = require("electron");
const Store = require("electron-store");
const AutoLaunch = require("auto-launch");
const { is } = require("electron-util");

const autolaunch = new AutoLaunch({
  name: "Gap",
  path: "/Applications/Gap.app",
});

const store = new Store();

const config = store.get("gap-config") || {
  license: null,
  email: null,
  autolaunch: true,
};

let trays = store.get("gap-trays") || [
  {
    id: Math.random() * 3,
    type: " | ",
  },
];
console.log("====================================");
console.log(trays);
console.log("====================================");
/**
 * [] licence check with email
 * [ ✅ ] save the number of trays and their config
 * [] auto launch on startup
 *
 */

const createTrayIcon = (trayConfig) => {
  const tray = new Tray(nativeImage.createEmpty());
  tray.setTitle(trayConfig.type);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "New Gap",
      click: () => {
        let newTray = { id: Math.random() * 3, type: " | " };
        trays.push(newTray);
        createTrayIcon(newTray);
        store.set("gap-trays", trays);
      },
    },
    {
      label: "Remove",
      click: () => {
        if (trays.length > 1) {
          let trayItems = trays.filter((t) => t.id !== trayConfig.id);
          trays = trayItems;
          console.log(trayItems);
          store.set("gap-trays", trayItems);
          tray.destroy();
        }
      },
    },
    {
      type: "separator",
    },
    {
      label: "Gap type",
      enabled: false,
    },
    {
      label: "space",
      click: () => {
        tray.setTitle("   ");
        let trayItems = trays.map((t) => {
          if (t.id === trayConfig.id) {
            return { ...t, type: "   " };
          }
          return t;
        });
        console.log(trayItems);
        store.set("gap-trays", trayItems);
      },
    },
    {
      label: "|",
      click: () => {
        tray.setTitle(" | ");
        let trayItems = trays.map((t) => {
          if (t.id === trayConfig.id) {
            return { ...t, type: " | " };
          }
          return t;
        });
        console.log(trayItems);
        store.set("gap-trays", trayItems);
      },
    },
    {
      label: "-",
      click: () => {
        tray.setTitle(" - ");
        let trayItems = trays.map((t) => {
          if (t.id === trayConfig.id) {
            return { ...t, type: " - " };
          }
          return t;
        });
        console.log(trayItems);
        store.set("gap-trays", trayItems);
      },
    },
    {
      label: "Tab",
      click: () => {
        tray.setTitle("      ");
        let trayItems = trays.map((t) => {
          if (t.id === trayConfig.id) {
            return { ...t, type: "      " };
          }
          return t;
        });
        console.log(trayItems);
        store.set("gap-trays", trayItems);
      },
    },
    {
      label: "⏤",
      click: () => {
        tray.setTitle(" ⏤ ");
        let trayItems = trays.map((t) => {
          if (t.id === trayConfig.id) {
            return { ...t, type: " ⏤ " };
          }
          return t;
        });
        console.log(trayItems);
        store.set("gap-trays", trayItems);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Auto launch",
      type: "checkbox",
      checked: true,
      click: () => {
        if (config.autolaunch) {
          autolaunch.enable();
        } else {
          autolaunch.disable();
        }
        store.set("gap-config", {
          ...config,
          autolaunch: !config.autolaunch,
        });
      },
    },
    {
      role: "quit",
    },
  ]);
  tray.setContextMenu(contextMenu);
};

app.whenReady().then(() => {
  app.dock && app.dock.hide();
  shell.beep();
  if (config.autolaunch && !is.development) {
    autolaunch.enable();
  }
  trays.map((tray) => {
    createTrayIcon(tray);
  });
});
