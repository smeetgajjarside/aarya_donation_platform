"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const successEmail_donate_1 = __importDefault(require("./successEmail_donate"));
const successEmail_physiciancourse_1 = __importDefault(require("./successEmail_physiciancourse"));
class EmailGenerator {
    static generateDonationSuccessEmail(name, amount, comment, dateTime) {
        let modifiedComment = '';
        if (comment != null && comment.length > 0) {
            modifiedComment = 'Comment: ' + comment;
        }
        return successEmail_donate_1.default
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment);
    }
    static generatePhysicianCourseSuccessEmail(name, amount, comment, dateTime) {
        let modifiedComment = '';
        if (comment != null && comment.length > 0) {
            modifiedComment = 'Comment: ' + comment;
        }
        return successEmail_physiciancourse_1.default
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment);
    }
}
exports.default = EmailGenerator;
