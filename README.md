# Angular 20 CRUD Item Manager - TagMe Desafio

Uma aplicação Angular 20 completa para gerenciamento de itens com operações CRUD, utilizando Angular Material, RxJS Signals e json-server como backend simulado.

## 🚀 Funcionalidades

- ✅ **CRUD Completo**: Criar, listar, editar e excluir itens
- ✅ **Angular 20**: Standalone Components com Control Flow (@if, @for)
- ✅ **Material Design**: Tema purple personalizado
- ✅ **Signals**: Gerenciamento de estado reativo
- ✅ **Upload de Imagens**: Com recorte usando ngx-image-cropper
- ✅ **Filtros e Busca**: Por título, descrição e ordenação
- ✅ **Paginação**: Navegação eficiente entre páginas
- ✅ **Responsivo**: Design mobile-first
- ✅ **Documentação**: JSDoc completa + Compodoc
- ✅ **Componentes Reutilizáveis**: Spinner, Modal, Confirm Dialog
- ✅ **Tratamento de Erros**: Feedback visual com snackbars
- ✅ **Loading States**: Estados de carregamento em todas as operações

## 🛠️ Tecnologias Utilizadas

- **Angular 20** com Standalone Components
- **Angular Material** (tema purple personalizado)
- **RxJS** e **Signals** para estado reativo
- **TypeScript** com documentação JSDoc
- **JSON Server** para API REST simulada
- **ngx-image-cropper** para recorte de imagens
- **Compodoc** para documentação técnica

## 📋 Pré-requisitos

- Node.js (versão 18+)
- npm ou yarn
- Angular CLI 20+

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd tagme-desafio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração completa (já executada)

As seguintes dependências já foram instaladas e configuradas:

```bash
# Angular Material
ng add @angular/material

# Dependências de desenvolvimento
npm install --save-dev jsdoc @compodoc/compodoc json-server

# Dependências de produção
npm install @angular/animations ngx-image-cropper
```

## 🚦 Executando a Aplicação

### Modo Desenvolvimento

#### Opção 1: Comando Único (Recomendado)
```bash
npm run start:dev
```
Este comando inicia automaticamente tanto o Angular quanto o JSON Server simultaneamente.

#### Opção 2: Comandos Separados
1. **Inicie o JSON Server** (em um terminal):
```bash
npm run json-server
```

2. **Inicie a aplicação Angular** (em outro terminal):
```bash
npm start
```

3. **Acesse a aplicação**:
   - Frontend: http://localhost:4200
   - API JSON Server: http://localhost:3000

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Inicia aplicação Angular
npm run json-server         # Inicia JSON Server na porta 3000
npm run start:dev           # Inicia Angular + JSON Server simultaneamente

# Build e Produção
npm run build               # Build para produção
npm run watch               # Build em modo watch

# Documentação
npm run doc:build           # Gera documentação Compodoc
npm run doc:serve           # Serve documentação
npm run doc:buildandserve   # Gera e serve documentação
npm run jsdoc               # Gera documentação JSDoc

# Testes
npm test                    # Executa testes unitários
```

## 📁 Estrutura do Projeto

```
src/app/
├── components/              # Componentes principais
│   ├── item-list/          # Lista com filtros e paginação
│   ├── item-form/          # Formulário criar/editar
│   ├── item-card/          # Card para exibir item
│   └── item-dialog/        # Modal detalhes do item
├── services/               # Services da aplicação
│   ├── item.service.ts     # CRUD operations com API
│   └── notification.service.ts # Sistema de notificações
├── models/                 # Interfaces TypeScript
│   └── item.model.ts       # Modelos de dados
├── shared/                 # Componentes reutilizáveis
│   └── components/
│       ├── spinner/        # Loading indicator
│       ├── modal/          # Modal genérico
│       └── confirm-dialog/ # Diálogo confirmação
├── guards/                 # Route guards
└── interceptors/           # HTTP interceptors
```

## 🗃️ Estrutura de Dados

### Item Model

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

### API Endpoints (JSON Server)

```
GET    /items              # Listar todos os itens
GET    /items/:id          # Buscar item por ID
POST   /items              # Criar novo item
PUT    /items/:id          # Atualizar item
DELETE /items/:id          # Excluir item

# Filtros suportados:
GET /items?q=search&_sort=field&_order=asc&_page=1&_limit=10
```

### Serviço de Imagens

O projeto utiliza o **placehold.co** como serviço de placeholder para imagens:

- **Service**: https://placehold.co/
- **Formato Básico**: `https://placehold.co/WIDTHxHEIGHT?text=TEXTO`
- **Formato Colorido**: `https://placehold.co/WIDTHxHEIGHT/COR_FUNDO/COR_TEXTO?text=TEXTO`
- **Exemplos**:
  - Simples: `https://placehold.co/300x200?text=Item+1`
  - Colorido: `https://placehold.co/300x200/4A90E2/FFFFFF?text=Smartphone`
- **Fallback**: Imagens quebradas são substituídas automaticamente por placeholders
- **Suporte**: JPG, PNG, GIF, WebP
- **Cores**: Hexadecimal (sem #) para fundo e texto
- **Dimensões**: Qualquer tamanho (recomendado: aspect ratio 4:3 para cards)

## 🎨 Componentes Principais

### 1. ItemListComponent
- Lista paginada de itens
- Filtros de busca e ordenação
- Ações CRUD inline
- Estados de loading e erro

### 2. ItemFormComponent
- Formulário reativo com validação
- Upload e recorte de imagens
- Modo criar/editar
- Preview em tempo real

### 3. ItemCardComponent
- Exibição visual do item
- Menu de ações
- Hover effects
- Responsive design

### 4. Componentes Compartilhados
- **SpinnerComponent**: Loading customizável
- **ModalComponent**: Modal genérico
- **ConfirmDialogComponent**: Confirmação de ações

## 🔧 Funcionalidades Avançadas

### Validações Implementadas
- **Título**: Obrigatório, mínimo 3 caracteres
- **Descrição**: Obrigatória, mínimo 10 caracteres
- **Imagem**: URL válida obrigatória
- **Recorte**: Aspect ratio 4:3, dimensões mínimas

### Estados de Loading
- Loading global durante operações
- Loading por item durante exclusão
- Spinners com mensagens contextuais
- Desabilitação de ações durante processo

### Sistema de Notificações
- Sucesso, erro, aviso e info
- Snackbars do Material Design
- Feedback visual para todas as ações
- Configuração de duração personalizada

## 📚 Documentação

### Geração de Documentação

```bash
# Compodoc (arquitetura e componentes)
npm run doc:build

# JSDoc (código e APIs)
npm run jsdoc
```

### Documentação Disponível
- **Compodoc**: `./documentation/index.html`
- **JSDoc**: `./docs/jsdoc/index.html`
- **llms.txt**: Documentação para LLMs na raiz

## 🧪 Testes

### Estrutura de Testes
- Testes unitários com Jasmine/Karma
- Mocks para services
- Cobertura de componentes principais

```bash
npm test                    # Executa testes
npm run test:coverage      # Testes com cobertura
```

## 📱 Responsividade

- **Desktop**: Grid de cards, filtros laterais
- **Tablet**: Grid adaptativo, navegação otimizada
- **Mobile**: Layout vertical, menu hambúrguer
- **Breakpoints**: 768px, 480px

## 🚀 Deploy e Produção

### Build para Produção

```bash
npm run build
```

### Otimizações Aplicadas
- Tree shaking automático
- Lazy loading de componentes
- Minificação de código
- Compressão de assets

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 🔄 Atualizações Recentes

### v1.1.0 - Melhorias no Serviço de Imagens
- ✅ **Migração para placehold.co**: Substituição do via.placeholder.com pelo placehold.co (mais estável)
- ✅ **URLs Coloridas**: Suporte a placeholders com cores personalizadas
- ✅ **Dados Reais**: Exemplos mais realistas no db.json (Smartphone, Notebook, Fones)
- ✅ **Documentação Atualizada**: README.md e llms.txt com informações detalhadas
- ✅ **JSDoc Melhorado**: Comentários atualizados em todos os componentes

### v1.1.1 - Correção do Tema Material Design
- ✅ **Tema Purple Correto**: Substituição do cyan-orange.css pelo purple-green.css
- ✅ **Customizações Purple**: Gradientes e estilos personalizados em tons de roxo
- ✅ **Título da Aplicação**: Atualizado para "Gerenciador de Itens - TagMe Desafio"
- ✅ **Estilização Melhorada**: Cards com bordas arredondadas e sombras suaves

### v1.1.2 - Melhorias Visuais Avançadas
- ✅ **Paginator com Gradiente**: Mat-paginator estilizado com gradiente purple
- ✅ **Cards Premium**: Gradiente sutil branco para cinza claro com bordas purple
- ✅ **Background Refinado**: Gradiente no body para textura visual
- ✅ **Form Fields Purple**: Estados de foco com cores do tema
- ✅ **Snackbars Coloridos**: Notificações com gradientes por tipo
- ✅ **Spinners Temáticos**: Loading indicators com cores do tema

### v1.1.3 - Busca Inteligente com Debounce
- ✅ **Busca com Debounce**: Executa busca apenas a partir do 3º caractere
- ✅ **Filtro Local**: Busca em título e descrição com filtro local
- ✅ **Hint Visual**: Indicador de quantos caracteres faltam para buscar
- ✅ **Performance**: Debounce de 500ms para evitar requests excessivos
- ✅ **UX Melhorada**: Placeholder explicativo e feedback em tempo real

### v1.1.4 - Comando de Desenvolvimento Unificado
- ✅ **Script start:dev**: Novo comando `npm run start:dev` que executa Angular + JSON Server simultaneamente
- ✅ **Documentação Atualizada**: README.md e llms.txt com informações do novo comando
- ✅ **Experiência Melhorada**: Inicia o ambiente completo com um único comando
- ✅ **Concorrência**: Utiliza `concurrently` para execução simultânea dos serviços

### v1.1.5 - IDs Únicos para Elementos Clicáveis
- ✅ **IDs Padronizados**: Todos os elementos clicáveis agora possuem IDs únicos para automação de testes
- ✅ **Elementos de Lista**: IDs dinâmicos baseados no ID do item (ex: `btn-edit-item-1`, `btn-delete-item-2`)
- ✅ **Componentes Compartilhados**: IDs em modais e diálogos de confirmação
- ✅ **Facilita Testes**: Melhora a identificação de elementos em testes automatizados e E2E
- ✅ **Acessibilidade**: Melhora a navegação por elementos para tecnologias assistivas

## 📋 Próximos Passos

- [ ] Autenticação e autorização
- [ ] Cache inteligente de dados
- [ ] PWA capabilities
- [ ] Testes E2E com Cypress
- [ ] Deploy automatizado
- [ ] Internacionalização (i18n)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para dúvidas e suporte:
1. Consulte a documentação gerada
2. Verifique os logs do console
3. Abra uma issue no repositório

---

Desenvolvido com ❤️ usando Angular 20 e Material Design
