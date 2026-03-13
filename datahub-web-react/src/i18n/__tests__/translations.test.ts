import de from '@src/i18n/locales/de.json';
import en from '@src/i18n/locales/en.json';
import es from '@src/i18n/locales/es.json';
import fr from '@src/i18n/locales/fr.json';
import ptBr from '@src/i18n/locales/pt-br.json';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            keys.push(...collectKeys(v as Record<string, unknown>, path));
        } else {
            keys.push(path);
        }
    }
    return keys;
}

const enKeys = collectKeys(en as unknown as Record<string, unknown>);
const deKeys = new Set(collectKeys(de as unknown as Record<string, unknown>));
const esKeys = new Set(collectKeys(es as unknown as Record<string, unknown>));
const frKeys = new Set(collectKeys(fr as unknown as Record<string, unknown>));
const ptBrKeys = new Set(collectKeys(ptBr as unknown as Record<string, unknown>));

describe('Translation parity', () => {
    it('DE has all EN keys', () => {
        const missing = enKeys.filter((k) => !deKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('ES has all EN keys', () => {
        const missing = enKeys.filter((k) => !esKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('FR has all EN keys', () => {
        const missing = enKeys.filter((k) => !frKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('PT-BR has all EN keys', () => {
        const missing = enKeys.filter((k) => !ptBrKeys.has(k));
        expect(missing).toEqual([]);
    });
});
