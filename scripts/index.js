import { btnsPlus, tasksHighBlock, tasksLowBlock } from './view.js';

const ToDoList = [];

for (let i = 0; i < btnsPlus.length; i++) {
    btnsPlus[i].addEventListener('click', (e) => addTask(e));
}

function addTask(e) {
    e.preventDefault();

    const input = e.srcElement.previousElementSibling;
    const data = getData(input);

    if(data){
        ToDoList.push(data);
    }

    input.value = '';

    render(ToDoList);
}

function getData(input){
    const value = input.value.trim();
    const isValidValue = (value !== '' && value.length <= 30);

    if(isValidValue){
        const idList = ToDoList.map(item => item.id);
        let uniqueId = getUniqueRandomIdInRange(1, 100, idList);

        return {
            id: uniqueId,
            name: value,
            priority: input.name,
            isChecked: false,
        }
    }
    return undefined;
}

function getUniqueRandomIdInRange(minId, maxId, existId) {
    let randomNumberInRange = Math.floor(Math.random() * (maxId - minId) + minId);
    return existId.includes(randomNumberInRange) ? getUniqueRandomIdInRange(minId, maxId, existId) : randomNumberInRange;
}

function deleteTask(e) {
    const parent = e.target.parentNode;
    const taskId = Number(parent.firstElementChild.id);

    let index = ToDoList.findIndex((item) => item.id === taskId);

    if (index !== -1) {
        ToDoList.splice(index, 1)
    };

    parent.remove();
}

function changeTaskStatus(e){
    const wrapper = e.target.closest('.task__wrapper');
    const taskId = Number(wrapper.children[0].id);
    const isTaskChecked = wrapper.classList.contains('task__checked');

    if(isTaskChecked){
        wrapper.classList.remove('task__checked');
        changeTaskChecked(taskId);
    } else {
        wrapper.classList.add('task__checked');
        changeTaskChecked(taskId);
    }
}

function changeTaskChecked(id) {
    for (const item of ToDoList) {
        if(item.id === id) {
            item.isChecked ? item.isChecked = false : item.isChecked = true;
        }
    }
}

function render(list){
    tasksHighBlock.innerHTML = '';
    tasksLowBlock.innerHTML = '';

    for(let i = 0; i < list.length; i++) {
        let task = list[i];
        const element = createElement(task);

        switch (task.priority) {
            case 'high':
                tasksHighBlock.append(element);
                break;
            case 'low':
                tasksLowBlock.append(element);
                break;
            default:
                break;
        }
    }
}

function createElement(task){
    let div = document.createElement('div');
    div.classList.add("task__wrapper");

    if(task.isChecked){
        div.classList.add("task__checked");
    }

    div.innerHTML = `
        <input class="task__checkbox-custom" type="checkbox" id="${task.id}" ${task.isChecked && 'checked'}/>
        <label class="task__description" for="${task.id}">${task.name}</label>
        <div class="btn btn__close"></div>
    `;

    
    let btnClose = div.querySelector('.btn__close');
    let taskDescription = div.querySelector('.task__description');

    btnClose.addEventListener('click', (e) => deleteTask(e));
    taskDescription.addEventListener('click', (e) => changeTaskStatus(e));
    
    return div;
}