// Infrastructure for Book Manager Frontend
// This template creates an Azure App Service for hosting the Next.js frontend

@description('The name of the app service')
param appServiceName string = 'bookmanager-frontend-${uniqueString(resourceGroup().id)}'

@description('The name of the app service plan')
param appServicePlanName string = 'bookmanager-plan-${uniqueString(resourceGroup().id)}'

@description('The location where resources will be deployed')
param location string = resourceGroup().location

@description('The SKU name for the app service plan')
@allowed([
  'F1'  // Free tier
  'B1'  // Basic tier
  'S1'  // Standard tier
  'P1v2' // Premium V2 tier
])
param skuName string = 'F1'

@description('Environment name tag')
param environmentName string

@description('The backend API URL for the application')
param backendApiUrl string = 'https://bookmanager-hzfmeaaqfeahavb9.eastus-01.azurewebsites.net'

// User-assigned managed identity for the app service
resource userAssignedManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${appServiceName}'
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
  sku: {
    name: skuName
    tier: skuName == 'F1' ? 'Free' : (skuName == 'B1' ? 'Basic' : (skuName == 'S1' ? 'Standard' : 'PremiumV2'))
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux App Services
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceName
  location: location
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'frontend'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedManagedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: skuName != 'F1' // AlwaysOn not available in Free tier
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'NEXT_PUBLIC_API_URL'
          value: backendApiUrl
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '20.x'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_NPM_DEFAULT_VERSION'
          value: '10.x'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
    }
  }
}

// Outputs
output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceId string = appService.id
output userAssignedManagedIdentityId string = userAssignedManagedIdentity.id
