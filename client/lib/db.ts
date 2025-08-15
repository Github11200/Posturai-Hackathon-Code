import Dexie, { EntityTable } from 'dexie'

interface SessionInterface {
  date: Date;
  duration: number;
  timeSpentSitting: number;
  sittingDurations: number[];
  numberOfBreaks: number;
  breakDurations: number[];
};

const db = new Dexie("Sessions") as Dexie & {
  sessions: EntityTable<
    SessionInterface,
    "date"
  >
}

db.version(1).stores({
  sessions: 'date, duration, timeSpentSitting, sittingDurations, numberOfBreaks, breakDurations'
})

export type { SessionInterface }
export { db }