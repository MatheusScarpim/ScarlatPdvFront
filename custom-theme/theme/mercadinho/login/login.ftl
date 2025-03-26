<!DOCTYPE html>
<html>
<head>
    <title>${realm.displayName!realm.name}</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
</head>
<body>

<div class="background-image"></div> <!-- fundo -->
<div class="login-container">
    <h1>${realm.displayName!realm.name}</h1>

    <form action="${url.loginAction}" method="post">
        <input type="text" name="username" placeholder="Usuário" />
        <input type="password" name="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
    </form>
</div>

</body>
</html>
