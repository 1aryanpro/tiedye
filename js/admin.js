let managers = Array($('#course-select').children().length).fill(0).map(e => new TaskManager({ container: '#tasks' }))

managers.forEach(e => e.unmount());

$('#course-select').children().map((i, e) => {
    if ($(e).hasClass('active')) {
        managers[i].mount();
    }
})

$('#course-select').children().click(ev => {
    let i = $.inArray(ev.target, $('#course-select').children());
    let e = $($('#course-select').children()[i]);

    $('#course-select').children().removeClass('active');
    e.addClass('active');

    managers.forEach(e => e.unmount());
    managers[i].mount();
})
