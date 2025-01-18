export async function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return { success: false, status: 401 };
    }

    try {
        const response = await fetch('http://localhost:5000/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            return { success: true, status: 200 };
        } else if (response.status === 401) {
            return { success: false, status: 401 };
        } else {
            return { success: false, status: response.status };
        }
    } catch {
        return { success: false, status: 500 };
    }
}

