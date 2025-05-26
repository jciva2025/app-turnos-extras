import type { TeamMember, Team, Holiday, ShiftBlock, TeamId } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'gonzalo_r', name: 'Gonzalo Rodríguez', teamId: 'team_a', loginKey: 'gr123', photoUrl: 'https://placehold.co/100x100.png?text=GR' },
  { id: 'francisco_g', name: 'Francisco Garces', teamId: 'team_a', loginKey: 'fg123', photoUrl: 'https://placehold.co/100x100.png?text=FG' },
  { id: 'sergio_s', name: 'Sergio Sosa', teamId: 'team_b', loginKey: 'ss123', photoUrl: 'https://placehold.co/100x100.png?text=SS' },
  { id: 'alexis_m', name: 'Alexis Monasterio', teamId: 'team_b', loginKey: 'am123', photoUrl: 'https://placehold.co/100x100.png?text=AM' },
  { id: 'jorge_c', name: 'Jorge Civalero', teamId: 'team_c', loginKey: 'jc123', photoUrl: 'https://placehold.co/100x100.png?text=JC' },
  { id: 'juan_b', name: 'Juan Bilbao', teamId: 'team_c', loginKey: 'jb123', photoUrl: 'https://placehold.co/100x100.png?text=JB' },
  { id: 'andres_f', name: 'Andres Flores', teamId: 'team_d', loginKey: 'af123', photoUrl: 'https://placehold.co/100x100.png?text=AF' },
  { id: 'matias_v', name: 'Matias Vilela', teamId: 'team_d', loginKey: 'mv123', photoUrl: 'https://placehold.co/100x100.png?text=MV' },
];

export const TEAMS: Record<TeamId, Team> = {
  team_a: { id: 'team_a', name: 'Turno A', members: ['gonzalo_r', 'francisco_g'] },
  team_b: { id: 'team_b', name: 'Turno B', members: ['sergio_s', 'alexis_m'] },
  team_c: { id: 'team_c', name: 'Turno C', members: ['jorge_c', 'juan_b'] },
  team_d: { id: 'team_d', name: 'Turno D', members: ['andres_f', 'matias_v'] },
};

export const REFERENCE_DATE = new Date(2025, 4, 27); // May 27, 2025 (month is 0-indexed)
export const CYCLE_LENGTH = 13; // days

export const SHIFT_PATTERN: ShiftBlock[] = [
  { duration: 3, assignments: { day: 'team_c', night: 'team_d' } }, // Days 0-2
  { duration: 2, assignments: { day: 'team_a', night: 'team_b' } }, // Days 3-4
  { duration: 2, assignments: { day: 'team_c', night: 'team_d' } }, // Days 5-6
  { duration: 3, assignments: { day: 'team_b', night: 'team_a' } }, // Days 7-9
  { duration: 3, assignments: { day: 'team_d', night: 'team_c' } }, // Days 10-12
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
  { date: "2025-08-18", name: "Paso a la Inmortalidad del Gral. José de San Martín" },
  { date: "2025-10-13", name: "Día del Respeto a la Diversidad Cultural" },
  { date: "2025-11-24", name: "Día de la Soberanía Nacional (Trasladable)"},
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
  { date: "2024-11-20", name: "Día de la Soberanía Nacional (Trasladable al Lunes 18)"},
  { date: "2024-12-08", name: "Inmaculada Concepción de María" },
  { date: "2024-12-25", name: "Navidad" },
];
