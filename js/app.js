var topAppBar = document.querySelector('.comp-top-app-bar');
document.body.onscroll = function() { topAppBar.style.top = window.scrollY*-3+'px' }