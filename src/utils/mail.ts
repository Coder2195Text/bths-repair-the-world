import sg from "@sendgrid/mail";
import { convert } from "html-to-text";

export async function sendEmail(
  data: Omit<sg.MailDataRequired, "from" | "text"> & {
    html: string;
  }
) {
  sg.setApiKey(process.env.SENDGRID_API_KEY!);

  return sg
    .send({
      ...data,
      from: "BTHS Repair the World <bthsrepairtheworld@gmail.com>",

      to: [
        process.env.ADVISOR_EMAIL!,
        ...(Array.isArray(data.to) ? data.to : data.to ? [data.to] : []),
      ],
      text: convert(data.html),
    })
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}
