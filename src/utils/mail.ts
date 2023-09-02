import nodemailer, { SendMailOptions } from "nodemailer";
import { convert } from "html-to-text";

export async function sendEmail(
  data: Omit<SendMailOptions, "from" | "text"> & {
    html: string;
  }
) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "bthsrepairtheworld@gmail.com",
      pass: process.env.SMTP_KEY!,
    },
  });

  data.html += `<div bis_skin_checked="1" style="width: 345px; padding: 60px 0px;">
  <table data-darkreader-inline-color="" style="--darkreader-inline-color:#e8e6e3; color:#000000; width:100%">
    <tbody>
      <tr>
        <td style="padding:0px 35px 0px 0px; vertical-align:top">
        <p style="margin: 0px; font-size: 18px; line-height: 21px; font-weight: 700;">BTHS Repair the World</p>
  
        <p data-darkreader-inline-border-top="" style="border-top: 1px solid rgb(231, 229, 247); --darkreader-inline-border-top: #211a56;">&nbsp;</p>
        <a href="https://bths-repair.tech" style="font-size:12px;">Club Website</a>
  
        <p style="font-size: 12px;">President: Justin Li<br />
        Vice President: Adeeb Mohammed, Marco Wu<br />
        Event Coordinator: Emma Katz<br />
        Treasurer: Carlos Simmons</p>
  
        <p data-darkreader-inline-border-top="" style="border-top: 1px solid rgb(231, 229, 247); --darkreader-inline-border-top: #211a56;">&nbsp;</p>
        </td>
        <td style="padding:0px; vertical-align:top; width:125px">
        <p style="margin: 0px 0px 20px; font-size: 0px;"><img alt="" src="https://bths-repair.tech/icon.png" style="border-radius:50%; height:120px; object-fit:cover; width:120px" /></p>
  
        <p style="margin: 0px; text-align: center;"><a href="https://discord.gg/cxEd3Mr8HG" style="display: inline-block; font-size: 0px;"><img alt="" src="https://i.pinimg.com/originals/03/b0/c8/03b0c88adcb772a4738d684488e5fc45.png" style="height:25px; width:25px" /></a> <a href="https://www.instagram.com/bths.repair/" style="display: inline-block; margin-left:7px;  margin-right: 7px; font-size: 0px;"> <img alt="" src="https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png" style="height:25px; width:25px" /> </a> <a href="mailto:bthsrepairtheworld@gmail.com" style="display: inline-block; font-size: 0px;"> <img alt="" src="https://cdn-icons-png.flaticon.com/512/5968/5968534.png" style="height:25px; width:25px" /> </a></p>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  `;

  return transporter
    .sendMail({
      ...data,
      from: "BTHS Repair the World <bthsrepairtheworld@gmail.com>",

      to: [
        process.env.ADVISOR_EMAIL!,
        ...(Array.isArray(data.to) ? data.to : data.to ? [data.to] : []),
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
