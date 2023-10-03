export const generateOTP = (leng: number) => {
    let OTP = "";
    for(let i = 0; i < leng; i++) {
        OTP += Math.floor(Math.random() * 10).toString();
    }

    return OTP;
}