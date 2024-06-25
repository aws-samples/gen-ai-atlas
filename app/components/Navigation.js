import * as React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckMobileScreen } from "./utils"

export const navHeader = { text: 'Generative AI Atlas', href: '/' };
export const navItems = [
  {
    type: 'section',
    text: 'Use Cases and Resources',
    items: [
      { type: 'link', text: 'Explore and Search', href: '/' },
    ]
  }
];

function Navigation(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useCheckMobileScreen();
  function onFollowHandler(ev) {
    if (ev.detail.href) {
      if (!ev.detail.external) {
        ev.preventDefault();
        navigate(ev.detail.href);
        if(isMobile){
          props.setNavigationOpen(false)
        }
      }
    }
  }
  return (
    <SideNavigation
      activeHref={location.pathname}
      header={navHeader}
      onFollow={onFollowHandler}
      items={navItems}
    />
  );
}

export default Navigation;