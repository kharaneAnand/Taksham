interface VerifyEmailTemplateProps {
  firstName: string;
  clientUrl: string;
}

const verifyEmailTemplate = ({
  firstName,
  clientUrl,
}: VerifyEmailTemplateProps): string => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Welcome to Taksham</title>
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

  <!-- Email Wrapper -->

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

        <!-- Main Container -->

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
          ======================================== -->

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
                      Welcome Home
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- ========================================
               HERO IMAGE
          ======================================== -->

          <tr>
            <td>

              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85"
                alt="Thoughtfully designed living space"
                width="620"
                style="
                  display:block;
                  width:100%;
                  height:auto;
                  border:0;
                  outline:none;
                  text-decoration:none;
                "
              />

            </td>
          </tr>

          <!-- ========================================
               MAIN CONTENT
          ======================================== -->

          <tr>
            <td
              style="
                padding:48px 42px 44px;
              "
            >

              <!-- Small Label -->

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    style="
                      width:32px;
                      height:1px;
                      background-color:#B7894A;
                    "
                  >
                    &nbsp;
                  </td>

                  <td
                    style="
                      width:12px;
                    "
                  >
                    &nbsp;
                  </td>

                  <td
                    style="
                      font-size:9px;
                      font-weight:700;
                      letter-spacing:2.5px;
                      text-transform:uppercase;
                      color:#A4773E;
                    "
                  >
                    Your journey begins
                  </td>

                </tr>

              </table>

              <!-- Heading -->

              <h1
                style="
                  margin:22px 0 0;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:44px;
                  font-weight:500;
                  line-height:1.05;
                  letter-spacing:-1.5px;
                  color:#29251F;
                "
              >
                Welcome to
                <br />

                <span
                  style="
                    color:#A4773E;
                  "
                >
                  Taksham.
                </span>
              </h1>

              <!-- Greeting -->

              <p
                style="
                  margin:28px 0 0;
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
                  margin:14px 0 0;
                  font-size:16px;
                  line-height:28px;
                  color:#6F665D;
                "
              >
                Your Taksham account has been created successfully,
                and you're all set to begin discovering thoughtfully
                designed furniture, beautiful interiors, and spaces
                made for living.
              </p>

              <!-- Account Ready Card -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:34px;
                  background-color:#F8F4EE;
                  border:1px solid #E9DED0;
                  border-radius:16px;
                "
              >

                <tr>
                  <td
                    style="
                      padding:24px 26px;
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
                              font-size:16px;
                              font-weight:bold;
                            "
                          >
                            ✓
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
                            Your account is ready
                          </div>

                          <div
                            style="
                              margin-top:7px;
                              font-size:13px;
                              line-height:21px;
                              color:#81776C;
                            "
                          >
                            You can sign in and start exploring
                            Taksham right away. Your account is
                            already ready to use.
                          </div>

                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

              </table>

              <!-- What Awaits You -->

              <div
                style="
                  margin-top:40px;
                  padding-top:34px;
                  border-top:1px solid #EDE6DE;
                "
              >

                <div
                  style="
                    font-family:Georgia, 'Times New Roman', serif;
                    font-size:24px;
                    font-weight:500;
                    color:#29251F;
                  "
                >
                  A little inspiration awaits.
                </div>

                <p
                  style="
                    margin:12px 0 0;
                    font-size:14px;
                    line-height:24px;
                    color:#81776C;
                  "
                >
                  Explore a world designed around the way you live
                  and the spaces you love.
                </p>

                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin-top:24px;
                  "
                >

                  <tr>

                    <!-- Item 1 -->

                    <td
                      width="33.33%"
                      valign="top"
                      style="
                        padding-right:10px;
                      "
                    >

                      <div
                        style="
                          font-size:20px;
                          line-height:1;
                          color:#A4773E;
                        "
                      >
                        01
                      </div>

                      <div
                        style="
                          margin-top:10px;
                          font-size:12px;
                          font-weight:700;
                          color:#3A342D;
                        "
                      >
                        Curated Furniture
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:11px;
                          line-height:18px;
                          color:#8B8177;
                        "
                      >
                        Pieces chosen to make every room feel complete.
                      </div>

                    </td>

                    <!-- Item 2 -->

                    <td
                      width="33.33%"
                      valign="top"
                      style="
                        padding:0 10px;
                      "
                    >

                      <div
                        style="
                          font-size:20px;
                          line-height:1;
                          color:#A4773E;
                        "
                      >
                        02
                      </div>

                      <div
                        style="
                          margin-top:10px;
                          font-size:12px;
                          font-weight:700;
                          color:#3A342D;
                        "
                      >
                        Beautiful Spaces
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:11px;
                          line-height:18px;
                          color:#8B8177;
                        "
                      >
                        Ideas and inspiration for every corner of home.
                      </div>

                    </td>

                    <!-- Item 3 -->

                    <td
                      width="33.33%"
                      valign="top"
                      style="
                        padding-left:10px;
                      "
                    >

                      <div
                        style="
                          font-size:20px;
                          line-height:1;
                          color:#A4773E;
                        "
                      >
                        03
                      </div>

                      <div
                        style="
                          margin-top:10px;
                          font-size:12px;
                          font-weight:700;
                          color:#3A342D;
                        "
                      >
                        Made for You
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:11px;
                          line-height:18px;
                          color:#8B8177;
                        "
                      >
                        A more personal way to discover what you love.
                      </div>

                    </td>

                  </tr>

                </table>

              </div>

              <!-- CTA -->

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:42px;
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
                      href="${clientUrl}"
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
                      Start Exploring →
                    </a>

                  </td>

                </tr>

              </table>

              <!-- Security Note -->

              <p
                style="
                  margin:28px 0 0;
                  font-size:12px;
                  line-height:21px;
                  color:#A0988E;
                "
              >
                This email confirms that a Taksham account was
                created using this email address. If this wasn't you,
                please contact our support team.
              </p>

            </td>
          </tr>

          <!-- ========================================
               FOOTER
          ======================================== -->

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
                Thoughtfully designed furniture and interiors
                for spaces that feel like home.
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
                © 2026 Taksham. All rights reserved.
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

export default verifyEmailTemplate;