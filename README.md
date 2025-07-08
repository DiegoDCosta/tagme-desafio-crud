# TagMe Desafio - Angular 20 CRUD Item Manager

## 🎯 Descrição
Aplicação Angular 20 completa para gerenciamento de itens com operações CRUD, temas dinâmicos, busca inteligente, paginação suavizada e **88 testes unitários** implementados.

## ✨ Funcionalidades Principais
- 📋 **CRUD Completo**: Criar, visualizar, editar e deletar itens
- 🔍 **Busca Inteligente**: Filtros com debounce e mínimo de 3 caracteres
- 📄 **Paginação Fixa**: Suavizada com transições e traduzida para português
- 🌙 **Temas Dinâmicos**: Alternância claro/escuro com persistência
- 📱 **Design Responsivo**: Cards adaptativos e Material Design
- 🔧 **88 Testes Unitários**: Cobertura completa com Jasmine/Karma
- 📸 **Upload de Imagens**: Com recorte usando ngx-image-cropper
- 🚀 **Performance**: Ordenação local e lazy loading

## 🛠️ Tecnologias Utilizadas
- **Angular 20** com Standalone Components
- **Angular Material** com tema personalizado
- **TypeScript** com tipagem rigorosa
- **RxJS** e **Signals** para estado reativo
- **JSON Server** para API simulada
- **Jasmine/Karma** para testes unitários
- **SCSS** para estilização avançada
- **ngx-image-cropper** para manipulação de imagens

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd tagme-desafio

# Instalar dependências
npm install
```

### Execução em Desenvolvimento
```bash
# Opção 1: Comando único (Angular + JSON Server)
npm run start:dev

# Opção 2: Executar separadamente
npm run json-server  # Terminal 1 - API na porta 3000
npm start            # Terminal 2 - Angular na porta 4200
```

### Acessar Aplicação
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000
- **Documentação**: http://localhost:8080 (após `npm run doc:serve`)

## 🧪 Executar Testes

### Testes Unitários
```bash
# Verificar estrutura de testes
node test-runner.js

# Executar todos os testes
npm test

# Executar com coverage
npm test -- --code-coverage

# Verificar build (para validar compilação)
npm run build
```

### Estrutura de Testes (88 testes)
- **ItemService** (15 testes) - CRUD, filtros, ordenação
- **ItemListComponent** (23 testes) - Paginação, filtros, ações
- **ItemCardComponent** (21 testes) - Exibição, ações, formatação
- **PaginatorIntlService** (10 testes) - Tradução português
- **ThemeService** (11 testes) - Alternância de temas
- **NotificationService** (6 testes) - Notificações
- **App** (2 testes) - Criação e renderização

## 📁 Estrutura do Projeto
```
src/app/
├── components/
│   ├── item-list/           # Lista principal com filtros
│   ├── item-card/           # Cards dos itens
│   ├── item-form/           # Formulário de criação/edição
│   └── item-dialog/         # Modal de visualização
├── services/
│   ├── item.service.ts      # CRUD operations
│   ├── theme.service.ts     # Gerenciamento de temas
│   ├── notification.service.ts  # Notificações
│   └── paginator-intl.service.ts  # Tradução paginação
├── models/
│   └── item.model.ts        # Interfaces TypeScript
├── shared/components/
│   ├── spinner/             # Loading indicators
│   ├── modal/               # Modal genérico
│   └── confirm-dialog/      # Diálogos de confirmação
└── assets/                  # Recursos estáticos
```

## 🎨 Funcionalidades Destacadas

### Sistema de Temas
- **Tema Claro/Escuro**: Alternância dinâmica
- **Persistência**: Salvo no localStorage
- **Detecção Automática**: Preferência do sistema
- **Transições Suaves**: Animações de 0.3s

### Paginação Avançada
- **Fixa no Rodapé**: Sempre visível
- **Suavização**: Delay de 1s + fade effects
- **Português**: Tradução completa
- **Responsiva**: Funciona em mobile

### Busca Inteligente
- **Debounce**: 500ms para performance
- **Mínimo 3 caracteres**: Evita buscas desnecessárias
- **Feedback Visual**: Hints do progresso
- **Busca Local**: Em título e descrição

### Ordenação Otimizada
- **Por Data**: updatedAt decrescente (padrão)
- **Local**: No frontend para melhor controle
- **Flexível**: Usuário pode alterar via filtros

## 📚 Scripts Disponíveis

### Desenvolvimento
```bash
npm start              # Iniciar Angular (porta 4200)
npm run json-server    # Iniciar API (porta 3000)
npm run start:dev      # Ambos simultaneamente
```

### Build e Deploy
```bash
npm run build          # Build de produção
npm run build:stats    # Build com análise de bundle
```

### Testes
```bash
npm test               # Testes unitários
npm run test:coverage  # Testes com coverage
node test-runner.js    # Verificar estrutura
```

### Documentação
```bash
npm run doc:build      # Gerar documentação
npm run doc:serve      # Servir documentação
npm run jsdoc          # Documentação JSDoc
```

## 🔧 Configuração

### Variáveis de Ambiente
- **API_URL**: URL da API (padrão: http://localhost:3000)
- **PRODUCTION**: Flag de produção

### Personalização de Tema
As cores podem ser customizadas em `src/styles.scss`:
```scss
:root {
  --primary-color: #546e7a;
  --accent-color: #78909c;
  --background-color: #fafafa;
}
```

## 📊 Dados de Exemplo
O arquivo `db.json` contém 20+ itens de exemplo com:
- Produtos tecnológicos diversos
- Imagens usando placehold.co
- Datas de criação e atualização
- Descrições detalhadas

## 🔄 Histórico de Versões

### v1.2.5 - Testes Unitários Completos (Atual)
- ✅ **88 Testes Implementados**: Cobertura completa dos principais componentes
- ✅ **7 Arquivos de Teste**: Services e Components testados individualmente
- ✅ **Padrões Jasmine/Karma**: Seguindo melhores práticas do Angular
- ✅ **Mocks Completos**: HttpClientTestingModule e spies para isolamento
- ✅ **Documentação de Testes**: TESTS.md com instruções completas

### v1.2.4 - Paginação Fixa e Suavizada
- ✅ **Paginação Fixa**: Componente MatPaginator fixo no final da tela
- ✅ **Transição Suavizada**: Delay de 1 segundo + fade effects na mudança de página
- ✅ **Tradução Completa**: Paginação em português brasileiro

### v1.2.3 - Ordenação por updatedAt
- ✅ **Ordenação por Última Atualização**: Lista agora carrega ordenada por `updatedAt`
- ✅ **Itens Recém-Editados no Topo**: Aparecem automaticamente no topo da lista
- ✅ **Ordenação Local**: Implementada no frontend para melhor performance

### v1.2.0 - Sistema de Tema Claro/Escuro
- ✅ **Alternância de Tema**: Sistema completo de mudança entre tema claro e escuro
- ✅ **Persistência**: Tema escolhido salvo no localStorage
- ✅ **Detecção Automática**: Respeita preferência do sistema operacional

### v1.1.7 - Modal de Edição
- ✅ **Edição em Modal**: Botão "Editar" nos cards agora abre formulário em modal
- ✅ **UX Melhorada**: Edição mais rápida sem navegar para outra tela

### v1.1.6 - Separação de Templates e Estilos
- ✅ **Arquivos Externos**: Templates e estilos movidos para arquivos separados
- ✅ **Melhor Organização**: Separação clara entre lógica, estrutura e estilo

### v1.1.5 - IDs Únicos para Automação
- ✅ **IDs Padronizados**: Todos os elementos clicáveis com IDs únicos
- ✅ **Facilita Testes**: Melhora identificação de elementos em testes automatizados

## 🤝 Contribuição
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte
- **Documentação**: Consulte TESTS.md e llms.txt
- **Issues**: Abra uma issue no GitHub
- **Wiki**: Documentação adicional no wiki do projeto

## 🚧 Roadmap Futuro
- [ ] Autenticação e autorização
- [ ] Testes E2E com Cypress
- [ ] PWA capabilities
- [ ] Cache inteligente
- [ ] Filtros avançados
- [ ] Export/Import de dados
- [ ] Bulk operations
- [ ] Versionamento de itens

---

**Desenvolvido com ❤️ usando Angular 20**
