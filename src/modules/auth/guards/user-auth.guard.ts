import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();
        const token = request.cookies.access_token;
        if(!token) throw new UnauthorizedException();

        try {
            const claim = await this.jwtService.verifyAsync(token, {secret: process.env.SECRET});
            if(claim == null) throw new Error("Invalid token");

            request.user = claim;
            return true;
        } catch (err) {
            response.clearCookie("access_token");
            throw new UnauthorizedException(err.message);
        }
    }
}