export interface Step {
  id: number;
  title: string;
  explanation: string;
  technicalDetails: string;
  activeElements: string[];
  packetLocation?:
    | "start"
    | "app"
    | "os-stack"
    | "tun"
    | "vpn-client-read"
    | "vpn-client-encrypt"
    | "nic-out"
    | "tunnel"
    | "server-nic-in"
    | "server-vpn-process"
    | "server-tun"
    | "server-nat"
    | "target-internet"
    | "return-path";
  packetStatus?: "none" | "raw" | "encrypted";
}

export const demonstrationSteps: Step[] = [
  {
    id: 0,
    title: "Stan początkowy",
    explanation:
      "Symulacja szczegółowa. Widzimy wnętrze hosta: aplikację użytkownika, system operacyjny z interfejsem wirtualnym (TUN) oraz proces klienta VPN.",
    technicalDetails:
      "W systemie zainstalowany jest sterownik TAP/TUN. Interfejs TUN (tun0) działa w warstwie 3 (IP) i symuluje fizyczną kartę sieciową, ale zamiast wysyłać prąd do kabla, przekazuje dane do programu (OpenVPN).",
    activeElements: ["client-host", "server-host"],
    packetLocation: "start",
    packetStatus: "none",
  },
  {
    id: 1,
    title: "Generowanie pakietu (Aplikacja)",
    explanation:
      "Użytkownik wpisuje adres w przeglądarce. Aplikacja tworzy standardowe żądanie sieciowe.",
    technicalDetails:
      "Aplikacja (np. przeglądarka) używa wywołania systemowego socket() i sendto(). Tworzony jest pakiet z docelowym adresem IP (np. 142.250.x.x dla Google).",
    activeElements: ["client-app"],
    packetLocation: "app",
    packetStatus: "raw",
  },
  {
    id: 2,
    title: "Routing systemowy (Kernel)",
    explanation:
      "System operacyjny sprawdza tablicę routingu. Domyślna trasa (default gateway) została zmieniona przez VPN, aby kierować ruch na interfejs wirtualny.",
    technicalDetails:
      "Kernel sprawdza tablicę routingu (route print / ip route). Widzi, że ruch 0.0.0.0/0 lub specyficzna podsieć ma być kierowana do interfejsu 'tun0'.",
    activeElements: ["client-os", "client-tun"],
    packetLocation: "os-stack",
    packetStatus: "raw",
  },
  {
    id: 3,
    title: "Przekazanie do interfejsu TUN",
    explanation:
      "Pakiet trafia do wirtualnej karty sieciowej TUN. Dla systemu wygląda to jak wysłanie do sieci, ale 'kabel' jest podłączony do procesu VPN.",
    technicalDetails:
      "Interfejs TUN odbiera ramkę IP. Zamiast wysłać ją w eter, jądro systemu przekazuje dane do deskryptora pliku (/dev/net/tun), który jest otwarty przez proces OpenVPN.",
    activeElements: ["client-tun"],
    packetLocation: "tun",
    packetStatus: "raw",
  },
  {
    id: 4,
    title: "Odczyt przez Klienta VPN (User Space)",
    explanation:
      "Proces OpenVPN 'nasłuchuje' na interfejsie TUN. Odbiera niezaszyfrowany pakiet z jądra systemu.",
    technicalDetails:
      "Proces OpenVPN wykonuje operację read() na deskryptorze pliku TUN. Otrzymuje czysty pakiet IP jako payload.",
    activeElements: ["client-vpn-process"],
    packetLocation: "vpn-client-read",
    packetStatus: "raw",
  },
  {
    id: 5,
    title: "Enkrypcja i Enkapsulacja",
    explanation:
      "Kluczowy moment: OpenVPN szyfruje odebrany pakiet i pakuje go w nowy 'kopertę' (nowy pakiet).",
    technicalDetails:
      "OpenSSL szyfruje payload (AES-256-GCM). Zaszyfrowany blok staje się danymi nowego pakietu UDP. Dodawane są nagłówki OpenVPN oraz nowy nagłówek IP (źródło: IP fizyczne klienta, cel: IP serwera VPN).",
    activeElements: ["client-vpn-process"],
    packetLocation: "vpn-client-encrypt",
    packetStatus: "encrypted",
  },
  {
    id: 6,
    title: "Wysłanie do fizycznej karty (NIC)",
    explanation:
      "Zaszyfrowany pakiet jest wysyłany przez 'prawdziwą' kartę sieciową (WiFi/Ethernet) do Internetu.",
    technicalDetails:
      "Proces OpenVPN używa standardowego gniazda sieciowego (socket) do wysłania zaszyfrowanego pakietu UDP na adres publiczny serwera VPN. Pakiet przechodzi przez fizyczny interfejs (np. eth0/wlan0).",
    activeElements: ["client-os", "client-nic"],
    packetLocation: "nic-out",
    packetStatus: "encrypted",
  },
  {
    id: 7,
    title: "Tunel VPN (Internet)",
    explanation:
      "Pakiet podróżuje przez publiczny Internet. Dla obserwatorów (dostawca internetu, hakerzy) wygląda to jak bełkotliwy strumień danych UDP.",
    technicalDetails:
      "Dostawca ISP widzi tylko pakiety UDP płynące między Twoim IP a IP serwera VPN. Nie widzi co jest w środku (np. że to żądanie HTTP do Google).",
    activeElements: ["internet-tunnel"],
    packetLocation: "tunnel",
    packetStatus: "encrypted",
  },
  {
    id: 8,
    title: "Odbiór przez Serwer VPN",
    explanation:
      "Serwer VPN odbiera pakiet na swoim fizycznym interfejsie i przekazuje go do swojego procesu OpenVPN.",
    technicalDetails:
      "Pakiet dociera do portu 1194 UDP na serwerze. Proces serwera OpenVPN odbiera go z gniazda sieciowego.",
    activeElements: ["server-os", "server-nic"],
    packetLocation: "server-nic-in",
    packetStatus: "encrypted",
  },
  {
    id: 9,
    title: "Dekrypcja i Routing na Serwerze",
    explanation:
      "Serwer odszyfrowuje pakiet, odzyskując oryginalne żądanie. Następnie kieruje je do Internetu.",
    technicalDetails:
      "OpenVPN odszyfrowuje payload, uzyskując oryginalny pakiet IP. Zapisuje go do swojego interfejsu TUN. Jądro serwera odbiera pakiet, wykonuje SNAT (Source NAT - maskarada), zmieniając adres źródłowy na własne publiczne IP.",
    activeElements: ["server-vpn-process"],
    packetLocation: "server-vpn-process",
    packetStatus: "raw",
  },
  {
    id: 10,
    title: "Dotarcie do celu",
    explanation:
      "Oryginalne (odszyfrowane) żądanie dociera do serwera docelowego (np. strony www).",
    technicalDetails:
      "Serwer docelowy widzi połączenie przychodzące z adresu IP serwera VPN, a nie oryginalnego klienta.",
    activeElements: ["target-internet"],
    packetLocation: "target-internet",
    packetStatus: "raw",
  },
];
