var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
function decode(s) {
    return decodeURIComponent(s.split("+").join(" "));
}

$_GET[decode(arguments[1])] = decode(arguments[2]);
});

function login() {
    if ($_GET['password'] == 'password'){
        window.location.pathname = "/admin.html";
        // alert(window.location.pathname);

    }
}
