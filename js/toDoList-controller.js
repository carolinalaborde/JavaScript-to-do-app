//Store data in local storage
//create object with 2 arrays 
var data = (localStorage.getItem('todolist')) ? JSON.parse(localStorage.getItem('todolist')):{
	todo: [],
	completed: []
};

console.log(JSON.parse(localStorage.getItem('todolist')));

renderTodoList();

var newTask = document.getElementById("new-task");
var btnAdd = document.getElementById("btn-add");
var tasksList = document.getElementById("uncompleted-tasks");
var title = document.getElementById("header-title");

title.addEventListener("click", function () {
	makeInputEditable(title);
});

title.addEventListener("keyup", function(event) {
	finishEditingInput (title, event);
});

function makeInputEditable(input) {
	input.readOnly = false;
	input.classList.add("edit-enable");
	input.select();
}

function finishEditingInput (input, event) {
	if (event.keyCode == 13) {
		input.readOnly = true;
		input.classList.remove("edit-enable");
		document.getSelection().removeAllRanges();
	}
}

document.getElementById('container').onclick = function(e) {
    var editableInputs = document.getElementsByClassName('edit-enable');
    if(e.target.className != 'edit-enable') {
    	for (var i = editableInputs.length - 1; i > -1; i--) {
    		editableInputs[i].readOnly = true;
			editableInputs[i].classList.remove("edit-enable");
		}         
    }
}

btnAdd.addEventListener("click", function() {
	var task = newTask.value;
	if (task) {
		addNewTask(task);
		//Reset textbox content
		newTask.value = '';
		//Add new task to object
		data.todo.push(task);
		storeData();
	}
});

newTask.addEventListener("keyup", function(event) {
	//check if user actually entered a text
	var task = newTask.value;
	event.preventDefault();

	if (event.keyCode == 13) {
		//btnAdd.click();
		if (task) {
			addNewTask(task);
			//Reset textbox content
			newTask.value = '';
			data.todo.push(task);
			storeData();
		}
	}	
});

//innerHTML = allows html + text to be introduced
//innerText = allows just text

function addNewTask(task, completed) {
	//Create items 
	var list = (completed) ? document.getElementById("completed-tasks"):document.getElementById("uncompleted-tasks");

	var item = document.createElement("li");
	item.classList.add("in-style");

	var input = document.createElement("input");
	input.setAttribute('value', task);
	input.setAttribute('type', 'text');
	input.readOnly = true;
	input.addEventListener("click", function () {
		makeInputEditable(input);
	});
	input.addEventListener("keyup", function(event) {
		finishEditingInput (input, event);
	})

	item.appendChild(input);

	var buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("buttons");

	var removeButton = document.createElement("button");
	var removeIcon = document.createElement("span");
	removeButton.innerHTML = "<span class='glyphicon glyphicon-trash'></span>";
	removeButton.addEventListener("click", removeTask);

	var checkButton = document.createElement("button");
	checkButton.innerHTML = "<span class='glyphicon glyphicon-ok-circle'></span>";
	checkButton.addEventListener("click", markTaskAsChecked);

	//innerHTML = removes all content inside the element and inserts the new one
	//appendChild = adds a node to the parent element
	buttonsContainer.appendChild(removeButton);
	buttonsContainer.appendChild(checkButton);
	item.appendChild(buttonsContainer);
	//it will insert the last item created on the top of the list
	list.insertBefore(item, list.childNodes[0]);
}

function removeTask() {
	var itemToBeRemoved = this.parentNode.parentNode;
	var parent = itemToBeRemoved.parentNode;
	parent.removeChild(itemToBeRemoved);
	var parentID = parent.id;
	var value = itemToBeRemoved.childNodes[0].value;

	if (parentID === "uncompleted-tasks") {
		data.todo.splice(data.todo.indexOf(value),1);
	} else {
		data.completed.splice(data.todo.indexOf(value),1);
	}

	storeData();
}

function markTaskAsChecked() {
	var itemToBeRemoved = this.parentNode.parentNode;
	var parent = itemToBeRemoved.parentNode;
	var parentID = parent.id;
	var value = itemToBeRemoved.childNodes[0].value;
	
	//change check icon 
	this.childNodes[0].classList.remove("glyphicon-ok-circle");
	this.childNodes[0].classList.add("glyphicon-ok-sign");

	if (parentID === "uncompleted-tasks") {
		data.todo.splice(data.todo.indexOf(value),1);
		data.completed.push(value);
		this.childNodes[0].classList.remove("glyphicon-ok-circle");
		this.childNodes[0].classList.add("glyphicon-ok-sign");
	} else {
		this.childNodes[0].classList.remove("glyphicon-ok-sign");
		this.childNodes[0].classList.add("glyphicon-ok-circle");
		data.completed.splice(data.todo.indexOf(value),1);
		data.todo.push(value);
	}

	storeData();

	//Define target = where to move the task wether it's completed or needs to be re-done
	var target = (parentID === "uncompleted-tasks") ? document.getElementById("completed-tasks"):document.getElementById("uncompleted-tasks");

	parent.removeChild(itemToBeRemoved);
	target.insertBefore(itemToBeRemoved, target.childNodes[0]);
}

function renderTodoList(){
	if(!data.todo.length && !data.completed.length) return;

	for (var i = 0; i < data.todo.length; i++) {
		var value = data.todo[i];
		addNewTask(value);
	}

	for (var j = 0; j < data.completed.length; j++) {
		var value = data.completed[j];
		addNewTask(value, true);
	}
}

function storeData() {
	//console.log(JSON.stringify(data));
	localStorage.setItem('todolist', JSON.stringify(data));
}