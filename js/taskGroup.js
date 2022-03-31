class taskGroup {
    constructor(taskGroupName) {
        this.taskGroupName = taskGroupName;
        this.tasks = [];
    }

    addTask(taskName) {
        this.tasks.push({ name: taskName, completed: false });
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
    }

    completeTask(index) {
        let completed = this.tasks[index].completed;

        if (completed) {
            this.tasks[index].completed = false;
        } else {
            this.tasks[index].completed = true;
        }
    }

    taskChangeStatus(index) {
        const target = this.tasks[index].completed;
        if (target) {
            target = false;
        } else {
            target = true;
        }
    }

    setTasks(arrayTasks) {
        this.tasks = arrayTasks;
    }
}