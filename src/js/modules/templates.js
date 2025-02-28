export const renderError = (msg) => {
    return `
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
        `;
};

export const getHeader = (name) => {
    if (!name) return;

    return `
            <header class="header">
                <div class="container">
                    <h1 class="header__heading">${name}</h1>
                </div>
            </header>
        `;
};

export const getBanner = ({ background, address, contactPhone, wifiPassword}) => {
    const banner = !!background?.url && `
            <div class="banner__pic" style="background-image: url(${background.url})"></div>
        `;

    const addressTemplate = !!address?.street && `
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
        `;

    const wifiPasswordTemplate = !!wifiPassword && `
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
        `;

    const phoneTemplate = !!contactPhone && `
            <div class="banner__contacts-item">
                <span class="banner__contacts-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use xlink:href="#phone"/>
                    </svg>
                </span>
                <div class="banner__contacts-value">
                    <a href="tel:+${contactPhone}">${contactPhone}</a>
                </div>
            </div>
        `;

    return `
            <section id="banner" class="banner">
                <div class="container">
                    ${banner}
                    <div class="banner__contacts">
                        ${addressTemplate || ""}
                        ${wifiPasswordTemplate || ""}
                        ${phoneTemplate || ""}
                    </div>
                </div>
            </section>
        `;
};

export const getCategories = (categories) => {
    if (!categories) return;

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

export const getProducts = (categories, products) => {
    if (!categories || !products) return;

    const mappedCategories = categories.reduce((map, item) => {
        const hash = `#${item.id}_${item.name}`;

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

    const sectionsTemplate = Object.fromEntries(mappedCategories).map(([key, products]) => {
        const sectionTitle = !!mappedCategories[key]?.name && `
            <h2 class="section__title">${mappedCategories[key].name}</h2>
        `;

        const items = products.map((product) => {
            const pic = !!product?.photo && `
                <div class="list__card-pic">
                    <img src="${product.photo.url}" alt="${product.photo.name}">
                </div>
            `;

            const title = !!product?.name && `
                <div class="list__card-title">
                    <span>${product.name}</span>
                </div>
            `;

            const description = !!product?.description && `
                <div class="list__card-desc">
                    ${product.description}
                </div>
            `;

            const unit = !!product?.unit && `
                <span class="list__card-weight">${product.unit}</span>
            `;

            return `
                <div class="list__card">
                    ${pic || ""}
                    <div class="list__card-bottom">
                        ${title || ""}
                        ${unit || ""}
                        ${description || ""}
                    </div>
                </div>
            `;
        });

        return `
            <section data-anchor="${key}" class="section">
                <div class="container">
                    ${sectionTitle || ""}
                    <div class="list">
                        ${items.join("")}
                    </div>
                </div>
            </section>
        `;
    });

    return sectionsTemplate.join("");
};