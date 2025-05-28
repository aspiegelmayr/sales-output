import { Output } from "src/app/models/output.model";
import { Person } from "../models/employee.model";

export const MOCK_OUTPUT: Output = {
    name: 'Anton',
    availability: 1,
    newOpps: 1,
    currentChances: 3,
    details: 'Some details',
    projectStarts: 2,
    newEntries: 1,
    contracts: 2,
    kvts: 3,
    note: 'Some note',
    weekOfTheYear: 1
}

export const MOCK_OUTPUT_LIST: Array<Output> = [
    {
        name: 'Anton',
        availability: 1,
        newOpps: 1,
        currentChances: 3,
        details: 'Some details',
        projectStarts: 2,
        newEntries: 1,
        contracts: 2,
        kvts: 3,
        note: 'Some note',
        weekOfTheYear: 1
    },
    {
        name: 'Berta',
        availability: 0.7,
        newOpps: 0,
        currentChances: 2,
        details: 'Some details',
        projectStarts: 0,
        newEntries: 0,
        contracts: 0,
        kvts: 0,
        note: 'Some note',
        weekOfTheYear: 1
    }
]


export const MOCK_PERSON_LIST: Array<Person> = [
    {
        id: 1,
        name: 'Anton',
        availability: 1
    },
    {
        id: 2,
        name: 'Berta',
        availability: 0.7
    }
]