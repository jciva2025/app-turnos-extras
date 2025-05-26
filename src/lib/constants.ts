
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
  { id: 'admin_viewer', name: 'Admin General', teamId: 'admin', loginKey: 'admin123', photoUrl: '/admin_avatar.png' },
];

export const TEAMS: Record<TeamId, Team> = {
  team_a: { id: 'team_a', name: 'Turno A', members: ['gonzalo_r', 'francisco_g'] },
  team_b: { id: 'team_b', name: 'Turno B', members: ['sergio_s', 'alexis_m'] },
  team_c: { id: 'team_c', name: 'Turno C', members: ['jorge_c', 'juan_b'] },
  team_d: { id: 'team_d', name: 'Turno D', members: ['andres_f', 'matias_v'] },
};

// Fecha de referencia: 24 de Mayo de 2025.
// En esta fecha, team_a trabaja de día y team_b de noche, iniciando el ciclo 3-3-2-2.
export const REFERENCE_DATE = new Date(2025, 4, 24); // Mayo 24, 2025 (month is 0-indexed, 4 = Mayo)
export const CYCLE_LENGTH = 20; // days

// Patrón de turnos: 3-3-2-2 y luego se invierte.
// Total 10 días, luego inversión para otros 10 días.
export const SHIFT_PATTERN: ShiftBlock[] = [
  // Primeros 10 días del ciclo (turnos estándar)
  { duration: 3, assignments: { day: 'team_a', night: 'team_b' } }, // Días 0-2. A(día)/B(noche) trabajan. C/D francos.
  { duration: 3, assignments: { day: 'team_c', night: 'team_d' } }, // Días 3-5. C(día)/D(noche) trabajan. A/B francos.
  { duration: 2, assignments: { day: 'team_a', night: 'team_b' } }, // Días 6-7. A(día)/B(noche) trabajan. C/D francos.
  { duration: 2, assignments: { day: 'team_c', night: 'team_d' } }, // Días 8-9. C(día)/D(noche) trabajan. A/B francos.

  // Siguientes 10 días del ciclo (turnos invertidos)
  { duration: 3, assignments: { day: 'team_b', night: 'team_a' } }, // Días 10-12. B(día)/A(noche) trabajan (invierte A/B). C/D francos.
  { duration: 3, assignments: { day: 'team_d', night: 'team_c' } }, // Días 13-15. D(día)/C(noche) trabajan (invierte C/D). A/B francos.
  { duration: 2, assignments: { day: 'team_b', night: 'team_a' } }, // Días 16-17. B(día)/A(noche) trabajan (invierte A/B). C/D francos.
  { duration: 2, assignments: { day: 'team_d', night: 'team_c' } }, // Días 18-19. D(día)/C(noche) trabajan (invierte C/D). A/B francos.
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
  { date: "2025-05-25", name: "Día de la Revolución de Mayo" }, // Este es un domingo en 2025
  { date: "2025-06-20", name: "Paso a la Inmortalidad del Gral. Manuel Belgrano" },
  { date: "2025-07-09", name: "Día de la Independencia" },
  { date: "2025-08-18", name: "Paso a la Inmortalidad del Gral. José de San Martín" }, // Trasladado del 17/8 (Lunes)
  { date: "2025-10-13", name: "Día del Respeto a la Diversidad Cultural" }, // Trasladado del 12/10 (Lunes)
  { date: "2025-11-24", name: "Día de la Soberanía Nacional (Trasladable)"}, // Lunes, trasladado del 20/11
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
  { date: "2024-05-25", name: "Día de la Revolución de Mayo" }, // Este es un sábado en 2024
  { date: "2024-06-17", name: "Paso a la Inmortalidad del Gral. Don Martín Miguel de Güemes"},
  { date: "2024-06-20", name: "Paso a la Inmortalidad del Gral. Manuel Belgrano" },
  { date: "2024-06-21", name: "Feriado Puente Turístico"},
  { date: "2024-07-09", name: "Día de la Independencia" },
  { date: "2024-08-17", name: "Paso a la Inmortalidad del Gral. José de San Martín" }, // Este es un sábado en 2024
  { date: "2024-10-11", name: "Feriado Puente Turístico"},
  { date: "2024-10-12", name: "Día del Respeto a la Diversidad Cultural" }, // Este es un sábado en 2024
  { date: "2024-11-18", name: "Día de la Soberanía Nacional"}, // Trasladado del 20/11
  { date: "2024-12-08", name: "Inmaculada Concepción de María" }, // Este es un domingo en 2024
  { date: "2024-12-25", name: "Navidad" },
];
    
