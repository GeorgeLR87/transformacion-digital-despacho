/**
 * @file lib/facturacom/client.ts
 * @description Cliente HTTP tipado para la API de factura.com
 *
 * Reglas críticas:
 * - Header F-PLUGIN obligatorio en TODOS los requests
 * - Serie = UID numérico (billing_series_emisoras.uid_facturacom), NO la letra
 * - Receptor.UID = UID interno hex de factura.com, NO el RFC
 * - Versiones por recurso: /v1/clients · /v3/products · /v4/cfdi40/ · /v4/series
 * - Cada RFC emisor tiene su propia API Key (no hay master key)
 */

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const F_PLUGIN_TOKEN = "9d4095c8f7ed5785cb14c0e3b033eeb8252416ed";

const API_HOST = {
  sandbox: "https://sandbox.factura.com/api",
  production: "https://api.factura.com",
} as const;

// ---------------------------------------------------------------------------
// Tipos — credenciales y configuración
// ---------------------------------------------------------------------------

export interface FacturaComCredentials {
  apiKey: string;
  secretKey: string;
}

export interface FacturaComClientConfig {
  credentials: FacturaComCredentials;
  /** Por defecto usa NODE_ENV: si es 'production' usa producción, en otro caso sandbox */
  environment?: "sandbox" | "production";
}

// ---------------------------------------------------------------------------
// Tipos — respuestas genéricas de factura.com
// ---------------------------------------------------------------------------

/** Estructura base de error devuelto por factura.com */
export interface FacturaComErrorBody {
  response: "error";
  message: string | Record<string, unknown>;
  messageDetail?: string;
  status?: string;
}

/** Respuesta exitosa genérica (cada endpoint extiende con su payload) */
export interface FacturaComSuccessBody<T = unknown> {
  response: "success";
  status?: "success";
  data?: T;
  message?: string;
}

/** Error estructurado que lanza el cliente */
export class FacturaComApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: FacturaComErrorBody | unknown,
    message?: string
  ) {
    // Extraer mensaje legible: body.message puede ser string u objeto { message: "..." }
    const rawMsg = (body as Record<string, unknown>)?.message;
    const extractedMsg =
      typeof rawMsg === "string"
        ? rawMsg
        : typeof rawMsg === "object" && rawMsg !== null && "message" in rawMsg
          ? String((rawMsg as Record<string, unknown>).message)
          : null;

    super(message ?? extractedMsg ?? `Error HTTP ${status} en factura.com`);
    this.name = "FacturaComApiError";
  }
}

// ---------------------------------------------------------------------------
// Tipos — CFDI
// ---------------------------------------------------------------------------

export interface CfdiCreateResponse {
  response: "success" | "error";
  uid?: string;
  UUID?: string;
  SAT?: {
    UUID: string;
    FechaTimbrado: string;
    NoCertificadoSAT: string;
    Version: string;
    SelloSAT: string;
    SelloCFD: string;
  };
  INV?: {
    Serie: string;
    Folio: number;
  };
  invoice_uid?: string;
  // Campos de borrador cuando BorradorSiFalla=1 falla el timbrado
  xmlerror?: string;
  draft?: {
    response: string;
    message: string;
    uid: string;
    invoice_uid: string;
  };
  message?: string | Record<string, unknown>;
}

export interface CfdiCancelResponse {
  response: "success" | "error";
  message?: string;
  status?: string;
}

// ---------------------------------------------------------------------------
// Tipos — Clientes (receptores)
// ---------------------------------------------------------------------------

export interface FacturaComCliente {
  UID: string; // UID hex interno, ej: "69c2b39872b03"
  RazonSocial: string;
  RFC: string;
  Regimen: string;
  RegimenId: string;
  Calle?: string;
  Numero?: string;
  Interior?: string;
  Colonia?: string;
  CodigoPostal: string;
  Ciudad?: string;
  Municipio?: string;
  Estado?: string;
  Pais?: string;
  NumRegIdTrib?: string;
  Email?: string;
}

export interface ListClientesParams {
  rfc?: string;
  razon_social?: string;
  page?: number;
  per_page?: number;
}

export interface ListClientesResponse {
  status: "success" | "error";
  response: "success" | "error";
  data: FacturaComCliente[];
}

// ---------------------------------------------------------------------------
// Tipos — Series
// ---------------------------------------------------------------------------

export interface FacturaComSerie {
  SerieID: number; // UID numérico — este es el campo "Serie" en CFDI
  SerieName: string; // Letra o nombre, ej: "F"
  SerieType: "factura" | "pago" | "nota_credito" | "nota_debito" | "retencion";
  SerieDescription: string;
  SerieStatus: "Activa" | "Inactiva";
}

export interface ListSeriesResponse {
  status: "success" | "error";
  data: FacturaComSerie[];
}

// ---------------------------------------------------------------------------
// Tipos — Productos
// ---------------------------------------------------------------------------

export interface FacturaComProducto {
  UID: string;
  ClaveProdServ: string;
  NoIdentificacion: string;
  Descripcion: string;
  Precio: string;
  IVA: string;
  IEPS: string;
  Unidad: string;
  ClaveUnidad: string;
  ObjetoImp: string;
}

export interface ListProductosResponse {
  status: "success" | "error";
  response?: string;
  data: FacturaComProducto[];
}

// ---------------------------------------------------------------------------
// Cliente principal
// ---------------------------------------------------------------------------

export class FacturaComClient {
  private readonly host: string;
  private readonly credentials: FacturaComCredentials;

  constructor(config: FacturaComClientConfig) {
    this.credentials = config.credentials;
    // Detectar ambiente: explícito → variable de entorno → sandbox por defecto
    const env =
      config.environment ??
      (process.env.FACTURACOM_ENV === "production" ? "production" : "sandbox");
    this.host = API_HOST[env];
  }

  // -------------------------------------------------------------------------
  // Utilidades internas
  // -------------------------------------------------------------------------

  /** Construye los headers obligatorios para todos los requests */
  private buildHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "F-PLUGIN": F_PLUGIN_TOKEN,
      "F-Api-Key": this.credentials.apiKey,
      "F-Secret-Key": this.credentials.secretKey,
    };
  }

  /**
   * Ejecuta un request HTTP y devuelve el body parseado.
   * Lanza FacturaComApiError si el status HTTP >= 400 o si response === 'error'.
   */
  private async request<T>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.host}${path}`;

    const res = await fetch(url, {
      method,
      headers: this.buildHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    // Intentar parsear JSON siempre (factura.com devuelve JSON incluso en errores)
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new FacturaComApiError(
        res.status,
        null,
        `factura.com devolvió respuesta no-JSON (HTTP ${res.status})`
      );
    }

    // HTTP error
    if (!res.ok) {
      throw new FacturaComApiError(res.status, json);
    }

    // Error de aplicación (HTTP 200 pero response: 'error')
    const asAny = json as Record<string, unknown>;
    if (asAny?.response === "error" || asAny?.status === "error") {
      throw new FacturaComApiError(res.status, json);
    }

    return json as T;
  }

  // -------------------------------------------------------------------------
  // CFDI 4.0 — /v4/cfdi40/
  // -------------------------------------------------------------------------

  /**
   * Crea (timbra) un CFDI 4.0.
   * El campo Serie del payload DEBE ser el UID numérico de billing_series_emisoras.uid_facturacom.
   * El campo Receptor.UID DEBE ser el UID hex interno de factura.com, NO el RFC.
   */
  async createCfdi(payload: Record<string, unknown>): Promise<CfdiCreateResponse> {
    return this.request<CfdiCreateResponse>("POST", "/v4/cfdi40/create", payload);
  }

  /**
   * Consulta un CFDI por su UID interno de factura.com.
   * Endpoint: GET /v4/cfdi40/{uid}
   */
  async getCfdi(uid: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("GET", `/v4/cfdi40/${uid}`);
  }

  /**
   * Cancela un CFDI.
   * Endpoint: DELETE /v4/cfdi40/{uid}/cancel
   * @param uid - uid_facturacom del CFDI a cancelar
   * @param motivo - Clave de motivo SAT: "01" sustitución, "02" comprobante con errores, "03" no realizó, "04" nominativa a público general
   * @param uuidSustitucion - Requerido solo cuando motivo === "01"
   */
  async cancelCfdi(
    uid: string,
    motivo: "01" | "02" | "03" | "04",
    uuidSustitucion?: string
  ): Promise<CfdiCancelResponse> {
    const body: Record<string, string> = { motivo };
    if (motivo === "01") {
      if (!uuidSustitucion) {
        throw new Error(
          'El UUID de sustitución es obligatorio cuando motivo === "01"'
        );
      }
      body.uuid_sustitucion = uuidSustitucion;
    }
    return this.request<CfdiCancelResponse>(
      "DELETE",
      `/v4/cfdi40/${uid}/cancel`,
      body
    );
  }

  /**
   * Descarga un archivo (PDF o XML) como Buffer.
   * factura.com puede devolver el archivo directamente como binario
   * o como JSON con campo "data" en base64.
   */
  private async downloadFile(path: string): Promise<Buffer> {
    const url = `${this.host}${path}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });

    if (!res.ok) {
      throw new FacturaComApiError(res.status, null, `Error al descargar archivo (HTTP ${res.status})`);
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Si la respuesta es binaria (PDF/XML directo)
    if (contentType.includes("application/pdf") || contentType.includes("application/xml") || contentType.includes("text/xml")) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // Si la respuesta es JSON con base64
    const json = await res.json() as Record<string, string>;
    if (json.data) {
      return Buffer.from(json.data, "base64");
    }

    throw new FacturaComApiError(res.status, null, "Formato de respuesta de descarga no reconocido");
  }

  /**
   * Descarga el PDF de un CFDI (timbrado o borrador) como Buffer.
   */
  async downloadCfdiPdf(uid: string): Promise<Buffer> {
    return this.downloadFile(`/v4/cfdi40/${uid}/pdf`);
  }

  /**
   * Descarga el XML de un CFDI como Buffer.
   */
  async downloadCfdiXml(uid: string): Promise<Buffer> {
    return this.downloadFile(`/v4/cfdi40/${uid}/xml`);
  }

  // -------------------------------------------------------------------------
  // Borradores — Draft + timbrar + eliminar
  // -------------------------------------------------------------------------

  /**
   * Crea un borrador de CFDI sin timbrarlo.
   * Usa el mismo payload de createCfdi pero agrega "Draft": "1".
   * El borrador queda guardado en factura.com con un UID y folio reservado.
   * Endpoint: POST /v4/cfdi40/create con Draft=1
   */
  async createDraft(payload: Record<string, unknown>): Promise<CfdiCreateResponse> {
    return this.request<CfdiCreateResponse>("POST", "/v4/cfdi40/create", {
      ...payload,
      Draft: "1",
    });
  }

  /**
   * Timbra un borrador existente. Usa el mismo folio que el borrador.
   * Endpoint: POST /v4/cfdi40/{uid}/timbrarborrador
   */
  async timbrarBorrador(uid: string): Promise<CfdiCreateResponse> {
    return this.request<CfdiCreateResponse>("POST", `/v4/cfdi40/${uid}/timbrarborrador`);
  }

  /**
   * Elimina un borrador.
   * Endpoint: POST /v4/cfdi40/{uid}/cancel (misma ruta que cancelar, funciona para borradores)
   */
  async eliminarBorrador(uid: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("POST", `/v4/cfdi40/${uid}/cancel`, {
      motivo: "02",
    });
  }

  // -------------------------------------------------------------------------
  // Clientes (receptores) — /v1/clients
  // -------------------------------------------------------------------------

  /**
   * Lista clientes del catálogo con filtros opcionales.
   * Endpoint: GET /v1/clients
   */
  async listClientes(params?: ListClientesParams): Promise<ListClientesResponse> {
    const qs = new URLSearchParams();
    if (params?.rfc) qs.set("rfc", params.rfc);
    if (params?.razon_social) qs.set("razon_social", params.razon_social);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.per_page !== undefined) qs.set("per_page", String(params.per_page));

    const query = qs.toString();
    const path = query ? `/v1/clients?${query}` : "/v1/clients";
    return this.request<ListClientesResponse>("GET", path);
  }

  /**
   * Busca un cliente por RFC exacto.
   * Retorna null si no existe (no lanza error).
   */
  async findClienteByRfc(rfc: string): Promise<FacturaComCliente | null> {
    const res = await this.listClientes({ rfc });
    return res.data?.[0] ?? null;
  }

  /**
   * Obtiene un cliente por su UID interno de factura.com.
   * Endpoint: GET /v1/clients/{uid}
   */
  async getCliente(uid: string): Promise<FacturaComCliente> {
    const res = await this.request<{ status: string; data: FacturaComCliente }>(
      "GET",
      `/v1/clients/${uid}`
    );
    return res.data;
  }

  /**
   * Crea un nuevo cliente en el catálogo de factura.com.
   * Endpoint: POST /v1/clients
   */
  async createCliente(
    payload: Record<string, unknown>
  ): Promise<{ UID: string; [key: string]: unknown }> {
    return this.request<{ UID: string; [key: string]: unknown }>(
      "POST",
      "/v1/clients",
      payload
    );
  }

  // -------------------------------------------------------------------------
  // Series — /v4/series
  // -------------------------------------------------------------------------

  /**
   * Lista todas las series activas de la empresa.
   * Endpoint: GET /v4/series
   *
   * NOTA: SerieID es el UID numérico que va en el campo Serie del CFDI.
   */
  async listSeries(): Promise<ListSeriesResponse> {
    return this.request<ListSeriesResponse>("GET", "/v4/series");
  }

  /**
   * Obtiene una serie por su UID numérico (SerieID).
   * Endpoint: GET /v4/series/{uid}
   */
  async getSerie(uid: number): Promise<FacturaComSerie> {
    const res = await this.request<{ status: string; data: FacturaComSerie }>(
      "GET",
      `/v4/series/${uid}`
    );
    return res.data;
  }

  // -------------------------------------------------------------------------
  // Productos — /v3/products
  // -------------------------------------------------------------------------

  /**
   * Lista productos del catálogo.
   * Endpoint: GET /v3/products
   */
  async listProductos(params?: {
    page?: number;
    per_page?: number;
  }): Promise<ListProductosResponse> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.per_page !== undefined) qs.set("per_page", String(params.per_page));

    const query = qs.toString();
    const path = query ? `/v3/products?${query}` : "/v3/products";
    return this.request<ListProductosResponse>("GET", path);
  }
}

// ---------------------------------------------------------------------------
// Factory — instancia por empresa emisora
// ---------------------------------------------------------------------------

/**
 * Crea un cliente de factura.com autenticado con las credenciales de una empresa.
 *
 * Uso en server actions / route handlers:
 * ```ts
 * import { createFacturaComClient } from "@/lib/facturacom/client";
 *
 * const client = createFacturaComClient({
 *   apiKey: empresa.api_key,
 *   secretKey: empresa.secret_key,
 * });
 * const cfdi = await client.createCfdi(payload);
 * ```
 */
export function createFacturaComClient(
  credentials: FacturaComCredentials,
  environment?: "sandbox" | "production"
): FacturaComClient {
  return new FacturaComClient({ credentials, environment });
}
