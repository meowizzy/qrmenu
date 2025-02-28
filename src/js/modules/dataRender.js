import { tabs } from "./tabs";
import { fetchCompanyCategories, fetchCompanyDetails, fetchCompanyProducts } from "../api";
import {getBanner, getCategories, getHeader, getProducts, renderError} from "./templates";

export const dataRender = () => {
    const loader = document.querySelector(".loader");
    const root = document.querySelector(".root");
    const companyId = location.pathname.slice(1);

    const showRoot = () => {
        loader.classList.add("d-none");
        root.classList.remove("d-none");
    };

    if (!companyId) {
        renderError("Не указан идентификатор ресторана", root);
        showRoot();

        return;
    }

    const render = (props) => {
        const {
            companyName,
            categories,
            products,
            bannerData
        } = props;

        root.innerHTML = "";

        // getProducts(categories, products);

        root.insertAdjacentHTML("beforeend", `
            ${getHeader(companyName)}
            ${getCategories(categories)}
            ${getBanner(bannerData)}
            ${getProducts(categories, products)}
        `);
    };

    const fetchData = async () => {
        try {
            const [
                detailsResp,
                categoriesResp,
                productsResp,
            ] = await Promise.all([
                fetchCompanyDetails(companyId),
                fetchCompanyCategories(companyId),
                fetchCompanyProducts(companyId)
            ]);

            const details = await detailsResp.json();
            const categories = await categoriesResp.json();
            const products = await productsResp.json();

            if (detailsResp.status === 200) {
                render({
                    companyName: details?.name,
                    categories,
                    products,
                    bannerData: {
                        background: details?.background,
                        address: details?.address,
                        contactPhone: details?.contactPhone,
                        wifiPassword: details?.wifiPassword,
                    }
                });
                tabs();
            } else {
                const message = details?.detail;
                throw new Error(message);
            }
        } catch (e) {
            console.error(e);
            renderError(e.message, root);
        } finally {
            showRoot();
        }
    };

    fetchData();
};