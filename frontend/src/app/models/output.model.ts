export class Output {
    id?: number;
    name: string;
    availability: number;
    newOpps: number;
    currentChances: number;
    details: string;
    projectStarts: number;
    newEntries: number;
    contracts: number;
    kvts: number;
    note: string;
    weekOfTheYear?: number;
    date?: Date;

    constructor(name?: string, 
        id?: number,
        availability?: number,
        newOpps?: number,
        currentChances?: number,
        details?: string,
        projectStarts?: number,
        newEntries?: number,
        contracts?: number,
        kvts?: number,
        note?: string,
        weekOfTheYear?: number,
        date?: Date) {
            this.id = id || undefined;
            this.name = name || '';
            this.availability = availability || 1;
            this.newOpps = newOpps || 0;
            this.currentChances = currentChances || 0;
            this.details = details || '';
            this.projectStarts = projectStarts || 0;
            this.newEntries = newEntries || 0;
            this.contracts = contracts || 0;
            this.kvts = kvts || 0;
            this.note = note || '';
            this.weekOfTheYear = weekOfTheYear || undefined;
            this.date = date || undefined;
    }
}