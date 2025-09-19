# Nep-gappa - Aplikacja Cateringowa

MVP aplikacji webowej do składania i obsługi zamówień cateringowych, stworzonej w Next.js 14 z TypeScript, Tailwind CSS i Prisma ORM.

## 🚀 Funkcjonalności

### Dla klientów:
- **5-etapowy proces składania zamówienia:**
  1. Wybór rodzaju wydarzenia (Agapa / Impreza okolicznościowa)
  2. Wybór dostępnego terminu z kalendarza
  3. Podanie szczegółów wydarzenia (adres, liczba osób, wspólnota, parafia)
  4. Wybór pozycji z menu z podsumowaniem kosztów
  5. Podanie danych kontaktowych
- **Strona zamówienia** z czatem na żywo i możliwością oceny po dostarczeniu
- **System ocen** z komentarzami i odpowiedziami admina
- **Responsywny design** działający na desktop i mobile

### Dla administratorów:
- **Panel administracyjny** z prostym uwierzytelnianiem
- **Zarządzanie zamówieniami** - zmiana statusów, odrzucanie z powodem
- **System wiadomości** - czat z klientami
- **Zarządzanie dostępnością** - ustawianie dostępnych terminów
- **Odpowiedzi na oceny** klientów
- **Automatyczne powiadomienia email** (mock - logi w konsoli)

## 🛠 Technologie

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (jasny motyw, kolor brand: #e65d2a)
- **Prisma ORM** + SQLite (dev) / PostgreSQL (production)
- **Zod** (walidacja danych)

## 📦 Instalacja

1. **Klonowanie repozytorium:**
```bash
git clone https://github.com/barwis3/Nep-gappa.git
cd Nep-gappa
```

2. **Instalacja dependencji:**
```bash
npm install
```

3. **Konfiguracja środowiska:**
```bash
cp .env.example .env
```

Edytuj plik `.env` według potrzeb:
```env
DATABASE_URL="file:./dev.db"
MIN_PEOPLE=10
ADMIN_PASSWORD="zmien-mnie"
MAIL_FROM="nep-gappa@example.com"
```

4. **Inicjalizacja bazy danych:**
```bash
npm run db:migrate
npm run db:seed
```

5. **Uruchomienie aplikacji:**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🗃 Baza danych

### SQLite (Development)
Domyślnie używa SQLite do developmentu. Baza danych zostanie utworzona automatycznie przy pierwszej migracji.

### PostgreSQL (Production)
Aby przełączyć na PostgreSQL, zmień `DATABASE_URL` w pliku `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nepgappa"
```

### Dostępne komendy:
```bash
npm run db:migrate    # Uruchom migracje
npm run db:seed      # Wypełnij bazę przykładowymi danymi
npm run db:studio    # Otwórz Prisma Studio (GUI dla bazy)
```

## 🏗 Struktura projektu

```
├── app/                    # Next.js App Router
│   ├── admin/             # Panel administracyjny
│   ├── api/               # API endpoints
│   ├── order/[id]/        # Strona szczegółów zamówienia
│   ├── layout.tsx         # Layout główny
│   └── page.tsx           # Strona główna
├── components/            # Komponenty React
│   ├── MenuSelector.tsx   # Wybór pozycji z menu
│   ├── CalendarPicker.tsx # Kalendarz dostępności
│   ├── OrderSummary.tsx   # Podsumowanie zamówienia
│   └── ChatBox.tsx        # Chat na żywo
├── lib/                   # Biblioteki pomocnicze
│   ├── prisma.ts         # Konfiguracja Prisma
│   ├── auth.ts           # Uwierzytelnianie admin
│   ├── email.ts          # System email (mock)
│   └── config.ts         # Konfiguracja aplikacji
├── prisma/               # Schema i seed bazy danych
└── public/               # Pliki statyczne
    └── logo.svg          # Logo (placeholder)
```

## 🎨 Logo

Aplikacja używa placeholder logo w formacie SVG. Możesz zastąpić plik `public/logo.svg` własnym logo lub użyć formatu PNG (`public/logo.png`).

## 🔐 Panel administracyjny

1. Przejdź do: http://localhost:3000/admin
2. Wprowadź hasło (domyślnie: `zmien-mnie`)
3. Zarządzaj zamówieniami i dostępnością

### Funkcje panelu:
- **Lista zamówień** z filtrami i statusami
- **Szczegóły zamówienia** z możliwością zmiany statusu
- **Chat z klientami** w czasie rzeczywistym
- **Zarządzanie dostępnością** - kalendarz z możliwością ustawiania dostępnych dni
- **Odpowiedzi na oceny** klientów

## 📧 System powiadomień

Aplikacja wysyła powiadomienia email w następujących przypadkach:
- Zaakceptowanie zamówienia
- Odrzucenie zamówienia (z powodem)
- Zamówienie w drodze
- Zamówienie dostarczone

**Uwaga:** W wersji demo wszystkie emaile są logowane do konsoli serwera.

## 🚦 Statusy zamówień

- **PENDING** - Oczekuje na potwierdzenie
- **ACCEPTED** - Zaakceptowane
- **REJECTED** - Odrzucone (z powodem)
- **IN_DELIVERY** - W drodze
- **DELIVERED** - Dostarczone

## ⚠️ Uwagi bezpieczeństwa

1. **Zmień hasło administratora** w pliku `.env`
2. **Użyj HTTPS** w środowisku produkcyjnym
3. **Skonfiguruj prawdziwy serwer email** zamiast mock
4. **Ustaw silne hasła bazy danych** w produkcji
5. **Regularnie aktualizuj dependencje**

## 🧪 Testowanie

Aplikacja zawiera mock data system, który pozwala na testowanie funkcjonalności bez konieczności działającej bazy danych. Wszystkie API endpoints automatycznie przełączają się na mock data w przypadku problemów z bazą danych.

### Test flow:
1. Złóż zamówienie przez główną stronę
2. Sprawdź szczegóły zamówienia na `/order/[id]`
3. Zaloguj się do panelu admin i zarządzaj zamówieniem
4. Przetestuj chat i system ocen

## 📚 API Endpoints

- `GET /api/menu` - Lista aktywnych pozycji menu
- `GET /api/availability` - Dostępne terminy
- `POST /api/orders` - Złożenie zamówienia
- `GET /api/orders/[id]` - Szczegóły zamówienia
- `PATCH /api/orders/[id]` - Aktualizacja statusu
- `POST /api/messages` - Wysyłanie wiadomości
- `POST /api/ratings` - Dodawanie/aktualizacja ocen

## 🤝 Rozwój

Aplikacja jest gotowa do rozbudowy o dodatkowe funkcjonalności:
- Integracja z prawdziwym systemem płatności
- Zaawansowane raportowanie
- Powiadomienia push
- Aplikacja mobilna
- Integracja z systemami księgowymi

## 📄 Licencja

MIT License - zobacz plik LICENSE dla szczegółów.