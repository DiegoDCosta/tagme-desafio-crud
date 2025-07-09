# Testes Unitários - TagMe Desafio

Este projeto possui testes unitários cobrindo os principais serviços e componentes, com foco em operações CRUD reais, mocks alinhados ao comportamento dos serviços, e cobertura de eventos, integração e tratamento de erros.

## Estrutura dos Testes

### Serviços
- **ItemService**: CRUD completo, filtros, paginação, ordenação, erros
- **NotificationService**: Notificações (sucesso, erro, info, warning)

### Componentes
- **ItemCardComponent**: Exibição, ações (visualizar, editar, deletar), eventos
- **ItemFormComponent**: Formulário, emissão de eventos, integração

### Arquivos de Teste
- src/app/services/item.service.spec.ts
- src/app/services/notification.service.spec.ts
- src/app/components/item-card/item-card.component.spec.ts
- src/app/components/item-form/item-form.component.spec.ts

## Como Executar os Testes

### Pré-requisitos
- Node.js instalado
- Dependências instaladas (`npm install`)

### Comandos
```bash
# Executar todos os testes
npm test

# Executar com coverage (Chromium/Ubuntu)
npm run test:coverage:chromium

# Verificar build
npm run build

# Verificar estrutura de testes
node test-runner.js
```

## Cobertura dos Testes

### Funcionalidades Testadas
- CRUD completo (create, read, update, delete)
- Busca, filtros e paginação
- Ordenação por data
- Emissão de eventos (edit, delete, view, save, cancel)
- Feedback visual (notificações)
- Tratamento de erros
- Integração entre componentes e serviços

## Padrões e Convenções
- Arrange-Act-Assert
- Mocks explícitos e alinhados ao serviço real
- Testes isolados e descritivos
- Uso de HttpClientTestingModule e spies
- Testes de eventos e integração

### Exemplo de Estrutura
```typescript
describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Setup de mocks e TestBed
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Dicas
- Sempre alinhe os tipos dos mocks ao serviço real
- Teste casos de sucesso e erro
- Use spies para eventos e dependências
- Valide a emissão correta de eventos

## Próximos Passos
- Expandir cobertura para E2E (Cypress)
- Testes de performance, acessibilidade e responsividade
- Internacionalização

## Documentação Adicional
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
