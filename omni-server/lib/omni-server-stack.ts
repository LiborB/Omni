import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {OAuthScope, UserPool, UserPoolClient, UserPoolClientIdentityProvider} from "aws-cdk-lib/aws-cognito";
import {Code, Function, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {resolve} from "path";
import {CfnAuthorizer, CfnMethod, LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class OmniServerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(scope, "UserPool", {
            autoVerify: {
                email: true
            },
            standardAttributes: {
                email: {
                    required: true
                },
                preferredUsername: {
                    required: true
                }
            },
            signInAliases: {
                email: true,
                username: true,
            },
            selfSignUpEnabled: true
        })

        const userPoolClient = new UserPoolClient(scope, "UserPoolClient", {
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
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
        })

        const lambdaLayer = new LayerVersion(scope, 'HandlerLayer', {
            code: Code.fromAsset(resolve(__dirname, '../api/node_modules')),
            compatibleRuntimes: [Runtime.NODEJS_16_X],
            description: 'Api Handler Dependencies',
        });

        const handler = new Function(scope, 'Handler', {
            code: Code.fromAsset(resolve(__dirname, '../api/dist'), {
                exclude: ['node_modules'],
            }),
            handler: 'main.api',
            runtime: Runtime.NODEJS_16_X,
            layers: [lambdaLayer],
        });

        const api = new RestApi(scope, "AppApi", {
            deploy: true,
            defaultMethodOptions: {
                apiKeyRequired: true
            },
            deployOptions: {
                stageName: "v1"
            }
        })

        const apiResource = api.root.addProxy({
            defaultIntegration: new LambdaIntegration(handler)
        })

        const anyMethod = apiResource.anyMethod?.node.defaultChild as CfnMethod;
        const authorizer = new CfnAuthorizer(this, 'CognitoAuthorizer', {
            name: 'App_Authorizer',
            identitySource: 'method.request.header.Authorization',
            providerArns: [userPool.userPoolArn],
            restApiId: api.restApiId,
            type: 'COGNITO_USER_POOLS',
        });

        anyMethod.node.addDependency(authorizer);
        anyMethod.addOverride('Properties.AuthorizerId', authorizer.ref);
    }
}
