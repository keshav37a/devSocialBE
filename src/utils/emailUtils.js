import { transporter } from '#Config/nodemailer'

export const sendEmail = async ({ from = process.env.GOOGLE_OAUTH_EMAIL, to, subject, emailBody }) => {
    try {
        console.log({ from, to, subject, html: emailBody })
        const email = await transporter.sendMail({ from, to, subject, html: emailBody })
        return email
    } catch (err) {
        console.log('error: ', err)
    }
}

export const sendEmailInBackground = async ({ from = process.env.GOOGLE_OAUTH_EMAIL, to, subject, emailBody }) => {
    transporter
        .sendMail({ from, to, subject, html: emailBody })
        .then((data) => {
            console.log('success: ', data)
        })
        .catch((err) => {
            console.log('error: ', err)
        })
}
