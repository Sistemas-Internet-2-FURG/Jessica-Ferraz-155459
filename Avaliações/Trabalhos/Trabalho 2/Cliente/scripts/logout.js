document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do link

    // Remover o token armazenado
    localStorage.removeItem('access_token');  // Se você estiver usando o localStorage

    // Alternativa: caso esteja usando cookies, use isso:
    // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; 

    // Redirecionar para a página de login ou outra página
    window.location.href = '../index.html';  // Redireciona para a página de login
});