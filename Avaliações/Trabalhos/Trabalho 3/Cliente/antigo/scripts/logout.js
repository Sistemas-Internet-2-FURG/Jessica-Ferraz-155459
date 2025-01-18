document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault();

    localStorage.removeItem('access_token');

    window.location.href = '../index.html';
});