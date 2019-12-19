import Reflux from 'reflux';

const AuthActions = Reflux.createActions([
    "Login",
    "VerifyLogin",
    "RegistCaptcha",
    "Logout",
    "Regist",
    "ForgotPassword",
    "ResetPassword",
    "ClearState",
    "LoginMobile",
    "LogoutMobile",
    "VerifyLoginMobile"
])

export default AuthActions;
