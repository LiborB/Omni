job("Run npm i and build") {
    container(displayName = "Run publish script", image = "node:16-alpine") {
        shellScript {
            interpreter = "/bin/sh"
            content = """
            	set AWS_ACCESS_KEY_ID=$access_key_id
                set AWS_SECRET_ACCESS_KEY=$access_key_secret
                cd omni-server
                npm ci --production
                cd api
                npm ci --production
                npm run build
                cp node_modules dist
                cd ..
                zip -r api.zip dist
                npx cdk bootstrap aws://368175386802/ap-southeast-2
                npx cdk synth
                npx cdk deploy

            """
        }
    }
}
