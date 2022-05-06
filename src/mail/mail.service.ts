import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendNotification(template: string, email: string, context: any): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'administrator@nestjs2022.com',
        subject: 'NESTJS2022',
        template: `${__dirname}/../../templates/${template}`,
        context: context,
      })
      .then(() => {
        console.log(`Mail sent to ${email}`);
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }
}
