import { removeAllClasses } from "../helpers/removeAllClasses";
import { getElementDimensions } from "../helpers/getElementDimensions";
import { scrollTo } from "../helpers/scrollTo";

export const tabs = () => {
    const navigationRoot = document.querySelector(".root .navigation__list");
    const navigationBadge = navigationRoot.querySelector(".badge");
    const navigationTargetSelector = ".navigation__list-item a";
    const navigationItems = navigationRoot.querySelectorAll(navigationTargetSelector);
    const sections = document.querySelectorAll(".root section");
    const validSections = Array.from(sections).filter((section) => !section.classList.contains("banner"));
    const hash = location.hash.slice(1);
    const scrollEndExist = window.hasOwnProperty("onscrollend");

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

        navigationRoot.scrollLeft = x;

        navigationRoot.style.setProperty("--x", `${x}px`);
        navigationRoot.style.setProperty("--width", `${width}px`);
        navigationRoot.style.setProperty("--height", `${height}px`);
    };

    const intersectionObserverConfig = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;

            if (entry.isIntersecting) {
                const hash = target.dataset.anchor;
                const currentNavigationItem = document.querySelector(`[href="#${hash}"]`);

                location.hash = hash;

                if (currentNavigationItem) {
                    updateNavigationListProps(currentNavigationItem.parentElement);
                    updateNavigationCurrentItem(currentNavigationItem);
                }
            }
        });
    }, intersectionObserverConfig);

    const refreshObserver = () => {
        validSections.forEach((section) => {
            observer.observe(section);
        });
    };

    let tabChanged = false;

    if (hash) {
        const currentSection = validSections.find((section) => section.dataset.anchor === hash);

        if (currentSection) {
            scrollTo(currentSection);
            tabChanged = true;
        }
    } else {
        const [firstNavigationItem] = navigationItems;
        refreshObserver();
        setTimeout(() => {
            updateNavigationListProps(firstNavigationItem);
            updateNavigationCurrentItem(firstNavigationItem);
        }, 70);
    }

    const handleTabClick = (e) => {
        e.preventDefault();
        const target = e.target;
        const hash = new URL(target.href).hash.slice(1);
        const anchor = document.querySelector(`[data-anchor="${hash}"]`);

        observer.disconnect();

        tabChanged = true;

        scrollTo(anchor);

        location.hash = hash;

        updateNavigationListProps(target);
        updateNavigationCurrentItem(target);
    };

    // safari
    const handleBadgeTransitionEnd = () => {
        if (!scrollEndExist) {
            setTimeout(refreshObserver, 300);
        }
    };

    if (scrollEndExist) {
        window.addEventListener("scrollend", () => {
            if (tabChanged) {
                refreshObserver();
                tabChanged = false;
            }
        });
    }

    navigationBadge.addEventListener("transitionend", handleBadgeTransitionEnd);
    navigationItems.forEach((item) => {
        item.addEventListener("click", handleTabClick);
    });

    window.addEventListener('hashchange', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });
};