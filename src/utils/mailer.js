import sendgrid from '@sendgrid/mail';
import env from '../config/envConfig';

const { NO_REPLY_EMAIL, SENDGRID_KEY } = env;
sendgrid.setApiKey(SENDGRID_KEY);

/**
 * Contains methods for sending Emails using SendGrid
 *
 * @class Mailer
 */
class Mailer {
  /**
 * Sends an email to the user
 *
 * @param {object} options mail options
 * @param {string} options.email Recipient email address
 * @param {string} options.templateId Unique email template Id
 * @param {string} options.firstName Recipient firstName
 * @param {string} options.urlLink Link inside the mail
 * @returns {Promise} Sendgrid response
 * @memberof Mailer
 */
  static async sendMail({
    email, templateId, firstName, urlLink
  }) {
    const mail = {
      to: email,
      from: NO_REPLY_EMAIL,
      templateId,
      dynamic_template_data: {
        name: firstName,
        urlLink
      }
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (e) {
      return e.message;
    }
  }
}
export default Mailer;
