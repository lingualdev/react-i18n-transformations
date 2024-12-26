// @ts-nocheck
import React from "react";
import { useIntl } from "react-intl";

export const Basic = () => {
    const intl = useIntl();

    return (
        <div>
            <h1>{intl.formatMessage({ id: "basictest.this_is_some_title", defaultMessage: "This is some title" })}</h1>
            <p>{intl.formatMessage({ id: "basictest.this_is_some_paragraph", defaultMessage: "This is some paragraph" })}</p>
            <div>{intl.formatMessage({ id: "basictest.this_is_some_div", defaultMessage: "This is some div" })}</div>
        </div>
    );
};

function DoNothing() {
    return <div>{""}</div>;
}

function HasTranslations() {
    const intl = useIntl();

    return <div>{intl.formatMessage({ id: "basictest.some_translation_in_here", defaultMessage: "Some translation in here" })}</div>;
}

function HasTranslationsWithIntl() {
    const intl = useIntl();
    return (
        <div>
            <h3>
                {intl.formatMessage({
                    id: "some.existing.key",
                    defaultMessage: "this is some other translation",
                })}
            </h3>
            <span>{intl.formatMessage({ id: "basictest.some_untranslated_text_inside_a_span", defaultMessage: "Some untranslated text inside a span" })}</span>
        </div>
    );
}
