export interface OrderEmailItem {
  productName: string;

  quantity: number;

  price: number;

  subtotal: number;

  variant?: {
    color?: string;

    material?: string;
  };
}

export interface OrderConfirmationTemplateProps {
  firstName: string;

  orderNumber: string;

  items: OrderEmailItem[];

  subtotal: number;

  discountAmount: number;

  shippingCost: number;

  total: number;

  paymentMethod: "cod" | "online";
}

const formatPrice = (
  amount: number,
): string => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",

      currency: "INR",

      maximumFractionDigits: 0,
    },
  ).format(amount);
};

export const orderConfirmationTemplate = ({
  firstName,
  orderNumber,
  items,
  subtotal,
  discountAmount,
  shippingCost,
  total,
  paymentMethod,
}: OrderConfirmationTemplateProps): string => {
  const orderItemsHtml =
    items
      .map(
        (item) => `
<tr>
  <td
    style="
      padding:16px 0;
      border-bottom:1px solid #EDE6DE;
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

        <td valign="top">

          <div
            style="
              font-size:14px;
              font-weight:700;
              line-height:21px;
              color:#29251F;
            "
          >
            ${item.productName}
          </div>

          ${
            item.variant?.color ||
            item.variant?.material
              ? `
          <div
            style="
              margin-top:4px;
              font-size:12px;
              line-height:18px;
              color:#81776C;
            "
          >
            ${
              [
                item.variant.color,
                item.variant.material,
              ]
                .filter(Boolean)
                .join(" • ")
            }
          </div>
          `
              : ""
          }

          <div
            style="
              margin-top:5px;
              font-size:12px;
              color:#91877B;
            "
          >
            Qty: ${item.quantity} × ${formatPrice(
              item.price,
            )}
          </div>

        </td>

        <td
          align="right"
          valign="top"
          style="
            padding-left:16px;
            font-size:14px;
            font-weight:700;
            white-space:nowrap;
            color:#29251F;
          "
        >
          ${formatPrice(
            item.subtotal,
          )}
        </td>

      </tr>
    </table>
  </td>
</tr>
`,
      )
      .join("");

  const paymentMessage =
    paymentMethod === "cod"
      ? "You can pay for your order when it is delivered."
      : "Your payment has been successfully confirmed.";

  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Order Confirmed | Taksham</title>
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

          <!-- HEADER -->

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
                      Order Confirmed
                    </div>
                  </td>

                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->

          <tr>
            <td
              align="center"
              style="
                padding:48px 42px 46px;
                background-color:#F8F4EE;
              "
            >

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
                &#10003;
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
                Thank You For Your Order
              </div>

              <h1
                style="
                  margin:18px 0 0;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:40px;
                  font-weight:500;
                  line-height:1.1;
                  letter-spacing:-1.2px;
                  color:#29251F;
                "
              >
                Your order is
                <br />
                <span
                  style="
                    color:#A4773E;
                  "
                >
                  confirmed.
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
                We've received your order and will keep you updated
                as it moves through each step.
              </p>

            </td>
          </tr>

          <!-- CONTENT -->

          <tr>
            <td
              style="
                padding:42px;
              "
            >

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
                  margin:14px 0 0;
                  font-size:15px;
                  line-height:25px;
                  color:#756C62;
                "
              >
                Thank you for choosing Taksham. Your order has been
                successfully placed.
              </p>

              <!-- ORDER NUMBER -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:28px;
                  background-color:#F8F4EE;
                  border:1px solid #E9DED0;
                  border-radius:14px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:20px 22px;
                    "
                  >

                    <div
                      style="
                        font-size:9px;
                        font-weight:700;
                        letter-spacing:1.8px;
                        text-transform:uppercase;
                        color:#A4773E;
                      "
                    >
                      Order Number
                    </div>

                    <div
                      style="
                        margin-top:8px;
                        font-size:19px;
                        font-weight:700;
                        color:#29251F;
                      "
                    >
                      ${orderNumber}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- ORDER ITEMS -->

              <div
                style="
                  margin-top:34px;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:23px;
                  color:#29251F;
                "
              >
                Order summary
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:12px;
                "
              >
                ${orderItemsHtml}
              </table>

              <!-- TOTALS -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:22px;
                "
              >

                <tr>
                  <td
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#81776C;
                    "
                  >
                    Subtotal
                  </td>

                  <td
                    align="right"
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#5F5142;
                    "
                  >
                    ${formatPrice(subtotal)}
                  </td>
                </tr>

                ${
                  discountAmount > 0
                    ? `
                <tr>
                  <td
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#81776C;
                    "
                  >
                    Discount
                  </td>

                  <td
                    align="right"
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#8F6B3F;
                    "
                  >
                    −${formatPrice(
                      discountAmount,
                    )}
                  </td>
                </tr>
                `
                    : ""
                }

                <tr>
                  <td
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#81776C;
                    "
                  >
                    Shipping
                  </td>

                  <td
                    align="right"
                    style="
                      padding:7px 0;
                      font-size:13px;
                      color:#5F5142;
                    "
                  >
                    ${
                      shippingCost === 0
                        ? "Free"
                        : formatPrice(
                            shippingCost,
                          )
                    }
                  </td>
                </tr>

                <tr>
                  <td
                    colspan="2"
                    style="
                      padding-top:15px;
                      border-top:1px solid #EDE6DE;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size:17px;
                      font-weight:700;
                      color:#29251F;
                    "
                  >
                    Total
                  </td>

                  <td
                    align="right"
                    style="
                      font-size:19px;
                      font-weight:700;
                      color:#29251F;
                    "
                  >
                    ${formatPrice(total)}
                  </td>
                </tr>

              </table>

              <!-- PAYMENT -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:34px;
                  background-color:#FCFAF7;
                  border:1px solid #E8E0D6;
                  border-radius:14px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:22px;
                    "
                  >

                    <div
                      style="
                        font-size:14px;
                        font-weight:700;
                        color:#29251F;
                      "
                    >
                      Payment method
                    </div>

                    <div
                      style="
                        margin-top:8px;
                        font-size:13px;
                        line-height:22px;
                        color:#81776C;
                      "
                    >
                      ${
                        paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"
                      }
                    </div>

                    <div
                      style="
                        margin-top:6px;
                        font-size:12px;
                        line-height:20px;
                        color:#91877B;
                      "
                    >
                      ${paymentMessage}
                    </div>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->

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

              <p
                style="
                  margin:24px 0 0;
                  font-size:12px;
                  line-height:21px;
                  color:#BEB7AE;
                "
              >
                Thank you for shopping with Taksham. We hope you love
                your new pieces.
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