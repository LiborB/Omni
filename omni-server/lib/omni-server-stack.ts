import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    ClientAttributes,
    OAuthScope,
    UserPool,
    UserPoolClient,
    UserPoolClientIdentityProvider
} from "aws-cdk-lib/aws-cognito";
import {Code, Function, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {resolve} from "path";
import {AuthorizationType, CognitoUserPoolsAuthorizer, LambdaRestApi} from "aws-cdk-lib/aws-apigateway";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class OmniServerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(this, "UserPool", {
            autoVerify: {
                email: true
            },
            standardAttributes: {
                email: {
                    required: true
                },
            },
            signInAliases: {
                email: true,
                username: true,
            },
            selfSignUpEnabled: true,

        })

        const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
            userPool,
            userPoolClientName: "App Client",
            authFlows: {
                userSrp: true,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true
                },
                scopes: [OAuthScope.PROFILE],
            },
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
            readAttributes: new ClientAttributes().withStandardAttributes({
                emailVerified: true
            })
        })

        const handler = new Function(this, 'Handler', {
            code: Code.fromAsset(resolve(__dirname, '../api/dist')),
            handler: 'main.api',
            runtime: Runtime.NODEJS_16_X,
        });

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'ApiAuthorizer', {
            cognitoUserPools: [userPool]
        });

        const api = new LambdaRestApi(this, "AppApi", {
            handler,
            defaultMethodOptions: {
                authorizer,
                authorizationType: AuthorizationType.COGNITO
            }
        })
    }
}
