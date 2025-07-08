# Testes Unitários - TagMe Desafio

## 📋 Resumo

Este projeto possui **88 testes unitários** distribuídos em **7 arquivos de teste**, cobrindo os principais componentes e serviços da aplicação.

## 🧪 Estrutura de Testes

### Services (Serviços)
- **ItemService** (15 testes)
  - CRUD operations (Create, Read, Update, Delete)
  - Filtros e paginação
  - Ordenação por datas
  - Tratamento de erros

- **PaginatorIntlService** (10 testes)
  - Tradução para português brasileiro
  - Formatação de ranges
  - Emissão de mudanças

- **ThemeService** (11 testes)
  - Alternância de temas
  - Persistência no localStorage
  - Aplicação de classes CSS

- **NotificationService** (6 testes)
  - Notificações de sucesso, erro, info e warning
  - Configuração de duração personalizada

### Components (Componentes)
- **ItemListComponent** (23 testes)
  - Inicialização e carregamento
  - Filtros e busca
  - Paginação suavizada
  - Ações CRUD
  - Estados de loading

- **ItemCardComponent** (21 testes)
  - Exibição de informações
  - Ações (visualizar, editar, deletar)
  - Tratamento de erros de imagem
  - Formatação de datas

- **App** (2 testes)
  - Criação do componente
  - Renderização básica

## 🚀 Como Executar os Testes

### Pré-requisitos
- Node.js instalado
- NPM dependencies instaladas (`npm install`)
- Browser disponível (Chrome, Firefox, etc.)

### Comandos

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm test -- --code-coverage

# Executar em modo headless (se Chrome estiver instalado)
npm test -- --browsers=ChromeHeadless

# Executar sem watch mode
npm test -- --watch=false

# Verificar estrutura de testes
node test-runner.js
```

## 📊 Cobertura de Testes

### Funcionalidades Testadas

#### ItemService
- ✅ Buscar todos os itens
- ✅ Buscar itens com filtros
- ✅ Buscar item por ID
- ✅ Criar novo item
- ✅ Atualizar item existente
- ✅ Deletar item
- ✅ Ordenação por data (updatedAt desc)
- ✅ Paginação local
- ✅ Tratamento de erros

#### ItemListComponent
- ✅ Inicialização com valores padrão
- ✅ Carregamento de itens
- ✅ Filtros de busca com debounce
- ✅ Paginação com delay suavizado
- ✅ Estados de loading
- ✅ Ações CRUD via diálogos
- ✅ Limpeza de filtros
- ✅ Alternância de tema

#### ItemCardComponent
- ✅ Exibição de informações do item
- ✅ Ações (visualizar, editar, deletar)
- ✅ Estados de loading
- ✅ Formatação de datas
- ✅ Tratamento de erros de imagem
- ✅ Controle de exibição de ações

#### PaginatorIntlService
- ✅ Tradução de labels para português
- ✅ Formatação de ranges (ex: "1 – 10 de 50")
- ✅ Casos especiais (sem itens, página única)
- ✅ Emissão de mudanças

#### ThemeService
- ✅ Inicialização com tema padrão
- ✅ Alternância entre temas
- ✅ Persistência no localStorage
- ✅ Aplicação de classes CSS
- ✅ Tratamento de erros

#### NotificationService
- ✅ Notificações de sucesso
- ✅ Notificações de erro
- ✅ Notificações de info
- ✅ Notificações de warning
- ✅ Duração personalizada

## 🛠️ Tecnologias de Teste

- **Jasmine** - Framework de testes
- **Karma** - Test runner
- **Angular Testing Utilities** - Utilitários específicos do Angular
- **HttpClientTestingModule** - Mock para requisições HTTP
- **Spies** - Mocks e stubs para dependências

## 📝 Padrões de Teste

### Estrutura Básica
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    // Setup de mocks e TestBed
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform specific action', () => {
    // Test implementation
  });
});
```

### Convenções
- **Arrange-Act-Assert** - Estrutura clara dos testes
- **Mocks explícitos** - Todas as dependências mockadas
- **Testes isolados** - Cada teste é independente
- **Nomes descritivos** - Descrições claras do comportamento testado

## 🔧 Configuração

### TestBed Configuration
```typescript
await TestBed.configureTestingModule({
  imports: [ComponentUnderTest, BrowserAnimationsModule],
  providers: [
    provideZonelessChangeDetection(),
    { provide: ServiceName, useValue: mockService }
  ]
}).compileComponents();
```

### Mock Services
```typescript
const mockService = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
mockService.method1.and.returnValue(of(mockData));
```

## 📈 Executando Validações

Para verificar se todos os testes estão funcionando:

```bash
# 1. Verificar estrutura
node test-runner.js

# 2. Verificar build
npm run build

# 3. Executar testes (quando browser disponível)
npm test
```

## 🎯 Próximos Passos

Para expandir a cobertura de testes:

1. **Testes E2E** - Adicionar testes de integração
2. **Testes de Performance** - Validar velocidade de carregamento
3. **Testes de Acessibilidade** - Verificar conformidade WCAG
4. **Testes de Responsividade** - Validar layouts em diferentes telas
5. **Testes de Internacionalização** - Verificar suporte a idiomas

## 📚 Documentação Adicional

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
