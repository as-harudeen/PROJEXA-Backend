import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidateOTPPipe implements PipeTransform {
    transform(otp: string) {
        try {
            if(otp.length !== 6 || isNaN(+otp)) {
                throw new BadRequestException("Invalid OTP")
            }
        } catch (err) {
            throw new BadRequestException(err.message);
        }
        return otp.toString();
    }
}