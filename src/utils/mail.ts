import sg, { MailDataRequired } from "@sendgrid/mail";
import { convert } from "html-to-text";
import { prisma } from "./prisma";

export async function sendEmail(
  data: Omit<MailDataRequired, "from" | "text"> & {
    html: string;
  }
) {
  sg.setApiKey(process.env.SENDGRID_API_KEY!);

  return sg
    .send({
      ...data,
      from: "BTHS Action <bthsaction@gmail.com>",

      to: [
        process.env.ADVISOR_EMAIL!,
        ...(
          await prisma.user.findMany({
            where: { position: "EXEC" },
          })
        ).map((user) => user.email),
      ],
      text: convert(data.html),
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}
