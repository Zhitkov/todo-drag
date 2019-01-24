/*
Необходимо реализовать простейший todoList.
Каждая задача состоит только из текста и значения выполнена/не выполнена.
Выполненная задача удаляется с анимацией.
При закрытии браузера список сохраняется с использованием IndexDB.
Можно менять порядок задач через drag and drop.
*/




const task = document.querySelector('task');
var count = new Boolean(false);

function addTask() {
	let newTask = task.cloneNode(true);
	document.querySelector(".board").appendChild(newTask);
	newTask.className = newTask.className + " show";
}

function notDone(notDoneButton) {
	let currentTask = notDoneButton.parentElement.parentElement;
	setTimeout(function() {
		currentTask.remove()
	}, 500);
	currentTask.className = currentTask.className + " not_done ";
}

function done(doneButton) {
	let currentTask = doneButton.parentElement.parentElement;
	setTimeout(function() {
		currentTask.remove()
	}, 500);
	currentTask.className = currentTask.className + " done ";
}
