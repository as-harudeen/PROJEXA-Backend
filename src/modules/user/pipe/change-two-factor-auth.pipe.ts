import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ChangeTwoFactorAuthPipe implements PipeTransform {
    transform(param: string) {
        if(param !== 'enable' && param !== 'disable')
            throw new BadRequestException('Invalid param');

        return param;    
    }
}