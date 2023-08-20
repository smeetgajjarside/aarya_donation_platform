const successEmail = `<!doctype html>
<html>

<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>IAHV Canada</title>

</head>

<body class=""
    style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" class="body"
        style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
        <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            <td class="container"
                style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                <div class="content"
                    style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                    <span class="preheader"
                    style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
                    Thank you for your donation.</span>
                   <table class="main"
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table class="main"
                        style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                        <td align="center" valign="top" style="padding: 15px 0; background-color: #bf0101;" class="logo">
                            <a href="https://iahv.ca" target="_blank">
                                <img alt="Logo"
                                    src="http://www.iahv.ca/wp-content/uploads/2017/02/imageedit_5_7682410385.png"
                                    style="max-height:50px; display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px;"
                                    border="0">
                            </a>
                        </td>
                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                            <td class="wrapper"
                                style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                <table border="0" cellpadding="0" cellspacing="0"
                                    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                    <tr>
                                        <div
                                            style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.8;padding-top:10px;padding-right:40px;padding-bottom:25px;padding-left:40px;">
                                            <div
                                                style="line-height: 1.8; font-size: 18px; color: #555555; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 22px;">
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    Dear {name},</p>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    &nbsp;
                                                </p>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    Thank you for registering for the Physician Wellness Workshop that is happening on: {workshopDate}. 
                                                </p>
                                                <p style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    We have received your payment of {amount} CAD.
                                                </p><br/>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    &nbsp;
                                                </p>
                                                <p
                                                style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    Hospital Name: {hospitalName}
                                                </p><br/>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    In case you need any assistance, please email us at <a
                                                        href="mailto:donations@iahv.ca">donations@iahv.ca</a>
                                                </p>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    &nbsp;
                                                </p>

                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    Sincerely,
                                                </p>
                                                <p
                                                    style="line-height: 1.8; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">
                                                    IAHV Canada.</p>
                                            </div>
                                        </div>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- END MAIN CONTENT AREA -->
                    </table>

                    <!-- END CENTERED WHITE CONTAINER -->
                </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        </tr>
    </table>
</body>

</html>`

export default successEmail;
