/**
 * @file __tests__/lib/api/helpers.test.ts
 * @description Tests de las utilidades compartidas para Route Handlers.
 *
 * Verifica que las respuestas de API siguen el formato estándar del proyecto:
 *   Éxito:  { success: true, data, meta? }
 *   Error:  { success: false, error: { message, code? } }
 */

import { describe, it, expect, vi } from "vitest";
import { apiSuccess, apiError, parseJsonBody } from "@/lib/api/helpers";

// ===========================================================================
// apiSuccess
// ===========================================================================

describe("apiSuccess", () => {
  it("debería retornar Response con success:true y data", async () => {
    const response = apiSuccess({ id: 1, nombre: "Test" });
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: 1, nombre: "Test" });
  });

  it("debería incluir meta cuando se proporciona", async () => {
    const response = apiSuccess(
      [{ id: 1 }],
      { total: 50, page: 1 }
    );
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.meta).toEqual({ total: 50, page: 1 });
  });

  it("debería no incluir meta cuando no se proporciona", async () => {
    const response = apiSuccess({ ok: true });
    const body = await response.json();

    expect(body.meta).toBeUndefined();
  });

  it("debería retornar status 200 por defecto", () => {
    const response = apiSuccess({});
    expect(response.status).toBe(200);
  });

  it("debería manejar data como array", async () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const response = apiSuccess(items);
    const body = await response.json();

    expect(body.data).toHaveLength(3);
    expect(body.data).toEqual(items);
  });

  it("debería manejar data como null", async () => {
    const response = apiSuccess(null);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toBeNull();
  });

  it("debería manejar data como string", async () => {
    const response = apiSuccess("Factura timbrada exitosamente");
    const body = await response.json();

    expect(body.data).toBe("Factura timbrada exitosamente");
  });
});

// ===========================================================================
// apiError
// ===========================================================================

describe("apiError", () => {
  it("debería retornar Response con success:false y mensaje de error", async () => {
    const response = apiError("No encontrado", 404);
    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error.message).toBe("No encontrado");
  });

  it("debería retornar el status HTTP proporcionado", () => {
    const response = apiError("No autorizado", 401);
    expect(response.status).toBe(401);
  });

  it("debería incluir code cuando se proporciona", async () => {
    const response = apiError("RFC duplicado", 409, "DUPLICATE_RFC");
    const body = await response.json();

    expect(body.error.code).toBe("DUPLICATE_RFC");
  });

  it("debería no incluir code cuando no se proporciona", async () => {
    const response = apiError("Error interno", 500);
    const body = await response.json();

    expect(body.error.code).toBeUndefined();
  });

  it("debería funcionar con status 400 (bad request)", async () => {
    const response = apiError("Datos inválidos", 400, "VALIDATION_ERROR");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Datos inválidos");
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("debería funcionar con status 500 (server error)", () => {
    const response = apiError("Error interno del servidor", 500);
    expect(response.status).toBe(500);
  });
});

// ===========================================================================
// parseJsonBody
// ===========================================================================

describe("parseJsonBody", () => {
  it("debería parsear JSON válido del request body", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Empresa Test", rfc: "ABC010101AB1" }),
    });

    const result = await parseJsonBody(request);
    expect(result).toEqual({ nombre: "Empresa Test", rfc: "ABC010101AB1" });
  });

  it("debería retornar null con body no JSON", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      body: "esto no es json",
    });

    const result = await parseJsonBody(request);
    expect(result).toBeNull();
  });

  it("debería retornar null con body vacío", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
    });

    const result = await parseJsonBody(request);
    expect(result).toBeNull();
  });

  it("debería parsear arrays JSON", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([1, 2, 3]),
    });

    const result = await parseJsonBody<number[]>(request);
    expect(result).toEqual([1, 2, 3]);
  });

  it("debería parsear objetos anidados", async () => {
    const payload = {
      Receptor: { UID: "abc123" },
      Conceptos: [{ ClaveProdServ: "84111506" }],
    };
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await parseJsonBody(request);
    expect(result).toEqual(payload);
  });
});
