import { modal } from "./modules/modal";
import { tabs } from "./modules/tabs";
import "../localization/index";
import "swiper/css";

const onDocumentLoaded = () => {
    modal();
    tabs();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);

