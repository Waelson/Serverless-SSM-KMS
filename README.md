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
```bash
{
    "KeyMetadata": {
        "AWSAccountId": "<Account ID>",
        "KeyId": "xxxxxxx-8be9-448a-b2aa-xxxxxxxxxx",
        "Arn": "arn:aws:kms:us-east-1:212165287828:key/xxxxxxx-8be9-448a-b2aa-xxxxxxxxxx",
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
### 2 - Storing parameters
```bash
aws ssm put-parameter --name DB_HOST --value localhost --type String
```
```bash
aws ssm put-parameter --name DB_PORT --value 3306 --type String
```
### 3 - Creating project
```bash
sls create --template aws-nodejs --name <PROJECT-NAME>
```
### 4 - Setting serverless.yml
```bash
...
custom:
  settings:
    DB_HOST: ${ssm:DB_HOST}
    DB_PORT: ${ssm:DB_PORT}
...    
provider:
  environment: ${self:custom.settings}
...
```  
### 5 - Getting parameters
```bash
  var myDbHost = process.env.DB_HOST
  var myDbPort = process.env.DB_PORT
```

### 6 - Deploying project
```bash
sls deploy -v
```

## Notice
All parameters defined in ```custom > setting``` section will be injected as environment variables in the settings of Lambda. 
