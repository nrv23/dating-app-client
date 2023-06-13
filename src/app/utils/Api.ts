import { environment } from "src/environments/environment"
import { get } from "./Storage";
import { HttpHeaders } from "@angular/common/http";

export const getApiUrl = () => environment.baseUrl;

export const getHttpOptions = () => {

    const userData = get("user");
    if(!userData) return;

    const {  token } = JSON.parse(userData);

    return {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
        })
    }
}