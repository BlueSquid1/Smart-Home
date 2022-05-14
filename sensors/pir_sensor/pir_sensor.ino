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

void HandlePirChange() 
{
    if(digitalRead(PIR_READING_PIN) == HIGH)
    {
        pir.SendStatusChange("triggered");
    }
    else
    {
        pir.SendStatusChange("untriggered");
    }
}

void setup() 
{
    if(!pir.Init(SSID, PASS, OUTGOING_CLIENT_URL, PIR_POWER_PIN, PIR_READING_PIN, LED_PIN))
    {
        exit();
    }

    attachInterrupt(digitalPinToInterrupt(PIR_READING_PIN), HandlePirChange, CHANGE);

    Serial.println("Setup complete");
}

void loop() 
{
    pir.HandleServer();

    //sleep for 20ms
    delay(20);
}
