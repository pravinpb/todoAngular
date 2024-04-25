export class Todo {
    content: string;
    status: boolean;
    id?: number;

    constructor(id:number, content: string, status: boolean) {
        this.id = id;
        this.content = content;
        this.status = status;
    }
}