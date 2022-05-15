#include "mkr100_common_config_secret.hh"
#include "pir.hh"

namespace
{
    const int UNIQUE_PIR_NUM = PIR_SENSOR_1;
}

Pir pir;

void exit() 
{
    Serial.print("Program has failed. Stopping execution.");
    while(true);
}

void setup() 
{
    PirUniqueConfig unique_config = PIR_UNIQUE_CONFIG[UNIQUE_PIR_NUM];
    if(!pir.Init(unique_config.uniqueName, unique_config.uniqueIpAddress, SECRET_SSID, SECRET_PASS, OUTGOING_CLIENT_URL, PIR_POWER_PIN, PIR_READING_PIN, LED_PIN))
    {
        exit();
    }

    Serial.println("Setup complete");
}

void loop() 
{
    bool processResult = pir.Process();
    if(processResult == false)
    {
        Serial.println("PIR processing failed.");
    }

    //sleep for 20ms
    delay(20);
}
