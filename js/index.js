class MytodoApp {
    constructor() {
        this.addTaskBtn = document.querySelector('#add-task');
        this.modal = document.getElementById("myModal");
        this.span = document.getElementsByClassName("close")[0];
        this.addBtn = document.getElementById('btn-add-task');
        this.addInput = document.getElementById('input-task');
        this.currentDate = document.getElementById('due-date--input');
        // this.today = new Date();

        // SECTION Initial test data

        this.itemsList = [];

        // SECTION Initialisation

        this._init();

        // SECTION Event listeners

        // 'Today' as default on date picker
        // currentDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // When user presses Esc key, exit modal
        document.addEventListener('keydown', this._EchapModal.bind(this));
        // When the user clicks on <span> (x), close the modal
        this.span.addEventListener('click', this._hideModal.bind(this));
        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener('click', this._clickOutsideModalClose.bind(this));

        // Add new task
        this.addTaskBtn.addEventListener('click', this._showModal.bind(this));
        this.addInput.addEventListener('keydown', this._createTask.bind(this));
        this.addBtn.addEventListener('click', this._addNewTask.bind(this));

        // SECTION Background on demand

        // Event delegation (to prevent repeating the listener function for each element)
        document.querySelector('#time-of-day').addEventListener('click', this._checkForSetBackground.bind(this));
    }

    _checkForSetBackground(e) {
        // change background color with input radio very simple
            this._setBackground(e.target.value);
    }

    _EchapModal(e) {
        // close modal with some key in your Computer very simple like Escape and Delete
        if (e.key === 'Escape' || e.key === 'Delete')
            this.modal.style.display = "none";
    }

    _clickOutsideModalClose(e) {
        // so what does this mean very simple when user click Outside Modal like click into background they will display modal
        if (e.target === this.modal)
            this.modal.style.display = "none";
    }

    _showModal() {
        // so this does mean is when user click  into show modal 
        this.modal.style.display = "block";
        document.getElementById('input-task').focus();
    }

    _hideModal() {
        // and this mean is when user click into tag span they will close modal
        this.modal.style.display = "none";
    }

    _createTask(e) {
        //  and this is when user click Enter or Alt key the will be tasks very simple
        if (e.key === 'Enter' || e.key === 'Alt')
            this._addNewTask();
    }
//   and this is mean how to change color of background
//  automatic and you can change that with click into input radio
    _setBackground(method) {
        let currentHour = 0; // Default value
// so what does this is mean so when 
// you are going to click into input 
// radio you will see background of body are change
        if (method === 'automatic') {
            currentHour = new Date().getHours();
        } else if (method === 'morning') {
            currentHour = 7;
        } else if (method === 'afternoon') {
            currentHour = 12;
        } else if(method === 'evening'){
            currentHour = 17
        } else if (method === 'night') {
            currentHour = 20;
        }

        const background = document.querySelector('body');
        background.className = ""; // Remove all properties

        if (currentHour >= 5 && currentHour < 12) {
            // Morning
            background.classList.add('background-morning');
            document.querySelector('#morning').checked = true;

        } else if (currentHour >= 12 && currentHour < 17) {
            // Afternoon
            background.classList.add('background-afternoon');
            document.querySelector('#afternoon').checked = true;

        } else if(currentHour >= 17 && currentHour <= 19){
            // Evening
               background.classList.add('background-evening');
               document.querySelector('#evening').checked = true;
        } else {
            // Night
            if (method !== 'manual') {
                background.classList.add('background-night');
                document.querySelector('#night').checked = true;
            }
        }
    }



    _displayTasks() {
        const list = document.getElementById('todo--tasks-list--items-list');
        // Clear list
        const li = document.querySelectorAll('li');
        li.forEach(element => {
            element.remove();
        })

        // Get items from local storage
        this._getLocalStorage();

        // Display list
        this.itemsList.reverse().forEach((_, i) => {
            list.insertAdjacentHTML('afterbegin', `<li class="todo--tasks-list--item">
            <div class="todo--tasks-list--item--description"><p class="text-content">${this.itemsList[i].task}<p></div>
            <div class="todo--tasks-list--item--due-date">
            <div class="due-date-bubble" style="padding: 2px;">${this.itemsList[i].dueDate}</div>
            <div class="delete-task">
            <img src="./img/bin.png" alt="" width="16px" height="16px"/>
            </div>
        </li>`);
        });
        this.itemsList.reverse();


        // Delete buttons
        this._updateDeleteButtons();
    }

    _updateDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.delete-task');
        // deleteButtons.forEach((button) => {
        //     button.removeEventListener('click', () => {});
        // });
        deleteButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
            
                this.itemsList.splice(i, 1);
            // and delete content from localStorage  
                this._setLocalStorage();
             //    delete content inside todo App 
                this._displayTasks();
            });
        });
    }

    _addNewTask() {
        const newTask = {};
        const inputTask = document.getElementById('input-task');
        
        if (inputTask.value !== '') {
            newTask.task = inputTask.value;
            const dueDate = document.getElementById('due-date--input').value;
            if (dueDate !== '') {
                const dueDateArr = dueDate.split('-');
                newTask.dueDate = `${dueDateArr[2]}/${dueDateArr[1]}/${dueDateArr[0]}`;
            }
            newTask.completed = true;
            this.itemsList.unshift(newTask);

            this._setLocalStorage();

            this._displayTasks();

            this.modal.style.display = "none";
            inputTask.value = '';

        } else {
            inputTask.style.border = '1px solid red';
            inputTask.focus();
            setTimeout(() => inputTask.style.border = '1px solid #c9c9c9', 500);
        }
    }


    _setHeaderDate() {
        const locale = navigator.language;

        const dateOptionsDay = {
            weekday: 'long',
        }
        const dateOptionsDate = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
        const day = new Intl.DateTimeFormat(locale, dateOptionsDay).format(new Date());
        const date = new Intl.DateTimeFormat(locale, dateOptionsDate).format(new Date());
        document.querySelector('#todo--header--today').textContent = day;
        document.querySelector('#todo--header--date').textContent = date;
    }

    _setLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.itemsList));
    }

    _getLocalStorage() {

        const data = JSON.parse(localStorage.getItem('tasks'));

        if (!data) return;

        this.itemsList = data;
    }

    _init() {

        this._setBackground('automatic');
        setInterval(()=>{
            this._setBackground('automatic');
        },5000)
        this._displayTasks();
        setInterval(()=>{
            this._setHeaderDate();
        },500)
    }
}

const app = new MytodoApp();

// some animation on scroll bar very simple just 

const animation = ScrollReveal({
    origin:'top',
    distance:'60px',
    duration:2500,
    delay:500,
})

animation.reveal('#time-of-day');
animation.reveal('.todo',{delay:500});
animation.reveal('.fotter',{delay:600});
animation.reveal('.My-picture',{interval:500,delay:900});
animation.reveal('#todo--header--today',{interval:300,delay:700});
animation.reveal('#todo--header--date',{interval:200,delay:600});

