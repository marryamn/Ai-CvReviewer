import {ApiProperty} from "@nestjs/swagger";

export class UploadFileRequest{
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Accepted file formats: PNG, JPG, JPEG',
    })
    file?: Buffer;
}