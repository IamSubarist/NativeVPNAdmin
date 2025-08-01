import { Fragment } from "react";
import { DocumentationContent } from "./blocks/documentationContent/DocumentationContent";
import { useLayout } from "@/providers";

export const DocumentationPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <DocumentationContent />
      </div>
    </Fragment>
  );
};
