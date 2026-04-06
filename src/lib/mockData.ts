export const agents = [
  { nif: '123456789', password: 'admin', name: 'Agente Silva' },
  { nif: '987654321', password: 'admin', name: 'Agente Costa' }
];

export const citizens = [
  { bi: '000000000LA012', name: 'João Manuel', photo: 'https://i.pravatar.cc/150?u=joao', licenseStatus: 'Válida', licenseCategory: 'B', licenseExpiry: '2028-05-10' },
  { bi: '111111111LA012', name: 'Maria Santos', photo: 'https://i.pravatar.cc/150?u=maria', licenseStatus: 'Suspensa', licenseCategory: 'B', licenseExpiry: '2025-10-20' },
  { bi: '222222222LA012', name: 'Carlos Mendes', photo: 'https://i.pravatar.cc/150?u=carlos', licenseStatus: 'Expirada', licenseCategory: 'A, B', licenseExpiry: '2023-01-15' },
  { bi: '333333333LA012', name: 'Ana Beatriz', photo: 'https://i.pravatar.cc/150?u=ana', licenseStatus: 'Válida', licenseCategory: 'B', licenseExpiry: '2030-12-01' },
];

export const vehicles = [
  { matricula: 'LD-12-34-AA', brand: 'Toyota', model: 'Corolla', ownerBi: '000000000LA012', taxPaid: true, insuranceActive: true },
  { matricula: 'LD-56-78-BB', brand: 'Hyundai', model: 'i10', ownerBi: '111111111LA012', taxPaid: false, insuranceActive: true },
  { matricula: 'LD-90-12-CC', brand: 'Kia', model: 'Rio', ownerBi: '222222222LA012', taxPaid: false, insuranceActive: false },
  { matricula: 'LD-34-56-DD', brand: 'Mercedes', model: 'C220', ownerBi: '333333333LA012', taxPaid: true, insuranceActive: true },
];

export const infractionTypes = [
  { id: 'excesso_velocidade', name: 'Excesso de Velocidade', baseAmount: 15000 },
  { id: 'estacionamento_indevido', name: 'Estacionamento Indevido', baseAmount: 8000 },
  { id: 'falta_cinto', name: 'Falta de Cinto de Segurança', baseAmount: 12000 },
  { id: 'conducao_perigosa', name: 'Condução Perigosa', baseAmount: 25000 },
  { id: 'falta_documentos', name: 'Falta de Documentos', baseAmount: 10000 },
  { id: 'conducao_ilegal', name: 'Condução Ilegal (Carta Suspensa)', baseAmount: 50000 },
];

export const initialInfractions = [
  { id: 'INF-001', type: 'multa', infractionTypeId: 'excesso_velocidade', date: '2024-03-01T10:00:00Z', citizenBi: '000000000LA012', vehicleMatricula: 'LD-12-34-AA', amount: 15000, status: 'pago', deadline: '2024-03-16T10:00:00Z', agentNif: '123456789' },
  { id: 'INF-002', type: 'aviso', infractionTypeId: 'estacionamento_indevido', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), citizenBi: '000000000LA012', vehicleMatricula: 'LD-12-34-AA', amount: 0, status: 'aviso', deadline: null, agentNif: '123456789' },
  { id: 'INF-003', type: 'multa', infractionTypeId: 'falta_cinto', date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), citizenBi: '111111111LA012', vehicleMatricula: 'LD-56-78-BB', amount: 12000, status: 'em_atraso', deadline: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), agentNif: '123456789' },
];
