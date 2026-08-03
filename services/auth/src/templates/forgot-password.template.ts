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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>

<body
style="
margin:0;
padding:0;
background:#F8F6F2;
font-family:Arial,Helvetica,sans-serif;
color:#222222;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 20px;background:#F8F6F2;"
>

<tr>
<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:22px;
overflow:hidden;
box-shadow:0 18px 50px rgba(0,0,0,.08);
"
>

<!-- HEADER -->

<tr>

<td
style="
padding:38px 45px;
background:#ffffff;
border-bottom:1px solid #ECE7E2;
"
>

<table width="100%">

<tr>

<td
style="
font-size:28px;
font-weight:700;
letter-spacing:1px;
color:#111111;
"
>

Taksham (तक्षम्)

</td>

<td
align="right"
style="
font-size:13px;
color:#888888;
"
>

Luxury Living • Modern Design

</td>

</tr>

</table>

</td>

</tr>

<!-- HERO -->

<tr>

<td
style="
background:#F5F2ED;
padding:60px 45px;
text-align:center;
"
>

<div
style="
font-size:56px;
margin-bottom:18px;
"
>

🔐

</div>

<h1
style="
margin:0;
font-size:42px;
line-height:48px;
color:#111111;
font-weight:700;
"
>

Reset Your Password

</h1>

<p
style="
margin-top:18px;
font-size:18px;
color:#666666;
line-height:30px;
"
>

Secure your account and continue
your journey with Taksham.

</p>

</td>

</tr>

<!-- CONTENT -->

<tr>

<td
style="
padding:50px;
"
>

<p
style="
margin-top:0;
font-size:17px;
line-height:30px;
color:#555555;
"
>

Hello <strong>${firstName}</strong>,

</p>

<p
style="
font-size:16px;
line-height:30px;
color:#666666;
"
>

We received a request to reset the password for your Taksham account.

If this was you, simply click the button below to create a new password.

</p>

<table
align="center"
cellpadding="0"
cellspacing="0"
style="margin:40px auto;"
>

<tr>

<td
style="
background:#111111;
border-radius:14px;
"
>

<a
href="${resetLink}"
style="
display:inline-block;
padding:18px 42px;
color:#ffffff;
text-decoration:none;
font-size:16px;
font-weight:bold;
letter-spacing:.3px;
"
>

Reset Password →

</a>

</td>

</tr>

</table>

<!-- SECURITY CARD -->

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#FAF8F5;
border:1px solid #ECE7E2;
border-radius:16px;
margin-top:20px;
"
>

<tr>

<td style="padding:28px;">

<h3
style="
margin-top:0;
color:#111111;
font-size:20px;
"
>

🔒 Security Information

</h3>

<p
style="
font-size:15px;
line-height:28px;
color:#666666;
margin-bottom:0;
"
>

• This reset link is valid for <strong>15 minutes</strong>.

<br><br>

• The link can only be used once.

<br><br>

• Your password will remain unchanged until you create a new one.

</p>

</td>

</tr>

</table>

<!-- FALLBACK -->

<p
style="
margin-top:35px;
font-size:15px;
line-height:28px;
color:#666666;
"
>

If the button doesn't work, copy and paste this link into your browser.

</p>

<div
style="
background:#F5F5F5;
padding:18px;
border-radius:12px;
word-break:break-all;
font-size:13px;
line-height:24px;
color:#555555;
"
>

${resetLink}

</div>

<p
style="
margin-top:35px;
font-size:15px;
line-height:30px;
color:#666666;
"
>

Didn't request a password reset?

You can safely ignore this email. Your password will remain secure.

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
style="
padding:40px;
background:#FAF8F5;
border-top:1px solid #ECE7E2;
"
>

<table width="100%">

<tr>

<td>

<h3
style="
margin:0;
font-size:20px;
color:#111111;
"
>

Need Help?

</h3>

<p
style="
margin:15px 0 0;
font-size:15px;
line-height:28px;
color:#666666;
"
>

Our support team is always here to help.

</p>

<p
style="
margin-top:20px;
font-size:15px;
font-weight:bold;
color:#111111;
"
>

support@taksham.com

</p>

</td>

</tr>

</table>

<hr
style="
margin:35px 0;
border:none;
border-top:1px solid #E7E7E7;
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

© ${new Date().getFullYear()} Taksham (तक्षम्)

</td>

<td
align="right"
style="
font-size:13px;
color:#888888;
"
>

Built with Trust & Elegance

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