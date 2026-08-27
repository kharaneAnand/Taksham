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
        eyebrow: "ORDER UPDATE",
        title: "We're preparing your order",
        heading: "Your order is being prepared",
        message:
          "Your order has been confirmed and our team is carefully preparing everything for its journey to your home.",
        statusLabel: "In Preparation",
        statusColor: "#A4773E",
        statusBackground: "#F4ECE1",
        icon: "✦",
      };

    case "shipped":
      return {
        eyebrow: "ORDER UPDATE",
        title: "Your order is on its way",
        heading: "Your order has been shipped",
        message:
          "Great news. Your order has left our team and is now making its way to you.",
        statusLabel: "On Its Way",
        statusColor: "#667C8A",
        statusBackground: "#EAF0F3",
        icon: "→",
      };

    case "out_for_delivery":
      return {
        eyebrow: "ORDER UPDATE",
        title: "Your order is arriving soon",
        heading: "Your order is out for delivery",
        message:
          "Your order is now out for delivery and should be arriving at your doorstep very soon.",
        statusLabel: "Arriving Soon",
        statusColor: "#9A6B20",
        statusBackground: "#FBF2E2",
        icon: "✦",
      };

    case "delivered":
      return {
        eyebrow: "ORDER COMPLETE",
        title: "Your order has been delivered",
        heading: "Your order has arrived",
        message:
          "Your order has been delivered successfully. We hope it brings something beautiful and meaningful to your space.",
        statusLabel: "Delivered",
        statusColor: "#4E7657",
        statusBackground: "#EAF3EC",
        icon: "✓",
      };
  }
};

const formatOrderStatus = (
  status: OrderEmailStatus,
) => {
  return status
    .replace(
      /_/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase(),
    );
};

const orderStatusTemplate = ({
  firstName,
  orderNumber,
  orderStatus,
}: OrderStatusTemplateProps) => {
  const statusContent =
    getStatusContent(orderStatus);

  const currentYear =
    new Date().getFullYear();

  return `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="x-apple-disable-message-reformatting"
  />

  <title>
    ${statusContent.title}
  </title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #F3F0EB;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
    color: #29251F;
  "
>

  <div
    style="
      display: none;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
    "
  >
    ${statusContent.title} — Order #${orderNumber}
  </div>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
    style="
      width: 100%;
      background-color: #F3F0EB;
      padding: 40px 16px;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="
            width: 100%;
            max-width: 620px;
          "
        >

          <!-- =====================================
               BRAND
          ====================================== -->

          <tr>
            <td
              align="center"
              style="
                padding:
                  0
                  20px
                  22px;
              "
            >

              <p
                style="
                  margin: 0;
                  font-family:
                    Georgia,
                    'Times New Roman',
                    serif;
                  font-size: 32px;
                  line-height: 1;
                  letter-spacing: -1px;
                  color: #29251F;
                "
              >
                Taksham
              </p>

              <p
                style="
                  margin:
                    8px
                    0
                    0;
                  font-size: 9px;
                  font-weight: 700;
                  letter-spacing: 2.5px;
                  color: #A4773E;
                "
              >
                THOUGHTFUL LIVING
              </p>

            </td>
          </tr>

          <!-- =====================================
               MAIN CARD
          ====================================== -->

          <tr>
            <td
              style="
                overflow: hidden;
                background-color: #FFFFFF;
                border-radius: 22px;
                border:
                  1px
                  solid
                  #E5DED5;
                box-shadow:
                  0
                  14px
                  45px
                  rgba(
                    70,
                    56,
                    39,
                    0.08
                  );
              "
            >

              <!-- =================================
                   TOP ACCENT
              ================================== -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
              >
                <tr>
                  <td
                    style="
                      height: 5px;
                      background-color: #A4773E;
                      font-size: 0;
                      line-height: 0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>

              <!-- =================================
                   HERO
              ================================== -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background-color: #29251F;
                "
              >
                <tr>
                  <td
                    align="center"
                    style="
                      padding:
                        42px
                        32px
                        38px;
                    "
                  >

                    <p
                      style="
                        margin:
                          0
                          0
                          18px;
                        font-size: 9px;
                        font-weight: 700;
                        letter-spacing: 2.4px;
                        color: #D7B57D;
                      "
                    >
                      ${statusContent.eyebrow}
                    </p>

                    <div
                      style="
                        width: 54px;
                        height: 54px;
                        margin:
                          0
                          auto
                          20px;
                        border-radius: 50%;
                        background-color:
                          rgba(
                            215,
                            181,
                            125,
                            0.14
                          );
                        border:
                          1px
                          solid
                          rgba(
                            215,
                            181,
                            125,
                            0.25
                          );
                        color: #E1C18D;
                        font-size: 24px;
                        line-height: 54px;
                        text-align: center;
                      "
                    >
                      ${statusContent.icon}
                    </div>

                    <h1
                      style="
                        margin: 0;
                        font-family:
                          Georgia,
                          'Times New Roman',
                          serif;
                        font-size: 31px;
                        font-weight: 400;
                        line-height: 1.2;
                        letter-spacing: -0.5px;
                        color: #FFFFFF;
                      "
                    >
                      ${statusContent.heading}
                    </h1>

                  </td>
                </tr>
              </table>

              <!-- =================================
                   CONTENT
              ================================== -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
              >
                <tr>
                  <td
                    style="
                      padding:
                        38px
                        32px
                        34px;
                    "
                  >

                    <p
                      style="
                        margin:
                          0
                          0
                          18px;
                        font-family:
                          Georgia,
                          'Times New Roman',
                          serif;
                        font-size: 22px;
                        line-height: 1.35;
                        color: #29251F;
                      "
                    >
                      Hi ${firstName},
                    </p>

                    <p
                      style="
                        margin:
                          0
                          0
                          30px;
                        font-size: 15px;
                        line-height: 1.8;
                        color: #756D63;
                      "
                    >
                      ${statusContent.message}
                    </p>

                    <!-- =============================
                         STATUS BADGE
                    ============================== -->

                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      role="presentation"
                      style="
                        margin:
                          0
                          0
                          28px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding:
                              8px
                              14px;
                            border-radius: 999px;
                            background-color:
                              ${statusContent.statusBackground};
                            color:
                              ${statusContent.statusColor};
                            font-size: 10px;
                            font-weight: 700;
                            letter-spacing: 1px;
                          "
                        >
                          ●&nbsp;&nbsp;${statusContent.statusLabel.toUpperCase()}
                        </td>
                      </tr>
                    </table>

                    <!-- =============================
                         ORDER DETAILS
                    ============================== -->

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      role="presentation"
                      style="
                        background-color: #F8F6F2;
                        border:
                          1px
                          solid
                          #E9E3DB;
                        border-radius: 16px;
                      "
                    >

                      <tr>
                        <td
                          colspan="2"
                          style="
                            padding:
                              18px
                              22px
                              14px;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              font-size: 9px;
                              font-weight: 700;
                              letter-spacing: 1.8px;
                              color: #A4773E;
                            "
                          >
                            YOUR ORDER
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:
                              10px
                              22px
                              18px;
                            font-size: 12px;
                            color: #8A8176;
                          "
                        >
                          Order Number
                        </td>

                        <td
                          align="right"
                          style="
                            padding:
                              10px
                              22px
                              18px;
                            font-size: 13px;
                            font-weight: 700;
                            color: #29251F;
                          "
                        >
                          #${orderNumber}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colspan="2"
                          style="
                            padding: 0 22px;
                          "
                        >
                          <div
                            style="
                              height: 1px;
                              background-color: #E5DED5;
                              font-size: 0;
                              line-height: 0;
                            "
                          >
                            &nbsp;
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:
                              18px
                              22px;
                            font-size: 12px;
                            color: #8A8176;
                          "
                        >
                          Current Status
                        </td>

                        <td
                          align="right"
                          style="
                            padding:
                              18px
                              22px;
                            font-size: 13px;
                            font-weight: 700;
                            color:
                              ${statusContent.statusColor};
                          "
                        >
                          ${formatOrderStatus(
                            orderStatus,
                          )}
                        </td>
                      </tr>

                    </table>

                    <!-- =============================
                         TIMELINE
                    ============================== -->

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      role="presentation"
                      style="
                        margin-top: 30px;
                      "
                    >
                      <tr>

                        <td
                          align="center"
                          style="
                            width: 25%;
                          "
                        >
                          <div
                            style="
                              width: 10px;
                              height: 10px;
                              margin:
                                0
                                auto
                                9px;
                              border-radius: 50%;
                              background-color: #A4773E;
                            "
                          >
                            &nbsp;
                          </div>

                          <p
                            style="
                              margin: 0;
                              font-size: 8px;
                              line-height: 1.4;
                              color: #756D63;
                            "
                          >
                            Confirmed
                          </p>
                        </td>

                        <td
                          align="center"
                          style="
                            width: 25%;
                          "
                        >
                          <div
                            style="
                              width: 10px;
                              height: 10px;
                              margin:
                                0
                                auto
                                9px;
                              border-radius: 50%;
                              background-color:
                                ${
                                  [
                                    "processing",
                                    "shipped",
                                    "out_for_delivery",
                                    "delivered",
                                  ].includes(
                                    orderStatus,
                                  )
                                    ? "#A4773E"
                                    : "#DDD6CC"
                                };
                            "
                          >
                            &nbsp;
                          </div>

                          <p
                            style="
                              margin: 0;
                              font-size: 8px;
                              line-height: 1.4;
                              color: #756D63;
                            "
                          >
                            Preparing
                          </p>
                        </td>

                        <td
                          align="center"
                          style="
                            width: 25%;
                          "
                        >
                          <div
                            style="
                              width: 10px;
                              height: 10px;
                              margin:
                                0
                                auto
                                9px;
                              border-radius: 50%;
                              background-color:
                                ${
                                  [
                                    "shipped",
                                    "out_for_delivery",
                                    "delivered",
                                  ].includes(
                                    orderStatus,
                                  )
                                    ? "#A4773E"
                                    : "#DDD6CC"
                                };
                            "
                          >
                            &nbsp;
                          </div>

                          <p
                            style="
                              margin: 0;
                              font-size: 8px;
                              line-height: 1.4;
                              color: #756D63;
                            "
                          >
                            Shipped
                          </p>
                        </td>

                        <td
                          align="center"
                          style="
                            width: 25%;
                          "
                        >
                          <div
                            style="
                              width: 10px;
                              height: 10px;
                              margin:
                                0
                                auto
                                9px;
                              border-radius: 50%;
                              background-color:
                                ${
                                  orderStatus ===
                                  "delivered"
                                    ? "#4E7657"
                                    : "#DDD6CC"
                                };
                            "
                          >
                            &nbsp;
                          </div>

                          <p
                            style="
                              margin: 0;
                              font-size: 8px;
                              line-height: 1.4;
                              color: #756D63;
                            "
                          >
                            Delivered
                          </p>
                        </td>

                      </tr>
                    </table>

                    <p
                      style="
                        margin:
                          32px
                          0
                          0;
                        font-size: 14px;
                        line-height: 1.75;
                        color: #81776C;
                      "
                    >
                      We'll continue to keep you informed as your order moves through each stage.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- =================================
                   SIGNATURE
              ================================== -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background-color: #FCFBF9;
                  border-top:
                    1px
                    solid
                    #E9E3DB;
                "
              >
                <tr>
                  <td
                    style="
                      padding:
                        28px
                        32px;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        line-height: 1.7;
                        color: #756D63;
                      "
                    >
                      With care,
                    </p>

                    <p
                      style="
                        margin:
                          4px
                          0
                          0;
                        font-family:
                          Georgia,
                          'Times New Roman',
                          serif;
                        font-size: 17px;
                        color: #29251F;
                      "
                    >
                      The Taksham Team
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- =====================================
               FOOTER
          ====================================== -->

          <tr>
            <td
              align="center"
              style="
                padding:
                  26px
                  20px
                  0;
              "
            >

              <p
                style="
                  margin: 0;
                  font-size: 10px;
                  line-height: 1.7;
                  color: #9C9389;
                "
              >
                © ${currentYear} Taksham. All rights reserved.
              </p>

              <p
                style="
                  margin:
                    5px
                    0
                    0;
                  font-size: 8px;
                  letter-spacing: 1.3px;
                  color: #B0A69B;
                "
              >
                THOUGHTFUL FURNITURE · BEAUTIFUL LIVING
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