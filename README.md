# Cloud-Based Smart Campus Management System

Beginner-friendly React + AWS serverless college project.

## Features
- Dashboard summary
- Campus notices: list and create
- Assignments: list and create
- Attendance: list and record
- Demo mode using browser local storage
- AWS mode using API Gateway + Lambda + DynamoDB
- Static frontend hosting bucket defined in AWS SAM template

> Important: the role switch in this starter is for demonstration only, not real security. Before using real student data, add Amazon Cognito authentication and API authorization, restrict admin operations on the backend, and use least-privilege IAM permissions.

## Requirements
- Node.js 20+ and npm
- Optional for AWS deployment: AWS CLI, AWS SAM CLI, and an AWS account

## 1. Run the frontend locally
Open a terminal in `frontend` and run:
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

The app starts in Demo mode and stores demo records in your browser. It does not need an AWS account.

## 2. Run the backend locally (optional)
The Lambda handler is in `backend/src/handler.mjs`. It is designed for API Gateway HTTP API events and uses DynamoDB.
For a quick cloud deployment, use SAM as shown below.

## 3. Deploy the serverless API
From the project root:
```bash
sam build
sam deploy --guided
```
Choose a stack name such as `smart-campus`, your preferred AWS Region, and allow SAM to create the required IAM roles. Keep the generated API URL.

After deployment, set the frontend API URL in `frontend/.env`:
```env
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com
VITE_DEMO_MODE=false
```
Restart `npm run dev`. For production, build and upload the frontend's `dist/` folder to the S3 bucket created by the stack. Configure CloudFront and HTTPS rather than exposing an S3 website endpoint publicly.

## API routes
- `GET /notices`
- `POST /notices`
- `GET /assignments`
- `POST /assignments`
- `GET /attendance`
- `POST /attendance`

Example notice:
```json
{"title":"Library Update","message":"The library will close at 5 PM.","postedBy":"Campus Admin"}
```

Example assignment:
```json
{"title":"Cloud Computing Lab","course":"CS304","dueDate":"2026-11-15","description":"Submit the serverless architecture report."}
```

Example attendance:
```json
{"studentName":"Demo Student","course":"CS304","date":"2026-10-19","status":"Present"}
```

## Suggested viva explanation
React displays the dashboard. API Gateway exposes HTTP routes. Each request invokes AWS Lambda, which validates the input and reads/writes records in DynamoDB. S3 stores static frontend files. This is serverless because you do not manage application servers.

## Cost and safety
AWS resources can incur charges. Review pricing and budgets before deployment, use test data only, and delete the stack when finished if you no longer need it:
```bash
sam delete
```
