import dataRu from "./ru.json";
import dataUz from "./uz.json";
import dataEn from "./en.json";
import template from "../index.hbs";
import { SITE_LANG } from "../js/app/constants";

console.log("is dev: ", __IS_DEV__);
console.log("mode: ", __MODE__);

if (__IS_DEV__) {
    const localization = {
        ru: dataRu,
        uz: dataUz,
        en: dataEn
    };

    let templateData = template(localization[SITE_LANG]);

    document.body.innerHTML = new DOMParser().parseFromString(templateData, "text/html").body.outerHTML;
}

const locales = {
    ru: dataRu,
    uz: dataUz,
    en: dataEn
};

export const redirectPaths = {
    ru: "/",
    en: "/en.html",
    uz: "/uz.html"
};

export const translate = (ns) => {
    if (typeof ns !== "string") return;

    const namespaces = ns.split(".");

    if (namespaces.length === 1) {
        return locales[SITE_LANG][ns];
    }

    return namespaces.reduce((acc, cur) => {
        acc = acc[cur];

        return acc;
    }, locales[SITE_LANG]);
};