interface ForgotPasswordTemplateProps {
  firstName: string;
  resetLink: string;
}

export const forgotPasswordTemplate = ({
  firstName,
  resetLink,
}: ForgotPasswordTemplateProps): string => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Reset Your Password | Taksham</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#F6F2EC;
    font-family:Arial, Helvetica, sans-serif;
    color:#29251F;
  "
>

  <!-- ========================================
       EMAIL WRAPPER
  ========================================= -->

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      margin:0;
      padding:36px 16px;
      background-color:#F6F2EC;
    "
  >

    <tr>
      <td align="center">

        <!-- ========================================
             MAIN CONTAINER
        ========================================= -->

        <table
          role="presentation"
          width="620"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:620px;
            background-color:#FFFFFF;
            border:1px solid #E8E0D6;
            border-radius:24px;
            overflow:hidden;
          "
        >

          <!-- ========================================
               HEADER
          ========================================= -->

          <tr>
            <td
              style="
                padding:32px 42px 28px;
                background-color:#FCFAF7;
                border-bottom:1px solid #EAE2D8;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td>

                    <div
                      style="
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:30px;
                        font-weight:500;
                        line-height:1;
                        letter-spacing:-1px;
                        color:#29251F;
                      "
                    >
                      TAKSHAM
                    </div>

                    <div
                      style="
                        margin-top:8px;
                        font-size:8px;
                        font-weight:600;
                        letter-spacing:3px;
                        text-transform:uppercase;
                        color:#A4773E;
                      "
                    >
                      Furniture &amp; Interiors
                    </div>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                  >

                    <div
                      style="
                        display:inline-block;
                        padding:9px 13px;
                        border:1px solid #E3D7C8;
                        border-radius:20px;
                        font-size:9px;
                        font-weight:600;
                        letter-spacing:1.5px;
                        text-transform:uppercase;
                        color:#8F6B3F;
                        background-color:#F8F3EC;
                      "
                    >
                      Account Security
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- ========================================
               HERO
          ========================================= -->

          <tr>
            <td
              style="
                padding:48px 42px 46px;
                background-color:#F8F4EE;
                text-align:center;
              "
            >

              <!-- Lock Icon -->

              <div
                style="
                  width:54px;
                  height:54px;
                  margin:0 auto;
                  line-height:54px;
                  text-align:center;
                  border-radius:50%;
                  background-color:#8F6B3F;
                  color:#FFFFFF;
                  font-size:24px;
                "
              >
                &#128274;
              </div>

              <div
                style="
                  margin-top:24px;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:2.5px;
                  text-transform:uppercase;
                  color:#A4773E;
                "
              >
                Secure Account Access
              </div>

              <h1
                style="
                  margin:18px 0 0;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:42px;
                  font-weight:500;
                  line-height:1.08;
                  letter-spacing:-1.4px;
                  color:#29251F;
                "
              >
                Reset your
                <br />

                <span
                  style="
                    color:#A4773E;
                  "
                >
                  password.
                </span>
              </h1>

              <p
                style="
                  margin:18px auto 0;
                  max-width:430px;
                  font-size:15px;
                  line-height:25px;
                  color:#756C62;
                "
              >
                We received a request to create a new password
                for your Taksham account.
              </p>

            </td>
          </tr>

          <!-- ========================================
               MAIN CONTENT
          ========================================= -->

          <tr>
            <td
              style="
                padding:46px 42px 44px;
              "
            >

              <!-- Greeting -->

              <p
                style="
                  margin:0;
                  font-size:16px;
                  line-height:28px;
                  color:#6F665D;
                "
              >
                Hello
                <strong
                  style="
                    color:#3A342D;
                  "
                >
                  ${firstName}
                </strong>,
              </p>

              <p
                style="
                  margin:16px 0 0;
                  font-size:16px;
                  line-height:28px;
                  color:#6F665D;
                "
              >
                If you requested a password reset, use the button
                below to securely create a new password for your
                account.
              </p>

              <!-- ========================================
                   CTA
              ========================================= -->

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:32px;
                "
              >

                <tr>

                  <td
                    align="center"
                    style="
                      border-radius:12px;
                      background-color:#29251F;
                    "
                  >

                    <a
                      href="${resetLink}"
                      style="
                        display:inline-block;
                        padding:17px 32px;
                        font-size:11px;
                        font-weight:700;
                        letter-spacing:1.8px;
                        text-transform:uppercase;
                        color:#FFFFFF;
                        text-decoration:none;
                      "
                    >
                      Reset Password &rarr;
                    </a>

                  </td>

                </tr>

              </table>

              <!-- ========================================
                   SECURITY CARD
              ========================================= -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:36px;
                  background-color:#F8F4EE;
                  border:1px solid #E9DED0;
                  border-radius:16px;
                "
              >

                <tr>
                  <td
                    style="
                      padding:25px 26px;
                    "
                  >

                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td
                          valign="top"
                          style="
                            width:42px;
                          "
                        >

                          <div
                            style="
                              width:32px;
                              height:32px;
                              line-height:32px;
                              text-align:center;
                              border-radius:50%;
                              background-color:#8F6B3F;
                              color:#FFFFFF;
                              font-size:15px;
                            "
                          >
                            &#10003;
                          </div>

                        </td>

                        <td valign="top">

                          <div
                            style="
                              font-size:15px;
                              font-weight:700;
                              color:#29251F;
                            "
                          >
                            For your security
                          </div>

                          <div
                            style="
                              margin-top:10px;
                              font-size:13px;
                              line-height:22px;
                              color:#81776C;
                            "
                          >
                            This reset link is valid for
                            <strong
                              style="
                                color:#5F5142;
                              "
                            >
                              15 minutes
                            </strong>
                            and can only be used once.
                          </div>

                          <div
                            style="
                              margin-top:8px;
                              font-size:13px;
                              line-height:22px;
                              color:#81776C;
                            "
                          >
                            Your current password will remain unchanged
                            until you successfully create a new one.
                          </div>

                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

              </table>

              <!-- ========================================
                   NOT YOU?
              ========================================= -->

              <div
                style="
                  margin-top:38px;
                  padding-top:30px;
                  border-top:1px solid #EDE6DE;
                "
              >

                <div
                  style="
                    font-family:Georgia, 'Times New Roman', serif;
                    font-size:22px;
                    font-weight:500;
                    color:#29251F;
                  "
                >
                  Didn't request this?
                </div>

                <p
                  style="
                    margin:12px 0 0;
                    font-size:14px;
                    line-height:24px;
                    color:#81776C;
                  "
                >
                  You can safely ignore this email. No changes will
                  be made to your account unless the password reset
                  process is completed.
                </p>

              </div>

              <!-- ========================================
                   FALLBACK LINK
              ========================================= -->

              <p
                style="
                  margin:30px 0 0;
                  font-size:12px;
                  line-height:21px;
                  color:#91877B;
                "
              >
                If the button doesn't work, copy and paste this link
                into your browser:
              </p>

              <div
                style="
                  margin-top:12px;
                  padding:15px 16px;
                  border:1px solid #E8E0D6;
                  border-radius:10px;
                  background-color:#FCFAF7;
                  word-break:break-all;
                  font-size:11px;
                  line-height:19px;
                  color:#756C62;
                "
              >
                ${resetLink}
              </div>

            </td>
          </tr>

          <!-- ========================================
               FOOTER
          ========================================= -->

          <tr>
            <td
              style="
                padding:34px 42px;
                background-color:#29251F;
              "
            >

              <div
                style="
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:22px;
                  letter-spacing:-0.5px;
                  color:#FFFFFF;
                "
              >
                TAKSHAM
              </div>

              <div
                style="
                  margin-top:8px;
                  font-size:8px;
                  font-weight:600;
                  letter-spacing:2.5px;
                  text-transform:uppercase;
                  color:#C8A978;
                "
              >
                Furniture &amp; Interiors
              </div>

              <div
                style="
                  height:1px;
                  margin:24px 0;
                  background-color:rgba(255,255,255,0.12);
                "
              >
                &nbsp;
              </div>

              <p
                style="
                  margin:0;
                  font-size:12px;
                  line-height:21px;
                  color:#BEB7AE;
                "
              >
                We take the security of your account seriously.
                If you need help, our support team is here for you.
              </p>

              <p
                style="
                  margin:18px 0 0;
                  font-size:12px;
                  color:#D6D0C8;
                "
              >
                Need help?
                <strong
                  style="
                    color:#FFFFFF;
                  "
                >
                  Contact the Taksham team.
                </strong>
              </p>

              <p
                style="
                  margin:26px 0 0;
                  font-size:10px;
                  color:#827A71;
                "
              >
                © ${new Date().getFullYear()} Taksham. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`;
};