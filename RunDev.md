# Rodando Aplicativo

## Rodar ClienteApp
Verificar se o `node` está na versão `12.20.0` no qual foi feito o teste

### Rodando pela primeira vez

```bash
cd ~/repo/Telemedicine/FewaTelemedicine/ClientApp
npm install
npm run-script dev
```

### Rodando pela segunda vez
```bash
cd ~/repo/Telemedicine/FewaTelemedicine/ClientApp
npm run-script dev
```

## Rodar backend
Verificar se o `dotnet-core` está na versão `3.1.418` no qual foi feito o teste 
e também se o banco e as tabelas estão ok.
```bash
cd ~/repo/Telemedicine/FewaTelemedicine
dotnet watch run
```

## Expor aplicativo para internet
```bash
lt --port 5000 --subdomain nomeApp
```


