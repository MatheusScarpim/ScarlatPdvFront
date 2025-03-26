// src/auth.js
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: 'http://localhost:8081', // sem o /auth
    realm: 'MERCADINHO_PDV',
    clientId: 'pdv_mercadinho',
})

const initializeKeycloak = () => {
    return new Promise((resolve, reject) => {
        keycloak
            .init({
                onLoad: 'login-required', // já força login
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
