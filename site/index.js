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

document.querySelectorAll('.cum').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        btn.innerHTML =
            'You\'ve cummed ' + cumCounter + ' time(s).';
        cumCounter++;
    });
});