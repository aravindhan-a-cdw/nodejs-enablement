const AUTHENTICATION_ERRORS = {
    USER_NOT_EXIST_IN_WALLET_DB: "User not exist in wallet db",
    PENDING_REQUEST_EXISTS: "Your request is pending! Wait for the admin to approve!",
    REJECTED_USER: "Rejected User",
    NO_PENDING_USER_FOUND: "No user found for the given ID with pending status",
    NO_USER_FOUND: "No active user found for the given ID",
    PENDING_REQUEST_EXISTS: "Your request is pending! Wait for the admin to approve!",
    REQUEST_REJECTED_WAIT_2_DAYS: "Your request is rejected! You need to wait for 2 days before reapplying!",
    USER_ALREADY_EXISTS: "User already exists for the given data",
    KEY_APPROVE_NOT_FOUND: "Not able to process the data. Key 'approve' not found in body!",
}

const LOGIN_ERRORS = {
    REQUEST_NOT_APPROVED: "You are not yet approved by admin!",
    REQUEST_REJECTED_WAIT_2_DAYS: "Your request is rejected! You need to wait for 2 days before reapplying!",
    INACTIVE_USER: "Your account is inactive! Kindly contact admin if mistaken!",
}

const ADMIN_ERRORS = {
    NOT_VALID_INPUT: "Your input is not valid!",
}

const COMMON_ERRORS = {
    UNEXPECTED_ERROR: "Something unexpected has happened! Try after some time or reach out to support team!"
}

module.exports = {AUTHENTICATION_ERRORS, COMMON_ERRORS, LOGIN_ERRORS, ADMIN_ERRORS}