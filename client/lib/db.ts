import Dexie, { EntityTable } from 'dexie'

interface SessionInterface {
  id: number; // The id is simply just new Date().getTime()
  date: Date;
  duration: number;
  timeSpentSitting: number;
  sittingDurations: number[];
  numberOfBreaks: number;
  breakDurations: number[];
  badPostureDurations: number[];
};

interface SettingsInterface {
  id: number;
  breakTimeReminder: number; // In milleseconds
  noUserDetectedIsBreak: boolean;
  soundEnabled: boolean;
  volume: number;
}

const db = new Dexie("Sessions") as Dexie & {
  sessions: EntityTable<
    SessionInterface,
    "id"
  >,
  settings: EntityTable<SettingsInterface, "id">
}

db.version(1).stores({
  sessions: '&id, date, duration, timeSpentSitting, sittingDurations, numberOfBreaks, breakDurations',
  settings: 'id, breakTimeReminder, noUserDetectedIsBreak, soundEnabled, volume'
})

export type { SessionInterface, SettingsInterface }
export { db }