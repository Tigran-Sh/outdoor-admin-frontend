import type { Preview } from '@storybook/react-vite'

import '../src/styles/main.scss'
import '../src/app/i18n'

import ThemeProvider from '../src/app/providers/ThemeProvider'
import type { ThemeMode } from '../src/app/providers/useTheme'

import ThemeSync from './ThemeSync'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  initialGlobals: {
    theme: 'light',
  },

  globalTypes: {
    theme: {
      description: 'Theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => (
      <ThemeProvider>
        <ThemeSync theme={context.globals.theme as ThemeMode}>
          <Story />
        </ThemeSync>
      </ThemeProvider>
    ),
  ],
};

export default preview;
