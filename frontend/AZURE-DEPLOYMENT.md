# Azure Static Web Apps Deployment Guide

This document outlines the steps required to deploy this Next.js frontend application to Azure Static Web Apps.

## Prerequisites

1. An Azure account with an active subscription
2. Visual Studio Code with the Azure Static Web Apps extension installed
3. Git and GitHub account configured

## Deployment Steps

### 1. Update Backend API URL

Before deploying, you need to specify your backend API URL in the configuration.

Edit `staticwebapp.config.json` and replace `%BACKEND_API_URL%` with your actual backend API URL:

```json
"rewrite": "https://your-actual-backend-url.com/api/:splat"
```

### 2. Deploy via VS Code Azure Extension

1. Open VS Code and navigate to the Azure extension (click the Azure icon in the sidebar).
2. Sign in to your Azure account if not already signed in.
3. Click on the "+" icon in the Static Web Apps section.
4. Select your subscription when prompted.
5. Provide a name for your Static Web App.
6. Select or create a resource group.
7. Select a region close to your users.
8. Choose "Next.js (static export)" as the build preset.
9. Select the "frontend" folder as your application code location.
10. Enter "/" for the build location.
11. Enter "out" as the output location.

### 3. Configure Environment Variables

After deployment, you may need to configure environment variables in the Azure Portal:

1. Go to your Static Web App in the Azure Portal.
2. Navigate to Configuration > Application settings.
3. Add your environment variables (e.g., NEXT_PUBLIC_API_URL).

### 4. Custom Domain Setup (Optional)

1. In the Azure Portal, go to your Static Web App.
2. Navigate to Custom domains.
3. Follow the instructions to set up your custom domain.

## Troubleshooting

### CORS Issues

If you experience CORS issues, check:
1. The `globalHeaders` section in `staticwebapp.config.json`.
2. Make sure your backend API is correctly configured to accept requests from your frontend domain.

### API Connection Issues

If API calls are failing:
1. Verify the API URL in the `staticwebapp.config.json` file.
2. Check that environment variables are correctly set in Azure Portal.
3. Test the API endpoints independently to ensure they're working.

## Additional Resources

- [Azure Static Web Apps documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Next.js static export documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)