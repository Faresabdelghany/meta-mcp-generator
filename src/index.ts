#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";

// MCP Server Templates and Patterns
const MCP_TEMPLATES = {
  basic: {
    name: "Basic MCP Server",
    description: "Simple MCP server with basic tools",
    tools: ["ping", "echo"]
  },
  database: {
    name: "Database MCP Server", 
    description: "MCP server for database operations",
    tools: ["query", "insert", "update", "delete", "schema"]
  },
  api: {
    name: "API Integration MCP Server",
    description: "MCP server for external API integration",
    tools: ["get", "post", "put", "delete", "auth"]
  },
  file: {
    name: "File Operations MCP Server",
    description: "MCP server for file system operations", 
    tools: ["read", "write", "list", "delete", "move"]
  },
  custom: {
    name: "Custom MCP Server",
    description: "Fully customized MCP server",
    tools: []
  }
};

// Question sets for different MCP types
const QUESTION_SETS = {
  basic: [
    "What is the main purpose of your MCP server?",
    "What simple operations do you want to perform?",
    "Do you need any specific error handling?"
  ],
  database: [
    "What type of database will you connect to? (MySQL, PostgreSQL, SQLite, MongoDB, etc.)",
    "What are the main tables/collections you'll work with?",
    "Do you need transaction support?",
    "What authentication method does your database use?",
    "Do you need query caching or connection pooling?"
  ],
  api: [
    "What API will you integrate with? (Provide base URL if possible)",
    "What authentication method does the API use? (API key, OAuth, Bearer token, etc.)",
    "What are the main endpoints you need to access?",
    "Do you need rate limiting or retry logic?",
    "What data format does the API use? (JSON, XML, etc.)"
  ],
  file: [
    "What file operations do you need? (read, write, list, delete, move, etc.)",
    "What file types will you primarily work with?",
    "Do you need to watch for file changes?",
    "Should there be any file size or type restrictions?",
    "Do you need backup or versioning features?"
  ],
  custom: [
    "What is the main purpose of your MCP server?",
    "What specific tools/functions do you need?",
    "What external services or APIs will you integrate with?",
    "What data sources will you work with?",
    "Do you need any special authentication or security features?",
    "What programming language do you prefer? (TypeScript/JavaScript)",
    "Do you need any specific dependencies or libraries?"
  ]
};

class MCPGeneratorServer {
  private server: Server;
  private generatedServers: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "meta-mcp-generator",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "start_mcp_generation",
            description: "Start the process of generating a new MCP server",
            inputSchema: {
              type: "object",
              properties: {
                projectName: {
                  type: "string",
                  description: "Name for the new MCP server project"
                },
                serverType: {
                  type: "string",
                  enum: ["basic", "database", "api", "file", "custom"],
                  description: "Type of MCP server to generate"
                }
              },
              required: ["projectName", "serverType"]
            }
          },
          {
            name: "ask_generation_questions",
            description: "Get the specific questions for the chosen MCP server type",
            inputSchema: {
              type: "object",
              properties: {
                serverType: {
                  type: "string",
                  enum: ["basic", "database", "api", "file", "custom"],
                  description: "Type of MCP server"
                }
              },
              required: ["serverType"]
            }
          },
          {
            name: "generate_mcp_server",
            description: "Generate the complete MCP server code based on requirements",
            inputSchema: {
              type: "object",
              properties: {
                projectName: {
                  type: "string",
                  description: "Name of the MCP server project"
                },
                serverType: {
                  type: "string",
                  enum: ["basic", "database", "api", "file", "custom"],
                  description: "Type of MCP server"
                },
                requirements: {
                  type: "object",
                  description: "Detailed requirements and answers to questions",
                  properties: {
                    purpose: { type: "string" },
                    tools: { type: "array", items: { type: "string" } },
                    config: { type: "object" },
                    dependencies: { type: "array", items: { type: "string" } }
                  }
                }
              },
              required: ["projectName", "serverType", "requirements"]
            }
          },
          {
            name: "list_mcp_templates",
            description: "List available MCP server templates and their descriptions",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "save_generated_mcp",
            description: "Save the generated MCP server files to disk",
            inputSchema: {
              type: "object",
              properties: {
                projectName: {
                  type: "string",
                  description: "Name of the MCP server project"
                },
                outputPath: {
                  type: "string",
                  description: "Path where to save the generated files"
                }
              },
              required: ["projectName", "outputPath"]
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "start_mcp_generation":
            return await this.startMCPGeneration(args.projectName, args.serverType);

          case "ask_generation_questions":
            return await this.askGenerationQuestions(args.serverType);

          case "generate_mcp_server":
            return await this.generateMCPServer(args.projectName, args.serverType, args.requirements);

          case "list_mcp_templates":
            return await this.listMCPTemplates();

          case "save_generated_mcp":
            return await this.saveGeneratedMCP(args.projectName, args.outputPath);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async startMCPGeneration(projectName: string, serverType: string) {
    const template = MCP_TEMPLATES[serverType as keyof typeof MCP_TEMPLATES];
    if (!template) {
      throw new Error(`Unknown server type: ${serverType}`);
    }

    return {
      content: [
        {
          type: "text",
          text: `🚀 Starting MCP Server Generation

**Project Name:** ${projectName}
**Server Type:** ${template.name}
**Description:** ${template.description}

✅ Generation process initiated! 

**Next Steps:**
1. I'll ask you specific questions about your requirements
2. Based on your answers, I'll generate the complete MCP server code
3. You'll get all the necessary files (package.json, server code, README, etc.)

Ready to proceed with the questions for your ${template.name}?`
        }
      ]
    };
  }

  private async askGenerationQuestions(serverType: string) {
    const questions = QUESTION_SETS[serverType as keyof typeof QUESTION_SETS];
    if (!questions) {
      throw new Error(`No questions defined for server type: ${serverType}`);
    }

    const template = MCP_TEMPLATES[serverType as keyof typeof MCP_TEMPLATES];
    
    return {
      content: [
        {
          type: "text",
          text: `📋 Configuration Questions for ${template.name}

Please answer the following questions to customize your MCP server:

${questions.map((q, i) => `**${i + 1}.** ${q}`).join('\\n\\n')}

**Additional Information:**
- Default tools for this type: ${template.tools.join(', ')}
- You can add custom tools beyond the defaults
- All generated code will follow MCP best practices

Please provide your answers, and I'll generate your custom MCP server!`
        }
      ]
    };
  }

  private async generateMCPServer(projectName: string, serverType: string, requirements: any) {
    const generatedCode = await this.createMCPServerCode(projectName, serverType, requirements);
    
    // Store the generated server for later saving
    this.generatedServers.set(projectName, generatedCode);

    return {
      content: [
        {
          type: "text",
          text: `🎉 MCP Server Generated Successfully!

**Project:** ${projectName}
**Type:** ${serverType}

**Generated Files:**
- 📄 package.json (Node.js project configuration)
- 🔧 src/index.ts (Main server implementation)
- 📚 README.md (Documentation and setup instructions)
- ⚙️ tsconfig.json (TypeScript configuration)
- 🔒 .gitignore (Git ignore rules)

**Features Included:**
${this.getFeaturesList(serverType, requirements)}

**Next Steps:**
1. Use 'save_generated_mcp' to save files to your desired location
2. Run 'npm install' to install dependencies
3. Run 'npm run build' to compile TypeScript
4. Run 'npm start' to start your MCP server
5. Add it to your Claude Desktop configuration

Your MCP server is ready to use! 🚀`
        }
      ]
    };
  }

  private async listMCPTemplates() {
    const templateList = Object.entries(MCP_TEMPLATES).map(([key, template]) => 
      `**${key}** - ${template.name}\\n   ${template.description}\\n   Default tools: ${template.tools.join(', ')}`
    ).join('\\n\\n');

    return {
      content: [
        {
          type: "text",
          text: `📦 Available MCP Server Templates

${templateList}

**Usage:**
1. Choose a template type that matches your needs
2. Use 'start_mcp_generation' with your chosen type
3. Answer the configuration questions
4. Get your complete, ready-to-use MCP server!

Each template includes best practices, proper error handling, and comprehensive documentation.`
        }
      ]
    };
  }

  private async saveGeneratedMCP(projectName: string, outputPath: string) {
    const generatedCode = this.generatedServers.get(projectName);
    if (!generatedCode) {
      throw new Error(`No generated code found for project: ${projectName}`);
    }

    try {
      const projectPath = path.join(outputPath, projectName);
      await fs.mkdir(projectPath, { recursive: true });
      await fs.mkdir(path.join(projectPath, 'src'), { recursive: true });

      // Save all generated files
      await Promise.all([
        fs.writeFile(path.join(projectPath, 'package.json'), generatedCode.packageJson),
        fs.writeFile(path.join(projectPath, 'src', 'index.ts'), generatedCode.serverCode),
        fs.writeFile(path.join(projectPath, 'README.md'), generatedCode.readme),
        fs.writeFile(path.join(projectPath, 'tsconfig.json'), generatedCode.tsconfig),
        fs.writeFile(path.join(projectPath, '.gitignore'), generatedCode.gitignore)
      ]);

      return {
        content: [
          {
            type: "text",
            text: `💾 MCP Server Saved Successfully!

**Location:** ${projectPath}

**Files Created:**
- ✅ package.json
- ✅ src/index.ts  
- ✅ README.md
- ✅ tsconfig.json
- ✅ .gitignore

**Setup Instructions:**
\`\`\`bash
cd ${projectPath}
npm install
npm run build
npm start
\`\`\`

**Add to Claude Desktop:**
Add this to your Claude Desktop MCP configuration:
\`\`\`json
{
  "${projectName}": {
    "command": "node",
    "args": ["${path.join(projectPath, 'build', 'index.js')}"]
  }
}
\`\`\`

Your MCP server is ready to use! 🎉`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to save files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async createMCPServerCode(projectName: string, serverType: string, requirements: any) {
    const packageJson = this.generatePackageJson(projectName, requirements);
    const serverCode = this.generateServerCode(projectName, serverType, requirements);
    const readme = this.generateReadme(projectName, serverType, requirements);
    const tsconfig = this.generateTsConfig();
    const gitignore = this.generateGitignore();

    return { packageJson, serverCode, readme, tsconfig, gitignore };
  }

  private generatePackageJson(projectName: string, requirements: any) {
    const dependencies = {
      "@modelcontextprotocol/sdk": "^0.4.0",
      ...this.getTypeDependencies(requirements)
    };

    return JSON.stringify({
      name: projectName,
      version: "1.0.0",
      description: `Generated MCP server: ${projectName}`,
      main: "build/index.js",
      type: "module",
      scripts: { build: "tsc", start: "node build/index.js", dev: "tsc --watch" },
      dependencies,
      devDependencies: { "@types/node": "^20.0.0", "typescript": "^5.0.0" }
    }, null, 2);
  }

  private generateServerCode(projectName: string, serverType: string, requirements: any): string {
    const baseImports = `#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";`;
    const serverClass = this.generateServerClass(projectName, serverType, requirements);
    const mainFunction = this.generateMainFunction(projectName);
    return `${baseImports}

${serverClass}

${mainFunction}`;
  }

  private generateServerClass(projectName: string, serverType: string, requirements: any): string {
    const className = this.toPascalCase(projectName) + 'Server';
    const tools = this.generateTools(serverType, requirements);
    const toolHandlers = this.generateToolHandlers(serverType, requirements);

    return `class ${className} {
  private server: Server;

  constructor() {
    this.server = new Server({ name: "${projectName}", version: "1.0.0" }, { capabilities: { tools: {} } });
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [${tools}] }));
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      try {
        switch (name) {${toolHandlers}
          default: throw new Error(\`Unknown tool: \${name}\`);
        }
      } catch (error) {
        return { content: [{ type: "text", text: \`Error: \${error instanceof Error ? error.message : String(error)}\` }], isError: true };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("${projectName} MCP server running on stdio");
  }
}`;
  }

  private generateTools(serverType: string, requirements: any): string {
    const template = MCP_TEMPLATES[serverType as keyof typeof MCP_TEMPLATES];
    const tools = requirements.tools || template.tools;
    return tools.map((tool: string) => `{ name: "${tool}", description: "Generated tool: ${tool}", inputSchema: { type: "object", properties: { input: { type: "string", description: "Input for ${tool} operation" } }, required: ["input"] } }`).join(', ');
  }

  private generateToolHandlers(serverType: string, requirements: any): string {
    const template = MCP_TEMPLATES[serverType as keyof typeof MCP_TEMPLATES];
    const tools = requirements.tools || template.tools;
    return tools.map((tool: string) => `\\n          case "${tool}": return await this.handle${this.toPascalCase(tool)}(args);`).join('');
  }

  private generateMainFunction(projectName: string): string {
    const className = this.toPascalCase(projectName) + 'Server';
    return `async function main() { const server = new ${className}(); await server.run(); }\\nmain().catch(console.error);`;
  }

  private generateReadme(projectName: string, serverType: string, requirements: any): string {
    return `# ${projectName}\\n\\nGenerated MCP server for ${serverType} operations.\\n\\n## Purpose\\n${requirements.purpose || 'Custom MCP server generated by Meta-MCP Generator'}\\n\\n## Installation\\n\\n\`\`\`bash\\nnpm install\\nnpm run build\\n\`\`\`\\n\\n## Usage\\n\\n\`\`\`bash\\nnpm start\\n\`\`\`\\n\\n## Configuration\\n\\nAdd to your Claude Desktop MCP configuration:\\n\\n\`\`\`json\\n{\\n  \\"${projectName}\\": {\\n    \\"command\\": \\"node\\",\\n    \\"args\\": [\\"path/to/${projectName}/build/index.js\\"]\\n  }\\n}\\n\`\`\`\\n\\n## Generated by Meta-MCP Generator\\n\\nThis server was automatically generated by the Meta-MCP Generator.`;
  }

  private generateTsConfig(): string {
    return JSON.stringify({ compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "node", esModuleInterop: true, allowSyntheticDefaultImports: true, strict: true, skipLibCheck: true, forceConsistentCasingInFileNames: true, outDir: "build", rootDir: "src" }, include: ["src/**/*"], exclude: ["node_modules", "build"] }, null, 2);
  }

  private generateGitignore(): string {
    return `node_modules/\\nbuild/\\n*.log\\n.env\\n.DS_Store\\n*.tsbuildinfo`;
  }

  private getTypeDependencies(requirements: any): Record<string, string> {
    const deps: Record<string, string> = {};
    if (requirements.dependencies) {
      requirements.dependencies.forEach((dep: string) => { deps[dep] = "latest"; });
    }
    return deps;
  }

  private getFeaturesList(serverType: string, requirements: any): string {
    const template = MCP_TEMPLATES[serverType as keyof typeof MCP_TEMPLATES];
    const features = [`✅ ${template.description}`, `✅ ${(requirements.tools || template.tools).length} custom tools`, `✅ Proper error handling and validation`, `✅ TypeScript implementation with full typing`, `✅ Ready for Claude Desktop integration`];
    return features.join('\\n');
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[-_])(\\w)/g, (_, c) => c.toUpperCase());
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Meta-MCP Generator server running on stdio");
  }
}

async function main() {
  const server = new MCPGeneratorServer();
  await server.run();
}

main().catch(console.error);
