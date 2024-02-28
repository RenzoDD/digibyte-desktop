require('./modules/port');

const { app, BrowserWindow, shell } = require('electron');
let myWindow = null;

// Only one instance
if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit();
}

app.on('second-instance', (event, commandLine, workingDirectory) => {
	if (myWindow) {
		if (myWindow.isMinimized()) myWindow.restore()
		myWindow.focus()
	}
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit()
})

app.whenReady().then(() => {
	myWindow = new BrowserWindow({
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			contextIsolation: false
		},
		icon: __dirname + "\\app\\img\\icons\\icon.png",
		autoHideMenuBar: true,
		maximizable: true,
		resizable: true,
		show: false,
		minWidth: 1080,
		minHeight: 720
	})

	myWindow.loadFile(__dirname + '/app/index.html');
	myWindow.webContents.once('did-finish-load', function () {
		myWindow.show();
		myWindow.maximize();
	});

	myWindow.webContents.on('will-navigate', function (event, url) {
		console.log(url)
		event.preventDefault();
		shell.openExternal(url);
	});
});