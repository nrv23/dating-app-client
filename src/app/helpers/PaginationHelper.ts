import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResults } from "../interfaces/IPagination";

export function getPaginatedResults<T>(url: string, params: HttpParams, http: HttpClient) {
    const pagintedResults: PaginatedResults<T> = new PaginatedResults<T>;
    return http.get<T>(url, {
      observe: 'response',
      params
    }).pipe(map(response => {
      if (response.body) {
        pagintedResults.result = response.body;
      }

      const pagination = response.headers.get("Pagination");
      if (pagination) {
        pagintedResults.pagination = JSON.parse(pagination);
      }

      return pagintedResults;
    }));
  }

  export function getPaginationHeaders(page: number, itemsPerPage: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);

    return params;
  }