import "dotenv/config"
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  ClientAttributes,
  OAuthScope,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { resolve } from "path";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Bucket } from "aws-cdk-lib/aws-s3";
import {
  CachePolicy,
  Distribution,
  KeyGroup,
  OriginRequestPolicy,
  PublicKey,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Duration } from "aws-cdk-lib";

export class OmniServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "UserPool", {
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
      },
      signInAliases: {
        email: true,
        username: true,
      },
      selfSignUpEnabled: true,
    });

    const userPoolDomain = new UserPoolDomain(this, "UserPoolDomain", {
      userPool,
      cognitoDomain: {
        domainPrefix: "omni",
      },
    });

    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "App Client",
      authFlows: {
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.PROFILE],
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      readAttributes: new ClientAttributes().withStandardAttributes({
        emailVerified: true,
      }),
    });

    const handler = new Function(this, "ApiLambda", {
      code: Code.fromAsset(resolve(__dirname, "../api/dist")),
      handler: "main.handler",
      runtime: Runtime.NODEJS_16_X,
      functionName: "omni-api-lambda",
    });

    const authorizer = new CognitoUserPoolsAuthorizer(this, "ApiAuthorizer", {
      cognitoUserPools: [userPool],
    });

    const api = new LambdaRestApi(this, "AppApi", {
      handler,
      defaultMethodOptions: {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      },
      restApiName: "omni-api",
    });

    const songBucket = new Bucket(this, "SongBucket", {
      bucketName: "omni-player-song-bucket",
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
        ignorePublicAcls: true,
      },
    });

    const thumbnailBucket = new Bucket(this, "ThumbnailBucket", {
      bucketName: "omni-player-thumbnail-bucket",
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
        ignorePublicAcls: true,
      },
    });

    songBucket.grantPut(handler)
    thumbnailBucket.grantPut(handler)


    const contentCachePolicy = new CachePolicy(this, "SongCachePolicy", {
      minTtl: Duration.days(7),
      maxTtl: Duration.days(7),
      defaultTtl: Duration.days(7),
    });

    const pubKey = new PublicKey(this, "CloudfrontPublicKey", {
      encodedKey: `-----BEGIN PUBLIC KEY-----
      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxiwa7QdH8jywfvpu765Q
      0xqg1e2JPaPs2pHMhUaWFulvBWzc9km+P94yptEDaOfSe8j17VKWRRMM3hoBajmq
      vbXe+y0u6gtnxjqp+YWKWqW1rCckU5+gC4KSlOGkSw1XP6r/E7hvDNEbkWanRfY0
      MSvwA/cxkpWSLCu+5Z74htWbu4Z9x9i3jNOdz56LGh+bmQEWk747ar2e9qzlg6q0
      pt3f/WBvhWsDe/atMzoJnD2laeksS6dUuUbcRtnbu4kkrAl8byW5DROCc/kcwG4J
      e/1M22SLZo9E4qiHh044ebMVeOBy7TSf/hwwoNe1jNXgJuYmNy4dvS1EZKyGvfls
      qwIDAQAB
      -----END PUBLIC KEY-----`,
      publicKeyName: "omni-api-access"
    })

    const keyGroup = new KeyGroup(this, "ApiKeyGroup", {
      items: [
        pubKey
      ]
    })

    new Distribution(this, "SongDistribution", {
      defaultBehavior: {
        origin: new S3Origin(songBucket),
        cachePolicy: contentCachePolicy,
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        trustedKeyGroups: [keyGroup]
      },
    });

    new Distribution(this, "ThumbnailDistribution", {
      defaultBehavior: {
        origin: new S3Origin(thumbnailBucket),
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        cachePolicy: contentCachePolicy,
        trustedKeyGroups: [keyGroup]
      },
    });
  }
}
