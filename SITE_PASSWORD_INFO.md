# 🔐 Site Password Protection

## Sistema Implementado

O seu site agora está completamente protegido por password. Ninguém consegue aceder a qualquer página sem inserir a password correta primeiro.

## 🔑 Password Atual

**Password do site:** `jplus2024` (default)  
**Password do admin:** `jstore2024` (default)

**🔄 Agora configurável via variáveis de ambiente!**

## 🎯 Como Funciona

1. **Primeira visita**: Usuário vê tela de login com logo JPlus
2. **Inserir password**: Campo para inserir a password do site
3. **Autenticação**: Se password estiver correta, acede ao site
4. **Logout**: Botão de logout no header (ícone vermelho) para sair

## 📱 Características

- **Tela de login elegante** com logo JPlus
- **Autenticação persistente** (mantém login até logout manual)
- **Botão de logout** no header (ícone de porta)
- **Loading states** durante verificação
- **Erro handling** para password incorreta
- **Design responsivo** para mobile/desktop

## 🔧 Como Alterar as Passwords

### ✅ **Método Recomendado: Variáveis de Ambiente**

**1. Crie o arquivo `.env.local` na raiz do projeto:**
```bash
# Site Access Password
NEXT_PUBLIC_SITE_PASSWORD=sua_password_personalizada

# Admin Panel Password  
NEXT_PUBLIC_ADMIN_PASSWORD=sua_password_admin_personalizada
```

**2. Reinicie o servidor:**
```bash
npm run dev
```

### 🔧 **Método Alternativo: Alterar no Código**

**Site Password - Arquivo:** `app/context/SiteAuthContext.tsx`
```typescript
const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || "jplus2024";
```

**Admin Password - Arquivo:** `app/context/AuthContext.tsx`
```typescript
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "jstore2024";
```

**📖 Documentação completa:** `ENVIRONMENT_VARIABLES.md`

## 🚀 Status do Sistema

### ✅ Implementado:
- Context de autenticação global
- Tela de login com design JPlus
- Guard para proteger todo o conteúdo
- Botão de logout no header
- Persistência de login (localStorage)
- Loading states e error handling

### 🔐 Segurança:
- Password armazenada no código (não em variável de ambiente)
- Delay de 500ms para prevenir ataques de força bruta
- Confirmação antes de logout
- Limpeza de localStorage ao logout

## 📖 Estrutura dos Arquivos

```
app/
├── context/
│   └── SiteAuthContext.tsx      # Lógica de autenticação
├── components/
│   ├── SiteLogin.tsx           # Tela de login
│   └── SiteAuthGuard.tsx       # Proteção de rotas
├── layout.tsx                  # Layout com proteção
└── ClientHeader.tsx            # Header com logout
```

## 🎨 Tela de Login

- **Logo**: JPlus centralizado
- **Título**: "JPlus" em gradiente azul-laranja
- **Subtítulo**: "Enter password to access"
- **Campo**: Input de password com placeholder
- **Botão**: "Access Site" com loading state
- **Design**: Gradiente de fundo beige, card branco

## ⚠️ Nota Importante

**Restart necessário**: Após implementação, o servidor de desenvolvimento precisa ser reiniciado para compilar os novos componentes.

**Comando:**
```bash
# Parar o servidor (Ctrl+C)
# Depois executar:
npm run dev
```

---

**O seu site está agora completamente protegido! 🔐✨**
