export class Email {
    
    constructor(id, subject, dependency, cost, body, status = 'pending') {
        this.id = id;
        this.subject = subject;
        this.dependency = dependency;
        this.cost = cost;
        this.body = body;
        this.status = status; // 'pending', 'approved', 'denied', 'read', 'skipped'
    }
}