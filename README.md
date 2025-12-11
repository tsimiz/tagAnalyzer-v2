# Azure Tag Analyzer

An Azure tag analyzer that analyzes tags across your Azure environment. The tool scans all subscriptions you have access to, fetches tags from resource groups and resources, and provides a user-friendly interface to view and search through them.

## Features

- **Multi-Subscription Support**: Automatically scans all Azure subscriptions accessible to the authenticated user
- **Comprehensive Tag Collection**: Retrieves tags from both resource groups and individual resources
- **Advanced Search**: Filter tags by key and value with case-insensitive search
- **Real-time Display**: View all tags in an organized table format
- **Modern UI**: React-based frontend with responsive design

## Architecture

- **Backend**: ASP.NET Core Web API (.NET 10)
  - Azure Resource Manager SDK for Azure resource access
  - Azure Identity for authentication
  - RESTful API endpoints
- **Frontend**: React with TypeScript
  - Vite for fast development
  - Axios for API communication
  - Modern, responsive UI

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or later)
- Azure CLI (for authentication)
- Azure subscription(s) with appropriate permissions

## Setup Instructions

### 1. Azure Authentication

Before running the application, authenticate with Azure using one of these methods:

**Option A: Azure CLI (Recommended for development)**
```bash
az login
```

**Option B: Environment Variables**
Set the following environment variables:
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_TENANT_ID`

**Option C: Managed Identity**
When deployed to Azure, the app will automatically use the managed identity.

### 2. Backend Setup

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

The backend will start on `https://localhost:5001` (or `http://localhost:5000`).

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and set the backend URL if different from default:
```
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Usage

1. **Start the Backend**: Make sure the .NET backend is running
2. **Start the Frontend**: Launch the React development server
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **View Tags**: The application will automatically fetch all tags from your subscriptions
5. **Search Tags**: Use the search form to filter tags by key or value

## API Endpoints

### GET /api/tags
Retrieves all tags from all accessible subscriptions.

**Response**: Array of `TagInfo` objects

### POST /api/tags/search
Searches for tags based on key and/or value.

**Request Body**:
```json
{
  "tagKey": "Environment",
  "tagValue": "Production"
}
```

**Response**: Array of filtered `TagInfo` objects

### GET /api/tags/subscriptions
Lists all accessible Azure subscriptions.

**Response**: Array of `SubscriptionInfo` objects

## Data Model

### TagInfo
```typescript
{
  key: string;              // Tag key
  value: string;            // Tag value
  resourceType: string;     // Type of resource (ResourceGroup or specific resource type)
  resourceName: string;     // Name of the resource
  resourceGroupName: string; // Name of the resource group
  subscriptionId: string;   // Azure subscription ID
  subscriptionName: string; // Azure subscription display name
}
```

## Required Azure Permissions

The authenticated user/service principal needs:
- `Reader` role at the subscription level (minimum)
- Access to read resource groups and resources
- Access to read tags

## Development

### Backend Development
```bash
cd backend
dotnet watch run
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production

**Backend**:
```bash
cd backend
dotnet publish -c Release
```

**Frontend**:
```bash
cd frontend
npm run build
```

## Troubleshooting

### Authentication Issues
- Ensure you're logged in via Azure CLI: `az login`
- Verify your Azure account has access to subscriptions: `az account list`
- Check that you have sufficient permissions to read resources

### Connection Issues
- Verify the backend is running on the correct port
- Check CORS settings in `Program.cs`
- Ensure the `VITE_API_URL` in `.env` points to the correct backend URL

### No Tags Found
- Verify your resources have tags applied in Azure Portal
- Ensure you have `Reader` permissions on subscriptions
- Check backend logs for authentication or authorization errors

## Technology Stack

- **Backend**:
  - ASP.NET Core 10.0
  - Azure.ResourceManager SDK
  - Azure.Identity
  - C# 12

- **Frontend**:
  - React 18
  - TypeScript 5
  - Vite 7
  - Axios

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

