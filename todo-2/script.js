

var todoDB = (function() {
  var tDB = {};
  var datastore = null;


  tDB.open = function(callback) {
    var version = 1;

    var request = indexedDB.open('todos', version);

    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      if (db.objectStoreNames.contains('todo')) {
        db.deleteObjectStore('todo');
      }

      var store = db.createObjectStore('todo', {
        keyPath: 'timestamp'
      });
    };

    request.onsuccess = function(e) {
      datastore = e.target.result;
      
      callback();
    };

    request.onerror = tDB.onerror;
  };


  tDB.fetchTodos = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var todos = [];

    transaction.oncomplete = function(e) {
      callback(todos);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      todos.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  };

  tDB.createTodo = function(text, callback) {
    var db = datastore;

    var transaction = db.transaction(['todo'], 'readwrite');

    var objStore = transaction.objectStore('todo');

    var timestamp = new Date().getTime();

    var todo = {
      'text': text,
      'timestamp': timestamp
    };

    var request = objStore.put(todo);

    request.onsuccess = function(e) {
      callback(todo);
    };

    request.onerror = tDB.onerror;
  };

  tDB.putTodo = function(text, id, callback) {
    var db = datastore;

    var transaction = db.transaction(['todo'], 'readwrite');

    var objStore = transaction.objectStore('todo');

    var todo = {
      'text': text,
      'timestamp': id
    };


    var request = objStore.put(todo);

    request.onsuccess = function(e) {
      callback(todo);
    };

    request.onerror = tDB.onerror;
  };

  tDB.deleteTodo = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  return tDB;
}());




window.onload = function() {
  
  todoDB.open(refreshTodos);
  
  
  var newTodoForm = document.getElementById('new-todo-form');
  var newTodoInput = document.getElementById('new-todo');
  
  
  newTodoForm.onsubmit = function() {
    var text = newTodoInput.value;
    
    if (text.replace(/ /g,'') != '') {
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    newTodoInput.value = '';
    
    return false;
  };
  
}

function refreshTodos() {  

  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {
      var todo = todos[(todos.length - 1 - i)];

      var li = document.createElement('li');
          li.draggable = true;
          addEventsDragAndDrop(li);
          li.setAttribute("data-id", todo.timestamp);
      var done = document.createElement('button');
          done.textContent="Выполнено";
      li.appendChild(done);
      var undone = document.createElement('button');
          undone.textContent="Не Выполнено";
          undone.setAttribute("data-id", todo.timestamp);
      li.appendChild(undone);
      var span = document.createElement('span');
          span.textContent = todo.text;
      li.appendChild(span);
      

      todoList.appendChild(li);
       
      done.addEventListener('click', function(e) {
        let currentTask = e.target.parentElement;
        var id = parseInt(currentTask.getAttribute('data-id'));
        currentTask.className += " done ";
        setTimeout(function(){todoDB.deleteTodo(id, refreshTodos)}, 400);
        // todoDB.deleteTodo(id, refreshTodos);
      });

      undone.addEventListener('click', function(e) {
        let currentTask = e.target.parentElement;
        var id = parseInt(currentTask.getAttribute('data-id'));
        currentTask.className += " not_done ";
        setTimeout(function(){todoDB.deleteTodo(id, refreshTodos)}, 400);
        // todoDB.deleteTodo(id, refreshTodos);
      });
    }


  });
}



   function dragStart(e) {
      this.style.opacity = '0.4';
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    };

    function dragEnter(e) {
      this.classList.add('over');
    }

    function dragLeave(e) {
      e.stopPropagation();
      this.classList.remove('over');

    }

    function dragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      return false;
    }


    function dragDrop(e) {

      console.log(dragSrcEl , 'dragSrcEl');
      console.log(this, 'this');
      if (dragSrcEl != this) {
        todoDB.putTodo(e.target.lastChild.textContent, 
                        parseInt(dragSrcEl.getAttribute('data-id')),
                        function(todo) {
                          refreshTodos();
                        });
        todoDB.putTodo(dragSrcEl.lastChild.textContent, 
          parseInt(e.target.getAttribute('data-id')),
                        function(todo) {
                          refreshTodos();
                        });
      }
      return false;

    }

    function dragEnd(e) {
      var listItems = document.querySelectorAll('li');
      [].forEach.call(listItems, function(item) {
        item.classList.remove('over');
      });
      this.style.opacity = '1';
    }


    function addEventsDragAndDrop(el) {
      el.addEventListener('dragstart', dragStart, false);
      el.addEventListener('dragenter', dragEnter, false);
      el.addEventListener('dragover', dragOver, false);
      el.addEventListener('dragleave', dragLeave, false);
      el.addEventListener('drop', dragDrop, false);
      el.addEventListener('dragend', dragEnd, false);
}