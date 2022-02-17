cumCounter = 0;

document.querySelectorAll('.gaybtn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Yes. 100%');
    });
});

document.querySelectorAll('.straightbtn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('no.');
    });
});

document.querySelectorAll('.modern-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        // set button text
        btn.innerHTML = '<button class="modern-btn">You\'ve cummed ' + cumCounter + ' time(s).</button>';
        cumCounter++;
    });
});