import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

const initializeKeycloak = () => {
    return new Promise((resolve, reject) => {
        keycloak
            .init({
                onLoad: 'login-required',
                pkceMethod: 'S256',
                checkLoginIframe: false,
            })
            .then(authenticated => {
                if (!authenticated) {
                    keycloak.login()
                } else {
                    resolve(keycloak)
                }
            })
            .catch(error => {
                console.error('Erro ao iniciar o Keycloak:', error)
                reject(error)
            })
    })
}

export { keycloak, initializeKeycloak }
