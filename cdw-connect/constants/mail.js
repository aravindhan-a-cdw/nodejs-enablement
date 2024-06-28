const MAIL_CONSTANTS = {
    EMAIL_SENDER: '"CDW Connect Support" <cdwconnect.support@ethereal.email>',
    APPROVED_SUBJECT: "User registration Approved",
    REJECTED_SUBJECT: "User registration Rejected",
    EMAIL_BODY: (user, isApprove) => {
        return `Hi ${user.name}, You user registration has been ${isApprove ? "Approved" : "Rejected"} by the admin.`
    }
}

module.exports = { MAIL_CONSTANTS }