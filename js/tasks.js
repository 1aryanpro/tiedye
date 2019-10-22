class Task {
    constructor(config) {
        if (typeof config == String) {
            config = JSON.parse(config)
        }

        this.due = new Date(config.due) || new Date();
        this.name = config.name;
        this.done = config.done || false;
        this.priority = config.priority || 4;

        this.editing = false;

        this.element = $($('#task').html().trim());


        this.element.attr('id', config.id || uuid());

        if (this.name) {
            this.element.find('#task-name').text(this.name);
        } else {
            this.element.find('#task-name').addClass('muted');
            this.element.find('#task-name').text('(click to edit)');
        }

        let minutes = this.due.getMinutes() + '';
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        this.element.find('#task-due').text(this.formatDate(this.due));
        this.element.find('#task-due').append('<i class="fas fa-pen-square"></i>');
        this.element.find('input[type="checkbox"]').attr('checked', this.done);

        this.element.find('input').click(e => {
            this.done = e.target.checked
        });
        this.element.find('#save-edit').click(e => this.edit(e));
        this.element.find('#task-name').click(e => this.clickName(e));

        this.element.find('#task-due').click(e => this.changeDate(e));

        this.element.find('#priority').change(e => {
            this.priority = eval(e.target.value);
            this.parent.sort();
        });
    }

    stringify(a) {
        if (a) {
            return {
                due: this.due.toString(),
                name: this.name,
                done: this.done,
                priority: this.priority,
                id: this.element.attr('id')
            }
        } else {
            return JSON.stringify({
                due: this.due.toString(),
                name: this.name,
                done: this.done,
                priority: this.priority,
                id: this.element.attr('id')
            });
        }
    }

    append(el) {
        $(el).append(this.element);
    }

    clickName() {
        if (!this.editing) {
            this.edit();
        }

        return false;
    }

    edit() {
        this.editing = true;
        this.element.find('#save-edit').unbind();

        this.input = $('<input id="task-name" type="text" />');
        this.input.val(this.name);
        this.input.attr('placeholder', '(click to edit)');
        this.element.find('#task-name').replaceWith(this.input);

        this.input.focus();
        this.input.focusout(e => this.view(e));

        this.element.find('#save-edit').text('Save Task');
        this.element.find('#save-edit').append('<i class="fas fa-check"></i>');
        this.element.find('#save-edit').click(e => this.view(e));
        this.element.find('#task-name').click(e => this.clickName(e));
        this.element.find('#task-name').keydown(e => {
            if (e.keyCode === 13) this.view(e);
        });

        this.element.find('#task-due').click(e => this.changeDate());
    }

    formatDate(d) {
        let m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let s = `${m[d.getMonth()]} ${d.getDate()}`
        if (d.getFullYear() !== new Date().getFullYear()) {
            s += `, ${d.getFullYear()}`
        }
        return s
    }

    view() {
        this.editing = false;
        this.input.unbind();
        this.element.find('#save-edit').unbind();

        this.name = this.input.val();

        let name = $('<p id="task-name"></p>');

        if (this.name) {
            name.text(this.name);
        } else {
            name.addClass('muted');
            name.text('(click to edit)');
        }
        this.element.find('#task-name').replaceWith(name);

        this.element.find('#save-edit').text('Edit Task');
        this.element.find('#save-edit').append('<i class="fas fa-pen-square"></i>');
        this.element.find('#save-edit').click(e => this.edit(e));
        this.element.find('#task-name').click(e => this.clickName(e));

        this.parent.sort()
    }

    changeDate(e) {
        this.element.find('#task-due').unbind();

        let dp = this.element.find('#date-input').datepicker();

        dp.show();
        this.element.find('#date-input').focus();
        dp.hide();

        this.element.find('#date-input').change(e => {
            this.due = this.element.find('#date-input').datepicker('getDate');
            this.element.find('#task-due').text(this.formatDate(this.due));
            this.element.find('#task-due').append('<i class="fas fa-pen-square"></i>');
            this.element.find('#task-due').click(e => this.changeDate(e));
        });

        this.element.find('#date-input').focusout(e => {
            this.element.find('#task-due').click(e => this.changeDate(e));
        });
    }
}

class TaskManager {
    constructor(config) {
        if (typeof config == String) {
            config = JSON.parse(config);
        }

        if (config == undefined) {
            config = {};
        }

        this.container = config.container || '#tasks';
        this.responses = config.responses || [];
        this.title = config.title || null;

        this.element = $(this.container);
        $('#new-task').click(e => this.createTask());
    }

    createTask(config, external) {
        let task = new Task(config || {
            due: new Date()
        });
        task.parent = this;
        task.external = external || false;
        this.responses.push(task);
        task.append(this.element);
        task.edit();
        task.element.find('#delete').click(e => {
            if (confirm('Are you sure you want to delete this task?')) this.deleteTask(task.element.attr('id'));
        });
    }

    deleteTask(id) {
        this.responses.forEach((e, i) => {
            if (e.element.attr('id') === id) {
                this.responses.splice(i, 1);
                return
            }
        })
        $(`#${id}`).remove();
    }

    unmount() {
        $('#new-task').unbind();
        this.responses.forEach(e => e.element.remove());
    }

    mount() {
        $('#new-task').click(e => this.createTask());
        this.responses.forEach(e => {
            e.append(this.container)
            e.view()
        });
        this.sort()
    }

    sort() {
        this.responses.sort((a, b) => a.priority - b.priority)
        let last = null
        this.responses.forEach(e => {
            e.element.removeClass('priority1 priority2 priority3 priority4')
            if ((last && last.priority !== e.priority) || !last) {
                e.element.addClass('priority' + e.priority)
            }

            last = e
        })
        this.responses.forEach(e => {
            $(`#${e.element.id}`).remove();
            e.append(this.container)
        })
    }

    data() {
        return this.responses.map(e => e.stringify(true))
    }
}
