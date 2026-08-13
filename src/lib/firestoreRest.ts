import { firebaseConfig } from '@/lib/firebase';

/**
 * Cliente REST mínimo do Firestore para as leituras da landing page.
 *
 * O SDK do Firestore são 568 KB (166 KB gzip) e abre um WebChannel de vida
 * longa. Para três leituras públicas de "só ler uma vez" isso é caro demais:
 * era o maior chunk baixado por cada visitante, e o canal pendente deixava
 * ERR_TIMED_OUT no console quando a página era encerrada.
 *
 * A API REST resolve o mesmo com um `fetch` e zero bytes de dependência. O SDK
 * continua sendo usado onde tempo real e escrita importam: painel admin e
 * curtidas/comentários do lightbox.
 *
 * Vale o mesmo conjunto de regras de segurança do Firestore — estes caminhos
 * já eram de leitura pública.
 */

const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

function decodeValue(value: FirestoreValue): unknown {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return new Date(value.timestampValue!).getTime();
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue?.fields);
  return undefined;
}

function decodeFields(
  fields: Record<string, FirestoreValue> | undefined,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    result[key] = decodeValue(value);
  }
  return result;
}

/** Último segmento do `name` do documento — equivale ao `doc.id` do SDK. */
function documentId(doc: FirestoreDocument): string {
  return doc.name?.split('/').pop() ?? '';
}

async function request(path: string, params?: Record<string, string>) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set('key', firebaseConfig.apiKey);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.append(key, value);
  }

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Firestore REST ${response.status} em ${path}`);
  }
  return response.json();
}

/**
 * Lista uma coleção. `orderByField` usa a ordenação do próprio Firestore.
 *
 * Só existe leitura de coleção aqui, de propósito: buscar um documento avulso
 * que ainda não foi criado responde 404, e o Lighthouse conta isso como erro
 * de console. Listar responde 200 com a lista vazia.
 */
export async function listCollectionRest(
  path: string,
  orderByField?: string,
): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
  try {
    const params: Record<string, string> = { pageSize: '300' };
    if (orderByField) params.orderBy = orderByField;

    const body: { documents?: FirestoreDocument[] } = await request(path, params);
    return (body.documents ?? []).map((doc) => ({
      id: documentId(doc),
      data: decodeFields(doc.fields),
    }));
  } catch {
    return [];
  }
}
