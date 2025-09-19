# 🍜 Nep-gappa - System Zamówień Jedzenia

Nowoczesny system zamówień jedzenia zbudowany w Next.js 14 z TypeScript, Tailwind CSS i Prisma.

## 🚀 Funkcjonalności

### Dla użytkowników:
- 📋 Formularz zamówienia z validacją (rodzaj wydarzenia, kalendarz, godzina, adres, liczba osób)
- 🏠 Wybór wspólnoty i parafii
- 🍽️ Responsywne menu z możliwością dodawania do koszyka
- 📧 Automatyczne powiadomienia email
- 📱 Pełna responsywność na wszystkich urządzeniach
- 📊 Śledzenie statusu zamówienia
- 💬 Czat z obsługą
- ⭐ Ocena po dostarczeniu

### Dla administratorów:
- 🔐 Panel administratora chroniony hasłem
- 📝 Zarządzanie zamówieniami i zmiana statusów
- 📋 Pełny podgląd danych kontaktowych
- 💬 System czatu z klientami
- 📊 Zarządzanie dostępnością
- ✉️ Automatyczne powiadomienia

## 🛠️ Technologie

- **Next.js 14** z App Router
- **TypeScript** - bezpieczny kod
- **Tailwind CSS** - stylowanie
- **Prisma** z SQLite - baza danych
- **React** - komponenty UI

## 📁 Struktura projektu

```
Nep-gappa/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Panel administratora
│   │   ├── api/               # API Routes
│   │   ├── order/[id]/        # Szczegóły zamówienia
│   │   └── page.tsx           # Strona główna
│   ├── components/            # Komponenty React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Menu.tsx
│   │   ├── OrderForm.tsx
│   │   └── OrderDetail.tsx
│   └── lib/                   # Biblioteki
│       ├── db.ts              # Połączenie z bazą danych
│       └── email.ts           # System powiadomień
├── prisma/
│   ├── schema.prisma          # Model bazy danych
│   └── seed.ts                # Dane testowe
├── public/                    # Pliki statyczne
└── data/                      # Pliki JSON (utworzone automatycznie)
```

## 🛠️ Instalacja i uruchomienie

### Wymagania:
- Node.js 18+ 
- npm lub yarn

### Kroki instalacji:

```bash
# Sklonuj repozytorium
git clone https://github.com/barwis3/Nep-gappa.git
cd Nep-gappa

# Zainstaluj zależności
npm install

# Skonfiguruj środowisko
cp .env.example .env.local

# Zainicjuj bazę danych (opcjonalne - używa JSON files jako fallback)
npm run db:push

# Załaduj dane testowe
npm run db:seed

# Uruchom serwer deweloperski
npm run dev
```

### Dostęp do aplikacji:

Otwórz przeglądarkę i przejdź do: `http://localhost:3000`

### Konto administratora:
- **Hasło:** `admin123` (można zmienić w `.env.local`)
- **Panel:** `http://localhost:3000/admin`

## ⚙️ Konfiguracja

Utwórz plik `.env.local` na podstawie `.env.example`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin Authentication
ADMIN_PASSWORD="admin123"

# App Configuration  
MAX_PEOPLE_COUNT="50"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔧 API Endpoints

### Menu:
- `GET /api/menu` - Pobranie menu
- `POST /api/menu` - Dodanie pozycji (admin)

### Zamówienia:
- `GET /api/orders` - Lista zamówień
- `POST /api/orders` - Nowe zamówienie
- `PATCH /api/orders/[id]/status` - Zmiana statusu (admin)

### Czat:
- `GET /api/orders/[id]/messages` - Wiadomości
- `POST /api/orders/[id]/messages` - Nowa wiadomość

### Oceny:
- `POST /api/orders/[id]/rating` - Dodaj ocenę

### Admin:
- `POST /api/admin/login` - Logowanie

## 📱 Interfejs użytkownika

- **Responsywny design** - dostosowany do wszystkich urządzeń
- **Brand colors** - używa koloru #e65d2a jako głównego
- **Polski język** - pełne tłumaczenie interfejsu
- **Jasny motyw** - czytelny i nowoczesny

## 🔒 Bezpieczeństwo

- Walidacja danych po stronie serwera i klienta
- Zabezpieczone sesje administratora
- Ograniczenia liczby osób (konfigurowane)
- Sanityzacja danych wejściowych

## 📞 Wsparcie

W przypadku problemów lub pytań:
- **Telefon:** +48 123 456 789
- **Email:** kontakt@nep-gappa.pl
- **Adres:** ul. Przykładowa 123, 00-000 Warszawa

## 🚀 Rozwój

### Dostępne skrypty:
```bash
npm run dev       # Serwer deweloperski
npm run build     # Budowanie produkcyjne
npm run start     # Start serwera produkcyjnego
npm run lint      # Linting kodu
npm run db:push   # Aktualizacja bazy danych
npm run db:seed   # Ładowanie danych testowych
```

### Możliwe rozszerzenia:
- Płatności online
- Powiadomienia SMS
- Integracja z mapami
- Aplikacja mobilna
- Zaawansowane raportowanie

## 📄 Licencja

Projekt dostępny na licencji ISC.