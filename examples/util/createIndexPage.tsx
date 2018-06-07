import * as React from "react";
import * as page from "page";
import { render } from "react-dom";

export function createIndexPage(routes: {
  [name: string]: React.ComponentType;
}) {
  const root = document.createElement("div");
  const routePaths = Object.keys(routes);

  document.body.appendChild(root);

  const IndexPageComponent: React.SFC<{}> = () => (
    <ul>
      {routePaths.map(routePath => (
        <li>
          <a href={routePath}>{routePath}</a>
        </li>
      ))}
    </ul>
  );

  page("/", () => {
    console.log("init");
    render(<IndexPageComponent />, root);
  });

  routePaths.forEach(routePath => {
    page(routePath, () => {
      const Component = routes[routePath];
      render(<Component />, root);
    });
  });

  page();
}
