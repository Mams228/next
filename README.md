# Telegram Mini App - Freelancer Job Platform

A comprehensive Telegram Mini App for connecting freelancers with clients, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Telegram Integration**: Full Telegram Web App API integration with bot authentication
- **Dual Role System**: Separate interfaces for clients and freelancers
- **Job Management**: Post, browse, and apply for jobs
- **Real-time Communication**: Integrated messaging system
- **Profile Management**: Comprehensive user profiles with skills and portfolio
- **Mobile-First Design**: Optimized for Telegram's mobile interface

## 🔧 Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Send `/setdomain` to set your app domain
6. Send `/setmenubutton` to configure the menu button

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Telegram Bot Configuration
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_APP_URL=https://your-app-domain.com

# Optional: Webhook configuration
VITE_WEBHOOK_URL=https://your-app-domain.com/api/webhook
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Deploy Your App

1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting platform (Netlify, Vercel, etc.)

3. Update the `VITE_APP_URL` in your `.env` file with your deployed URL

### 6. Configure Telegram Bot

1. Set the Web App URL in BotFather:
```
/setmenubutton
@your_bot_username
FreelanceHub
https://your-app-domain.com
```

2. Optionally set up webhooks for real-time updates

## 🔐 Security

- Web App data validation using HMAC-SHA256
- Secure token handling
- User authentication through Telegram

## 📱 Usage

1. Users start the bot in Telegram
2. Click the "FreelanceHub" menu button to open the Mini App
3. Choose role (Client or Freelancer)
4. Access role-specific features:
   - **Clients**: Post jobs, find freelancers, manage projects
   - **Freelancers**: Browse jobs, submit proposals, manage profile

## 🛠 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── dashboard/      # Dashboard components
│   ├── jobs/           # Job-related components
│   ├── navigation/     # Navigation components
│   └── profile/        # Profile components
├── config/             # Configuration files
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # API services
└── types/              # TypeScript type definitions
```

### Key Files

- `src/config/telegram.ts` - Telegram bot configuration
- `src/services/telegramBot.ts` - Telegram Bot API service
- `src/hooks/useTelegram.ts` - Telegram Web App hook
- `src/context/AuthContext.tsx` - Authentication context

## 🔗 Telegram Bot Commands

Set these commands in BotFather using `/setcommands`:

```
start - Start the FreelanceHub app
help - Get help and support
profile - View your profile
jobs - Browse available jobs
```

## 📋 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TELEGRAM_BOT_TOKEN` | Your Telegram bot token from BotFather | Yes |
| `VITE_TELEGRAM_BOT_USERNAME` | Your bot's username (without @) | Yes |
| `VITE_APP_URL` | Your deployed app URL | Yes |
| `VITE_WEBHOOK_URL` | Webhook URL for real-time updates | No |

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import your project for seamless deployment
- **GitHub Pages**: Use GitHub Actions for deployment
- **Firebase Hosting**: Deploy with Firebase CLI

## 📞 Support

For issues and questions:
1. Check the Telegram Web App documentation
2. Review the bot configuration in BotFather
3. Ensure all environment variables are correctly set
4. Verify your bot token is valid and active

## 📄 License

This project is licensed under the MIT License.