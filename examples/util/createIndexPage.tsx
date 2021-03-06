import * as React from "react";
import page from "page";
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
        <li key={routePath}>
          <a href={routePath}>{routePath}</a>
        </li>
      ))}
    </ul>
  );

  page("/", () => render(<IndexPageComponent />, root));

  routePaths.forEach(routePath => {
    page(routePath, () => {
      const Component = routes[routePath];
      render(<Component />, root);
    });
  });

  page();
}
