@description('The name of the Static Web App')
param staticWebAppName string

@description('The location of the Static Web App')
param location string = resourceGroup().location

@description('The SKU of the Static Web App')
@allowed(['Free', 'Standard'])
param sku string = 'Free'

@description('The name of your application')
param appName string = 'Keploy Fellowship'

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    allowConfigFileUpdates: true
    provider: 'Custom'
    stagingEnvironmentPolicy: 'Enabled'
    enterpriseGradeCdnStatus: 'Disabled'
  }
  tags: {
    'application-name': appName
    'environment': 'production'
  }
}
