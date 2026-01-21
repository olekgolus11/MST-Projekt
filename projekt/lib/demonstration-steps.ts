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
    | "control-tunnel"
    | "data-tunnel"
    | "server-nic-in"
    | "server-vpn-process"
    | "server-tun"
    | "server-nat"
    | "target-internet"
    | "return-path";
  packetFrom?: Step["packetLocation"];
  packetTo?: Step["packetLocation"];
  packetPath?: Step["packetLocation"][];
  packetStatus?: "none" | "raw" | "encrypted";
  packetLabel?: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

export const demonstrationPhases: Phase[] = [
  {
    id: "initiation",
    title: "1. Inicjacja połączenia",
    description:
      "Klient nawiązuje kontakt z serwerem VPN (zwykle UDP/1194) i inicjuje kanał kontrolny OpenVPN.",
    steps: [
      {
        id: 0,
        title: "Stan początkowy",
        explanation:
          "Symulacja szczegółowa. Widzimy wnętrze hosta: aplikację użytkownika, system operacyjny z interfejsem wirtualnym (TUN) oraz proces klienta VPN.",
        technicalDetails:
          "W systemie zainstalowany jest sterownik TAP/TUN. Interfejs TUN (tun0) działa w warstwie 3 (IP) i symuluje fizyczną kartę sieciową, ale zamiast wysyłać prąd do kabla, przekazuje dane do programu (OpenVPN).",
        activeElements: ["client-host", "server-host"],
        packetLocation: "start",
        packetFrom: "start",
        packetTo: "start",
        packetStatus: "none",
      },
      {
        id: 1,
        title: "P_CONTROL_HARD_RESET_CLIENT_V2",
        explanation:
          "Klient wysyła pierwszy pakiet kontrolny, aby zainicjować sesję OpenVPN.",
        technicalDetails:
          "Pakiet kontrolny OpenVPN (P_CONTROL_HARD_RESET_CLIENT_V2) jest wysyłany UDP/1194 do serwera. Zawiera losowy Session ID i żądanie rozpoczęcia handshake.",
        activeElements: ["client-vpn-process", "client-nic", "control-tunnel"],
        packetLocation: "nic-out",
        packetFrom: "vpn-client-encrypt",
        packetTo: "nic-out",
        packetPath: ["vpn-client-encrypt", "nic-out"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_CLIENT",
      },
      {
        id: 2,
        title: "Kanał kontrolny (Internet)",
        explanation:
          "Pakiet inicjujący płynie kanałem kontrolnym przez Internet.",
        technicalDetails:
          "To nadal UDP/1194, ale logicznie jest to kanał kontrolny (TLS control).",
        activeElements: ["control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "nic-out",
        packetTo: "control-tunnel",
        packetPath: ["nic-out", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "UDP/1194",
      },
      {
        id: 3,
        title: "P_CONTROL_HARD_RESET_SERVER_V2",
        explanation:
          "Serwer odpowiada pakietem resetu i akceptuje rozpoczęcie sesji kontrolnej.",
        technicalDetails:
          "Serwer wysyła P_CONTROL_HARD_RESET_SERVER_V2, potwierdzając gotowość do handshake TLS na kanale kontrolnym.",
        activeElements: ["server-vpn-process", "server-nic", "control-tunnel"],
        packetLocation: "server-nic-in",
        packetFrom: "control-tunnel",
        packetTo: "server-nic-in",
        packetPath: ["control-tunnel", "server-nic-in"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
      {
        id: 4,
        title: "Odpowiedź wraca do klienta",
        explanation:
          "Pakiet odpowiedzi serwera wraca kanałem kontrolnym do klienta.",
        technicalDetails:
          "Kanał kontrolny jest wykorzystywany do wymiany komunikatów sterujących TLS/OpenVPN.",
        activeElements: ["control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "server-nic-in",
        packetTo: "control-tunnel",
        packetPath: [
          "server-nic-in",
          "server-vpn-process",
          "control-tunnel",
        ],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
      {
        id: 5,
        title: "Klient odbiera odpowiedź",
        explanation:
          "Klient otrzymuje potwierdzenie od serwera i przygotowuje się do handshake TLS.",
        technicalDetails:
          "Po odebraniu HARD_RESET_SERVER klient przechodzi do negocjacji TLS.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-read",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: ["control-tunnel", "vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
    ],
  },
  {
    id: "authentication",
    title: "2. Uwierzytelnienie",
    description:
      "Serwer weryfikuje tożsamość klienta (certyfikaty, tokeny lub login/hasło).",
    steps: [
      {
        id: 0,
        title: "Klient wysyła certyfikat",
        explanation:
          "Klient przesyła swój certyfikat w kanale kontrolnym.",
        technicalDetails:
          "W TLS wysyłany jest łańcuch certyfikatów klienta (Client Certificate).",
        activeElements: ["client-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "vpn-client-encrypt",
        packetTo: "control-tunnel",
        packetPath: ["vpn-client-encrypt", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "CERTIFICATE",
      },
      {
        id: 1,
        title: "Serwer weryfikuje certyfikat",
        explanation:
          "Serwer sprawdza ważność certyfikatu klienta i zaufany CA.",
        technicalDetails:
          "Weryfikacja obejmuje podpis CA, ważność, CRL/OCSP oraz zgodność CN/OU z polityką serwera.",
        activeElements: ["server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "control-tunnel",
        packetTo: "server-vpn-process",
        packetPath: ["control-tunnel", "server-vpn-process"],
        packetStatus: "raw",
        packetLabel: "VERIFY",
      },
      {
        id: 2,
        title: "AUTH_REQUEST (opcjonalne)",
        explanation:
          "Jeśli włączono auth-user-pass lub MFA, serwer żąda dodatkowych poświadczeń.",
        technicalDetails:
          "Komunikat AUTH_REQUEST inicjuje dodatkowy etap uwierzytelnienia (login/hasło, OTP). Klient odpowiada AUTH_REPLY.",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "server-vpn-process",
        packetTo: "control-tunnel",
        packetPath: ["server-vpn-process", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "AUTH_REQUEST",
      },
      {
        id: 3,
        title: "AUTH_REPLY",
        explanation:
          "Klient odsyła dodatkowe poświadczenia.",
        technicalDetails:
          "W zależności od konfiguracji może to być login/hasło lub token OTP.",
        activeElements: ["client-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "control-tunnel",
        packetTo: "control-tunnel",
        packetPath: [
          "control-tunnel",
          "vpn-client-read",
          "vpn-client-encrypt",
          "control-tunnel",
        ],
        packetStatus: "raw",
        packetLabel: "AUTH_REPLY",
      },
      {
        id: 4,
        title: "AUTH_SUCCESS",
        explanation:
          "Serwer potwierdza poprawną autoryzację klienta.",
        technicalDetails:
          "Serwer zapisuje sesję jako uwierzytelnioną i przechodzi do negocjacji parametrów kanału danych.",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "vpn-client-read",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: [
          "control-tunnel",
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-read",
        ],
        packetStatus: "raw",
        packetLabel: "AUTH_SUCCESS",
      },
    ],
  },
  {
    id: "tls-handshake",
    title: "3. SSL/TLS Handshake",
    description:
      "Strony negocjują szyfry i generują klucze sesyjne (PFS).",
    steps: [
      {
        id: 0,
        title: "TLS ClientHello",
        explanation:
          "Klient proponuje wersje TLS i listę szyfrów.",
        technicalDetails:
          "ClientHello zawiera listę obsługiwanych cipher suites, rozszerzenia (SNI/ALPN), losowe nonces.",
        activeElements: ["client-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "vpn-client-encrypt",
        packetTo: "control-tunnel",
        packetPath: ["vpn-client-encrypt", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "TLS ClientHello",
      },
      {
        id: 1,
        title: "TLS ServerHello + Certificate",
        explanation:
          "Serwer wybiera szyfr i przedstawia certyfikat.",
        technicalDetails:
          "ServerHello potwierdza wersję TLS i wybrany szyfr (np. TLS_AES_256_GCM_SHA384). Następuje przesłanie certyfikatu serwera.",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "vpn-client-read",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: [
          "control-tunnel",
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-read",
        ],
        packetStatus: "raw",
        packetLabel: "TLS ServerHello",
      },
      {
        id: 2,
        title: "ClientKeyExchange + Finished",
        explanation:
          "Klient tworzy klucze sesyjne i kończy handshake.",
        technicalDetails:
          "Wymiana kluczy (ECDHE) zapewnia Perfect Forward Secrecy. Po tym komunikaty TLS są już szyfrowane.",
        activeElements: ["client-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "vpn-client-read",
        packetTo: "control-tunnel",
        packetPath: ["vpn-client-read", "control-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "TLS Finished",
      },
      {
        id: 3,
        title: "Server Finished",
        explanation:
          "Serwer potwierdza zakończenie handshake.",
        technicalDetails:
          "Od tej chwili kanał kontrolny jest w pełni szyfrowany i gotowy do wymiany komend.",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "vpn-client-read",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: [
          "control-tunnel",
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-read",
        ],
        packetStatus: "encrypted",
        packetLabel: "TLS Finished",
      },
    ],
  },
  {
    id: "tunnel-creation",
    title: "4. Zestawienie tunelu",
    description:
      "Serwer przypisuje adres, trasy i parametry kanału danych. Tworzony jest interfejs TUN/TAP.",
    steps: [
      {
        id: 0,
        title: "PUSH_REQUEST",
        explanation:
          "Klient prosi o konfigurację tunelu (IP, trasy, DNS).",
        technicalDetails:
          "PUSH_REQUEST jest wysyłany w kanale kontrolnym po zakończonym TLS. Klient oczekuje konfiguracji sesji.",
        activeElements: ["client-vpn-process", "control-tunnel"],
        packetLocation: "control-tunnel",
        packetFrom: "vpn-client-encrypt",
        packetTo: "control-tunnel",
        packetPath: ["vpn-client-encrypt", "control-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "PUSH_REQUEST",
      },
      {
        id: 1,
        title: "PUSH_REPLY (ifconfig, route, DNS)",
        explanation:
          "Serwer zwraca parametry: IP tunelu, trasy oraz DNS.",
        technicalDetails:
          "W PUSH_REPLY znajdują się m.in. ifconfig 10.8.0.2/24, route 0.0.0.0/0 oraz DNS. Klient zapisuje je lokalnie.",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "vpn-client-read",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: [
          "control-tunnel",
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-read",
        ],
        packetStatus: "encrypted",
        packetLabel: "PUSH_REPLY",
      },
      {
        id: 2,
        title: "Konfiguracja TUN i routingu",
        explanation:
          "Klient konfiguruje interfejs TUN i aktualizuje tablice routingu.",
        technicalDetails:
          "System ustawia adres IP tunelu, dodaje trasy oraz (opcjonalnie) modyfikuje DNS. Ruch domyślny trafia do tunelu.",
        activeElements: ["client-os", "client-tun", "routing"],
        packetLocation: "tun",
        packetFrom: "tun",
        packetTo: "tun",
        packetPath: ["tun"],
        packetStatus: "none",
      },
      {
        id: 3,
        title: "Initialization Sequence Completed",
        explanation:
          "Tunel jest aktywny i gotowy do przesyłania danych.",
        technicalDetails:
          "OpenVPN kończy inicjalizację kanału danych. Od tej chwili każdy pakiet będzie szyfrowany i przenoszony tunelem.",
        activeElements: ["client-vpn-process", "server-vpn-process", "data-tunnel"],
        packetLocation: "data-tunnel",
        packetFrom: "vpn-client-read",
        packetTo: "data-tunnel",
        packetPath: ["vpn-client-read", "vpn-client-encrypt", "data-tunnel"],
        packetStatus: "none",
        packetLabel: "READY",
      },
    ],
  },
  {
    id: "data-transmission",
    title: "5. Transmisja danych",
    description:
      "Pakiety aplikacji są szyfrowane, enkapsulowane i przesyłane przez tunel VPN.",
    steps: [
      {
        id: 0,
        title: "Generowanie pakietu (Aplikacja)",
        explanation:
          "Użytkownik wysyła żądanie, a aplikacja tworzy pakiet IP.",
        technicalDetails:
          "Aplikacja (np. przeglądarka) używa socket() i sendto(). Tworzony jest pakiet z docelowym adresem IP (np. 142.250.x.x).",
        activeElements: ["client-app"],
        packetLocation: "app",
        packetFrom: "app",
        packetTo: "app",
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 1,
        title: "Routing systemowy (Kernel)",
        explanation:
          "Kernel kieruje ruch na interfejs TUN zgodnie z trasą domyślną.",
        technicalDetails:
          "Tablica routingu (ip route/route print) wskazuje tun0 jako default gateway dla ruchu 0.0.0.0/0.",
        activeElements: ["client-os", "client-tun", "routing"],
        packetLocation: "tun",
        packetFrom: "app",
        packetTo: "tun",
        packetPath: ["app", "os-stack", "tun"],
        packetStatus: "raw",
        packetLabel: "ROUTE",
      },
      {
        id: 2,
        title: "Odczyt z TUN",
        explanation:
          "Proces OpenVPN odbiera niezaszyfrowany pakiet z interfejsu wirtualnego.",
        technicalDetails:
          "OpenVPN wykonuje read() na /dev/net/tun i uzyskuje oryginalny pakiet IP jako payload.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-read",
        packetFrom: "tun",
        packetTo: "vpn-client-read",
        packetPath: ["tun", "vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "PAYLOAD",
      },
      {
        id: 3,
        title: "Szyfrowanie + AEAD/HMAC",
        explanation:
          "Pakiet jest szyfrowany i podpisywany, a następnie enkapsulowany w UDP.",
        technicalDetails:
          "Kanał danych używa AES-256-GCM (AEAD) lub AES-CBC + HMAC. Dodawany jest Packet ID i ochrona przed replay.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-encrypt",
        packetFrom: "vpn-client-read",
        packetTo: "vpn-client-encrypt",
        packetPath: ["vpn-client-read", "vpn-client-encrypt"],
        packetStatus: "encrypted",
        packetLabel: "DATA (AES-GCM)",
      },
      {
        id: 4,
        title: "Wysłanie do Internetu",
        explanation:
          "Zaszyfrowany pakiet opuszcza hosta przez fizyczny interfejs.",
        technicalDetails:
          "OpenVPN wysyła UDP/1194 do publicznego IP serwera. Pakiet przechodzi przez NIC (eth0/wlan0).",
        activeElements: ["client-os", "client-nic"],
        packetLocation: "nic-out",
        packetFrom: "vpn-client-encrypt",
        packetTo: "nic-out",
        packetPath: ["vpn-client-encrypt", "nic-out"],
        packetStatus: "encrypted",
        packetLabel: "UDP/1194",
      },
      {
        id: 5,
        title: "Tunel VPN (Internet)",
        explanation:
          "Pakiet podróżuje przez publiczny Internet jako zaszyfrowany strumień UDP.",
        technicalDetails:
          "ISP widzi tylko pakiety UDP między IP klienta i serwera. Treść jest nieczytelna.",
        activeElements: ["data-tunnel"],
        packetLocation: "data-tunnel",
        packetFrom: "nic-out",
        packetTo: "data-tunnel",
        packetPath: ["nic-out", "data-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "ENCRYPTED",
      },
      {
        id: 6,
        title: "Odbiór na serwerze VPN",
        explanation:
          "Serwer odbiera pakiet i weryfikuje integralność.",
        technicalDetails:
          "Sprawdzany jest HMAC/AEAD oraz Packet ID (ochrona przed replay). Niepoprawne pakiety są odrzucane.",
        activeElements: ["server-os", "server-nic"],
        packetLocation: "server-nic-in",
        packetFrom: "data-tunnel",
        packetTo: "server-nic-in",
        packetPath: ["data-tunnel", "server-nic-in"],
        packetStatus: "encrypted",
        packetLabel: "VERIFY",
      },
      {
        id: 7,
        title: "Dekapsulacja i zapis do TUN",
        explanation:
          "Serwer odszyfrowuje pakiet i kieruje go do interfejsu TUN.",
        technicalDetails:
          "OpenVPN odszyfrowuje payload i zapisuje pakiet IP do tun0. Kernel odbiera go jak normalny ruch.",
        activeElements: ["server-vpn-process", "server-tun"],
        packetLocation: "server-vpn-process",
        packetFrom: "server-nic-in",
        packetTo: "server-vpn-process",
        packetPath: ["server-nic-in", "server-vpn-process"],
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 8,
        title: "NAT i wyjście do Internetu",
        explanation:
          "Serwer wykonuje maskaradę i wysyła ruch do Internetu.",
        technicalDetails:
          "SNAT zmienia adres źródłowy na publiczny IP serwera VPN. Pakiet wychodzi do sieci docelowej.",
        activeElements: ["server-os", "server-nat"],
        packetLocation: "server-nat",
        packetFrom: "server-vpn-process",
        packetTo: "server-nat",
        packetPath: ["server-vpn-process", "server-nat"],
        packetStatus: "raw",
        packetLabel: "SNAT",
      },
      {
        id: 9,
        title: "Dotarcie do celu",
        explanation:
          "Pakiet dociera do serwera docelowego (np. strony WWW).",
        technicalDetails:
          "Serwer docelowy widzi połączenie z publicznego IP serwera VPN, a nie z IP klienta.",
        activeElements: ["target-internet"],
        packetLocation: "target-internet",
        packetFrom: "server-nat",
        packetTo: "target-internet",
        packetPath: ["server-nat", "target-internet"],
        packetStatus: "raw",
        packetLabel: "HTTP(S)",
      },
      {
        id: 10,
        title: "Odpowiedź wraca do serwera VPN",
        explanation:
          "Serwer docelowy odsyła odpowiedź do publicznego IP serwera VPN.",
        technicalDetails:
          "Odpowiedź trafia na interfejs fizyczny serwera VPN i jest przekazywana do OpenVPN.",
        activeElements: ["server-os", "server-nic"],
        packetLocation: "server-nic-in",
        packetFrom: "target-internet",
        packetTo: "server-nic-in",
        packetPath: ["target-internet", "server-nic-in"],
        packetStatus: "raw",
        packetLabel: "RESPONSE",
      },
      {
        id: 11,
        title: "Szyfrowanie odpowiedzi",
        explanation:
          "Serwer szyfruje odpowiedź i enkapsuluje ją w UDP.",
        technicalDetails:
          "OpenVPN tworzy pakiet DATA z AES-GCM/HMAC i przygotowuje go do wysłania do klienta.",
        activeElements: ["server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "server-nic-in",
        packetTo: "server-vpn-process",
        packetPath: ["server-nic-in", "server-vpn-process"],
        packetStatus: "encrypted",
        packetLabel: "DATA (AES-GCM)",
      },
      {
        id: 12,
        title: "Powrót tunelem",
        explanation:
          "Zaszyfrowany pakiet wraca do klienta przez Internet.",
        technicalDetails:
          "Pakiet UDP/1194 wraca tą samą ścieżką sieciową do klienta.",
        activeElements: ["data-tunnel"],
        packetLocation: "data-tunnel",
        packetFrom: "server-vpn-process",
        packetTo: "data-tunnel",
        packetPath: ["server-vpn-process", "data-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "ENCRYPTED",
      },
      {
        id: 13,
        title: "Odszyfrowanie u klienta",
        explanation:
          "Zaszyfrowana odpowiedź dociera do procesu OpenVPN klienta.",
        technicalDetails:
          "Pakiet DATA trafia do procesu OpenVPN w przestrzeni użytkownika. W tym momencie jest jeszcze zaszyfrowany.",
        activeElements: ["client-vpn-process", "client-tun"],
        packetLocation: "vpn-client-read",
        packetFrom: "data-tunnel",
        packetTo: "vpn-client-read",
        packetPath: ["data-tunnel", "vpn-client-read"],
        packetStatus: "encrypted",
        packetLabel: "DATA (ENCRYPTED)",
      },
      {
        id: 14,
        title: "Odszyfrowanie i zapis do TUN",
        explanation:
          "OpenVPN weryfikuje integralność i odszyfrowuje odpowiedź, zapisując ją do tun0.",
        technicalDetails:
          "Sprawdzany jest Packet ID/HMAC/AEAD, a następnie payload jest odszyfrowany i zapisany do interfejsu TUN.",
        activeElements: ["client-vpn-process", "client-tun"],
        packetLocation: "tun",
        packetFrom: "vpn-client-read",
        packetTo: "tun",
        packetPath: ["vpn-client-read", "tun"],
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 15,
        title: "Pakiet trafia do aplikacji",
        explanation:
          "Kernel przekazuje odpowiedź do aplikacji użytkownika.",
        technicalDetails:
          "System odczytuje pakiet z tun0 i przekazuje go do gniazda aplikacji (np. przeglądarki).",
        activeElements: ["client-app"],
        packetLocation: "app",
        packetFrom: "tun",
        packetTo: "app",
        packetPath: ["tun", "app"],
        packetStatus: "raw",
        packetLabel: "RESPONSE",
      },
    ],
  },
];
