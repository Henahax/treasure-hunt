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
        'browse': {
            de: 'Entdecken',
            en: 'Browse'
        },
        'continue': {
            de: 'Fortsetzen',
            en: 'Continue'
        }
    },
    'treasure-hunt': {
        'active-hunt': {
            de: 'Aktive Schnitzeljagd',
            en: 'Active Treasure Hunt'
        },
        'reset': {
            de: 'Zurücksetzen',
            en: 'Reset'
        }
    },
    form: {
        continue: {
            de: 'Fortfahren',
            en: 'Continue'
        },

        'enter-code': {
            de: 'Code scannen oder eingeben',
            en: 'Scan or enter code'
        },
        submit: {
            de: 'Absenden',
            en: 'Submit'
        },
        'browse-treasure-hunts': {
            de: 'Schnitzeljagden entdecken',
            en: 'Browse Treasure Hunts'
        }
    }
} as const;

type TranslationKey =
    | 'title'
    | 'nav.home'
    | 'nav.browse'
    | 'nav.continue'
    | 'treasure-hunt.active-hunt'
    | 'treasure-hunt.reset'
    | 'form.continue'
    | 'form.submit'
    | 'form.enter-code'
    | 'form.browse-treasure-hunts';

class Translator {
    locale = $state<Locale>('de');

    translate(key: TranslationKey): string {
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
