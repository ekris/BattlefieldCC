let closeWindow = document.querySelector('#close-window')
let minWindow = document.querySelector('#minimize-window')

closeWindow.addEventListener('click', () => {
	ipc.send('close-window')
})

minWindow.addEventListener('click', () => {
	ipc.send('minimize-window')
})
