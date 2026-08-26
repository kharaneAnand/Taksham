export type OrderEmailStatus =
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

interface OrderStatusTemplateProps {
  firstName: string;

  orderNumber: string;

  orderStatus: OrderEmailStatus;
}

const getStatusContent = (
  orderStatus: OrderEmailStatus,
) => {
  switch (orderStatus) {
    case "processing":
      return {
        title:
          "Your order is being prepared",

        heading:
          "We're preparing your order",

        message:
          "Your order has been confirmed and our team is now preparing it for shipment.",
      };

    case "shipped":
      return {
        title:
          "Your order has been shipped",

        heading:
          "Your order is on its way",

        message:
          "Great news! Your order has been shipped and is now on its way to you.",
      };

    case "out_for_delivery":
      return {
        title:
          "Your order is out for delivery",

        heading:
          "Your order is arriving soon",

        message:
          "Your order is out for delivery and should reach you soon.",
      };

    case "delivered":
      return {
        title:
          "Your order has been delivered",

        heading:
          "Your order has been delivered 🎉",

        message:
          "Your order has been delivered successfully. We hope you enjoy your purchase!",
      };
  }
};

const orderStatusTemplate = ({
  firstName,
  orderNumber,
  orderStatus,
}: OrderStatusTemplateProps) => {
  const statusContent =
    getStatusContent(
      orderStatus,
    );

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
    ${statusContent.title}
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
                Order Update
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
                ${statusContent.heading}
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
                ${statusContent.message}
              </p>

              <!-- Order Details -->

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
                      color:
                        #6b7280;
                      font-size:
                        14px;
                    "
                  >
                    Current Status
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
                        14px;
                      font-weight:
                        700;
                    "
                  >
                    ${orderStatus
                      .replace(
                        /_/g,
                        " ",
                      )
                      .replace(
                        /\b\w/g,
                        (letter) =>
                          letter.toUpperCase(),
                      )}
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
                We'll continue to keep you updated about your order.
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

export default orderStatusTemplate;