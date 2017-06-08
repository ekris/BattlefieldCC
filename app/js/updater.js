let appUpdate = document.getElementById('app-update')
let appQI = document.getElementById('app-quit-install')
let dlProgress = document.getElementById('dl-progress')

appUpdate.addEventListener('click', () => {
	ipc.send('app-update')
})

appQI.addEventListener('click', () => {
	ipc.send('app-quit-install')
})

ipcRenderer.on('dl-message', (event, message) => {
	dlProgress.innerHTML = message
})
