export class Period {
    id?: number;
    name: string;
    startWeek: number;
    endWeek: number

    constructor(id?: number,
        name?: string,
        startWeek?: number,
        endWeek?: number) {
        this.id = id || -1;
        this.name = name || '';
        this.startWeek = startWeek || -1;
        this.endWeek = endWeek || -1;
    }
}