## Serverless-SSM-KMS
This project demonstrate how you can to use AWS System Manager and KMS with Lambda application.
--


### Pre Requirements
- You must have an AWS account
- You must have Serverless Framework installed
- You must have IAM permission to write and read in SSM (see policy.json file in the repository)


## Steps
### 1 - Creating KMS Keys
Command:
```bash
aws kms create-key --description kms-poc-test
```
Output:
```json
{
    "KeyMetadata": {
        "AWSAccountId": "<Account ID>",
        "KeyId": "xxxxxxx-8be9-448a-b2aa-xxxxxxxxxx",
        "Arn": "arn:aws:kms:us-east-1:<Account ID>:key/xxxxxxx-8be9-448a-b2aa-xxxxxxxxxx",
        "CreationDate": 1620302223.792,
        "Enabled": true,
        "Description": "kms-poc-test",
        "KeyUsage": "ENCRYPT_DECRYPT",
        "KeyState": "Enabled",
        "Origin": "AWS_KMS",
        "KeyManager": "CUSTOMER",
        "CustomerMasterKeySpec": "SYMMETRIC_DEFAULT",
        "EncryptionAlgorithms": [
            "SYMMETRIC_DEFAULT"
        ]
    }
}
```
The attributes KeyId and Arn will used next steps. You will need it to encrypt parameter and setting serverless.yml.

### 2 - Storing parameters
Storing parameter as plain text value:
```bash
aws ssm put-parameter --name PLAIN_VALUE --value 123456 --type String
```
Storing parameter encrypted 
```bash
aws ssm put-parameter --name SECRET_VALUE --value 123456 --type SecureString  --key-id <KeyId>
```
### 3 - Creating project
```bash
sls create --template aws-nodejs --name <PROJECT-NAME>
```
### 4 - Setting serverless.yml
```yml
...
custom:
  arnKmsKey: <Arn> #ARN value generated in the first step
  settings:
    SECRET_VALUE: ${ssm:SECRET_VALUE}
    PLAIN_SECRET_VALUE: ${ssm:SECRET_VALUE~true} #TRUE means decrypt parameter to the Lambda
    PLAIN_VALUE: ${ssm:PLAIN_VALUE}
...    
provider:
  ...
  environment: ${self:custom.settings}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - kms:Decrypt
        - kms:Encrypt
      Resource:
        - ${self:custom.arnKmsKey}  
    - Effect: Allow
      Action:
        - states:*
        - secretsmanager:*        
      Resource: '*'  
functions:
  hello:
    handler: handler.hello
    kmsKeyArn: ${self:custom.arnKmsKey}       
...
```  
### 5 - Getting parameters
```bash
  var myDbHost = process.env.SECRET_VALUE
  var myDbPort = process.env.PLAIN_SECRET_VALUE
  var myDbPort = process.env.PLAIN_VALUE  
```

### 6 - Deploying project
```bash
sls deploy -v
```

## Notice
All parameters defined in ```custom > setting``` section will be injected as environment variables in the settings of Lambda. 
