// @ts-nocheck
import React from "react";
import { useTranslation } from "react-i18next";

export const Basic = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t("basictest.this_is_some_title", "This is some title")}</h1>
            <p>{t("basictest.this_is_some_paragraph", "This is some paragraph")}</p>
            <div>{t("basictest.this_is_some_div", "This is some div")}</div>
        </div>
    );
};

function DoNothing() {
    return <div>{""}</div>;
}

function HasTranslations() {
    const { t } = useTranslation();

    return <div>{t("basictest.some_translation_in_here", "Some translation in here")}</div>;
}

function HasTranslationsWithTFunction() {
    const { t } = useTranslation();
    return (
        <div>
            <h3>{t("some.key", "this is some other translation")}</h3>
            <span>{t("basictest.some_untranslated_text_inside_a_span", "Some untranslated text inside a span")}</span>
        </div>
    );
}
