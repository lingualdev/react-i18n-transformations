// @ts-nocheck
import React from "react";

export const Basic = () => {
  return (
    <div>
      <h1>This is some title</h1>
      <p>This is some paragraph</p>
      <div>This is some div</div>
    </div>
  );
};

function DoNothing() {
  return <div>{""}</div>;
}

function HasTranslations() {
  return <div>Some translation in here</div>;
}

function HasTranslationsWithTFunction() {
  const { t } = useTranslation();
  return (
    <div>
      <h3>{t("some.key", "this is some other translation")}</h3>
      <span>Some untranslated text inside a span</span>
    </div>
  );
}
