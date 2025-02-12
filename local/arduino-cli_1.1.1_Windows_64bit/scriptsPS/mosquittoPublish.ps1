param(
    $t,
    $ip='192.168.137.1',
    $m = "off"
)


& mosquitto_pub -h $ip -t esp32/$t/output -m "$m"