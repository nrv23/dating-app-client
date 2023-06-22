export interface IPagation {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export class PaginatedResults<T> {
    result?:T;
    pagination?: IPagation;
}