const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendOtpToMail(toEmail, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Otp",
      text: "",
      html: `
        <div>
            <h3>
                Sizning tasdiqlash  kodingiz: ${otp}
            </h3>
        </div>
        `,
    });
  }
}

module.exports = new MailService();
