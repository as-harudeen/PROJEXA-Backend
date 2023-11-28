import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ChangeTaskPostionPipe implements PipeTransform {
    transform(body: {new_position: string, new_stage_id?: string}) {
        if(!+body.new_position && +body.new_position !== 0) {
            throw new BadRequestException("Invalid task position");
        }
        return body;
    }
}