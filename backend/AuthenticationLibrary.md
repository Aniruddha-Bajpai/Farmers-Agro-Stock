### Authentication Library ->

1. bcryptjs: when we save our password, so to not let anyone see password by accessing mongodb compass including the admin, we cannot access the user credentials.
2. jsonwebtoken: basically to generate tokens
3. validator: to validate in email field
4. nodemailer: if forget password then he should be receiving email automatically
5. cookie-parser: storing jsonwebtokens in cookie and cookie-parser allows us
   body-parser:
