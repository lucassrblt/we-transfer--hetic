export class SuccessResponse {
    constructor(private message: string, private statusCode: number) {}

    send(res: any) {
        res.status(this.statusCode).json({
            status: 'success',
            message: this.message
        });
    }
}