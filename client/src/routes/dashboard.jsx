// @material-ui/icons
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Send from "@material-ui/icons/Send";
import Publish from "@material-ui/icons/Publish";
import Home from "@material-ui/icons/Home";
//containers
import Product from '../containers/Product';
import ProductHandover from '../containers/ProductHandover';
import ProductView from '../containers/ProductView';
import PublishRecords from '../containers/PublishRecords';
import App from '../App';



const dashboardRoutes = [
  {
    path: "/home",
    sidebarName: "Home",
    navbarName: "Home",
    icon: Home,
    component: App
  },
  {
    path: "/admin",
    sidebarName: "Admin",
    navbarName: "Admin",
    icon: Person,
    component: Product
    
  },
 
  {
    path: "/handover",
    sidebarName: "Handover",
    navbarName: "Handover",
    icon: Send,
    component: ProductHandover,
    
  },
  {
    path: "/publish",
    sidebarName: "Publish",
    navbarName: "Publish",
    icon: Publish,
    component: PublishRecords,
    
  },
  {
    path: "/view",
    sidebarName: "View",
    navbarName: "View",
    icon: "content_paste",
    component: ProductView,
    
  },
 
  
  { redirect: true, path: "/", to: "/home", navbarName: "Redirect" }
];

export default dashboardRoutes;
