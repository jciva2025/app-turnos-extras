
import type { TeamMember, Team, Holiday, ShiftBlock, TeamId } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'gonzalo_r', name: 'Gonzalo Rodríguez', teamId: 'team_a', loginKey: 'gr123', photoUrl: '/gonzalo_r.png' },
  { id: 'francisco_g', name: 'Francisco Garces', teamId: 'team_a', loginKey: 'fg123', photoUrl: '/francisco_g.png' },
  { id: 'sergio_s', name: 'Sergio Sosa', teamId: 'team_b', loginKey: 'ss123', photoUrl: '/sergio_s.png' },
  { id: 'alexis_m', name: 'Alexis Monasterio', teamId: 'team_b', loginKey: 'am123', photoUrl: '/alexis_m.png' },
  { id: 'jorge_c', name: 'Jorge Civalero', teamId: 'team_c', loginKey: 'jc123', photoUrl: '/jorge_c.png' },
  { id: 'juan_b', name: 'Juan Bilbao', teamId: 'team_c', loginKey: 'jb123', photoUrl: '/juan_b.png' },
  { id: 'andres_f', name: 'Andres Flores', teamId: 'team_d', loginKey: 'af123', photoUrl: '/andres_f.png' },
  { id: 'matias_v', name: 'Matias Vilela', teamId: 'team_d', loginKey: 'mv123', photoUrl: '/matias_v.png' },
];

export const TEAMS: Record<TeamId, Team> = {
  team_a: { id: 'team_a', name: 'Turno A', members: ['gonzalo_r', 'francisco_g'] },
  team_b: { id: 'team_b', name: 'Turno B', members: ['sergio_s', 'alexis_m'] },
  team_c: { id: 'team_c', name: 'Turno C', members: ['jorge_c', 'juan_b'] },
  team_d: { id: 'team_d', name: 'Turno D', members: ['andres_f', 'matias_v'] },
};

// Fecha de referencia: 27 de Mayo de 2024.
// En esta fecha, team_c trabaja de día y team_d de noche, iniciando el ciclo.
export const REFERENCE_DATE = new Date(2024, 4, 27); // May 27, 2024 (month is 0-indexed)
export const CYCLE_LENGTH = 20; // days

// Patrón de turnos basado en la descripción del usuario:
// Ciclo de 20 días. Los equipos trabajan en bloques 3-2-2-3.
// Después de los primeros 10 días (un ciclo 3-2-2-3), los turnos se invierten.
export const SHIFT_PATTERN: ShiftBlock[] = [
  // Primeros 10 días del ciclo (turnos estándar)
  { duration: 3, assignments: { day: 'team_c', night: 'team_d' } }, // Días 0-2. C(día)/D(noche) trabajan. A/B francos.
  { duration: 2, assignments: { day: 'team_a', night: 'team_b' } }, // Días 3-4. A(día)/B(noche) trabajan. C/D francos.
  { duration: 2, assignments: { day: 'team_c', night: 'team_d' } }, // Días 5-6. C(día)/D(noche) trabajan. A/B francos.
  { duration: 3, assignments: { day: 'team_a', night: 'team_b' } }, // Días 7-9. A(día)/B(noche) trabajan. C/D francos.

  // Siguientes 10 días del ciclo (turnos invertidos)
  { duration: 3, assignments: { day: 'team_d', night: 'team_c' } }, // Días 10-12. D(día)/C(noche) trabajan (invierte C/D). A/B francos.
  { duration: 2, assignments: { day: 'team_b', night: 'team_a' } }, // Días 13-14. B(día)/A(noche) trabajan (invierte A/B). C/D francos.
  { duration: 2, assignments: { day: 'team_d', night: 'team_c' } }, // Días 15-16. D(día)/C(noche) trabajan (invierte C/D). A/B francos.
  { duration: 3, assignments: { day: 'team_b', night: 'team_a' } }, // Días 17-19. B(día)/A(noche) trabajan (invierte A/B). C/D francos.
];


export const DAY_SHIFT_START = "06:00";
export const DAY_SHIFT_END = "18:00";
export const NIGHT_SHIFT_START = "18:00";
export const NIGHT_SHIFT_END = "06:00"; // Next day

export const ARGENTINA_HOLIDAYS: Holiday[] = [
  // 2025 Example Holidays
  { date: "2025-01-01", name: "Año Nuevo" },
  { date: "2025-03-03", name: "Carnaval" },
  { date: "2025-03-04", name: "Carnaval" },
  { date: "2025-03-24", name: "Día Nacional de la Memoria por la Verdad y la Justicia" },
  { date: "2025-04-02", name: "Día del Veterano y de los Caídos en la Guerra de Malvinas" },
  { date: "2025-04-18", name: "Viernes Santo" },
  { date: "2025-05-01", name: "Día del Trabajador" },
  { date: "2025-05-25", name: "Día de la Revolución de Mayo" },
  { date: "2025-06-20", name: "Paso a la Inmortalidad del Gral. Manuel Belgrano" },
  { date: "2025-07-09", name: "Día de la Independencia" },
  { date: "2025-08-18", name: "Paso a la Inmortalidad del Gral. José de San Martín" }, // Trasladado del 17/8
  { date: "2025-10-13", name: "Día del Respeto a la Diversidad Cultural" }, // Trasladado del 12/10
  { date: "2025-11-24", name: "Día de la Soberanía Nacional (Trasladable)"}, // Originalmente 20/11, ejemplo de trasladable
  { date: "2025-12-08", name: "Inmaculada Concepción de María" },
  { date: "2025-12-25", name: "Navidad" },
  // 2024 Example Holidays (for testing with current dates)
  { date: "2024-01-01", name: "Año Nuevo" },
  { date: "2024-02-12", name: "Carnaval" },
  { date: "2024-02-13", name: "Carnaval" },
  { date: "2024-03-24", name: "Día Nacional de la Memoria por la Verdad y la Justicia" },
  { date: "2024-03-29", name: "Viernes Santo" },
  { date: "2024-04-01", name: "Feriado Puente Turístico"},
  { date: "2024-04-02", name: "Día del Veterano y de los Caídos en la Guerra de Malvinas" },
  { date: "2024-05-01", name: "Día del Trabajador" },
  { date: "2024-05-25", name: "Día de la Revolución de Mayo" },
  { date: "2024-06-17", name: "Paso a la Inmortalidad del Gral. Don Martín Miguel de Güemes"},
  { date: "2024-06-20", name: "Paso a la Inmortalidad del Gral. Manuel Belgrano" },
  { date: "2024-06-21", name: "Feriado Puente Turístico"},
  { date: "2024-07-09", name: "Día de la Independencia" },
  { date: "2024-08-17", name: "Paso a la Inmortalidad del Gral. José de San Martín" },
  { date: "2024-10-11", name: "Feriado Puente Turístico"},
  { date: "2024-10-12", name: "Día del Respeto a la Diversidad Cultural" },
  { date: "2024-11-18", name: "Día de la Soberanía Nacional"}, // Trasladado del 20/11
  { date: "2024-12-08", name: "Inmaculada Concepción de María" },
  { date: "2024-12-25", name: "Navidad" },
];
