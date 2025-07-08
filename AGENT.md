# AGENT.md - Guia para IA/Assistentes

## 📋 Resumo do Projeto

**TagMe Desafio** é uma aplicação Angular 20 completa para gerenciamento de itens com CRUD, temas dinâmicos, busca inteligente, paginação suavizada e 88 testes unitários.

## 🚀 Comandos Essenciais

### Desenvolvimento
```bash
npm run start:dev      # Inicia Angular + JSON Server simultaneamente
npm start              # Apenas Angular (porta 4200)
npm run json-server    # Apenas API (porta 3000)
```

### Build e Testes
```bash
npm run build          # Build de produção
npm test               # Executar testes unitários
node test-runner.js    # Verificar estrutura de testes
```

### Documentação
```bash
npm run doc:serve      # Servir documentação Compodoc
npm run jsdoc          # Gerar documentação JSDoc
```

## 📁 Estrutura Importante

### Componentes Principais
- `src/app/components/item-list/` - Lista principal com filtros e paginação
- `src/app/components/item-card/` - Cards dos itens
- `src/app/components/item-form/` - Formulário criação/edição
- `src/app/components/item-dialog/` - Modal de visualização

### Services Críticos
- `src/app/services/item.service.ts` - CRUD operations
- `src/app/services/theme.service.ts` - Gerenciamento de temas
- `src/app/services/notification.service.ts` - Notificações
- `src/app/services/paginator-intl.service.ts` - Tradução paginação

### Arquivos de Configuração
- `package.json` - Dependências e scripts
- `angular.json` - Configuração Angular
- `db.json` - Dados de exemplo (JSON Server)
- `tsconfig.json` - Configuração TypeScript

## 🎯 Funcionalidades Implementadas

### ✅ CRUD Completo
- Criar, listar, editar e deletar itens
- Validação reativa em formulários
- Upload e recorte de imagens

### ✅ UX Avançada
- Busca inteligente com debounce (500ms, mín 3 chars)
- Paginação fixa no rodapé com transições suaves
- Sistema de temas claro/escuro com persistência
- Ordenação por `updatedAt` decrescente

### ✅ Qualidade
- 88 testes unitários (Jasmine/Karma)
- Documentação JSDoc completa
- IDs únicos para automação
- TypeScript com tipagem rigorosa

## 🔧 Padrões de Código

### Convenções Angular
- **Standalone Components**: Todos os componentes são independentes
- **Signals**: Para gerenciamento de estado reativo
- **Control Flow**: Uso de @if, @for nos templates
- **Dependency Injection**: Injeção moderna com inject()

### Estrutura de Arquivos
- **Separação**: .ts, .html, .scss em arquivos separados
- **JSDoc**: Documentação em todos os métodos públicos
- **Interfaces**: Tipagem rigorosa com models/

### Naming Conventions
- **IDs**: Padrão btn-, input-, select- para elementos
- **Classes CSS**: BEM-like com prefixos temáticos
- **Services**: Sufixo .service.ts
- **Models**: Interfaces em models/

## 📊 Dados e API

### Modelo de Dados
```typescript
interface Item {
  id: number;
  title: string;        // Obrigatório, min 3 chars
  description: string;  // Obrigatório, min 10 chars
  imageUrl: string;     // Obrigatório, URL válida
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Endpoints API (JSON Server)
```
GET    /items          # Listar todos
GET    /items/:id      # Buscar por ID
POST   /items          # Criar novo
PUT    /items/:id      # Atualizar
DELETE /items/:id      # Excluir

# Filtros: ?q=search&_sort=field&_order=desc&_page=1&_limit=10
```

## 🧪 Estrutura de Testes

### Arquivos de Teste (88 testes)
- `item.service.spec.ts` (15 testes) - CRUD, filtros
- `item-list.component.spec.ts` (23 testes) - Paginação, filtros
- `item-card.component.spec.ts` (21 testes) - Exibição, ações
- `paginator-intl.service.spec.ts` (10 testes) - Tradução
- `theme.service.spec.ts` (11 testes) - Temas
- `notification.service.spec.ts` (6 testes) - Notificações
- `app.spec.ts` (2 testes) - App principal

### Executar Testes
```bash
node test-runner.js    # Verificar estrutura
npm test               # Executar (precisa browser)
npm run build          # Verificar compilação
```

## 🎨 Sistema de Temas

### Cores Principais
**Tema Claro:**
- Primary: #546e7a (azul-acinzentado)
- Background: #fafafa (cinza muito claro)
- Surface: #ffffff (branco)

**Tema Escuro:**
- Primary: #78909c (azul-acinzentado claro)
- Background: #121212 (preto Material)
- Surface: #1e1e1e (cinza escuro)

### Classes CSS
- `.light-theme` / `.dark-theme` aplicadas no body
- Variáveis CSS customizadas em `:root`
- Transições suaves de 0.3s ease

## 🔍 Features Específicas

### Busca Inteligente
- Debounce de 500ms para performance
- Mínimo 3 caracteres para executar
- Busca local em título e descrição
- Hint visual do progresso

### Paginação Suavizada
- Position fixed no bottom da tela
- Delay mínimo de 1 segundo na mudança
- Fade effect (opacidade 0.3) durante loading
- Tradução completa para português

### Ordenação Otimizada
- Padrão: `updatedAt` decrescente
- Ordenação local no frontend
- Itens editados aparecem no topo
- Fallback inteligente nos services

## ⚠️ Pontos de Atenção

### Para Desenvolvimento
1. **JSON Server**: Sempre executar na porta 3000
2. **CORS**: Configurado para desenvolvimento local
3. **Imagens**: Usar placehold.co para placeholders
4. **Testes**: Validar com `node test-runner.js` antes de executar

### Para Debugging
1. **Console**: Logs detalhados nos services
2. **DevTools**: Angular DevTools para signals/estado
3. **Network**: Verificar requisições para JSON Server
4. **Build**: `npm run build` para validar TypeScript
5. **Sass Warnings**: Warnings de @import são normais (não são erros)

### Para Novas Features
1. **Seguir Padrões**: Standalone components + signals
2. **Documentar**: JSDoc em métodos públicos
3. **Testar**: Criar spec.ts correspondente
4. **IDs Únicos**: Para elementos clicáveis
5. **Responsividade**: Testar em mobile

## 📚 Recursos de Documentação

### Para Consulta
- **llms.txt**: Documentação completa para LLMs
- **TESTS.md**: Guia específico de testes
- **README.md**: Instruções gerais de uso
- **JSDoc**: Documentação gerada do código

### Para Aprendizado
- **Compodoc**: Arquitetura e dependências
- **Source Code**: Código bem comentado
- **Git History**: Evolução das features

## 🎯 Próximos Desenvolvimentos Sugeridos

### Prioridade Alta
- Autenticação e autorização
- Testes E2E com Cypress
- PWA capabilities

### Prioridade Média
- Cache inteligente
- Filtros avançados (data, categoria)
- Export/Import de dados

### Prioridade Baixa
- Animações avançadas
- Múltiplos temas
- Internacionalização (i18n)

## 💡 Dicas para IA

### Ao Modificar Código
1. Sempre verificar tipagem TypeScript
2. Seguir padrões existentes de naming
3. Documentar com JSDoc se público
4. Adicionar IDs únicos se elementos clicáveis

### Ao Criar Testes
1. Usar estrutura similar aos existentes
2. Mock todas as dependências
3. Testar casos de sucesso e erro
4. Verificar com `node test-runner.js`

### Ao Debugar
1. Verificar se JSON Server está rodando
2. Confirmar CORS e endpoints
3. Validar dados no db.json
4. Testar build com `npm run build`

---

**Este arquivo serve como guia rápido para qualquer IA/assistente trabalhar eficientemente com o projeto TagMe Desafio.**
