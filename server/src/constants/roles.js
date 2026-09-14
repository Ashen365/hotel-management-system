// Roles that are hotel employees (as opposed to guests).
// Guests only see/manage their own bookings; staff see/manage everything.
const STAFF_ROLES = ['admin', 'manager', 'receptionist', 'housekeeping', 'restaurant', 'cashier'];

// Boss-roles with full delete rights.
const MANAGER_ROLES = ['admin', 'manager'];

// Who may touch housekeeping: managers, front-desk and the housekeeping crew.
const HOUSEKEEPING_ROLES = ['admin', 'manager', 'receptionist', 'housekeeping'];

module.exports = { STAFF_ROLES, MANAGER_ROLES, HOUSEKEEPING_ROLES };