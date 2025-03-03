import { dataRender } from "./modules/dataRender";
import "../localization/index";
import "swiper/css";

const onDocumentLoaded = () => {
    dataRender();
};

window.addEventListener("DOMContentLoaded", onDocumentLoaded);

