interface PaymentSuccessTemplateProps {
  firstName: string;

  orderNumber: string;

  amount: number;

  paymentId: string;
}

const formatPrice = (
  amount: number,
) => {
  return `₹${amount.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
};

const paymentSuccessTemplate = ({
  firstName,
  orderNumber,
  amount,
  paymentId,
}: PaymentSuccessTemplateProps) => {
  return `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Payment Successful
  </title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f6f6f3;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
    color: #1f2937;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      padding: 40px 16px;
      background-color: #f6f6f3;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          "
        >

          <!-- Header -->

          <tr>
            <td
              align="center"
              style="
                padding:
                  32px
                  24px;
                background-color:
                  #1f2937;
              "
            >

              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  letter-spacing: 0.5px;
                "
              >
                Taksham
              </h1>

              <p
                style="
                  margin:
                    8px
                    0
                    0;
                  color:
                    #d1d5db;
                  font-size: 14px;
                "
              >
                Payment Successful
              </p>

            </td>
          </tr>


          <!-- Content -->

          <tr>
            <td
              style="
                padding:
                  40px
                  32px;
              "
            >

              <h2
                style="
                  margin:
                    0
                    0
                    16px;
                  font-size:
                    24px;
                  color:
                    #111827;
                "
              >
                Payment successful 🎉
              </h2>


              <p
                style="
                  margin:
                    0
                    0
                    24px;
                  font-size:
                    16px;
                  line-height:
                    1.7;
                  color:
                    #4b5563;
                "
              >
                Hi ${firstName},
                <br />
                <br />
                We've successfully received your payment for
                order
                <strong>
                  ${orderNumber}
                </strong>.
              </p>


              <!-- Payment Details -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color:
                    #f9fafb;
                  border-radius:
                    12px;
                  margin:
                    0
                    0
                    24px;
                "
              >

                <tr>
                  <td
                    style="
                      padding:
                        20px
                        24px;
                      border-bottom:
                        1px
                        solid
                        #e5e7eb;
                      color:
                        #6b7280;
                      font-size:
                        14px;
                    "
                  >
                    Order Number
                  </td>

                  <td
                    align="right"
                    style="
                      padding:
                        20px
                        24px;
                      border-bottom:
                        1px
                        solid
                        #e5e7eb;
                      color:
                        #111827;
                      font-size:
                        14px;
                      font-weight:
                        600;
                    "
                  >
                    ${orderNumber}
                  </td>
                </tr>


                <tr>
                  <td
                    style="
                      padding:
                        20px
                        24px;
                      border-bottom:
                        1px
                        solid
                        #e5e7eb;
                      color:
                        #6b7280;
                      font-size:
                        14px;
                    "
                  >
                    Payment ID
                  </td>

                  <td
                    align="right"
                    style="
                      padding:
                        20px
                        24px;
                      border-bottom:
                        1px
                        solid
                        #e5e7eb;
                      color:
                        #111827;
                      font-size:
                        14px;
                      font-weight:
                        600;
                    "
                  >
                    ${paymentId}
                  </td>
                </tr>


                <tr>
                  <td
                    style="
                      padding:
                        20px
                        24px;
                      color:
                        #6b7280;
                      font-size:
                        14px;
                    "
                  >
                    Amount Paid
                  </td>

                  <td
                    align="right"
                    style="
                      padding:
                        20px
                        24px;
                      color:
                        #111827;
                      font-size:
                        16px;
                      font-weight:
                        700;
                    "
                  >
                    ${formatPrice(amount)}
                  </td>
                </tr>

              </table>


              <p
                style="
                  margin: 0;
                  font-size: 16px;
                  line-height: 1.7;
                  color: #4b5563;
                "
              >
                Your order is now confirmed and we'll keep you
                updated as it moves through each stage.
              </p>

            </td>
          </tr>


          <!-- Footer -->

          <tr>
            <td
              align="center"
              style="
                padding:
                  24px;
                background-color:
                  #f9fafb;
                border-top:
                  1px
                  solid
                  #e5e7eb;
              "
            >

              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  color: #9ca3af;
                "
              >
                © ${new Date().getFullYear()} Taksham.
                All rights reserved.
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

export default paymentSuccessTemplate;