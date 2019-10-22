let datefield = document.createElement('input')

datefield.setAttribute('type', 'date')

if (datefield.type !== 'date') { //if browser doesn't support input type="date", load files for jQuery UI Date Picker
    document.write('<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />\n')
    document.write('<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"><\/script>\n')
    window.dates = false
} else {
    window.dates = true
}

window.uuid = a => a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)

window.admin = window.location.pathname === '/admin.html'
