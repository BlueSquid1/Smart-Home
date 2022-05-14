#pragma once

#include <WString.h>
#include <WiFi101.h>

class Pir
{
private:
    struct HttpResponse 
    {
        bool wasSuccessful;
        String message;
    };

public:
    ~Pir();
    bool Init(const String& ssid, const String& password, const String& outgoingClientUrl, int pirPowerPin, int pirReadingPin, int ledPin);

    bool HandleServer();

    void SendStatusChange(const String& newStatus);

private:
    bool InitHardware();

    bool ConnectWifi(const String& ssid, const String& password);

    void RestartPir();

    void PrintWifiStatus();

    String ReadHttpRequest(WiFiClient client);

    int FindCharInString(const String& text);

    HttpResponse ProcessIncomingRequest(const String& requestArg);

    // PIR power pin
    int pirPowerPin;
    // PIR status pin
    int pirReadingPin;
    // LED status pin number
    int ledPin;

    String outgoingClientUrl;

    WiFiServer * incomingServer = nullptr;
    WiFiClient * outgoingClient = nullptr;

    bool restartScheduled = false;
};