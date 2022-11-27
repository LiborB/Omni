import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { DateTime } from 'luxon';

@Injectable()
export class SharedService {
  readonly s3 = new S3Client({
    region: 'ap-southeast-2',
  });

  generateCloudfrontSignedUrl(url: string) {
    console.log(getSignedUrl({
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      url,
      dateLessThan: DateTime.utc().plus({
        hour: 1
      }).toJSDate().toString()
    }))
    return getSignedUrl({
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      url,
      dateLessThan: DateTime.utc().plus({
        hour: 1
      }).toJSDate().toString()
    })
  }
}
