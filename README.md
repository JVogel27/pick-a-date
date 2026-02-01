# Pick-A-Date 💕

A romantic date idea picker web app that helps couples discover new and exciting date ideas.

## Features

- **Smart Selection Algorithm**: Shows 3 random date ideas, prioritizing ideas that haven't been shown before
- **Tracking System**: Keeps track of which ideas have been shown and completed
- **Romantic Animation**: Fun hearts and sparkles animation when picking dates
- **Admin Panel**: Easy CRUD interface for managing date ideas
- **Reset Functionality**: Clear all tracking data to start fresh

## Tech Stack

- **Frontend**: React, TypeScript, SASS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Testing**: Jest, React Testing Library
- **Data Storage**: JSON file on server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Navigate to the project directory:
```bash
cd pick-a-date
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode

Run both the client and server concurrently:

```bash
npm run dev
```

This will start:
- Client dev server on http://localhost:5173
- Backend API server on http://localhost:3000

#### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Running Tests

Run frontend component tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

**Note:** The current test suite covers frontend React components. Backend tests would require additional configuration for ESM modules, which can be added if needed.

## Project Structure

```
pick-a-date/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (Home, Admin)
│   │   ├── services/      # API service layer
│   │   ├── styles/        # SASS stylesheets
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── index.html
├── server/                # Express backend
│   ├── src/
│   │   ├── data/          # JSON data storage
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── index.ts       # Server entry point
│   └── tsconfig.json
├── shared/                # Shared TypeScript types
│   └── types.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── jest.config.js
```

## How It Works

### Date Selection Algorithm

1. **Prioritization**:
   - Never-shown ideas are shown first
   - Then least-recently-shown ideas
   - Completed ideas are excluded from selection

2. **Tracking**:
   - `lastShown`: Timestamp when idea was last displayed
   - `lastCompleted`: Timestamp when idea was selected by user

3. **Reset**: Clears all tracking data so all ideas can be shown again

### API Endpoints

- `GET /api/ideas` - Get all date ideas
- `GET /api/ideas/pick` - Get 3 random ideas (updates lastShown)
- `POST /api/ideas/:id/select` - Mark idea as completed
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/reset` - Reset all tracking data

## Usage

### Main Page

1. Click the "Pick A Date!" button
2. Enjoy the romantic animation
3. Three date ideas will appear
4. Click "Choose This!" on your favorite idea
5. The app tracks your selection

### Admin Page

1. Navigate to `/admin` or click "Manage Ideas"
2. Add new date ideas using the form
3. Edit existing ideas by clicking "Edit"
4. Delete ideas you no longer want
5. Use "Reset All Tracking" to clear history

## Customization

### Adding More Date Ideas

You can add ideas through the admin interface or directly edit the template file:

`server/src/data/date-ideas-template.json`

### Styling

All styles are in `client/src/styles/`. The app uses SASS with:
- Variables in `_variables.scss`
- Animations in `_animations.scss`
- Component styles in `components/` folder

### Animation Duration

Modify the animation duration in `client/src/components/RomanticAnimation.tsx`:

```typescript
const timer = setTimeout(onComplete, 2000); // Change 2000 to desired ms
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
