interface VerifyEmailTemplateProps {
  firstName: string;
  verificationLink: string;
}

const verifyEmailTemplate = ({
  firstName,
  verificationLink,
}: VerifyEmailTemplateProps): string => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email</title>
</head>

<body
style="
margin:0;
padding:0;
background:#F8F6F2;
font-family:Arial,Helvetica,sans-serif;
color:#1E1E1E;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
padding:40px 20px;
background:#F8F6F2;
"
>

<tr>
<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
style="
background:#FFFFFF;
border-radius:20px;
overflow:hidden;
box-shadow:0 12px 40px rgba(0,0,0,.08);
"
>

<!-- ================= Header ================= -->

<tr>

<td
style="
padding:35px 45px;
border-bottom:1px solid #ECE7E2;
background:#FFFFFF;
"
>

<table width="100%">

<tr>

<td
style="
font-size:26px;
font-weight:700;
letter-spacing:2px;
color:#111111;
"
>

ART EFFECT

</td>

<td
align="right"
style="
font-size:13px;
color:#8B8B8B;
"
>

Craft Beautiful Living Spaces

</td>

</tr>

</table>

</td>

</tr>

<!-- ================= Hero ================= -->

<tr>

<td
style="
padding:0;
"
>

<img
src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
alt="Luxury Living Room"
width="620"
style="
display:block;
width:100%;
height:auto;
"
>

</td>

</tr>

<!-- ================= Content ================= -->

<tr>

<td
style="
padding:50px;
"
>

<p
style="
margin:0;
font-size:15px;
color:#777777;
letter-spacing:1px;
text-transform:uppercase;
"
>

WELCOME TO ART EFFECT

</p>

<h1
style="
margin:18px 0;
font-size:40px;
font-weight:700;
line-height:50px;
color:#111111;
"
>

Create Your<br>
Dream Home

</h1>

<p
style="
font-size:17px;
line-height:30px;
color:#666666;
margin-bottom:35px;
"
>

Hello <strong>${firstName}</strong>,

<br><br>

Thank you for joining <strong>Art Effect</strong>.

We're excited to help you discover timeless furniture,
beautiful interiors, and thoughtfully curated collections.

Before you begin, please verify your email address.

</p>

<table
cellpadding="0"
cellspacing="0"
style="
margin:40px auto;
"
>

<tr>

<td
align="center"
style="
border-radius:12px;
background:#111111;
"
>

<a
href="${verificationLink}"
style="
display:inline-block;
padding:18px 42px;
font-size:16px;
font-weight:bold;
color:#FFFFFF;
text-decoration:none;
letter-spacing:.5px;
"
>

Verify My Email →

</a>

</td>

</tr>

</table>

<!-- Feature Card -->

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#FAF8F5;
border:1px solid #ECE7E2;
border-radius:16px;
margin-top:45px;
"
>

<tr>

<td
style="
padding:30px;
"
>

<h3
style="
margin-top:0;
font-size:20px;
color:#111111;
"
>

Your Membership Includes

</h3>

<p
style="
margin:10px 0;
color:#555555;
font-size:15px;
"
>

✓ Curated Premium Collections

</p>

<p
style="
margin:10px 0;
color:#555555;
font-size:15px;
"
>

✓ Interior Design Inspiration

</p>

<p
style="
margin:10px 0;
color:#555555;
font-size:15px;
"
>

✓ Exclusive Member Offers

</p>

<p
style="
margin:10px 0 0;
color:#555555;
font-size:15px;
"
>

✓ Personalized Shopping Experience

</p>

</td>

</tr>

</table>

<!-- Security Card -->

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
margin-top:25px;
background:#FFFFFF;
border:1px solid #ECE7E2;
border-radius:16px;
"
>

<tr>

<td
style="
padding:28px;
"
>

<h3
style="
margin:0;
font-size:18px;
color:#111111;
"
>

🔒 Secure Verification

</h3>

<p
style="
margin-top:15px;
font-size:15px;
line-height:28px;
color:#666666;
"
>

This verification link is valid for
<strong>15 minutes</strong>.

If you didn't create an account,
you can safely ignore this email.

</p>

</td>

</tr>

</table>

<!-- Fallback Link -->

<p
style="
margin-top:40px;
font-size:14px;
color:#777777;
line-height:24px;
"
>

If the button doesn't work, copy and paste this link into your browser.

</p>

<p
style="
background:#F4F4F4;
padding:18px;
border-radius:10px;
word-break:break-all;
font-size:13px;
color:#444444;
line-height:22px;
"
>

${verificationLink}

</p>

</td>

</tr>

<!-- ================= Footer ================= -->

<tr>

<td
style="
background:#FAF8F5;
padding:45px;
border-top:1px solid #ECE7E2;
"
>

<h3
style="
margin-top:0;
font-size:22px;
color:#111111;
"
>

Need Help?

</h3>

<p
style="
font-size:15px;
line-height:28px;
color:#666666;
margin-bottom:25px;
"
>

Our team is here to help you create
beautiful living spaces.

</p>

<p
style="
margin:0;
font-size:15px;
color:#111111;
font-weight:bold;
"
>

support@arteffect.com

</p>

<hr
style="
margin:35px 0;
border:none;
border-top:1px solid #E8E8E8;
"
>

<table width="100%">

<tr>

<td
style="
font-size:13px;
color:#888888;
"
>

© 2026 Art Effect

</td>

<td
align="right"
style="
font-size:13px;
color:#888888;
"
>

Craft Beautiful Living Spaces

</td>

</tr>

</table>

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