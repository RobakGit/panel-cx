# Changelog

## 2023-05-20

### Added

- EndityEditor component
- api: added paths for entity list and editing specific entity

### Changed

- schema.prisma: added default value for name, kind, autoExpansionMode and enableFuzzyExtraction fields
- SideNavigationList: added listHeader component, make component as universal

## 2023-05-13 - 3

### Added

- "@mui/x-data-grid": Community Plan edition of the data grid component
- "formidable": module for parsing form data
- IntentEditor component
- SideNavigation component
- SideNavigationList component

### Changed

- .gitignore
- schema.prisma:
  Agent: added keyFilePath field
  Intent: default value for name, prioritym description and isFallback fields
  Webhook: removed unique from name field
- agent import ui: added file uploader, sending data via formData
- agent import: reading form data

## 2023-05-13 - 2

### Added

- agent import ui: popup window that allows you to specify the name of the dialogflow agent and the display name. Then allowing you to start importing

### Changed

- ui pallete colors
- agent import: reading data from frontend

## 2023-05-13 - 1

### Added

- "@google-cloud/dialogflow-cx": Dialogflow CX library
- "node-stream-zip": library for reading and extraction of ZIP archives.
- agent import: A backend that allows you to download the zip file from dialogflow, unzip it and enter the data into the database
- prettier

### Changed

- schema.prisma: In the Agent model, set a default value for the uid column, added createdAt, updatedAt, a unique key on the projectId and agent fields.
  In Flow Page, Entity, Intent and Webhook models added uid field with default value, createdAt and updatedAt fields, Removed uniqueness from the name field.
  Flow added a unique key consisting of name and agentId
  Page added a unique key consisting of name and flowId
  Entity added a unique key consisting of name and agentId
  Intent added a unique key consisting of name and agentId, field trainingPhrases as Json[]
  Webhook added a unique key consisting of name and agentId

## 2023-05-12

### Added

- .env.sample: file with an example database configuration.
- schema.prisma: database model with the following tables: Agent, Flow, Page, Entity, Intent, Webhook, and enums kind and autoExpansionMode.
