"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const successEmail_donate_1 = __importDefault(require("./successEmail_donate"));
const successEmail_physiciancourse_1 = __importDefault(require("./successEmail_physiciancourse"));
const successEmail_skyResilience_1 = __importDefault(require("./successEmail_skyResilience"));
const successEmail_ukraine_1 = __importDefault(require("./successEmail_ukraine"));
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
    static generatePhysicianCourseSuccessEmail(name, amount, comment, dateTime, workshopDate, hospitalName) {
        let modifiedComment = '';
        if (comment != null && comment.length > 0) {
            modifiedComment = 'Comment: ' + comment;
        }
        let workshopDate_modified = "";
        switch (workshopDate) {
            case "nov_18to20_2022":
                workshopDate_modified = "Nov 18 to Nov 20, 2022";
                break;
            case "jan_20to22_2023":
                workshopDate_modified = "Jan 20 to Jan 22, 2023";
                break;
            case "feb_3to5_2023":
                workshopDate_modified = "Feb 3 to Feb 5, 2023";
                break;
        }
        return successEmail_physiciancourse_1.default
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment)
            .replace('{workshopDate}', workshopDate_modified)
            .replace('{hospitalName}', hospitalName);
    }
    static generateSkyResilienceCourseSuccessEmail(name, amount, dateTime) {
        return successEmail_skyResilience_1.default
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime);
    }
    static generateUkraineSuccessEmail(name) {
        return successEmail_ukraine_1.default
            .replace('{name}', name);
    }
}
exports.default = EmailGenerator;
