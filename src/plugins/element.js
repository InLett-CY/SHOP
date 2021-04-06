import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Form, FormItem, Input, Button, Message,Switch,Tooltip,MessageBox } from 'element-ui'
import { Container, Header, Aside, Main, Menu, MenuItem, Submenu } from 'element-ui'
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
import { Card, Row, Col } from 'element-ui';
import { Table,TableColumn,Pagination,Dialog } from 'element-ui';

Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox;
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Switch);
Vue.use(Tooltip);

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);


Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);