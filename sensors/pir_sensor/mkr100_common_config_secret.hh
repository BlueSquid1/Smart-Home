#pragma once

#include <WString.h>

#define SECRET_SSID "too fly for a wifi"
#define SECRET_PASS "clinton is awesome and rich"
#define PIR_POWER_PIN 0
#define PIR_READING_PIN 7
#define LED_PIN LED_BUILTIN
#define OUTGOING_CLIENT_URL "192.168.20.200"

struct PirUniqueConfig
{
    String uniqueName;
    String uniqueIpAddress;
};

#define PIR_SENSOR_1 0
#define PIR_SENSOR_2 1
#define PIR_SENSOR_3 2
#define PIR_SENSOR_4 3
#define PIR_SENSOR_5 4
const PirUniqueConfig PIR_UNIQUE_CONFIG[] = 
{
    {"pir_sensor_1", "192.168.20.201"},
    {"pir_sensor_2", "192.168.20.202"},
    {"pir_sensor_3", "192.168.20.203"},
    {"pir_sensor_4", "192.168.20.204"},
    {"pir_sensor_5", "192.168.20.205"}
};