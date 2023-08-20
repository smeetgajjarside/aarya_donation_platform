import successEmailDonate from './successEmail_donate';
import successEmailPhysicianCourse from './successEmail_physiciancourse';


class EmailGenerator {

    public static generateDonationSuccessEmail(name: string, amount: string, comment: string, dateTime: string) {

        let modifiedComment = '';

        if (comment != null && comment.length > 0){
            modifiedComment = 'Comment: ' + comment;
        }

        return successEmailDonate
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment);
    }

    public static generatePhysicianCourseSuccessEmail(name: string, amount: string, comment: string, dateTime: string) {

        let modifiedComment = '';

        if (comment != null && comment.length > 0){
            modifiedComment = 'Comment: ' + comment;
        }

        return successEmailPhysicianCourse
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment);
    }



}

export default EmailGenerator;