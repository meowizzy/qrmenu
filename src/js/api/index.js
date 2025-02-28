import {BASE_URL} from "../app/constants";

const $request = (endpoint) => {
    return fetch(`${BASE_URL}/${endpoint}`);
};

export const fetchCompanyDetails = async (companyId) => {
    return $request(`public/v1/qr-menu/company/${companyId}`);
};

export const fetchCompanyCategories = async (companyId) => {
    return $request(`public/v1/qr-menu/categories/${companyId}`);
};

export const fetchCompanyProducts = async (companyId) => {
    return $request(`public/v1/qr-menu/products/${companyId}`);
};