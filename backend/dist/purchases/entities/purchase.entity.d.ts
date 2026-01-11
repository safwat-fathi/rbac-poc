export declare class Purchase {
    id: string;
    description: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}
