export class Person {
    id?: number;
    name: string;
    availability: number;

    constructor(id?: number,
        name?: string,
        availability?: number) {
        this.id = id || -1;
        this.name = name || '';
        this.availability = availability || 1;
    }
}