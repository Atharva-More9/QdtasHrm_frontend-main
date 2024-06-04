import { User } from "./user";

export class Department {

    deptId: number | undefined;

    deptName: string | undefined;

    employees: User[] = [];
}
