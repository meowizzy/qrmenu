import { modal } from "./modules/modal";
import { dataRender } from "./modules/dataRender";
import "../localization/index";
import "swiper/css";

const onDocumentLoaded = () => {
    modal();
    dataRender();
};

window.addEventListener("DOMContentLoaded", onDocumentLoaded);

