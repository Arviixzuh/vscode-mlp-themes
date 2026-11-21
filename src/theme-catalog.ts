export interface ThemeInfo {
  /** Theme label — must match `contributes.themes[].label` in package.json and the `name` field in the generated JSON. */
  label: string;
  /** Output file name under `themes/` (without extension). */
  file: string;
  /** Short tagline shown in the quick picker. */
  tagline: string;
  /** Longer description shown in the quick picker detail pane. */
  description: string;
  /** Palette key consumed by `src/palette-generator.ts`. */
  character: string;
}

export const THEME_CATALOG: ThemeInfo[] = [
  {
    label: 'Twilight Sparkle',
    file: 'twilight-sparkle',
    tagline: 'Lavender & mauve — the studious alicorn',
    description: 'Mane 6. Soft indigo-charcoal surfaces with pastel lavender, mauve, pink, and warm peach accents.',
    character: 'twilight',
  },
  {
    label: 'Rainbow Dash',
    file: 'rainbow-dash',
    tagline: 'Sky & sapphire — the bold pegasus',
    description: 'Mane 6. Deep slate-indigo surfaces with pastel sky, sapphire, coral, and mint accents.',
    character: 'rainbow',
  },
  {
    label: 'Fluttershy',
    file: 'fluttershy',
    tagline: 'Rosewater & sage — the gentle pegasus',
    description: 'Mane 6. Warm charcoal surfaces with buttercream, rosewater, pink, and sage green accents.',
    character: 'fluttershy',
  },
  {
    label: 'Rarity',
    file: 'rarity',
    tagline: 'Pearl & periwinkle — the elegant unicorn',
    description: 'Mane 6. Refined dark slate surfaces with pearl text, sapphire, periwinkle, and amethyst accents.',
    character: 'rarity',
  },
  {
    label: 'Applejack',
    file: 'applejack',
    tagline: 'Peach & orchard — the honest earth pony',
    description: 'Mane 6. Warm espresso-charcoal surfaces with apricot peach, soft yellow, and orchard green accents.',
    character: 'applejack',
  },
  {
    label: 'Pinkie Pie',
    file: 'pinkie-pie',
    tagline: 'Flamingo pink — the joyful earth pony',
    description: 'Mane 6. Deep plum-charcoal surfaces with flamingo pink, sky, and soft yellow accents.',
    character: 'pinkie',
  },
  {
    label: 'Princess Luna',
    file: 'princess-luna',
    tagline: 'Midnight sapphire — the Nightmare Moon ruler',
    description: 'Princesses. Deep night-indigo surfaces with starry blue, lunar silver, and lavender accents.',
    character: 'luna',
  },
  {
    label: 'Princess Celestia',
    file: 'princess-celestia',
    tagline: 'Solar gold — the radiant alicorn',
    description: 'Princesses. Warm dusk-charcoal surfaces with solar yellow, peach, rose, and teal accents.',
    character: 'celestia',
  },
  {
    label: 'Sunset Shimmer',
    file: 'sunset-shimmer',
    tagline: 'Ember maroon — the transformed equestria girl',
    description: 'Equestria Girls. Warm ember-charcoal surfaces with peach, maroon, coral, and golden accents.',
    character: 'sunset',
  },
];
