export enum ERRCODE {
    E_OK = 200,
    E_UPDATED = 204,
    E_CREATED = 201,
    E_BADREQUEST = 400,
    E_UNAUTHORIZED = 401,
    E_NOTFOUND = 404,
    E_DUPLICATE = 409,
}

export enum ERRSTR {
    S_OK = '',
    S_UPDATED = 'Update succeed',
    S_CREATED = 'Created succeed',
    S_BADREQUEST = 'Bad parameters',
    S_UNAUTHORIZED = 'Unauthorized',
    S_WRONGPASSWORD = 'Cannot find username and password combination.',
    S_NOTFOUND = 'Not found',
    S_DUPLICATE = 'Username already exist.'
}

export class PizzaError {
    data: any;
    code: number;
    msg: string;

    constructor(code: ERRCODE = ERRCODE.E_OK,
                msg: string = ERRSTR.S_OK,
                data: any = null) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    };
}