import successEmailDonate from './successEmail_donate';
import successEmailPhysicianCourse from './successEmail_physiciancourse';
import skyResilienceSuccessEmail from './successEmail_skyResilience';
import ukraineSuccessEmail from './successEmail_ukraine';


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

    public static generatePhysicianCourseSuccessEmail(name: string, amount: string, comment: string, dateTime: string, workshopDate: string,
            hospitalName: string
        ) {

        let modifiedComment = '';

        if (comment != null && comment.length > 0){
            modifiedComment = 'Comment: ' + comment;
        }

        let workshopDate_modified = "";

        switch (workshopDate){
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

        return successEmailPhysicianCourse
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime)
            .replace('{comment}', modifiedComment)
            .replace('{workshopDate}', workshopDate_modified)
            .replace('{hospitalName}', hospitalName);
    }


    public static generateSkyResilienceCourseSuccessEmail(name: string, amount: string, dateTime: string) {

        return skyResilienceSuccessEmail
            .replace('{name}', name)
            .replace('{amount}', amount)
            .replace('{dateTime}', dateTime);
    }

    public static generateUkraineSuccessEmail(name: string) {
        return ukraineSuccessEmail
            .replace('{name}', name);
    }



}

export default EmailGenerator;