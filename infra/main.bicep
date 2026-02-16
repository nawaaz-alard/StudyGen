param location string = resourceGroup().location
param appName string = 'studygen-app'
param cosmosAccountName string = 'studygen-db-${uniqueString(resourceGroup().id)}'
param repositoryUrl string = 'https://github.com/Alard/StudyGen'

// Azure Static Web App (Free Tier)
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: appName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: 'main'
    buildProperties: {
      appLocation: 'frontend'
      apiLocation: 'api'
      outputLocation: 'dist'
    }
  }
}

// Cosmos DB (Serverless) - Lowest cost option for unpredictable traffic
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    capabilities: [
      { name: 'EnableServerless' }
    ]
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  parent: cosmosAccount
  name: 'StudyGenDB'
  properties: {
    resource: {
      id: 'StudyGenDB'
    }
  }
}

// Container for Modules/Study Content
resource modulesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  parent: database
  name: 'Modules'
  properties: {
    resource: {
      id: 'Modules'
      partitionKey: {
        paths: ['/id']
        kind: 'Hash'
      }
    }
  }
}

// Container for User Progress/Usage Tracking
resource usersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  parent: database
  name: 'UserTracking'
  properties: {
    resource: {
      id: 'UserTracking'
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
    }
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
output cosmosAccountName string = cosmosAccount.name
