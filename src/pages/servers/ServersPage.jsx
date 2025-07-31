import { Fragment } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";
import { useLayout } from "@/providers";
import { ServersContent } from "./blocks/serversContent/ServersContent";

export const ServersPage = () => {
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <ServersContent />
      </div>
    </Fragment>
  );
};
