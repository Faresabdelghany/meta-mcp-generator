# 📚 Meta-MCP Generator Examples

This directory contains example requirements files for different types of MCP servers that can be generated.

## Available Examples

### 🗄️ Database Server Example
**File**: `example-database-requirements.json`

- **Purpose**: User management and analytics
- **Database**: PostgreSQL
- **Features**: Transactions, connection pooling, query caching
- **Tools**: Standard CRUD operations plus analytics and backup

### 🌐 API Integration Example
**File**: `example-api-requirements.json`

- **Purpose**: Weather data integration
- **API**: OpenWeatherMap
- **Features**: Rate limiting, retry logic, caching
- **Tools**: HTTP methods plus weather-specific operations

### 📁 File Operations Example
**File**: `example-file-requirements.json`

- **Purpose**: Document management system
- **Features**: File watching, versioning, thumbnails
- **Tools**: File operations plus search and compression
- **Supported Types**: PDF, DOCX, images, text files

### 🔧 Custom Server Example
**File**: `example-custom-requirements.json`

- **Purpose**: Blockchain analytics and cryptocurrency insights
- **Features**: Multi-blockchain support, real-time updates
- **Tools**: Wallet tracking, portfolio analysis, market data
- **Integrations**: Etherscan, Coinbase, CoinGecko APIs

## How to Use These Examples

### Method 1: Direct JSON Usage

You can use these JSON files directly with the `generate_mcp_server` tool:

```javascript
// Copy the contents of any example file and use it as the requirements parameter
generate_mcp_server({
  projectName: "my-server",
  serverType: "database", // or api, file, custom
  requirements: {
    // Paste the requirements object from the example file here
  }
})
```

### Method 2: As Reference for Manual Generation

1. Use `start_mcp_generation` with your desired server type
2. Use `ask_generation_questions` to get the configuration questions
3. Refer to these examples to understand how to structure your answers
4. Use `generate_mcp_server` with your custom requirements

### Method 3: Modify and Customize

1. Copy an example that's closest to your needs
2. Modify the:
   - `projectName` - Your server's name
   - `purpose` - Description of what your server does
   - `tools` - Add, remove, or rename tools as needed
   - `config` - Adjust configuration for your specific use case
   - `dependencies` - Add or remove npm packages

## Example Workflow

Let's create a database server using the example:

```bash
# 1. Start generation
start_mcp_generation({
  projectName: "my-user-db",
  serverType: "database"
})

# 2. Get questions (optional - for reference)
ask_generation_questions({ serverType: "database" })

# 3. Generate using example requirements
generate_mcp_server({
  projectName: "my-user-db",
  serverType: "database",
  requirements: {
    // Copy from example-database-requirements.json
    purpose: "Manage user accounts and analytics data for a web application",
    tools: ["query", "insert", "update", "delete", "schema", "analytics"],
    config: {
      dbType: "postgresql",
      tables: ["users", "sessions", "analytics"],
      authMethod: "connection string with username/password",
      features: {
        transactions: true,
        connectionPooling: true,
        queryCaching: true
      }
    },
    dependencies: ["pg", "@types/pg"]
  }
})

# 4. Save the generated server
save_generated_mcp({
  projectName: "my-user-db",
  outputPath: "/path/to/my/projects"
})
```

## Customization Tips

### Adding Custom Tools
```json
{
  "tools": [
    "standardTool1",
    "standardTool2",
    "myCustomTool",
    "anotherCustomTool"
  ]
}
```

### Adding Dependencies
```json
{
  "dependencies": [
    "express",
    "lodash",
    "moment",
    "@types/express"
  ]
}
```

### Complex Configuration
```json
{
  "config": {
    "database": {
      "host": "localhost",
      "port": 5432,
      "ssl": true
    },
    "api": {
      "rateLimit": 100,
      "timeout": 30000
    },
    "features": {
      "logging": true,
      "monitoring": true,
      "backup": {
        "enabled": true,
        "interval": "daily"
      }
    }
  }
}
```

## Next Steps

1. **Choose an Example**: Pick the example closest to your needs
2. **Customize**: Modify the requirements to match your specific use case
3. **Generate**: Use the Meta-MCP Generator to create your server
4. **Extend**: Add custom business logic to the generated code
5. **Deploy**: Install dependencies and run your new MCP server

Happy generating! 🚀