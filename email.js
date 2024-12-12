export class Email {
    constructor(id, subject, cost, body, status = 'pending') {
        this.id = id;
        this.subject = subject;
        this.cost = cost;
        this.body = body;
        this.status = status; // 'pending', 'approved', 'denied', 'read'
    }
}