import { 
    ConfigPaginatorInput, 
    ConfigPaginatorData, 
    PaginationMeta, 
    ResponsePaginatorInput 
} from "~/shared/paginator/application/paginator.types";

export const PAGINATOR_PORT = Symbol('PAGINATOR_PORT');

export interface PaginatorServicePort {
    /** 
    * Sets the `page` and `limit` parameters for pagination 
    * @returns Returns the `skip` and `take` values for data retrieval via ORM 
    * */
    config: (input: ConfigPaginatorInput) => ConfigPaginatorData

    /** Prepares the response for the paginator */
    response: <T>(input: ResponsePaginatorInput<T>) => PaginationMeta
}