FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB thunderchime
COPY dbstarter/accounts.sql /docker-entrypoint-initdb.d/