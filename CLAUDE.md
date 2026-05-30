# Instruções para Claude

## Salvamento automático no Google Drive

Ao final de cada sessão (quando o usuário se despedir ou pedir para encerrar), salve os arquivos modificados no Google Drive usando as ferramentas MCP disponíveis.

**Pasta de destino no Drive:**
- Nome: `Claude Conf/my-repository`
- ID da pasta: `1U-G5GVlN2VQFreZIPxvom3BOyP7RvZQO`

**Arquivos prioritários para salvar:**
- Qualquer arquivo que foi criado ou modificado na sessão
- `package.json`, `.env.example`, `next.config.ts`, `tsconfig.json`
- Arquivos de configuração (`.claude/`, `drizzle.config.ts`, `biome.jsonc`)
- Código novo em `app/`, `components/`, `lib/`, `hooks/`

**Como salvar:** Use a ferramenta `mcp__*__create_file` do servidor Google Drive (ID do servidor começa com `1cba4e6c`) com o `parentId` da pasta acima.

## Sobre este projeto

Projeto: **Chatbot** — template Next.js 16 + AI SDK da Vercel  
Stack: React 19, Drizzle ORM, Postgres, Redis, Auth.js, Tailwind CSS

### Comandos úteis
```bash
pnpm dev          # inicia o servidor de desenvolvimento
pnpm build        # faz o build
pnpm db:migrate   # roda as migrations do banco
pnpm db:studio    # abre o Drizzle Studio
```

### Variáveis de ambiente
Consulte `.env.example` — nunca commite o `.env` real.
