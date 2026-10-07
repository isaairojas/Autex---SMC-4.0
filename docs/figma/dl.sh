# uso: bash scripts_dl.sh destino url  (descarga y valida no vacío)
curl -sfL -o "$1" "$2" && [ -s "$1" ] && echo "ok $1 $(wc -c <"$1")" || echo "FAIL $1"
