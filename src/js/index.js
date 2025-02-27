import { modal } from "./modules/modal";
import { tabs } from "./modules/tabs";
import "../localization/index";
import "swiper/css";

const onDocumentLoaded = () => {

    setTimeout(() => {
        document.querySelector(".loader").classList.add("d-none");
        document.querySelector(".root").classList.remove("d-none");
    }, 1000);

    modal();
    tabs();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);

