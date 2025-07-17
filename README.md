# Ceku - Telegram House Management Bot

A Telegram bot designed to manage household expenses, payments, and donations for roommates. The bot helps track financial transactions, debt calculations, and provides various utilities for house management.

## Features

- **User Management**: Register new users, confirm accounts, and manage roommate status
- **Expense Tracking**: Add and view household expenses with categorization
- **Payment Management**: Record payments made to the house account
- **Donation System**: Track charitable contributions with leaderboard functionality
- **Debt Calculation**: Calculate individual debts and view overall debt status
- **Interactive Commands**: Conversational command system with validation
- **Media Responses**: GIF and video responses for better user experience

## Technical Stack

- **Runtime**: Node.js (>=18.0.0)
- **Package Manager**: PNPM (>=8.0.0)
- **Database**: SQLite with Sequelize ORM
- **Bot Framework**: node-telegram-bot-api
- **Template Engine**: Handlebars
- **Process Manager**: PM2

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ceku
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure the bot:
   - Update `configs.json` with your Telegram bot token
   - Set the door password and IBAN information

4. Start the bot:
```bash
# Development mode
pnpm run dev

# Production mode
pnpm run start
```

## Bot Commands

### User Management

#### `/eklebeni` - Register New User
Registers a new roommate in the system.
- **Input**: Name (letters only), Roommate status (1=Yes, 2=No, 3=Emre)
- **Access**: Public
- **Response**: Welcome GIF

#### `/dogrula` - Confirm User
Confirms user account with door password.
- **Input**: Door password
- **Access**: Public
- **Response**: Correct GIF

#### `/ahali` - List Users
Displays all registered users with their status.
- **Access**: Protected (confirmed users only)
- **Response**: Formatted user list

#### `/ben` - Get Identity
Shows the sender's registered name.
- **Access**: Public
- **Response**: Plain text or unrecognized video

### Financial Management

#### `/gider` - Add Expense
Records a new household expense.
- **Input**: Amount (integer), Label (≤20 chars), Description (≤200 chars)
- **Access**: Protected, Roommates only
- **Response**: Invoice confirmation

#### `/odeme` - Add Payment
Records a payment to the house account.
- **Input**: Amount (integer), Description (≤200 chars)
- **Access**: Protected
- **Response**: Receipt confirmation

#### `/bagis` - Add Donation
Records a charitable donation.
- **Input**: Amount (integer), Message (≤200 chars)
- **Access**: Protected
- **Response**: Receipt confirmation

### Information & Reports

#### `/borc` - Get Personal Debt
Shows the sender's current debt amount.
- **Access**: Protected
- **Response**: Debt amount

#### `/borclar` - Get All Debts
Lists all roommates' debts.
- **Access**: Protected
- **Response**: Formatted debt list

#### `/odemelerim` - My Payments
Shows sender's last 15 payments.
- **Access**: Protected
- **Response**: Formatted payment history

#### `/bagislarim` - My Donations
Shows sender's last 15 donations with total amount.
- **Access**: Protected
- **Response**: Formatted donation history

#### `/tab` - Donation Leaderboard
Shows top 3 donors and their contribution amounts.
- **Access**: Protected
- **Response**: Formatted leaderboard

#### `/giderler` - Recent Expenses
Lists the last 15 household expenses.
- **Access**: Protected
- **Response**: Formatted expense list

#### `/odemeler` - Recent Payments
Lists the last 20 payments made to the house account.
- **Access**: Protected
- **Response**: Formatted payment list

#### `/iban` - Get IBAN
Displays the house account's IBAN number.
- **Access**: Protected
- **Response**: IBAN string

## Database Schema

### Users Table
- `id` (Primary): Telegram user ID
- `name`: User's display name
- `isRoommate`: Boolean indicating if user shares expenses
- `confirmed`: Boolean indicating if user is verified
- `active`: Boolean for soft deletion

### Expenses Table
- `id` (Primary): Auto-increment ID
- `amount`: Expense amount
- `label`: Category/label for the expense
- `desc`: Additional description
- `addedBy`: User who added the expense
- `createdAt`: Timestamp

### Payments Table
- `id` (Primary): Auto-increment ID
- `amount`: Payment amount
- `desc`: Payment description
- `user`: Foreign key to Users table
- `createdAt`: Timestamp

### Donations Table
- `id` (Primary): Auto-increment ID
- `amount`: Donation amount
- `desc`: Donation message
- `user`: Foreign key to Users table
- `createdAt`: Timestamp

## Project Structure

```
├── configs.json           # Bot configuration
├── ecosystem.config.js    # PM2 configuration
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
├── data/                 # SQLite database
├── logs/                 # Application logs
├── public/               # Static assets (GIFs, images, videos)
├── src/                  # Source code
│   ├── Bot.js           # Telegram bot instance
│   ├── Commands.js      # Command definitions
│   ├── Database.js      # Database connection
│   ├── History.js       # Conversation state management
│   ├── Response.js      # Response formatting
│   ├── Service.js       # Business logic
│   └── Schemas.js       # Database schemas
├── templates/           # Handlebars templates
└── utils/              # Utility functions
```

## Development

### Linting
```bash
pnpm run lint
```

### Database
The bot uses SQLite for data persistence. The database file is located at `data/Home.sqlite` and is automatically created on first run.

### Command System
Commands are defined in `src/Commands.js` with the following structure:
- `def`: Command definition
- `desc`: Command description
- `regex`: Pattern matching for command recognition
- `cont`: Whether the command requires conversation flow
- `props`: Input properties for conversational commands
- `protect`: Whether the command requires user confirmation
- `action`: Async function to execute the command

### Response System
The bot supports multiple response types:
- Plain text responses
- GIF responses (welcome, correct)
- Video responses (unrecognized)
- Formatted lists using Handlebars templates

## Security Features

- **User Confirmation**: Commands are protected and require password confirmation
- **Roommate Verification**: Financial operations restricted to confirmed roommates
- **Input Validation**: All user inputs are validated before processing
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `pnpm run lint`
5. Submit a pull request

## License

ISC License - see package.json for details

## Author

nazmirket
