# AGENT.md - Guia para IA/Assistentes

TagMe Desafio é uma aplicação Angular 20 standalone para gerenciamento de itens com CRUD, temas dinâmicos, busca inteligente, paginação fixa, upload de imagens, responsividade e testes unitários alinhados ao comportamento real dos serviços e componentes.

## Comandos Essenciais

### Desenvolvimento
```bash
npm run start:dev      # Angular + JSON Server juntos
npm start              # Apenas Angular (porta 4200)
npm run json-server    # Apenas API (porta 3000)
```

### Build e Testes
```bash
npm run build          # Build de produção
npm test               # Testes unitários
npm run test:coverage:chromium  # Coverage (Chromium/Ubuntu)
```

### Documentação
```bash
npm run doc:serve      # Servir documentação Compodoc
npm run jsdoc          # Gerar documentação JSDoc
```

## Estrutura Importante

### Componentes Principais
- src/app/components/item-list/         # Lista principal com filtros e paginação
- src/app/components/item-card/         # Cards dos itens
- src/app/components/item-form/         # Formulário criação/edição
- src/app/components/item-dialog/       # Modal de visualização

### Serviços Críticos
- src/app/services/item.service.ts      # CRUD de itens
- src/app/services/theme.service.ts     # Temas
- src/app/services/notification.service.ts # Notificações
- src/app/services/paginator-intl.service.ts # Tradução paginação

### Arquivos de Configuração
- package.json, angular.json, db.json, tsconfig.json

## Funcionalidades
- CRUD completo de itens
- Busca inteligente (debounce, mínimo 3 caracteres)
- Paginação fixa e traduzida
- Temas claro/escuro com persistência
- Upload e recorte de imagens
- Testes unitários alinhados ao comportamento real
- Feedback visual (snackbar, loading, erros)
- Ordenação local por data de atualização

## Padrões de Código
- Standalone Components e Signals
- Tipagem TypeScript strict
- Separação de responsabilidades (componentes, serviços, modelos)
- JSDoc em métodos públicos
- IDs únicos para automação e acessibilidade
- Testes focados em operações essenciais e casos reais

## Dados e API
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
Endpoints: GET/POST/PUT/DELETE /items, filtros ?q=search&_sort=field&_order=desc&_page=1&_limit=10

## Testes
- Estrutura de testes: veja TESTS.md
- Mocks alinhados ao serviço real
- Testes de eventos, integração e erros

## Temas
- Claro/Escuro alternável (localStorage, detecção automática)
- Variáveis CSS customizadas em src/styles.scss
- Transições suaves (0.3s)

## Dicas para IA/Assistentes
- Sempre alinhe tipos dos mocks ao serviço real
- Siga convenções de código e nomes
- Documente métodos públicos
- Teste casos de sucesso e erro
- Use spies para eventos e dependências
- Valide a emissão correta de eventos

## Roadmap e Próximos Passos
- Autenticação e autorização
- Testes E2E com Cypress
- PWA e cache inteligente
- Filtros avançados e export/import de dados
- Internacionalização (i18n)

---
Este arquivo serve como guia rápido e confiável para qualquer IA/assistente trabalhar eficientemente com o projeto TagMe Desafio.
