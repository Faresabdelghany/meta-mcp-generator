# Meta-MCP Generator 🚀

An intelligent MCP (Model Context Protocol) server that generates other MCP servers based on user requirements. This tool allows you to create custom MCP servers through a conversational interface with Claude Desktop.

## ✨ Features

- **🤖 AI-Powered Generation**: Creates complete MCP servers based on natural language requirements
- **📋 Smart Questionnaire**: Asks targeted questions based on server type
- **🏗️ Multiple Templates**: Support for Database, API, File Operations, and Custom servers
- **📦 Complete Projects**: Generates package.json, TypeScript code, documentation, and configuration
- **🔧 Ready-to-Use**: Generated servers are immediately functional
- **💾 File Management**: Saves generated projects directly to your filesystem

## 🎯 Supported Server Types

| Type | Description | Default Tools |
|------|-------------|---------------|
| **Basic** | Simple MCP server with basic operations | ping, echo |
| **Database** | Database integration and operations | query, insert, update, delete, schema |
| **API** | External API integration | get, post, put, delete, auth |
| **File** | File system operations | read, write, list, delete, move |
| **Custom** | Fully customizable server | User-defined |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Faresabdelghany/meta-mcp-generator.git
cd meta-mcp-generator

# Install dependencies
npm install

# Build the project
npm run build
```

### Setup with Claude Desktop

Add to your Claude Desktop MCP configuration (`claude_desktop_config.json`):

```json
{
  \"mcpServers\": {
    \"meta-mcp-generator\": {
      \"command\": \"node\",
      \"args\": [\"/path/to/meta-mcp-generator/build/index.js\"]
    }
  }
}
```

### Usage

1. **Start Generation Process**
   ```
   Use the 'start_mcp_generation' tool with:
   - projectName: \"my-awesome-server\"
   - serverType: \"database\" (or \"api\", \"file\", \"basic\", \"custom\")
   ```

2. **Answer Configuration Questions**
   ```
   Use 'ask_generation_questions' to get type-specific questions
   ```

3. **Generate Your Server**
   ```
   Use 'generate_mcp_server' with your requirements
   ```

4. **Save to Filesystem**
   ```
   Use 'save_generated_mcp' to create your project files
   ```

## 🛠️ Available Tools

### `start_mcp_generation`
Initiates the MCP server generation process.

**Parameters:**
- `projectName` (string): Name for your new MCP server
- `serverType` (enum): Type of server to generate

### `ask_generation_questions`
Retrieves configuration questions specific to the chosen server type.

**Parameters:**
- `serverType` (enum): The type of MCP server

### `generate_mcp_server`
Generates the complete MCP server code based on requirements.

**Parameters:**
- `projectName` (string): Project name
- `serverType` (enum): Server type
- `requirements` (object): Detailed requirements and configurations

### `list_mcp_templates`
Lists all available MCP server templates with descriptions.

### `save_generated_mcp`
Saves the generated MCP server files to the specified location.

**Parameters:**
- `projectName` (string): Name of the generated project
- `outputPath` (string): Directory where files should be saved

## 📁 Generated Project Structure

Each generated MCP server includes:

```
my-awesome-server/
├── src/
│   └── index.ts          # Main server implementation
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── README.md             # Documentation and setup instructions
└── .gitignore           # Git ignore rules
```

## 🔧 Example: Creating a Database MCP Server

```typescript
// 1. Start generation
start_mcp_generation({
  projectName: \"my-database-server\",
  serverType: \"database\"
})

// 2. Answer questions about:
// - Database type (MySQL, PostgreSQL, etc.)
// - Main tables/collections
// - Authentication method
// - Special requirements

// 3. Generate and save
generate_mcp_server({
  projectName: \"my-database-server\",
  serverType: \"database\",
  requirements: {
    purpose: \"Manage user data and analytics\",
    tools: [\"query\", \"insert\", \"update\", \"delete\", \"analytics\"],
    config: {
      dbType: \"postgresql\",
      tables: [\"users\", \"orders\", \"analytics\"]
    }
  }
})
```

## 🚀 Using Generated Servers

After generation:

```bash
cd my-database-server
npm install
npm run build
npm start
```

Add to Claude Desktop configuration:
```json
{
  \"my-database-server\": {
    \"command\": \"node\",
    \"args\": [\"/path/to/my-database-server/build/index.js\"]
  }
}
```

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup and configuration guide
- **[examples/](examples/)** - Example requirements for all server types
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and planned features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Powered by the [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- Designed for seamless integration with Claude Desktop

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [SETUP.md](SETUP.md) troubleshooting section
2. Review the [examples/](examples/) for usage patterns
3. Create an issue with detailed information about your problem

## 🎉 What's Next?

- **Explore Templates**: Use `list_mcp_templates` to see what's available
- **Create Your First Server**: Start with a \"basic\" type for simplicity
- **Try Examples**: Use the provided example configurations
- **Customize**: Build servers tailored to your specific needs
- **Share**: Contribute your custom templates back to the community

---

**Happy MCP Server Generation!** 🎉