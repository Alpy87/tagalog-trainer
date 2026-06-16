export type TrainingMode = 
  | 'conversation'
  | 'grammar'
  | 'vocabulary'
  | 'scenarios'
  | 'writing';

export interface ModeConfig {
  id: TrainingMode;
  title: string;
  emoji: string;
  description: string;
  shortDescription: string;
  accentColor: string;
  welcomeMessage: string;
}

export const MODES: Record<TrainingMode, ModeConfig> = {
  conversation: {
    id: 'conversation',
    title: 'Conversation Partner',
    emoji: '🗣️',
    description: 'Practice speaking Tagalog in immersive conversations. Get corrections, learn vocabulary in context, and build confidence.',
    shortDescription: 'Immersive Tagalog conversations with real-time corrections',
    accentColor: 'var(--accent-gold)',
    welcomeMessage: 'Kamusta! 👋 I\'m your Tagalog conversation partner. I\'ll speak to you in Tagalog using simple vocabulary. After each response, I\'ll correct any mistakes, provide the corrected version, and ask you a follow-up question. **Simulan na natin!** (Let\'s begin!) Ano ang pangalan mo? (**What is your name?**)',
  },
  grammar: {
    id: 'grammar',
    title: 'Grammar Coach',
    emoji: '📖',
    description: 'Master Tagalog grammar step by step. Learn rules, practice with exercises, and get detailed explanations.',
    shortDescription: 'Structured grammar lessons with interactive exercises',
    accentColor: 'var(--accent-blue)',
    welcomeMessage: 'Welcome to Tagalog Grammar Coach! 📖\n\nI\'ll teach you grammar one topic at a time with clear explanations and exercises. We\'ll start with the absolute basics.\n\n**Let\'s begin with Topic 1: Tagalog Personal Pronouns (Mga Panghalip Panao)**\n\nReady? Just say "Let\'s go!" and I\'ll present the first lesson.',
  },
  vocabulary: {
    id: 'vocabulary',
    title: 'Vocabulary Builder',
    emoji: '🎧',
    description: 'Build your Tagalog word bank with spaced repetition. Learn 5 words per session with context and quizzes.',
    shortDescription: 'Spaced repetition vocabulary training with quizzes',
    accentColor: 'var(--accent-teal)',
    welcomeMessage: 'Welcome to Vocabulary Builder! 🎧\n\nEach session, I\'ll teach you **5 new words** with pronunciation, examples, and quizzes. I use spaced repetition to help you remember.\n\nChoose a theme to start, or I\'ll suggest one:\n\n1. 🏠 **Bahay** — Home & Family\n2. 🍽️ **Pagkain** — Food & Drinks\n3. 👋 **Pagbati** — Greetings & Basics\n4. 🔢 **Numero** — Numbers & Counting\n5. 🎨 **Kulay** — Colors\n\nWhich theme would you like?',
  },
  scenarios: {
    id: 'scenarios',
    title: 'Scenario Simulator',
    emoji: '🌍',
    description: 'Practice real-life Filipino situations through roleplay. Order at a carinderia, ride a jeepney, and more!',
    shortDescription: 'Real-life roleplay scenarios with performance reviews',
    accentColor: 'var(--accent-coral)',
    welcomeMessage: 'Welcome to the Real-World Scenario Simulator! 🌍\n\nI\'ll set up realistic Filipino situations and play all the characters. You\'ll practice practical Tagalog communication!\n\nChoose a scenario to practice:\n\n1. 🏪 **Sari-Sari Store** — Buy snacks and drinks\n2. 🚕 **Grab/Taxi Ride** — Give directions to a driver\n3. 🍜 **Carinderia** — Order food at a local eatery\n4. 👋 **Meeting a Neighbor** — Introduce yourself\n5. 📱 **Phone Call** — Simple phone conversation\n\nWhich scenario would you like to try?',
  },
  writing: {
    id: 'writing',
    title: 'Writing Tutor',
    emoji: '✍️',
    description: 'Improve your Tagalog writing with detailed feedback on grammar, vocabulary, flow, and style.',
    shortDescription: 'Writing practice with 4-axis scoring and native rewrites',
    accentColor: 'var(--accent-purple)',
    welcomeMessage: 'Welcome to the Tagalog Writing Tutor! ✍️\n\nI\'ll review your Tagalog writing on 4 axes:\n- 📝 **Grammar** (1-5)\n- 📚 **Vocabulary Range** (1-5)\n- 🌊 **Natural Flow** (1-5)\n- 🎨 **Style/Register** (1-5)\n\nLet\'s start with your first writing exercise! Here\'s your prompt:\n\n**Write a short message (2-3 sentences) introducing yourself in Tagalog.**\n\nExample starter: "Kumusta! Ako si..."',
  },
};
