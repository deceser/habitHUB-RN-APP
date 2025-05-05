# HabitHUB - Habit Tracking Application

HabitHUB is a mobile application for tracking habits and tasks, developed with React Native using Expo. The application allows you to create, track, and manage your daily habits.

## Key Features

- **User Authentication**: registration, login, and password recovery
- **Task Management**: create, view, edit, and delete tasks
- **Habit Tracking**: mark tasks as completed
- **Filtering and Categorization**: organize tasks by tags and dates
- **Recurring Tasks**: set up daily, weekly, and monthly tasks
- **Personalization**: choose colors and emojis for tasks

## Technologies

- **React Native** + **Expo**: main development platform
- **TypeScript**: for typing and improved development
- **Supabase**: backend (authentication, data storage)
- **React Navigation**: for app navigation
- **Context API**: for global state management

## Project Setup

### Prerequisites

- Node.js (version 14+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account and configured database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/habitHUB-RN-APP.git
cd habitHUB-RN-APP
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a .env file in the project root with the following variables:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase Database Structure

1. **users table**:

   - id (uuid, primary key)
   - name (text)
   - email (text)
   - created_at (timestamp with time zone)

2. **user_tasks table**:
   - id (bigint, primary key)
   - name_task (text)
   - description_task (text)
   - color_task (text)
   - repeat_task (text)
   - tag_task (text)
   - created_at (timestamp with time zone)
   - completed (boolean)
   - user_id (uuid, foreign key to users.id)

### Running the Application

```bash
npx expo start
```

## Project Structure

```
src/
├── assets/          # Images, fonts, and other static resources
├── components/      # Reusable components
│   ├── auth/        # Authentication components
│   ├── habit/       # Habit and task components
│   ├── layout/      # Layout components
│   └── ui/          # Common UI components (buttons, inputs, etc.)
├── constants/       # Constants and themes
├── context/         # React Contexts
├── hooks/           # Custom React hooks
├── lib/             # Libraries and utilities
├── navigation/      # Navigation configuration
├── screens/         # Application screens
├── services/        # Services for API interaction
├── styles/          # Common styles
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## Application Screens

1. **LoginScreen**: Welcome screen
2. **SignInScreen**: User login
3. **SignUpScreen**: User registration
4. **ForgotPasswordScreen**: Password recovery
5. **HomeScreen**: Main screen with habits
6. **CalendarScreen**: Task calendar
7. **ProfileScreen**: User profile
8. **NewTaskScreen**: Create a new task

## Development and Contribution

1. Fork the repository
2. Create a branch for the new feature (`git checkout -b feature/amazing-feature`)
3. Make changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to your fork (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

Distributed under the MIT License.
