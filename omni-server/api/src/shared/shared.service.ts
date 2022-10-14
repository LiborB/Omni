import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class SharedService {
  readonly s3 = new S3Client({
    region: 'ap-southeast-2',
  });
}
