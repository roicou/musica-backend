#!/bin/bash

# estas dos líneas hay que borrarlas
echo "Configura bien el fichero"
exit 0
#  ------

DATE=$(date '+%Y%m%d_%H%M')

VERSION="1.1"

# Local
NAME="backend-plantilla_"${DATE}".tar.gz"
TEST_NAME="test_backend-plantilla_"${DATE}".tar.gz"
NODE_MAIN_FOLDER="."
TARS_FOLDER="../tars"
NODE_FOLDER="."

# Server
SERVER="servernameinconfig" # server's name in ~/.ssh/config
SERVER_TARS_FOLDER="/data/tars/backend-plantilla/upload"
SERVER_NODE_MAIN_FOLDER="/srv/essence_food/"
SERVER_NODE_TEST_FOLDER="/srv/essence_food_test/"
SERVER_BACKUPS_FOLDER="/data/tars/backend-plantilla/backups"
SERVER_NAME_BACKUP="backend-plantilla_backup_"${DATE}".tar.gz"

# Service
SERVER_SERVICE="backend-plantilla"

# INTERFACE
# INTERFACE_ROUTE="${NODE_MAIN_FOLDER}/${NODE_FOLDER}/public/rodaballo"
# INTERFACE_HOST="ftp.cluster014.ovh.net"
# INTERFACE_HOST_ROUTE="/www/pescanova/rodaballo/"
# INTERFACE_USER="deicomte"
# INTERFACE_PASSWORD="N5bhU8rw"

# Help command
function help_show() {
    echo "
Modo de empleo: $(basename "$0") [OPCIÓN]...
Sube los archivos del servidor e interfaz de rodaballo a sus respectivos servidores

Las opciones son para excluír ciertos procesos del script
Opciones disponibles:
    -s, --no_server     NO sube al servidor de nube el servidor Node
    -r, --no_restart    NO reinicia los servicios de los servidores Node
    -t, --test          Sube todo a la carpeta de test, no crea backup ni reinicia servidores
    -h, --help          Muestra esta ayuda y finaliza
        --version       Informa de la versión y finaliza
    "
    exit 0
}

# Upload Servidor
function uploadServer() {
    echo "----- Servidor -----"
    echo "Carpeta principal: ${NODE_MAIN_FOLDER}"
    cd ${NODE_MAIN_FOLDER}
    echo "Comprimiendo ${NODE_FOLDER}/* en ${TARS_FOLDER}"
    tar --exclude ${NODE_FOLDER}'/.git*' --exclude ${NODE_FOLDER}'/.vscode' --exclude ${NODE_FOLDER}'/node_modules' -czf ${TARS_FOLDER}/${NAME} ${NODE_FOLDER}/*
    echo "Tar creado con el nombre ${TARS_FOLDER}/${NAME}"
    echo "Subiendo ${NAME} mediante scp a ${SERVER}:${SERVER_TARS_FOLDER}"
    scp ${TARS_FOLDER}/${NAME} ${SERVER}:${SERVER_TARS_FOLDER}
    echo "Haciendo copia de seguridad en el servidor, comprimiendo: ${SERVER_NODE_MAIN_FOLDER}/${SERVER_NODE_FOLDER}/* en ${SERVER_BACKUPS_FOLDER}"
    ssh ${SERVER} "cd ${SERVER_NODE_MAIN_FOLDER}; sudo tar -czf ${SERVER_BACKUPS_FOLDER}/${SERVER_NAME_BACKUP} ./*"
    echo "Copia de seguridad creada con el nombre ${SERVER_BACKUPS_FOLDER}/${SERVER_NAME_BACKUP}"
    echo "Descomprimiendo servidor nuevo en el servidor en ${SERVER_NODE_MAIN_FOLDER}"
    ssh ${SERVER} "cd ${SERVER_TARS_FOLDER}; sudo tar -xzf ${NAME} -C ${SERVER_NODE_MAIN_FOLDER}"
    echo "----- /Servidor -----"
}

# Upload Test Servidor
function uploadTest() {
    echo "----- Servidor -----"
    echo "Carpeta principal: ${NODE_MAIN_FOLDER}"
    cd ${NODE_MAIN_FOLDER}
    echo "Comprimiendo ${NODE_FOLDER}/* en ${TARS_FOLDER}"
    tar --exclude ${NODE_FOLDER}'/.git*' --exclude ${NODE_FOLDER}'/.vscode' --exclude ${NODE_FOLDER}'/node_modules' -czf ${TARS_FOLDER}/${TEST_NAME} ${NODE_FOLDER}/*
    echo "Tar creado con el nombre ${TARS_FOLDER}/${TEST_NAME}"
    echo "Subiendo ${TEST_NAME} mediante scp a ${SERVER}:${SERVER_TARS_FOLDER}"
    scp ${TARS_FOLDER}/${TEST_NAME} ${SERVER}:${SERVER_TARS_FOLDER}
    echo "Descomprimiendo servidor nuevo en el servidor en ${SERVER_NODE_TEST_FOLDER}"
    ssh ${SERVER} "cd ${SERVER_TARS_FOLDER}; sudo tar -xzf ${TEST_NAME} -C ${SERVER_NODE_TEST_FOLDER}; rm ${TEST_NAME};"
    echo "----- /Servidor -----"
}

# Restart servers
function restartServer() {
    echo "----- Reinicio servidores -----"
    ssh ${SERVER} "sudo systemctl restart ${SERVER_SERVICE};"
    echo "Reinicio efectuado"
    echo "----- /Reinicio servidores -----"

}

# Check packages
function checkPackages() {
    echo "Comprobando paquetes"
}

# Execute all
function uploadAll() {
    checkPackages
    uploadServer
    # echo ""
    # uploadInterface
    echo ""
    restartServer
    echo ""
}

ARG_S=true
ARG_R=true
ARG_T=false

LONG_OPTARG=""

while getopts "hsirt-:" arg; do
    case "$arg" in
    h)
        help_show
        exit 0
        ;;
    s) ARG_S=false ;;
    r) ARG_R=false ;;
    t) ARG_T=true ;;
    -)
        LONG_OPTARG="${OPTARG#*=}" # Esto se usa para en caso de que una flag tenga datos ( foo="test.txt" )
        case $OPTARG in
        help) help_show ;;
        version)
            echo "${VERSION}"
            exit 0
            ;;
        no_server) ARG_S=false ;;
        test) ARG_T=true ;;
        # foo=?*     )  ARG_foo="$LONG_OPTARG" ;;
        # foo*       )  echo "No hay arguemntos para --$OPTARG option" >&2; exit 2 ;;
        # no_interface )  ARG_I=false ;;
        no_restart) ARG_R=false ;;
        '') break ;; # "--" Terminar el procesado de --
        *)
            echo "Illegal option --$OPTARG" >&2
            help_show
            exit 2
            ;;
        esac
        ;;
    \?)
        help_show
        exit 2
        ;;
    esac
done

if [ -z "$1" ]; then
    echo "
No se ha detectado ningúna opción, haciendo todo el proceso
    "
    uploadAll
else
    echo ""
    if [ ${ARG_T} = true ]; then
        echo "--- Parámetro test detectado, se subirá a la carpeta tde test ${SERVER_NODE_TEST_FOLDER}"
        uploadTest
        echo ""
    else
        if [ ${ARG_S} = true ]; then
            uploadServer
            echo ""
        else
            echo "--- Parámetro detectado, NO se subirá la versión del servidor a nube"
            echo ""
        fi
        if [ ${ARG_R} = true ]; then
            restartServer
            echo ""
        else
            echo "--- Parámetro detectado, NO se reiniciará el servidor Node de nube"
            echo ""
        fi
    fi
fi

echo "Todo listo"
echo "Gracias por usar el script para subir backend-plantilla"
echo "Que tengas un buen día :)"
echo ""
exit 0
