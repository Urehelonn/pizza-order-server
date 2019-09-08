import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {Product} from "./Product";

export enum OederStatusType {
    Placed = 'placed',
    Cancelled = 'cancelled',
    Payed = 'payed',
    PayFailed = 'payfailed',
    Delivered = 'delivered',
    Returned = 'returned',
    Refund = 'refund'
}

@Entity()
export class Order {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    note: string;

    @Column()
    status: OederStatusType;

    @Column()
    paymentId: string;


    @Column()
    deleted: boolean;


    @Column()
    products: Product[];

    constructor(products: Product[], deleted: boolean = false,
                status: OederStatusType = OederStatusType.Placed,
                note: string = '',
                paymentId: string = '') {
        this.products = products;
        this.deleted = deleted;
        this.status = status;
        this.paymentId = paymentId;
        this.note = note;
    }
}