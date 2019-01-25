// /*
// Необходимо реализовать простейший todoList.
// Каждая задача состоит только из текста и значения выполнена/не выполнена.
// Выполненная задача удаляется с анимацией.
// При закрытии браузера список сохраняется с использованием IndexDB.
// Можно менять порядок задач через drag and drop.
// */




const task = document.querySelector('task');
const board = document.querySelector('.board');
var count = new Boolean(false);
    board.innerHTML = localStorage.getItem('storeList');

function addTask() {
	let newTask = task.cloneNode(true);
	board.appendChild(newTask);
	newTask.className = newTask.className + " show";
   	
    var listTasks = document.querySelectorAll('task');
      [].forEach.call(listTasks, function(item) {
        addEventsDragAndDrop(item);
      });
}

function notDone(notDoneButton) {
	let currentTask = notDoneButton.parentElement.parentElement;
	setTimeout(function() {
		currentTask.remove();
	}, 500);
	currentTask.className = currentTask.className + " not_done ";
}

function saveList(argument) {
    return localStorage.setItem('storeList', board.innerHTML);
}

function done(doneButton) {
	let currentTask = doneButton.parentElement.parentElement;
	setTimeout(function() {
		currentTask.remove();
	}, 500);
	currentTask.className = currentTask.className + " done ";
}







