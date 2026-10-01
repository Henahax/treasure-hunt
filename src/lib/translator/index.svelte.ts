type Locale = 'de' | 'en';
type TranslationVariables = Readonly<Record<string, string | number>>;

const translations = {
	app: {
		title: {
			de: 'Schnitzeljagd',
			en: 'Treasure Hunt'
		}
	},
	nav: {
		home: {
			de: 'Startseite',
			en: 'Home'
		},
		browse: {
			de: 'Entdecken',
			en: 'Browse'
		},
		continue: {
			de: 'Fortsetzen',
			en: 'Continue'
		},
		steps: {
			de: 'Schritte',
			en: 'Steps'
		}
	},
	catalog: {
		title: {
			de: 'Schnitzeljagden entdecken',
			en: 'Browse treasure hunts'
		},
		stepsCount: {
			de: '{count} Schritte',
			en: '{count} steps'
		}
	},
	hunt: {
		active: {
			de: 'Aktive Schnitzeljagd',
			en: 'Active Treasure Hunt'
		},
		start: {
			de: 'Jagd starten',
			en: 'Start hunt'
		},
		continue: {
			de: 'Jagd fortsetzen',
			en: 'Continue hunt'
		},
		reset: {
			de: 'Zurücksetzen',
			en: 'Reset'
		},
		resetConfirm: {
			de: 'Fortschritt für „{name}“ wirklich zurücksetzen?',
			en: 'Reset progress for “{name}”?'
		},
		notFound: {
			de: 'Diese Schnitzeljagd wurde nicht gefunden.',
			en: 'This treasure hunt could not be found.'
		},
		back: {
			de: 'Zur Jagd',
			en: 'Back to hunt'
		}
	},
	steps: {
		unlockedTitle: {
			de: 'Freigeschaltete Schritte',
			en: 'Unlocked steps'
		},
		completed: {
			de: 'Abgeschlossen',
			en: 'Completed'
		},
		available: {
			de: 'Offen',
			en: 'Available'
		},
		day: {
			de: 'Tag',
			en: 'day'
		},
		days: {
			de: 'Tage',
			en: 'days'
		},
		countdown: {
			de: 'Freischaltung in',
			en: 'Unlocks in'
		},
		releaseAt: {
			de: 'Freischaltung am',
			en: 'Available on'
		},
		timeUnlocked: {
			de: 'Dieser Schritt ist jetzt freigeschaltet.',
			en: 'This step is now unlocked.'
		},
		noneUnlocked: {
			de: 'Es sind noch keine Schritte freigeschaltet.',
			en: 'No steps are unlocked yet.'
		},
		close: {
			de: 'Schrittliste schließen',
			en: 'Close step list'
		},
		progressLoading: {
			de: 'Fortschritt wird geladen ...',
			en: 'Loading progress ...'
		},
		locked: {
			de: 'Dieser Schritt ist noch gesperrt. Du wirst zum nächsten offenen Schritt weitergeleitet.',
			en: 'This step is still locked. You are being redirected to the next available step.'
		},
		notFound: {
			de: 'Der Schritt wurde nicht gefunden.',
			en: 'This step could not be found.'
		},
		finish: {
			de: 'Jagd abschließen',
			en: 'Finish hunt'
		},
		next: {
			de: 'Weiter',
			en: 'Next'
		}
	},
	scanner: {
		title: {
			de: 'QR-Code scannen',
			en: 'Scan QR code'
		},
		close: {
			de: 'Scanner schließen',
			en: 'Close scanner'
		},
		cameraError: {
			de: 'Die Kamera konnte nicht gestartet werden.',
			en: 'The camera could not be started.'
		}
	},
	form: {
		scan: {
			de: 'Scannen',
			en: 'Scan'
		},
		codeLabel: {
			de: 'Schnitzeljagd-Code',
			en: 'Treasure hunt code'
		},
		codePlaceholder: {
			de: 'Code scannen oder eingeben',
			en: 'Enter a code or scan a QR code'
		},
		passwordCodeLabel: {
			de: 'Passwort oder QR-Code',
			en: 'Password or QR code'
		},
		passwordCodePlaceholder: {
			de: 'Passwort eingeben oder QR-Code scannen',
			en: 'Enter a password or scan a QR code'
		},
		submit: {
			de: 'Absenden',
			en: 'Submit'
		},
		verifyPassword: {
			de: 'Prüfen',
			en: 'Check'
		},
		checkLocation: {
			de: 'Standort prüfen',
			en: 'Check location'
		}
	},
	actions: {
		openLink: {
			de: 'Link öffnen',
			en: 'Open link'
		}
	},
	messages: {
		passwordIncorrect: {
			de: 'Das Passwort ist nicht korrekt.',
			en: 'The password is incorrect.'
		},
		locationUnsupported: {
			de: 'Die Standortbestimmung wird von diesem Browser nicht unterstützt.',
			en: 'Geolocation is not supported by this browser.'
		},
		locationChecking: {
			de: 'Standort wird geprüft ...',
			en: 'Checking location ...'
		},
		locationDistance: {
			de: 'Du bist noch etwa {distance} m vom Ziel entfernt.',
			en: 'You are still about {distance} m from the destination.'
		},
		locationFailed: {
			de: 'Dein Standort konnte nicht ermittelt werden.',
			en: 'Your location could not be determined.'
		},
		huntCodeNotFound: {
			de: 'Für diesen Code wurde keine Schnitzeljagd gefunden.',
			en: 'No treasure hunt was found for this code.'
		},
		huntCompleted: {
			de: 'Jagd abgeschlossen!',
			en: 'Treasure hunt completed!'
		}
	},
	footer: {
		copyright: {
			de: '© {year} Henahax',
			en: '© {year} Henahax'
		},
		source: {
			de: 'Quellcode',
			en: 'Source code'
		}
	}
} as const;

type TranslationPaths<T> = {
	[Key in keyof T & string]: T[Key] extends Record<Locale, string>
		? Key
		: T[Key] extends object
			? `${Key}.${TranslationPaths<T[Key]>}`
			: never;
}[keyof T & string];

type TranslationKey = TranslationPaths<typeof translations>;

class Translator {
	locale = $state<Locale>('de');

	translate(key: TranslationKey, variables: TranslationVariables = {}): string {
		let entry: unknown = translations;

		for (const segment of key.split('.')) {
			if (typeof entry !== 'object' || entry === null) {
				return key;
			}

			entry = (entry as Record<string, unknown>)[segment];
		}

		if (typeof entry === 'object' && entry !== null && this.locale in entry) {
			const template = (entry as Record<Locale, string>)[this.locale];
			return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
				const value = variables[name];
				return value === undefined ? placeholder : String(value);
			});
		}

		return key;
	}
}

export const translator = new Translator();
