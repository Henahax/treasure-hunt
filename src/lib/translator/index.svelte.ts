type Locale = 'de' | 'en';

const translations = {
    title: {
        de: 'Schnitzeljagd',
        en: 'Treasure Hunt'
    },
    nav: {
        home: {
            de: 'Startseite',
            en: 'Home'
        },
        'treasure-hunts': {
            de: 'Schnitzeljagden',
            en: 'Treasure Hunts'
        }
    },
    form: {
        continue: {
            de: 'Fortfahren',
            en: 'Continue'
        },

        'enter-code': {
            de: 'Code eingeben',
            en: 'Enter code'
        },
        submit: {
            de: 'Absenden',
            en: 'Submit'
        },
        'browse-treasure-hunts': {
            de: 'Schnitzeljagden durchsuchen',
            en: 'Browse Treasure Hunts'
        }
    }
} as const;

type TranslationKey =
    | 'title'
    | 'nav.home'
    | 'nav.treasure-hunts'
    | 'form.continue'
    | 'form.submit'
    | 'form.enter-code'
    | 'form.browse-treasure-hunts';

class Translator {
    locale = $state<Locale>('de');

    t(key: TranslationKey): string {
        let entry: unknown = translations;

        for (const segment of key.split('.')) {
            if (typeof entry !== 'object' || entry === null) {
                return key;
            }

            entry = (entry as Record<string, unknown>)[segment];
        }

        if (typeof entry === 'object' && entry !== null && this.locale in entry) {
            return (entry as Record<Locale, string>)[this.locale];
        }

        return key;
    }
}

export const translator = new Translator();
