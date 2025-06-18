// Admin functionality for user management

// Function to delete a user account as an admin
function deleteUserAsAdmin(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    fetch(`/admin/deleteUser/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            // Remove the row from the table
            const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (userRow) {
                userRow.remove();
            }
            alert('User deleted successfully');
        } else {
            alert('Failed to delete user');
        }
    })
    .catch(error => {
        alert('An error occurred while deleting the user');
    });
} 