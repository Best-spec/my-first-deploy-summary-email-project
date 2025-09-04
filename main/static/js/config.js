export function permissions() {
    const permissionsData = JSON.parse(document.getElementById('permissions-data').textContent);

    const username = permissionsData.username
    const canDelete = permissionsData.can_delete
    const isSuperUser = permissionsData.is_superuser
    const isStaff = permissionsData.is_staff
    const userPermissions = permissionsData.user_permissions
    const canView = permissionsData.can_view

    return {
        username,
        canDelete,
        canView,
        isSuperUser,
        isStaff,
        userPermissions,
    };
}