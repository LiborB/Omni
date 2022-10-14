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

    songBucket.grantReadWrite(handler);
  }
}
