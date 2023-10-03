import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class TwoAFStrategy extends PassportStrategy(Strategy, '2AF-Strategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('2AFToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.TWO_AF_TOKEN_SECRET,
    });
  }
  async validate(payload) {
    console.log(payload, ' payload 2 af strategy');
    return true;
  }
}
