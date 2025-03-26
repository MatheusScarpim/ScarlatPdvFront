FROM quay.io/keycloak/keycloak:21.0

ENV KC_DB=mysql

# Copiar o tema direto pro local correto
COPY ./custom-theme/theme /opt/keycloak/themes

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]
