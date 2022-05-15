#include "wifi_secrets.h" // Defines SECRET_SSID and SECRET_PASS
#include "pir.hh"

namespace 
{
    const int PIR_POWER_PIN = 0;
    const int PIR_READING_PIN = 7;
    const int LED_PIN =  LED_BUILTIN;

    const char SSID[] = SECRET_SSID;
    const char PASS[] = SECRET_PASS;

    const char OUTGOING_CLIENT_URL[] = "192.168.20.6";
};

Pir pir;

void exit() 
{
    Serial.print("Program has failed. Stopping execution.");
    while(true);
}

void setup() 
{
    if(!pir.Init(SSID, PASS, OUTGOING_CLIENT_URL, PIR_POWER_PIN, PIR_READING_PIN, LED_PIN))
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
