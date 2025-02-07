import { removeAllClasses } from "../helpers/removeAllClasses";
import {getElementDimensions} from "../helpers/getElementDimensions";

export const tabs = () => {
    const navigationRoot = document.querySelector(".header__navigation-list");
    const navigationTargetSelector = ".header__navigation-list-item a";

    const updateNavigationProps = (props) => {
        const { x, y, width, height } = props;

        navigationRoot.style.setProperty("--x", x + "px");
        navigationRoot.style.setProperty("--y", y + "px");
        navigationRoot.style.setProperty("--width", width + "px");
        navigationRoot.style.setProperty("--height", height + "px");

        navigationRoot.scrollLeft = x;
    };

    const resetNavigationProps = () => {
        navigationRoot.style = null;
    };

    const onClickTabChange = (e) => {
        e.preventDefault();
        const target = e.target;

        if (target.closest(navigationTargetSelector)) {
            updateNavigationProps(getElementDimensions(target.parentElement));

            removeAllClasses(navigationRoot.querySelectorAll(navigationTargetSelector), "active");
            target.classList.add("active");

            const [href] = e.target.href.split("#").slice(1);

            const section = document.querySelector(`#${href}`);

            window.scrollTo({
                top: section.offsetTop - 100
            })
        }
    };

    document.addEventListener("click", onClickTabChange);

    const sections = document.querySelectorAll(".section");
    const intersectionOptions = {
        root: null,
        rootMargin: "10px",
        threshold: 0.4,
    };

    const observer = new IntersectionObserver((entries) => {
        const navigationItems = {};

        entries.forEach((entry, index) => {
            const target = entry.target;
            const next = entries[index + 1];
            const prev = entries[index - 1];
            const prevNavigationItem = prev ? navigationItems[prev.target.id] || document.querySelector(`[href="#${prev.target.id}"]`) : null;
            const nextNavigationItem = next ? navigationItems[next.target.id] || document.querySelector(`[href="#${next.target.id}"]`) : null;
            let navigationItem;

            if (navigationItems[target.id]) {
                navigationItem = navigationItems[target.id];
            } else {
                navigationItem = document.querySelector(`[href="#${target.id}"]`);
                navigationItems[target.id] = navigationItem;
            }

            if (entry.isIntersecting) {
                if (navigationItem) {
                    updateNavigationProps(getElementDimensions(navigationItem.parentElement));
                    navigationItem.classList.add("active");

                    window.location.hash = "#" + target.id;

                    if (prevNavigationItem) {
                        prevNavigationItem.classList.remove("active");
                    }

                    if (nextNavigationItem) {
                        nextNavigationItem.classList.remove("active");
                    }
                }

                target.classList.add("intersecting");
            } else {
                target.classList.remove("intersecting");

                if (navigationItem) {
                    navigationItem.classList.remove("active");
                }
            }
        })
    }, intersectionOptions);

    sections.forEach((section) => observer.observe(section));
};