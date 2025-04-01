import { translate } from "../../localization";

export const renderError = (msg, root) => {
    root.insertAdjacentHTML("beforeend", `
        <div class="error">
            <div class="error__icon">
                <svg x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                    <use xlink:href="#error"/>
                </svg>
            </div>
            <div class="error__message">
                <span>${msg}</span>
            </div>
        </div>
    `);
};

export const getHeader = (name) => {
    if (!name) return "";

    return `
        <header class="header">
            <div class="container">
                <h1 class="header__heading">${name}</h1>
            </div>
        </header>
    `;
};

export const getBanner = ({ background, address, contactPhone, wifiPassword}) => {
    const banner = background?.url ? `
        <div class="banner__pic" style="background-image: url(${background.url})"></div>
    ` : "";

    const addressTemplate = address?.street ? `
        <div class="banner__contacts-item">
            <span class="banner__contacts-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="#location"/>
                </svg>
            </span>
            <div class="banner__contacts-value">
                <span>${address.street}</span>
            </div>
        </div>
    ` : "";

    const wifiPasswordTemplate = wifiPassword ? `
        <div class="banner__contacts-item">
            <span class="banner__contacts-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="#wifi"/>
                </svg>
            </span>
            <div class="banner__contacts-value">
                <span>${wifiPassword}</span>
            </div>
        </div>
    ` : "";

    const phoneTemplate = contactPhone ? `
        <div class="banner__contacts-item">
            <span class="banner__contacts-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="#phone"/>
                </svg>
            </span>
            <div class="banner__contacts-value">
                <a href="tel:+${contactPhone.replace(/[^\d]/g,'')}">${contactPhone}</a>
            </div>
        </div>
    ` : "";

    return `
        <section id="banner" class="banner">
            <div class="container">
                ${banner}
                <div class="banner__contacts">
                    ${addressTemplate}
                    ${wifiPasswordTemplate}
                    ${phoneTemplate}
                </div>
            </div>
        </section>
    `;
};

export const getCategories = (categories) => {
    if (!categories) return "";

    const items = categories.map((item) => {
        return `
            <li class="navigation__list-item">
                <a href="#${item.id}">${item.name}</a>
            </li>
        `;
    });

    return `
        <div class="navigation">
            <div class="container">
                <nav class="navigation__inner">
                    <ul class="navigation__list">
                        <span class="badge"></span>
                        ${items.join("")}
                    </ul>
                </nav>
            </div>
        </div>
    `;
};

const getProductTitle = (title, cb) => {
    if (!title) return "";

    return cb(title);
};

export const getProducts = (categories, products) => {
    if (!categories?.length && !products?.length) return "";

    const mappedCategories = categories.reduce((map, item) => {
        const hash = [item.id, item.name];

        map.set(hash, []);

        products.forEach((product) => {
            if (item.id === product.menuId) {
                map.set(hash, [
                    ...map.get(hash),
                    product
                ]);
            }
        });

        return map;
    }, new Map);

    const sections = [];

    mappedCategories.forEach((products, key) => {
        const [id, name] = key;

        const sectionTitle = !!name ? `
            <h2 class="section__title">${name}</h2>
        ` : "";

        let items;

        if (products.length) {
            items = products.map((product) => {
                const modalId = Math.random()*Date.now();
                const noImageSvg = `
                    <svg class="d-none" viewBox="0 0 64 64" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2">
                        <use xlink:href="#food"/>
                    </svg>
                `;

                const image = product?.photo ? `
                    <img src="${product.photo.url}" alt="${product.photo.name}" onload="this.parentElement.classList.add('image-success');" onerror="this.parentElement.classList.add('image-error');">
                    ${noImageSvg}
                ` : noImageSvg;

                const pic = `
                    <div class="list__card-pic" data-modal-target="productDescriptionModal-${modalId}">
                        ${image}
                    </div>
                `;

                const title = getProductTitle(product?.name, (title) => `
                    <div class="list__card-title" data-modal-target="productDescriptionModal-${modalId}"> 
                        <span>${title}</span>
                    </div>
                `);

                const unit = getProductTitle(product?.unit, (unit) => `
                    <span class="list__card-weight">${unit}</span>
                `);

                const description = `
                    ${getProductTitle(product?.description, (description) => `
                       <div class="list__card-desc">
                            <span>${description}</span>
                       </div> 
                    `)}
                    <div class="d-none">
                        <div class="product-modal" data-modal-id="productDescriptionModal-${modalId}">
                            ${getProductTitle(product?.name, (title) => `
                               <div class="product-modal__title">
                                    <span>${title}</span>
                               </div> 
                            `)}
                            <div class="product-modal__units">
                                
                            </div> 
                            <button class="lp-button primary product-modal__button" data-modal-close>${translate("buttonOk")}</button>   
                        </div>
                    </div>
                `;

                return `
                    <div class="list__card">
                        ${pic}
                        <div class="list__card-bottom">
                            ${title}
                            ${unit}
                            ${description}
                        </div>
                    </div>
                `;
            });

            items = items.join("");
        } else {
            items = `
                <div class="list__empty">
                    <div class="list__empty-icon">
                        <svg viewBox="0 0 711 379">
                            <use xlink:href="#plate"/>
                        </svg>
                    </div>
                    <div class="list__empty-title">
                        <span>${translate("willBeSoon")}</span>
                    </div>
                </div> 
            `;
        }

        sections.push(`
            <section data-anchor="${id}" class="section">
                <div class="container">
                    ${sectionTitle}
                    <div class="list">
                        ${items}
                    </div>
                </div>
            </section>
        `);
    });

    return sections.join("");
};