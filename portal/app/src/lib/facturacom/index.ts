/**
 * @file lib/facturacom/index.ts
 * @description Re-exports del módulo factura.com
 */

export {
  FacturaComClient,
  FacturaComApiError,
  createFacturaComClient,
  type FacturaComCredentials,
  type FacturaComClientConfig,
  type CfdiCreateResponse,
  type CfdiCancelResponse,
  type FacturaComCliente,
  type ListClientesParams,
  type ListClientesResponse,
  type FacturaComSerie,
  type ListSeriesResponse,
  type FacturaComProducto,
  type ListProductosResponse,
} from "./client";

export {
  syncClientesFacturaCom,
  resolveReceptorUid,
  type SyncClientesOptions,
  type SyncClientesResult,
} from "./sync-clientes";

export {
  syncSeriesFacturaCom,
  resolveSerieUid,
  type SyncSeriesOptions,
  type SyncSeriesResult,
  type SerieConUid,
} from "./sync-series";

export {
  syncProductosFacturaCom,
  type SyncProductosOptions,
  type SyncProductosResult,
} from "./sync-productos";

export {
  validateCfdiFactura,
  validateCfdiRep,
  formatValidationErrors,
  conceptoRepFijo,
  CfdiFacturaSchema,
  CfdiRepSchema,
  ConceptoSchema,
  ReceptorSchema,
  type ICfdiFactura,
  type ICfdiRep,
  type IConcepto,
  type IReceptor,
  type ValidationResult,
} from "./validators";
