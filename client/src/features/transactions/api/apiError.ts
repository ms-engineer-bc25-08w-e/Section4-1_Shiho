export type ApiErrorBody = {
    error: {
        code: string;
        message: string;
        details?: unknown; // 型が何かわからないときに使う型
        requestId?: string;
    };
    
};

export class ApiError extends Error {
    status: number;
    code: string;
    details?: unknown;
    requestId?: string;

    constructor(status: number, body: ApiErrorBody){
        super(body.error.message);
        this.name = "ApiError";
        this.status = status;
        this.code = body.error.code;
        this.details = body.error.details;
        this.requestId = body.error.requestId;

    };

};