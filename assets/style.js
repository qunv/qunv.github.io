function openNav() {
    document.getElementById("poem-myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("poem-myNav").style.width = "0%";
}

function setCookie(name, value, daysToLive) {
    let cookie = name + "=" + encodeURIComponent(value) + ";path=/";
    if(typeof daysToLive === "number") {
        cookie += "; max-age=" + (daysToLive*24*60*60);
    }
    document.cookie = cookie;
}

function getCookie(name) {
     let cookieArr = document.cookie.split(";");

    for(let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if(name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function changeTheme(action) {
    let mode = getCookie("theme-mode")
    if (action === 'btnClick') {
        if (mode === 'dark') {
            const stylesheet = document.getElementById('stylesheet');
            stylesheet.setAttribute('href', '/assets/styte-light.css');
            document.getElementById("fa-theme-switch").className = "fa fa-sun-o"
            setCookie("theme-mode", "light")
        } else {
            const stylesheet = document.getElementById('stylesheet');
            stylesheet.setAttribute('href', '/assets/styte-dark.css');
            document.getElementById("fa-theme-switch").className = "fa fa-moon-o"
            setCookie("theme-mode", "dark")
        }
    }
    if (action === 'load') {
        if (mode === null || mode === 'light') {
            const stylesheet = document.getElementById('stylesheet');
            stylesheet.setAttribute('href', '/assets/styte-light.css');
            document.getElementById("fa-theme-switch").className = "fa fa-sun-o"
            setCookie("theme-mode", "light")
        } else {
            const stylesheet = document.getElementById('stylesheet');
            stylesheet.setAttribute('href', '/assets/styte-dark.css');
            document.getElementById("fa-theme-switch").className = "fa fa-moon-o"
            setCookie("theme-mode", "dark")
        }
    }
}
