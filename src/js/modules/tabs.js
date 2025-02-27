import { removeAllClasses } from "../helpers/removeAllClasses";
import { getElementDimensions } from "../helpers/getElementDimensions";

export const tabs = () => {
    const navigationRoot = document.querySelector(".root .navigation__list");
    const navigationBadge = navigationRoot.querySelector(".badge");
    const navigationTargetSelector = ".navigation__list-item a";
    const navigationItems = navigationRoot.querySelectorAll(navigationTargetSelector);
    const sections = document.querySelectorAll(".root section");
    const validSections = Array.from(sections).filter((section) => !section.classList.contains("banner"));

    if (!navigationItems) {
        return;
    }

    const updateNavigationCurrentItem = (currentTarget) => {
        removeAllClasses(navigationItems, "active");
        currentTarget.classList.add("active");
    };

    const updateNavigationListProps = (item) => {
        const {
            x,
            width,
            height
        } = getElementDimensions(item);

        navigationRoot.style.setProperty("--x", `${x}px`);
        navigationRoot.style.setProperty("--width", `${width}px`);
        navigationRoot.style.setProperty("--height", `${height}px`);
    };

    const intersectionObserverConfig = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        const target = entry.target;

        if (entry.isIntersecting) {
            const hash = target.id;
            const currentNavigationItem = document.querySelector(`[href="#${hash}"]`);

            window.location.hash = hash;

            if (currentNavigationItem) {
                updateNavigationListProps(currentNavigationItem.parentElement);
            }
        }
    }, intersectionObserverConfig);

    const refreshObserver = () => {
        validSections.forEach((section) => {
            observer.observe(section);
        });
    };

    refreshObserver();

    const handleTabClick = (e) => {
        e.preventDefault();
        const target = e.target;
        const hash = new URL(target.href).hash.slice(1);
        const anchor = document.getElementById(hash);

        window.scrollTo({
            top: anchor.getBoundingClientRect().top + window.scrollY - 100,
        });
        window.location.hash = hash;

        updateNavigationListProps(target);
        observer.disconnect();
    };

    const handleBadgeTransitionEnd = () => {
        const hash = window.location.hash;
        const currentTarget = document.querySelector(`[href="${hash}"]`);

        setTimeout(() => {
            refreshObserver();
        }, 200);
        updateNavigationCurrentItem(currentTarget);
    };

    navigationBadge.addEventListener("transitionend", handleBadgeTransitionEnd);
    navigationItems.forEach((item) => {
        item.addEventListener("click", handleTabClick);
    });
};