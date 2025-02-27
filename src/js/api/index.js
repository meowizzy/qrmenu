import {BASE_URL} from "../app/constants";

export const $request = (endpoint) => {
    return fetch(`${BASE_URL}/${endpoint}`);
};

export const fetchCompanyDetails = async (companyId) => {
    return fetch()
};